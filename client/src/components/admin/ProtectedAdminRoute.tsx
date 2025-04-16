import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

interface ProtectedAdminRouteProps {
  path: string;
  component: () => React.JSX.Element;
}

export function ProtectedAdminRoute({ path, component: Component }: ProtectedAdminRouteProps) {
  const { user, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/admin/login" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}