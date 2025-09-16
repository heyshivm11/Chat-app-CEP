
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plane } from "lucide-react";

export default function LoginPage() {
  const [firstName, setFirstName] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    if (!firstName.trim() || !department) {
      setError("Please enter your name and select a department.");
      return;
    }
    login({ name: firstName, department });
    router.push("/scripts/etg");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background login-gradient-background">
      <Card className="w-full max-w-sm glass-card">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
                <Plane className="h-10 w-10 text-primary" />
                <CardTitle className="text-3xl">Welcome to CEP</CardTitle>
            </div>
          <CardDescription>
            Please enter your details to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="first-name">First Name</Label>
              <Input
                id="first-name"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frontline">Frontline</SelectItem>
                  <SelectItem value="Schedule Change">Schedule Change</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {error && <p className="text-destructive text-sm mt-4 text-center">{error}</p>}
          <Button onClick={handleLogin} className="w-full mt-8">
            Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
