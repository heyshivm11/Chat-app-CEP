
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
import { LogIn } from 'lucide-react';
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
      <Card className="w-full max-w-sm z-10 bg-primary-foreground/5 backdrop-blur-lg border-primary-foreground/20 text-primary-foreground">
        <CardHeader className="text-center">
          <CardTitle className="text-5xl font-bold">SettleUp</CardTitle>
          <CardDescription className="text-primary-foreground/80 text-lg">Simplify. Split. Settle.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Input
                id="firstName"
                placeholder="Email"
                className="bg-transparent border-primary-foreground/30 placeholder:text-primary-foreground/60 h-12 rounded-xl"
                {...register('firstName', {
                  required: 'First name is required',
                })}
              />
              {errors.firstName && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
             <div className="space-y-2">
              <Input
                id="password"
                type="password"
                placeholder="Password"
                className="bg-transparent border-primary-foreground/30 placeholder:text-primary-foreground/60 h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold sr-only">Department</Label>
              <Select
                onValueChange={(value: 'Frontline' | 'Schedule Change') => {
                  setValue('department', value, { shouldValidate: true });
                }}
                {...register('department', {
                  required: 'Department is required',
                })}
              >
                <SelectTrigger className="bg-transparent border-primary-foreground/30 placeholder:text-primary-foreground/60 h-12 rounded-xl">
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frontline">Frontline</SelectItem>
                  <SelectItem value="Schedule Change">Schedule Change</SelectItem>
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.department.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full h-14 bg-gray-900 text-white hover:bg-gray-800 rounded-full font-bold text-lg" disabled={isLoading}>
              {isLoading ? (
                'Signing in...'
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
            <div className="text-center mt-4">
                 <Button variant="link" className="text-primary-foreground/80 font-semibold text-sm">
                    Forgot your password?
                </Button>
            </div>
        </CardContent>
      </Card>
  );
}
