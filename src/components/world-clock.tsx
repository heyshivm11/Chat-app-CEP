
"use client";

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search } from 'lucide-react';

interface TimeData {
  datetime: string;
  timezone: string;
  utc_offset: string;
  abbreviation: string;
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
};

const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function WorldClockComponent() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState<string>('Asia/Kolkata');
  const [timeData, setTimeData] = useState<TimeData | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allTimezones, setAllTimezones] = useState<string[]>([]);

  // Fetch the list of all available timezones from the API
  useEffect(() => {
    async function fetchAllTimezones() {
        if (allTimezones.length > 0) return; // Don't refetch if we already have them
        try {
            const response = await fetch('https://worldtimeapi.org/api/timezone');
            if (!response.ok) {
                throw new Error('Failed to load timezone list.');
            }
            const data: string[] = await response.json();
            setAllTimezones(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Could not load timezones.');
        }
    }
    fetchAllTimezones();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to fetch the time for a specific timezone
  const fetchTime = useCallback(async (timezone: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://worldtimeapi.org/api/timezone/${timezone}`);
      if (!response.ok) {
        throw new Error(`Could not find time for "${timezone}". Please select a valid timezone from the list.`);
      }
      const data: TimeData = await response.json();
      setTimeData(data);
      setCurrentTime(new Date(data.datetime));
      setSelectedTimezone(data.timezone);
      setQuery('');
      setSuggestions([]);
    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unknown error occurred.');
       setTimeData(null); // Clear old data on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch initial time for the default timezone
  useEffect(() => {
    fetchTime(selectedTimezone);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Update the clock every second
  useEffect(() => {
    if (currentTime) {
      const timer = setInterval(() => {
        setCurrentTime(prevTime => {
            if (!prevTime) return null;
            return new Date(prevTime.getTime() + 1000);
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentTime]);

  // Handle changes in the search input
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 1 && allTimezones.length > 0) {
      const filtered = allTimezones.filter(tz => tz.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };
  
  // Handle clicking a suggestion from the list
  const handleSuggestionClick = (timezone: string) => {
    fetchTime(timezone);
  };

  // Handle submitting the search
  const handleSearch = () => {
    const searchTerm = query.trim();
    if (!searchTerm) return;
    
    // Check for an exact match first (case-insensitive)
    const exactMatch = allTimezones.find(tz => tz.toLowerCase() === searchTerm.toLowerCase());
    if (exactMatch) {
      fetchTime(exactMatch);
      return;
    }

    // If no exact match, use the first suggestion if available
    if (suggestions.length > 0) {
      fetchTime(suggestions[0]);
    } else {
       setError(`Could not find a timezone matching "${searchTerm}".`);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
    }
  };

  const locationName = useMemo(() => {
      if (!selectedTimezone) return "";
      const parts = selectedTimezone.split('/');
      return parts[parts.length - 1].replace(/_/g, ' ');
  }, [selectedTimezone]);
  
  const regionName = useMemo(() => {
      if (!selectedTimezone) return "";
      const parts = selectedTimezone.split('/');
      return parts.length > 1 ? parts[0].replace(/_/g, ' ') : "";
  }, [selectedTimezone]);
  
  const utcOffset = useMemo(() => {
    if (!timeData) return '';
    return `UTC${timeData.utc_offset}`;
  }, [timeData]);

  const showLoader = isLoading || (allTimezones.length === 0 && !error);

  return (
    <div className="w-full max-w-md">
      <div className="relative">
        <div className="relative flex items-center gap-2">
            <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  value={query}
                  onChange={handleQueryChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Search for a city or timezone..."
                  className="w-full pl-10 text-lg h-14 rounded-full shadow-lg"
                  disabled={allTimezones.length === 0}
                />
            </div>
            <Button onClick={handleSearch} disabled={showLoader || !query.trim()} className="h-14 rounded-full px-6">
                <Search className="h-5 w-5" />
            </Button>
        </div>
        {suggestions.length > 0 && (
            <Card className="absolute top-full mt-2 w-full z-10 shadow-lg">
                <CardContent className="p-2">
                    {suggestions.map(tz => (
                        <div 
                            key={tz}
                            onClick={() => handleSuggestionClick(tz)}
                            className="p-2 hover:bg-accent rounded-md cursor-pointer"
                        >
                            {tz.replace(/_/g, ' ')}
                        </div>
                    ))}
                </CardContent>
            </Card>
        )}
      </div>

      <div className="mt-8">
        {showLoader && !timeData ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error && !timeData ? (
          <p className="text-center text-destructive p-4 bg-destructive/10 rounded-md">{error}</p>
        ) : timeData && currentTime ? (
          <>
            {error && <p className="text-center text-destructive p-4 bg-destructive/10 rounded-md mb-4">{error}</p>}
            <Card className="text-center shadow-2xl rounded-2xl bg-card/30 backdrop-blur-sm border-white/20">
              <CardHeader>
                  <div className="flex items-center justify-center gap-2">
                    <CardTitle className="text-2xl font-bold">{locationName}</CardTitle>
                    {isLoading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                  </div>
                  <p className="text-muted-foreground">{regionName}</p>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <div className="text-6xl font-black text-primary tracking-tighter">
                  {formatTime(currentTime)}
                </div>
                <p className="text-lg text-muted-foreground mt-2">{formatDate(currentTime)}</p>
                <p className="text-sm text-muted-foreground mt-4">{timeData.timezone} ({timeData.abbreviation} / {utcOffset})</p>
              </CardContent>
            </Card>
          </>
        ) : (
            !error && <p className="text-center text-muted-foreground">Search for a place to see the time.</p>
        )}
      </div>
    </div>
  );
}

export const WorldClock = memo(WorldClockComponent);
