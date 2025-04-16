import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Home, 
  Users, 
  Mail, 
  FileText, 
  Calendar, 
  Mic, 
  Image, 
  LogOut, 
  Settings, 
  Menu, 
  X, 
  ChevronRight,
  BookOpen,
  CircleUser,
  PieChart,
  BarChart3,
  Activity,
  Church,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { Loader2 } from 'lucide-react';
import SermonManager from '@/components/admin/SermonManager';

// Stat card component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  isLoading?: boolean;
  path?: string;
}

const StatCard = ({ title, value, icon: Icon, color, isLoading = false, path }: StatCardProps) => (
  <Card className={`overflow-hidden border-none ${color}`}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              value
            )}
          </h3>
        </div>
        <div className={`rounded-full p-2 bg-white/20`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs text-white/80">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-white hover:text-white hover:bg-white/20 px-2 py-1 h-auto"
          onClick={() => path && (window.location.href = path)}
        >
          View All
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Dashboard components will be added later
const DashboardContent = () => {
  // Fetch Events
  const { 
    data: events = [], 
    isLoading: eventsLoading 
  } = useQuery({
    queryKey: ['/api/events'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Fetch Sermons
  const { 
    data: sermons = [], 
    isLoading: sermonsLoading 
  } = useQuery({
    queryKey: ['/api/sermons'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Fetch Communities
  const { 
    data: communities = [], 
    isLoading: communitiesLoading 
  } = useQuery({
    queryKey: ['/api/communities'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Fetch Contact Messages
  const { 
    data: contactMessages = [], 
    isLoading: contactMessagesLoading 
  } = useQuery({
    queryKey: ['/api/admin/contact'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Fetch Magazines
  const { 
    data: magazines = [], 
    isLoading: magazinesLoading 
  } = useQuery({
    queryKey: ['/api/magazines'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Fetch Leaders
  const { 
    data: leaders = [], 
    isLoading: leadersLoading 
  } = useQuery({
    queryKey: ['/api/leaders'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Fetch Newsletter Subscribers
  const { 
    data: subscribers = [], 
    isLoading: subscribersLoading 
  } = useQuery({
    queryKey: ['/api/admin/subscribers'],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  
  // Website stats
  const visitsThisMonth = 0; // Placeholder until we implement analytics
  const pageViews = 0;       // Placeholder until we implement analytics

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Upcoming Events" 
          value={Array.isArray(events) ? events.length : 0} 
          icon={Calendar} 
          color="bg-gradient-to-br from-amber-400 to-amber-600"
          isLoading={eventsLoading}
          path="/admin/events"
        />
        <StatCard 
          title="Sermons" 
          value={Array.isArray(sermons) ? sermons.length : 0}
          icon={Mic} 
          color="bg-gradient-to-br from-purple-500 to-purple-700"
          isLoading={sermonsLoading}
          path="/admin/sermons"
        />
        <StatCard 
          title="Communities" 
          value={Array.isArray(communities) ? communities.length : 0}
          icon={Users} 
          color="bg-gradient-to-br from-purple-400 to-purple-600"
          isLoading={communitiesLoading} 
          path="/admin/communities"
        />
        <StatCard 
          title="Leadership" 
          value={Array.isArray(leaders) ? leaders.length : 0}
          icon={CircleUser} 
          color="bg-gradient-to-br from-amber-500 to-amber-700"
          isLoading={leadersLoading}
          path="/admin/leaders"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-amber-700">Magazines</CardTitle>
              <span className="text-3xl font-bold">
                {magazinesLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (Array.isArray(magazines) ? magazines.length : 0)}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center text-sm">
                <Link href="/admin/magazines">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 border-amber-300 text-amber-700 hover:text-amber-800 hover:bg-amber-50 hover:border-amber-400"
                  >
                    View All
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-purple-600">Contact Messages</CardTitle>
              <span className="text-3xl font-bold">
                {contactMessagesLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (Array.isArray(contactMessages) ? contactMessages.length : 0)}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center text-sm">
                <Link href="/admin/contact">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 border-purple-300 text-purple-700 hover:text-purple-800 hover:bg-purple-50 hover:border-purple-400"
                  >
                    View All
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-purple-600">Newsletter Subscribers</CardTitle>
            <div className="text-3xl font-bold">
              {subscribersLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (Array.isArray(subscribers) ? subscribers.length : 0)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <div className="text-center space-y-2">
              {subscribersLoading ? (
                <Loader2 className="h-16 w-16 text-gray-300 mx-auto animate-spin" />
              ) : Array.isArray(subscribers) && subscribers.length > 0 ? (
                <>
                  <MessageSquare className="h-16 w-16 text-amber-400 mx-auto" />
                  <p className="text-sm text-gray-500">Managing {subscribers.length} newsletter subscribers</p>
                  <Link href="/admin/subscribers">
                    <Button 
                      variant="outline" 
                      className="mt-4 border-amber-300 text-amber-700 hover:text-amber-800 hover:bg-amber-50 hover:border-amber-400"
                    >
                      Manage Subscribers
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <MessageSquare className="h-16 w-16 text-gray-300 mx-auto" />
                  <p className="text-sm text-gray-500">No newsletter subscribers yet</p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
const CommunityContent = () => <div className="p-6">Communities Content</div>;
const SermonContent = () => <div className="p-6"><SermonManager /></div>;
const EventContent = () => <div className="p-6">Events Content</div>;
const MagazineContent = () => <div className="p-6">Magazines Content</div>;
const LeaderContent = () => <div className="p-6">Leadership Content</div>;
const ContactContent = () => <div className="p-6">Contact Messages Content</div>;
const SubscriberContent = () => <div className="p-6">Newsletter Subscribers Content</div>;
const PageContent = () => <div className="p-6">Pages Content</div>;
const MediaContent = () => <div className="p-6">Media Library Content</div>;
const SettingsContent = () => <div className="p-6">Settings Content</div>;

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/admin' },
  { id: 'communities', label: 'Communities', icon: Users, path: '/admin/communities' },
  { id: 'sermons', label: 'Sermons', icon: Mic, path: '/admin/sermons' },
  { id: 'events', label: 'Events', icon: Calendar, path: '/admin/events' },
  { id: 'magazines', label: 'Magazines', icon: BookOpen, path: '/admin/magazines' },
  { id: 'leaders', label: 'Leadership', icon: CircleUser, path: '/admin/leaders' },
  { id: 'contact', label: 'Contact Messages', icon: Mail, path: '/admin/contact' },
  { id: 'subscribers', label: 'Newsletter', icon: Mail, path: '/admin/subscribers' },
  { id: 'pages', label: 'Pages', icon: FileText, path: '/admin/pages' },
  { id: 'media', label: 'Media Library', icon: Image, path: '/admin/media' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logoutMutation } = useAdminAuth();
  const [location] = useLocation();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  // Function to go to the public website
  const goToPublicSite = () => {
    // Ensure we're using the full URL with origin to avoid relative path issues
    const origin = window.location.origin;
    window.open(`${origin}/`, '_blank');
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar (desktop) */}
      <aside className={`fixed inset-y-0 z-50 flex w-60 flex-col bg-white shadow-md transition-transform duration-300 lg:relative lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-16 items-center px-6 border-b">
          <Link href="/admin" className="flex items-center">
            <h1 className="text-xl font-bold text-amber-600">Kingsborough</h1>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="ml-auto rounded p-1 hover:bg-gray-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto py-6">
          <nav className="flex flex-col space-y-1 px-3">
            {navItems.map((item) => (
              <Link 
                key={item.id}
                href={item.path as string}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm cursor-pointer ${
                  location === item.path
                    ? 'bg-amber-50 font-medium text-amber-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <item.icon className="mr-3 h-5 w-5" />
                  <span>{item.label}</span>
                </div>
                {location === item.path && <ChevronRight className="h-4 w-4" />}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="border-t p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                {user?.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 w-full justify-start text-amber-600 hover:bg-amber-50 hover:text-amber-700 border-amber-200"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
      </aside>
      
      {/* Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="flex h-16 items-center bg-white px-6 border-b">
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="rounded p-1 hover:bg-gray-100 lg:hidden"
          >
            <Menu size={24} />
          </button>
          <div className="ml-4 lg:ml-0">
            <h2 className="text-xl font-medium text-gray-800">
              {navItems.find((item) => item.path === location)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="ml-auto">
            <a 
              href="/"
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button 
                variant="outline" 
                className="mr-2 text-amber-600 hover:bg-amber-50 hover:text-amber-700 border-amber-200"
              >
                <Church className="mr-2 h-4 w-4" />
                View Website
              </Button>
            </a>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {location === '/admin' && <DashboardContent />}
          {location === '/admin/communities' && <CommunityContent />}
          {location === '/admin/sermons' && <SermonContent />}
          {location === '/admin/events' && <EventContent />}
          {location === '/admin/magazines' && <MagazineContent />}
          {location === '/admin/leaders' && <LeaderContent />}
          {location === '/admin/contact' && <ContactContent />}
          {location === '/admin/subscribers' && <SubscriberContent />}
          {location === '/admin/pages' && <PageContent />}
          {location === '/admin/media' && <MediaContent />}
          {location === '/admin/settings' && <SettingsContent />}
        </main>
      </div>
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}