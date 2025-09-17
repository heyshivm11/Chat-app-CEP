
"use client";

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getRandomFact } from '@/app/actions';
import { Sparkles } from 'lucide-react';

export function RandomFactProvider() {
  const { toast } = useToast();

  useEffect(() => {
    const fetchAndShowFact = async () => {
      const result = await getRandomFact();
      if (result.success) {
        toast({
          title: (
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Sarthi's Fun Fact!
            </div>
          ),
          description: result.data.fact,
          duration: 10000, // Show for 10 seconds
        });
      }
      // Silently fail if there's an error to not bother the user
    };

    const intervalId = setInterval(fetchAndShowFact, 120000); // 2 minutes in milliseconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [toast]);

  return null; // This component doesn't render anything visible
}
