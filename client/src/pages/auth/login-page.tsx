import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { user, loginMutation } = useAuth();
  const [, navigate] = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/cms/dashboard");
    }
  }, [user, navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  if (user) return null; // Prevent flash of content before redirect

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Form Column */}
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Kingsborough Church</CardTitle>
            <CardDescription className="text-center">
              CMS Admin Login
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
                        <Input 
                          type="password" 
                          placeholder="Enter your password" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
              This area is restricted to authorized personnel only.
            </div>
          </CardFooter>
        </Card>

        {/* Hero Column */}
        <div className="hidden md:flex flex-col justify-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">
              Kingsborough Church<br /> 
              <span className="text-primary">Content Management System</span>
            </h1>
            <p className="text-xl text-slate-600">
              Manage all your church content in one place - sermons, events, 
              galleries, ministries, and more.
            </p>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="mr-4 h-8 w-8 flex items-center justify-center rounded-full bg-primary/10">
                  <span className="text-primary font-semibold">✓</span>
                </div>
                <div>
                  <h3 className="font-medium">Easy Management</h3>
                  <p className="text-slate-600">Update website content with just a few clicks</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 h-8 w-8 flex items-center justify-center rounded-full bg-primary/10">
                  <span className="text-primary font-semibold">✓</span>
                </div>
                <div>
                  <h3 className="font-medium">Role-based Access</h3>
                  <p className="text-slate-600">Secure permissions for different team members</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="mr-4 h-8 w-8 flex items-center justify-center rounded-full bg-primary/10">
                  <span className="text-primary font-semibold">✓</span>
                </div>
                <div>
                  <h3 className="font-medium">Comprehensive Tools</h3>
                  <p className="text-slate-600">Manage all aspects of your church's online presence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}