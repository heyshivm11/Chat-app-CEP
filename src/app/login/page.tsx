
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LogIn } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/components/providers/theme-provider";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const { theme } = useTheme();

  const handleLogin = () => {
    if (!name.trim() || !department) {
      setError('Please enter your name and select a department.');
      return;
    }
    login(name, department);
    // The useAuth hook will handle the redirection.
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen p-4">
       <div className="absolute top-4 right-4 z-10">
        <ThemeSwitcher />
      </div>
      
      <Image
        src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Airplane wing in the sky - Light Mode"
        fill
        className={cn(
            "object-cover -z-10 transition-opacity duration-1000",
            theme === 'dark' ? 'opacity-0' : 'opacity-100'
        )}
        priority
      />
      <Image
        src="https://storage.googleapis.com/project-spark-348216/815/studio/assets/1l_Gk7Lz1.jpg"
        alt="Airplane flying over a city at night - Dark Mode"
        fill
        className={cn(
            "object-cover -z-10 transition-opacity duration-1000",
            theme === 'dark' ? 'opacity-100' : 'opacity-0'
        )}
        priority
      />

      <Card className="w-full max-w-sm bg-background/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to access the CEP scripts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">First Name</Label>
            <Input
              id="name"
              placeholder="Enter your first name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select onValueChange={setDepartment} value={department}>
              <SelectTrigger id="department">
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="etg">FrontLine</SelectItem>
                <SelectItem value="bookingcom">Schedule Change</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin}>
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
