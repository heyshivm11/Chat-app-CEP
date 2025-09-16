
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
      <Card className="w-full max-w-sm z-10 glass-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">CEP Scripts</CardTitle>
          <CardDescription>
            Sign in to access your scripts and tools.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                {...register('firstName', {
                  required: 'First name is required',
                })}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select
                onValueChange={(value: 'Frontline' | 'Schedule Change') => {
                  setValue('department', value, { shouldValidate: true });
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frontline">Frontline</SelectItem>
                  <SelectItem value="Schedule Change">Schedule Change</SelectItem>
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="text-xs text-destructive mt-1">
                  {errors.department.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                'Signing in...'
              ) : (
                'Sign in'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
  );
}
