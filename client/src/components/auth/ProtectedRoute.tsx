import { ReactNode } from "react";
import { Redirect, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireEditor?: boolean;
  requireMediaManager?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
  requireEditor = false,
  requireMediaManager = false,
}: ProtectedRouteProps) {
  const { user, isLoading, isAdmin, isEditor, isMediaManager } = useAuth();
  const [, setLocation] = useLocation();

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Redirect to="/auth/login" />;
  }

  // Check role-based permissions
  if (requireAdmin && !isAdmin) {
    return <Redirect to="/cms/unauthorized" />;
  }

  if (requireEditor && !isEditor) {
    return <Redirect to="/cms/unauthorized" />;
  }

  if (requireMediaManager && !isMediaManager) {
    return <Redirect to="/cms/unauthorized" />;
  }

  // User is authenticated and has appropriate permissions
  return <>{children}</>;
}