import { useState } from 'react';
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
  Activity
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Stat card component
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => (
  <Card className={`overflow-hidden border-none ${color}`}>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        </div>
        <div className={`rounded-full p-2 bg-white/20`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-xs text-white/80">
        <Button variant="ghost" size="sm" className="text-xs text-white hover:text-white hover:bg-white/20 px-2 py-1 h-auto">
          View All
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Dashboard components will be added later
const DashboardContent = () => (
  <div className="p-6 space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard 
        title="Pages" 
        value="1,345" 
        icon={FileText} 
        color="bg-gradient-to-br from-emerald-500 to-emerald-600" 
      />
      <StatCard 
        title="Posts" 
        value="12,456" 
        icon={FileText} 
        color="bg-gradient-to-br from-purple-500 to-purple-600" 
      />
      <StatCard 
        title="Events" 
        value="21" 
        icon={Calendar} 
        color="bg-gradient-to-br from-orange-500 to-orange-600" 
      />
      <StatCard 
        title="Files" 
        value="1,220" 
        icon={Image} 
        color="bg-gradient-to-br from-blue-500 to-blue-600" 
      />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Categories</CardTitle>
            <span className="text-3xl font-bold">65</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center text-sm">
              <Button variant="outline" size="sm" className="h-8">View All</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Comments</CardTitle>
            <span className="text-3xl font-bold">9,876</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center text-sm">
              <Button variant="outline" size="sm" className="h-8">View All</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>User Stats</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-8">Week</Button>
            <Button variant="outline" size="sm" className="bg-purple-500 text-white border-purple-500 h-8">Month</Button>
            <Button variant="outline" size="sm" className="h-8">Year</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-center space-y-2">
            <BarChart3 className="h-16 w-16 text-gray-300 mx-auto" />
            <p className="text-sm text-gray-500">Analytics chart will be displayed here</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
const CommunityContent = () => <div className="p-6">Communities Content</div>;
const SermonContent = () => <div className="p-6">Sermons Content</div>;
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

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar (desktop) */}
      <aside className={`fixed inset-y-0 z-50 flex w-60 flex-col bg-white shadow-md transition-transform duration-300 lg:relative lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-16 items-center px-6 border-b">
          <Link href="/admin" className="flex items-center">
            <h1 className="text-xl font-bold text-purple-600">Constructor</h1>
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
              <div key={item.id} 
                onClick={() => window.location.href = item.path}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm cursor-pointer ${
                  location === item.path
                    ? 'bg-purple-50 font-medium text-purple-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}>
                <div className="flex items-center">
                  <item.icon className="mr-3 h-5 w-5" />
                  <span>{item.label}</span>
                </div>
                {location === item.path && <ChevronRight className="h-4 w-4" />}
              </div>
            ))}
          </nav>
        </div>
        
        <div className="border-t p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
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
            className="mt-4 w-full justify-start text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-gray-200"
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