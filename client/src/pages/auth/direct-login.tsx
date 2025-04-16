import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function DirectLoginPage() {
  const { loginMutation } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // Make direct fetch instead of using mutation to ensure cookies are set properly
      console.log("Attempting direct login with:", { username });
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      console.log("Login response:", data);
      
      if (data.success) {
        toast({
          title: "Login successful",
          description: "Redirecting to dashboard...",
        });
        
        // Wait for a second to ensure the cookie is properly set
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Manually fetch user data instead of relying on cache
        console.log("Fetching user data after login...");
        const userResponse = await fetch('/api/auth/user', {
          credentials: 'include'
        });
        const userData = await userResponse.json();
        console.log("User data response:", userData);
        
        // Now update the cache
        if (userData.success) {
          queryClient.setQueryData(["/api/auth/user"], userData);
          console.log("User data cached successfully");
        }
        
        // Navigate to dashboard after successful login and user data fetch
        console.log("Navigating to dashboard...");
        navigate("/cms/dashboard");
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Incorrect username or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Kingsborough Church CMS</h1>
          <p className="text-gray-600">Direct Admin Login</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          
          <Button 
            className="w-full"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login to Dashboard"
            )}
          </Button>
          
          <div className="text-sm text-center text-gray-600 mt-4">
            Default credentials are pre-filled for your convenience.
          </div>
          
          <div className="mt-6 text-center">
            <a 
              href="http://www.kingsborough.org" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:text-blue-800 inline-flex items-center text-sm"
            >
              <span>Visit the official Kingsborough Church website</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}