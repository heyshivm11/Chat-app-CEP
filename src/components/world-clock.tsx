
"use client";

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search } from 'lucide-react';

interface TimeData {
  dateTime: string;
  timeZone: string;
  dayOfWeek: string;
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
};

const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function WorldClockComponent() {
  const [query, setQuery] = useState('');
  const [allTimezones, setAllTimezones] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedTimezone, setSelectedTimezone] = useState<string>('Asia/Kolkata');
  const [timeData, setTimeData] = useState<TimeData | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllTimezones = async () => {
      try {
        const response = await fetch('https://timeapi.io/api/TimeZone/AvailableTimeZones');
        if (!response.ok) throw new Error('Could not load the list of available timezones.');
        const data: string[] = await response.json();
        setAllTimezones(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching timezones.');
      }
    };
    fetchAllTimezones();
  }, []);

  const fetchTime = useCallback(async (timezone: string) => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    setQuery("");
    try {
      const response = await fetch(`https://timeapi.io/api/time/current/zone?timeZone=${timezone}`);
      if (!response.ok) throw new Error(`Could not fetch time for "${timezone}". Please check if the timezone is correct (e.g., "Europe/Amsterdam").`);
      const data: TimeData = await response.json();
      setTimeData(data);
      setCurrentTime(new Date(data.dateTime));
      setSelectedTimezone(data.timeZone);
      setQuery(''); // Reset search bar
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      // Don't clear old data on error, so the clock remains visible.
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTime(selectedTimezone);
  }, []); 

  useEffect(() => {
    if (currentTime) {
      const timer = setInterval(() => {
        setCurrentTime(prevTime => {
            if (!prevTime) return null;
            const newTime = new Date(prevTime.getTime() + 1000);
            return newTime;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentTime]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 1) {
      const filtered = allTimezones.filter(tz => tz.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
    } else {
      setSuggestions([]);
    }
  };
  
  const handleSuggestionClick = (timezone: string) => {
    fetchTime(timezone);
  };

  const handleSearch = () => {
    if (suggestions.length > 0) {
      // If there are suggestions, use the top one
      fetchTime(suggestions[0]);
    } else if (query.trim()) {
      // Otherwise, use the raw query text
      fetchTime(query.trim());
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
  
  const countryName = useMemo(() => {
      if (!selectedTimezone) return "";
      const parts = selectedTimezone.split('/');
      return parts.length > 1 ? parts[0].replace(/_/g, ' ') : "";
  }, [selectedTimezone]);


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
                />
            </div>
            <Button onClick={handleSearch} disabled={isLoading || (!query.trim() && suggestions.length === 0)} className="h-14 rounded-full px-6">
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
        {isLoading && !timeData ? ( // Show loader only on initial load
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error && !timeData ? ( // Show error only if there's no data to display
          <p className="text-center text-destructive p-4 bg-destructive/10 rounded-md">{error}</p>
        ) : timeData && currentTime ? (
          <>
            {error && <p className="text-center text-destructive mb-4">{error}</p>}
            <Card className="text-center shadow-2xl rounded-2xl bg-card/30 backdrop-blur-sm border-white/20">
              <CardHeader>
                  <div className="flex items-center justify-center gap-2">
                    <CardTitle className="text-2xl font-bold">{locationName}</CardTitle>
                    {isLoading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                  </div>
                  <p className="text-muted-foreground">{countryName}</p>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center">
                <div className="text-6xl font-black text-primary tracking-tighter">
                  {formatTime(currentTime)}
                </div>
                <p className="text-lg text-muted-foreground mt-2">{formatDate(currentTime)}</p>
                <p className="text-sm text-muted-foreground mt-4">{timeData.timeZone}</p>
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
