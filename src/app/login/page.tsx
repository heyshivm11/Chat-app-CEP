
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
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
} from '@/components/ui/select';

interface IFormInput {
  firstName: string;
  department: 'Frontline' | 'Schedule Change';
}

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    control,
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
      router.push('/scripts');
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
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
      {/* Decorative shapes */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 text-primary/10 animate-float-1">
        <Plane className="w-full h-full"/>
      </div>
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 text-secondary/10 animate-float-2">
        <Plane className="w-full h-full"/>
      </div>
      <div className="absolute bottom-1/2 right-1/3 w-16 h-16 text-primary/5 animate-float-3">
         <Plane className="w-full h-full"/>
      </div>
      <div className="absolute top-1/3 left-1/2 w-20 h-20 text-secondary/5 animate-float-1">
         <Plane className="w-full h-full"/>
      </div>

      <Card className="w-full max-w-md glass-card z-10 edge-light">
        <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 mb-4 relative">
                <Plane className="h-16 w-16 text-primary animate-fly-login" />
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
              <Label>Department</Label>
              <Controller
                name="department"
                control={control}
                rules={{ required: 'Department is required' }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Frontline">Frontline</SelectItem>
                      <SelectItem value="Schedule Change">Schedule Change</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.department && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.department.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
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
