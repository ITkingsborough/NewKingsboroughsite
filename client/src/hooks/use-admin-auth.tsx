import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AdminUserData = {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

type LoginData = {
  username: string;
  password: string;
};

type AdminAuthContextType = {
  user: AdminUserData | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<AdminUserData, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
};

export const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();

  // Query to fetch the current admin user
  const {
    data: user = null,
    error,
    isLoading,
  } = useQuery<AdminUserData | null, Error>({
    queryKey: ["/api/admin/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Mutation to login
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/admin/login", credentials);
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to login");
      }
      return await res.json();
    },
    onSuccess: (user: AdminUserData) => {
      queryClient.setQueryData(["/api/admin/me"], user);
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation to logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/logout");
      if (!res.ok) {
        const error = await res.text();
        throw new Error(error || "Failed to logout");
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/admin/me"], null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
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
    <AdminAuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}