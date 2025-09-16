
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

interface PageHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onSearchSubmit: () => void;
  category: string;
  onCategoryChange: (category: string) => void;
  department: string;
  onDepartmentChange: (department: string) => void;
}

function PageHeaderComponent({ 
  searchTerm, 
  onSearchChange, 
  onSearchSubmit,
  category, 
  onCategoryChange, 
  department, 
  onDepartmentChange,
}: PageHeaderProps) {
  const { logout } = useAuth();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
    }
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-background/30 backdrop-blur-lg border-b">
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
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
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
