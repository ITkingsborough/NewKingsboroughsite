import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  Calendar,
  Home,
  Image,
  LogOut,
  Menu,
  Mic,
  Settings,
  Users,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toaster } from "@/components/ui/toaster";

interface DashboardLayoutProps {
  children: ReactNode;
}

interface SidebarLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarLink({
  href,
  icon,
  label,
  active,
  onClick,
}: SidebarLinkProps) {
  return (
    <Link href={href}>
      <a
        onClick={onClick}
        className={cn(
          "flex items-center gap-x-2 py-2 px-3 rounded-md text-sm font-medium",
          active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        {icon}
        {label}
      </a>
    </Link>
  );
}

function Sidebar({ className }: { className?: string }) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const name = user?.name || "";
  const role = user?.role || "";

  // Format role for display
  const displayRole = 
    role === "admin" ? "Administrator" :
    role === "editor" ? "Content Editor" :
    role === "media_manager" ? "Media Manager" : 
    "User";

  // Get user initials for avatar (take first letter of each word in name)
  const initials = name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();

  // Handle logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <aside className={cn("border-r h-screen flex flex-col", className)}>
      <div className="p-4 border-b flex items-center justify-between">
        <div className="font-semibold text-lg text-primary">
          Kingsborough CMS
        </div>
      </div>
      
      <div className="p-4 border-b">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <div className="font-medium">{name}</div>
            <div className="text-xs text-muted-foreground">{displayRole}</div>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <div className="space-y-1">
            <SidebarLink
              href="/cms/dashboard"
              icon={<Home className="h-4 w-4" />}
              label="Dashboard"
              active={location === "/cms/dashboard"}
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground py-1 px-3">
              Content Management
            </p>
            <SidebarLink
              href="/cms/sermons"
              icon={<Mic className="h-4 w-4" />}
              label="Sermons"
              active={location.startsWith("/cms/sermons")}
            />
            <SidebarLink
              href="/cms/events"
              icon={<Calendar className="h-4 w-4" />}
              label="Events"
              active={location.startsWith("/cms/events")}
            />
            <SidebarLink
              href="/cms/gallery"
              icon={<Image className="h-4 w-4" />}
              label="Gallery"
              active={location.startsWith("/cms/gallery")}
            />
            <SidebarLink
              href="/cms/magazines"
              icon={<FileText className="h-4 w-4" />}
              label="Magazines"
              active={location.startsWith("/cms/magazines")}
            />
          </div>
          
          {user?.role === "admin" && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground py-1 px-3">
                Administration
              </p>
              <SidebarLink
                href="/cms/users"
                icon={<Users className="h-4 w-4" />}
                label="User Management"
                active={location.startsWith("/cms/users")}
              />
              <SidebarLink
                href="/cms/settings"
                icon={<Settings className="h-4 w-4" />}
                label="Settings"
                active={location.startsWith("/cms/settings")}
              />
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {logoutMutation.isPending ? "Logging out..." : "Log out"}
        </Button>
      </div>
    </aside>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <Sidebar className="hidden lg:flex w-64 flex-col" />
      
      {/* Mobile sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <header className="border-b bg-white p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold">Kingsborough Church CMS</h1>
            <Link 
              href="/" 
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
            >
              <span>Visit Church Website</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </Link>
          </div>
        </header>
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
      
      <Toaster />
    </div>
  );
}