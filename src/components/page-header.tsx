"use client";

import Link from "next/link";
import { Search, Gamepad2, Plane, Notebook } from "lucide-react";
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

interface PageHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
  department: string;
  onDepartmentChange: (department: string) => void;
}

export function PageHeader({ 
  searchTerm, 
  onSearchChange, 
  category, 
  onCategoryChange, 
  department, 
  onDepartmentChange,
}: PageHeaderProps) {

  return (
    <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="container flex h-20 items-center gap-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
            <Plane className="h-8 w-8 text-primary" />
            <span className="hidden sm:inline-block">CEP Scripts</span>
        </Link>
        
        <div className="flex-1 flex items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search scripts..."
              className="pl-10 h-11 text-md rounded-full"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <Select value={department} onValueChange={onDepartmentChange}>
            <SelectTrigger className="w-[200px] h-11 text-md rounded-full">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="etg">ETG</SelectItem>
              <SelectItem value="booking">Booking.com</SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[220px] hidden md:flex h-11 text-md rounded-full">
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
                <Gamepad2 className="h-6 w-6" />
              </Button>
            </Link>
        </div>
      </div>
    </header>
  );
}
