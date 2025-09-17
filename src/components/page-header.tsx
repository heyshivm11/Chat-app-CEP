
"use client";
import React from 'react';
import Link from "next/link";
import { Search, Globe, Plane, Notebook, LogOut } from "@/components/ui/lucide-icons";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeSwitcher } from "./theme-switcher";
import { scriptCategories } from "@/lib/scripts";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Script } from '@/lib/types';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearchSubmit: () => void;
  category: string;
  onCategoryChange: (category: string) => void;
  department: string;
  onDepartmentChange: (department: string) => void;
  suggestions: Script[];
  onSuggestionClick: (scriptId: string) => void;
}

function PageHeaderComponent({ 
  searchTerm, 
  onSearchChange, 
  onSearchSubmit,
  category, 
  onCategoryChange, 
  department, 
  onDepartmentChange,
  suggestions,
  onSuggestionClick
}: PageHeaderProps) {
  const { logout } = useAuth();
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        onSuggestionClick(suggestions[activeIndex].id);
      } else {
        onSearchSubmit();
      }
      setShowSuggestions(false);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  }
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
    setShowSuggestions(true);
    setActiveIndex(-1);
  }

  const handleSuggestionClick = (scriptId: string) => {
    onSuggestionClick(scriptId);
    setShowSuggestions(false);
  }

  const handleBlur = () => {
    // Delay hiding suggestions to allow click events to register
    setTimeout(() => setShowSuggestions(false), 150);
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-background/30 backdrop-blur-lg border-b">
      <div className="container flex h-20 items-center gap-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Plane className="h-8 w-8 text-primary" />
            <span className="hidden sm:inline-block">CEP Scripts</span>
        </Link>
        
        <div className="flex-1 flex items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search scripts..."
              className="pl-12 h-12 text-md"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              onBlur={handleBlur}
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && searchTerm && (
              <Card className="absolute top-full mt-2 w-full z-20 shadow-lg">
                <CardContent className="p-2">
                  <ul>
                    {suggestions.map((script, index) => (
                      <li
                        key={script.id}
                        className={cn(
                          "p-2 rounded-md cursor-pointer",
                          index === activeIndex ? "bg-accent" : "hover:bg-accent/50"
                        )}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSuggestionClick(script.id);
                        }}
                      >
                        <p className="font-semibold">{script.title}</p>
                        <p className="text-sm text-muted-foreground">{script.category}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
             {showSuggestions && searchTerm && suggestions.length === 0 && (
                <Card className="absolute top-full mt-2 w-full z-20 shadow-lg">
                    <CardContent className="p-4 text-center text-muted-foreground">
                        No results found.
                    </CardContent>
                </Card>
            )}
          </div>

          <Select value={department} onValueChange={onDepartmentChange}>
            <SelectTrigger className="w-[200px] h-12 text-md">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="etg">ETG</SelectItem>
              <SelectItem value="bookingcom">Booking.com</SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[220px] hidden md:flex h-12 text-md">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {scriptCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <Link href="/notes" passHref>
              <Button variant="ghost" size="icon" aria-label="Rough Notes">
                <Notebook className="h-6 w-6" />
              </Button>
            </Link>
            <Link href="/fun" passHref>
              <Button variant="ghost" size="icon" aria-label="Fun Zone">
                <Globe className="h-6 w-6" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" aria-label="Logout" onClick={logout}>
                <LogOut className="h-6 w-6" />
            </Button>
        </div>
      </div>
    </header>
  );
}

export const PageHeader = React.memo(PageHeaderComponent);

    