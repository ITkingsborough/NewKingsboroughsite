import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Redirect } from "wouter";
import { Loader2 } from "lucide-react";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const { user, isLoading, loginMutation } = useAdminAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  async function onSubmit(data: LoginFormData) {
    loginMutation.mutate(data);
  }
  
  // Redirect to admin dashboard if already logged in
  if (user) {
    return <Redirect to="/admin" />;
  }
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Enter your password" 
                          {...field} 
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-400 hover:text-gray-500"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loginMutation.isPending || isLoading}
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center text-xs text-muted-foreground">
          Kingsborough Church Admin Panel
        </CardFooter>
      </Card>
    </div>
  );
}