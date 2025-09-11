
"use client";

import Link from "next/link";
import { Search, LogOut, Gamepad2, BookText } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { usePageLoader } from "./providers/page-loader-provider";
import { PageLink } from "./page-link";


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
  const { logout } = useAuth();
  const router = useRouter();
  const { showLoader } = usePageLoader();

  const handleLogout = async () => {
    showLoader();
    await logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container flex h-16 items-center gap-6">
        <PageLink href="/scripts" className="flex items-center gap-2 text-lg font-bold text-foreground">
            <BookText className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline-block">CEP Scripts</span>
        </PageLink>
        
        <div className="flex-1 flex items-center gap-4">
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
            <SelectContent>
              <SelectItem value="etg">ETG</SelectItem>
              <SelectItem value="booking">Booking.com</SelectItem>
            </SelectContent>
          </Select>

          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-[200px] hidden md:flex">
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
            <PageLink href="/fun" passHref>
              <Button variant="ghost" size="icon" aria-label="Fun Zone">
                <Gamepad2 className="h-5 w-5" />
              </Button>
            </PageLink>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-500 hover:text-red-400 hover:bg-red-500/10" aria-label="Logout">
                <LogOut className="h-5 w-5" />
            </Button>
        </div>
      </div>
    </header>
  );
}
