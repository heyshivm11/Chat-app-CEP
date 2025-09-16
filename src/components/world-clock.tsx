
"use client";

import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

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
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>('Asia/Kolkata');
  const [timeData, setTimeData] = useState<TimeData | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimezones = async () => {
      try {
        const response = await fetch('https://timeapi.io/api/TimeZone/AvailableTimeZones');
        if (!response.ok) throw new Error('Failed to fetch timezones');
        const data: string[] = await response.json();
        setAllTimezones(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };
    fetchTimezones();
  }, []);
  
  const fetchTime = useCallback(async (timezone: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://timeapi.io/api/time/current/zone?timeZone=${timezone}`);
      if (!response.ok) throw new Error(`Failed to fetch time for ${timezone}`);
      const data: TimeData = await response.json();
      setTimeData(data);
      setCurrentTime(new Date(data.dateTime));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setTimeData(null);
      setCurrentTime(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (selectedTimezone) {
      fetchTime(selectedTimezone);
    }
  }, [selectedTimezone, fetchTime]);

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

  const handleSelectTimezone = (timezone: string) => {
    setSelectedTimezone(timezone);
    setQuery('');
    setSuggestions([]);
  }
  
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);

      if (value) {
        const lowerCaseQuery = value.toLowerCase();
        const filtered = allTimezones
          .filter(tz => tz.toLowerCase().includes(lowerCaseQuery))
          .sort();
        setSuggestions(filtered);
      } else {
        setSuggestions([]);
      }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
        e.preventDefault(); // Prevent form submission if it's inside a form
        handleSelectTimezone(suggestions[0]);
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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          placeholder="Search for a city or timezone..."
          className="w-full pl-10 text-lg h-14 rounded-full shadow-lg"
        />
        {suggestions.length > 0 && (
          <Card className="absolute z-10 w-full mt-2 max-h-60 overflow-y-auto">
            <ScrollArea className="h-full">
              <div className="p-2">
              {suggestions.map(tz => (
                <button
                  key={tz}
                  onClick={() => handleSelectTimezone(tz)}
                  className="w-full text-left p-2 rounded-md hover:bg-accent text-sm"
                >
                  {tz.replace(/_/g, ' ')}
                </button>
              ))}
              </div>
            </ScrollArea>
          </Card>
        )}
      </div>

      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <p className="text-center text-destructive">{error}</p>
        ) : timeData && currentTime ? (
          <Card className="text-center shadow-2xl rounded-2xl bg-card/30 backdrop-blur-sm border-white/20">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">{locationName}</CardTitle>
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
        ) : (
            <p className="text-center text-muted-foreground">Search for a place to see the time.</p>
        )}
      </div>
    </div>
  );
}

export const WorldClock = memo(WorldClockComponent);
