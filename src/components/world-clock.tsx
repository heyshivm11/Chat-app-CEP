
"use client";

import { useState, useEffect, useMemo, useCallback, memo, useRef } from 'react';
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
  const [timeData, setTimeData] = useState<TimeData | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allTimezones, setAllTimezones] = useState<string[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchTime = useCallback(async (timezone: string) => {
    if (!timezone) {
        setError("Please provide a valid timezone.");
        return;
    }
    setIsLoading(true);
    setError(null);
    
    // Stop any existing timer
    if (timerRef.current) {
        clearInterval(timerRef.current);
    }
    
    try {
      const response = await fetch(`https://worldtimeapi.org/api/timezone/${timezone}`);
      if (!response.ok) {
        throw new Error(`Could not find time for "${timezone}". Please select a valid timezone.`);
      }
      const data: TimeData = await response.json();
      
      setTimeData(data);
      setCurrentTime(new Date(data.datetime));

      setQuery('');
      setSuggestions([]);
    } catch (err) {
       const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
       setError(errorMessage);
       setTimeData(null);
       setCurrentTime(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect for fetching initial data (timezone list and default time)
  useEffect(() => {
    let isMounted = true;
    async function fetchInitialData() {
        setIsLoading(true);
        setError(null);
        try {
            const tzResponse = await fetch('https://worldtimeapi.org/api/timezone');
            if (!tzResponse.ok) throw new Error('Failed to load timezone list.');
            const tzData: string[] = await tzResponse.json();
            if(isMounted) {
              setAllTimezones(tzData);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Could not load timezones.';
            if(isMounted) {
              setError(errorMessage);
            }
        }
        // Fetch initial time after getting timezone list.
        await fetchTime('Asia/Kolkata');
    }
    fetchInitialData();

    return () => {
      isMounted = false;
    };
  }, [fetchTime]); 

  // Effect for the clock tick. This is the crucial fix.
  useEffect(() => {
    // Only start the timer if we have a valid current time.
    if (currentTime) {
      timerRef.current = setInterval(() => {
        // Use a functional update to ensure we are always working with the latest state.
        setCurrentTime(prevTime => {
          if (!prevTime) return null;
          return new Date(prevTime.getTime() + 1000)
        });
      }, 1000);
    }
    
    // Cleanup function to clear the interval when the component unmounts
    // or before this effect runs again.
    return () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };
  }, [currentTime]); // Rerun this effect ONLY when `currentTime` is reset by a new fetch.


  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value.length > 1 && allTimezones.length > 0) {
      const lowerCaseValue = value.toLowerCase().replace(/ /g, '_');
      const filtered = allTimezones
        .filter(tz => tz.toLowerCase().includes(lowerCaseValue))
        .sort((a, b) => {
          const aStarts = a.toLowerCase().startsWith(lowerCaseValue);
          const bStarts = b.toLowerCase().startsWith(lowerCaseValue);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return a.length - b.length;
        });
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };
  
  const handleSuggestionClick = (timezone: string) => {
    fetchTime(timezone);
  };

  const handleSearch = () => {
    const searchTerm = query.trim();
    if (!searchTerm) return;
    
    if (suggestions.length > 0) {
      fetchTime(suggestions[0]);
    } else {
       const bestGuess = allTimezones.find(tz => tz.toLowerCase().replace(/_/g, ' ').includes(searchTerm.toLowerCase()));
       if (bestGuess) {
           fetchTime(bestGuess);
       } else {
           setError(`Could not find a timezone matching "${query}".`);
       }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleSearch();
    }
  };

  const locationName = useMemo(() => {
      if (!timeData?.timezone) return "";
      const parts = timeData.timezone.split('/');
      return parts.length > 1 ? parts[parts.length - 1].replace(/_/g, ' ') : parts[0];
  }, [timeData]);
  
  const regionName = useMemo(() => {
      if (!timeData?.timezone) return "";
      const parts = timeData.timezone.split('/');
      return parts.length > 1 ? parts[0].replace(/_/g, ' ') : "";
  }, [timeData]);
  
  const utcOffset = useMemo(() => {
    if (!timeData) return '';
    return `UTC${timeData.utc_offset}`;
  }, [timeData]);

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
            <Button onClick={handleSearch} disabled={allTimezones.length === 0 || !query.trim()} className="h-14 rounded-full px-6">
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
        {isLoading && !currentTime ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
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
             <p className="text-center text-destructive p-4 bg-destructive/10 rounded-md">{error || "Failed to fetch time data. Please try again."}</p>
        )}
      </div>
    </div>
  );
}

export const WorldClock = memo(WorldClockComponent);

    