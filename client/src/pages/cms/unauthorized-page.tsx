import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/cms/DashboardLayout";

export default function UnauthorizedPage() {
  const { user } = useAuth();
  
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center py-12">
        <div className="h-24 w-24 rounded-full bg-amber-100 flex items-center justify-center mb-6">
          <AlertTriangle className="h-12 w-12 text-amber-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Unauthorized Access</h1>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          You don't have the required permissions to access this page.
          Please contact an administrator if you believe this is an error.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/cms/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}