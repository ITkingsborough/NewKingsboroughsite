import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
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
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isLoading) {
      // If not logged in, redirect to login
      if (!user) {
        navigate("/auth/login");
        return;
      }

      // Check role requirements
      if (
        (requireAdmin && !isAdmin) ||
        (requireEditor && !isEditor) ||
        (requireMediaManager && !isMediaManager)
      ) {
        navigate("/cms/unauthorized");
      }
    }
  }, [
    user,
    isLoading,
    isAdmin,
    isEditor,
    isMediaManager,
    requireAdmin,
    requireEditor,
    requireMediaManager,
    navigate,
  ]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated or doesn't have required roles, return null
  // (useEffect will handle navigation)
  if (!user || 
      (requireAdmin && !isAdmin) ||
      (requireEditor && !isEditor) ||
      (requireMediaManager && !isMediaManager)) {
    return null;
  }

  // User is authenticated and has required roles
  return <>{children}</>;
}