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
  User,
  BookOpen,
  CircleUser
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { Button } from '@/components/ui/button';

// Dashboard components will be added later
const DashboardContent = () => <div className="p-6">Dashboard Overview Content</div>;
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (desktop) */}
      <aside className={`fixed inset-y-0 z-50 flex w-64 flex-col bg-white shadow-lg transition-transform duration-300 lg:relative lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-16 items-center justify-between px-4">
          <Link href="/admin" className="flex items-center">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="rounded p-1 hover:bg-gray-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto py-2">
          <nav className="flex flex-col space-y-1 px-2">
            {navItems.map((item) => (
              <Link key={item.id} href={item.path}>
                <a className={`flex items-center rounded-lg px-4 py-2 text-sm ${
                  location === item.path
                    ? 'bg-gray-100 font-medium text-deepPurple'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}>
                  <item.icon className="mr-3 h-5 w-5" />
                  <span>{item.label}</span>
                </a>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="border-t p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <User className="h-8 w-8 rounded-full bg-gray-200 p-1" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="mt-4 w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
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
        <header className="flex h-16 items-center bg-white px-4 shadow-sm">
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="rounded p-1 hover:bg-gray-100 lg:hidden"
          >
            <Menu size={24} />
          </button>
          <div className="ml-4 lg:ml-0">
            <h2 className="text-xl font-bold">
              {navItems.find((item) => item.path === location)?.label || 'Dashboard'}
            </h2>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-auto bg-gray-50">
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