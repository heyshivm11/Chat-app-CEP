
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plane, LogIn } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

interface IFormInput {
  empId: string;
  systemPassword:  string;
  firstName: string;
}

export function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    setIsLoading(true);

    // Mock authentication
    setTimeout(() => {
      toast({
        title: "Login Successful",
        description: `Welcome, ${data.firstName}!`,
      });
      // Redirect to the scripts page with the agent's name
      router.push(`/scripts?agent=${encodeURIComponent(data.firstName)}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Toaster />
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center">
          <div className="mx-auto h-12 w-12 plane-animation mb-4">
            <Plane className="h-12 w-12 text-primary plane-icon" />
          </div>
          <CardTitle className="text-2xl">CEP Scripts</CardTitle>
          <CardDescription>Please log in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                {...register("firstName", { required: "First name is required" })}
              />
              {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="empId">Emp ID</Label>
              <Input
                id="empId"
                placeholder="Enter your Employee ID"
                {...register("empId", { required: "Employee ID is required" })}
              />
              {errors.empId && <p className="text-xs text-red-500 mt-1">{errors.empId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="systemPassword">System Password</Label>
              <Input
                id="systemPassword"
                type="password"
                placeholder="Enter your password"
                {...register("systemPassword", { required: "Password is required" })}
              />
              {errors.systemPassword && <p className="text-xs text-red-500 mt-1">{errors.systemPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </div>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
