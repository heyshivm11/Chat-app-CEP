
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LogIn, Plane } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface IFormInput {
  firstName: string;
  department: 'Frontline' | 'Schedule Change';
}

export function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInput>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true);
    try {
      await login(data.firstName, data.department);
      toast({
        title: 'Login Successful',
        description: 'Welcome!',
      });
      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 grid-background">
      <Card className="w-full max-w-md z-10 border-2 border-black rounded-lg shadow-[8px_8px_0px_#000]">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Agent Login</CardTitle>
          <CardDescription>Enter your details to access the scripts</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="font-semibold">First Name</Label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                className="border-2 border-black"
                {...register('firstName', {
                  required: 'First name is required',
                })}
              />
              {errors.firstName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">Department</Label>
              <Select
                onValueChange={(value: 'Frontline' | 'Schedule Change') => {
                  setValue('department', value, { shouldValidate: true });
                }}
                {...register('department', {
                  required: 'Department is required',
                })}
              >
                <SelectTrigger className="border-2 border-black">
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent className="border-2 border-black">
                  <SelectItem value="Frontline">Frontline</SelectItem>
                  <SelectItem value="Schedule Change">Schedule Change</SelectItem>
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.department.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full btn-custom btn-primary-custom" disabled={isLoading}>
              {isLoading ? (
                'Logging in...'
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
