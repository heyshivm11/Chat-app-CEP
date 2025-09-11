"use client";

import Link from "next/link";
import { BookText, Home, Search, Plane } from "lucide-react";
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

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  department: string;
  onDepartmentChange: (department: string) => void;
}

export function Header({ 
  searchTerm, 
  onSearchChange, 
  category, 
  onCategoryChange, 
  department, 
  onDepartmentChange 
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/80 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 text-foreground font-semibold">
          <BookText className="h-6 w-6 text-primary" />
          <span className="hidden md:inline">CEP Scripts</span>
        </Link>
        
        <div className="flex-1 flex justify-center items-center gap-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search scripts..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <Select value={department} onValueChange={onDepartmentChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent className="glass-card">
              <SelectItem value="etg">ETG</SelectItem>
              <SelectItem value="booking">Booking.com</SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[200px] hidden md:flex">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent className="glass-card">
              <SelectItem value="All">All Categories</SelectItem>
              {scriptCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
            <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
