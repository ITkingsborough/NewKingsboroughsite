import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User, userRoleEnum } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export type SafeUser = Omit<User, "password">;

export type RegisterData = {
  username: string;
  email: string;
  password: string;
  name: string;
  role?: typeof userRoleEnum.enumValues[number];
};

export type LoginData = {
  username: string;
  password: string;
};

type AuthContextType = {
  user: SafeUser | null;
  isLoading: boolean;
  error: Error | null;
  isAdmin: boolean;
  isEditor: boolean;
  isMediaManager: boolean;
  loginMutation: UseMutationResult<{ user: SafeUser }, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<{ user: SafeUser }, Error, RegisterData>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  const {
    data: authData,
    error,
    isLoading,
  } = useQuery<{ success: boolean; user: SafeUser } | undefined, Error>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const user = authData?.user || null;
  
  // Role checks
  const isAdmin = user?.role === "admin";
  const isEditor = user?.role === "editor" || isAdmin;
  const isMediaManager = user?.role === "media_manager" || isAdmin;

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.setQueryData(["/api/auth/user"], data);
        toast({
          title: "Login successful",
          description: `Welcome back, ${data.user.name}!`,
        });
      } else {
        throw new Error(data.message || "Login failed");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      const res = await apiRequest("POST", "/api/auth/register", userData);
      return await res.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        queryClient.setQueryData(["/api/auth/user"], data);
        toast({
          title: "Registration successful",
          description: `Welcome, ${data.user.name}!`,
        });
      } else {
        throw new Error(data.message || "Registration failed");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/user"], null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        isAdmin,
        isEditor,
        isMediaManager,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}