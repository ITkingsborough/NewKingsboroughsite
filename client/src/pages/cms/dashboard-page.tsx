import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { DashboardLayout } from "@/components/cms/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle,
  Calendar, 
  FileText, 
  Image, 
  Loader2,
  MessageSquare, 
  Mic, 
  Users 
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const name = user?.name || "";

  // Fetch statistics from API
  const { data: sermonsData, isLoading: sermonsLoading } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: ["/api/cms/sermons"],
    refetchOnWindowFocus: false
  });

  const { data: eventsData, isLoading: eventsLoading } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: ["/api/cms/events"],
    refetchOnWindowFocus: false
  });

  const { data: galleryData, isLoading: galleryLoading } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: ["/api/cms/gallery"],
    refetchOnWindowFocus: false
  });

  const { data: contactData, isLoading: contactLoading } = useQuery<{ success: boolean; data: any[] }>({
    queryKey: ["/api/cms/contacts"],
    refetchOnWindowFocus: false
  });

  // Calculate prayer requests count
  const prayerRequests = contactData?.data?.filter(message => message.isPrayer) || [];
  
  // Calculate future events
  const now = new Date();
  const upcomingEvents = eventsData?.data?.filter(event => new Date(event.date) > now) || [];

  // Create stats array from real data
  const stats = [
    {
      title: "Total Sermons",
      value: sermonsLoading ? null : sermonsData?.data?.length || 0,
      icon: <Mic className="h-6 w-6 text-primary" />,
      description: "Recorded sermons and teachings",
      loading: sermonsLoading,
      link: "/cms/sermons"
    },
    {
      title: "Upcoming Events",
      value: eventsLoading ? null : upcomingEvents.length,
      icon: <Calendar className="h-6 w-6 text-primary" />,
      description: "Events in the future",
      loading: eventsLoading,
      link: "/cms/events"
    },
    {
      title: "Gallery Photos",
      value: galleryLoading ? null : galleryData?.data?.length || 0,
      icon: <Image className="h-6 w-6 text-primary" />,
      description: "Images across all albums",
      loading: galleryLoading,
      link: "/cms/gallery"
    },
    {
      title: "Prayer Requests",
      value: contactLoading ? null : prayerRequests.length,
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      description: "Received prayer requests",
      loading: contactLoading,
      link: "/cms/contact"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {name}</h1>
          <p className="text-muted-foreground">
            Here's an overview of your church's content and recent activity.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Link key={index} href={stat.link}>
              <a className="block h-full">
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    {stat.icon}
                  </CardHeader>
                  <CardContent>
                    {stat.loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <div className="text-2xl font-bold">{stat.value}</div>
                    )}
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              </a>
            </Link>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Items</CardTitle>
              <CardDescription>
                Latest content from your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sermonsLoading || eventsLoading || galleryLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : sermonsData?.data?.length === 0 && eventsData?.data?.length === 0 && galleryData?.data?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <AlertTriangle className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No content yet</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">
                    Start adding content to see it displayed here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Recent sermons */}
                  {sermonsData?.data?.slice(0, 2).map((sermon, index) => (
                    <div key={`sermon-${index}`} className="border-l-4 border-primary pl-4 py-2">
                      <p className="text-sm font-medium">Sermon: {sermon.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(sermon.date).toLocaleDateString("en-US", { 
                          month: "short", 
                          day: "numeric", 
                          year: "numeric" 
                        })}
                      </p>
                    </div>
                  ))}

                  {/* Recent events */}
                  {eventsData?.data?.slice(0, 2).map((event, index) => (
                    <div key={`event-${index}`} className="border-l-4 border-primary pl-4 py-2">
                      <p className="text-sm font-medium">Event: {event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString("en-US", { 
                          month: "short", 
                          day: "numeric", 
                          year: "numeric"
                        })}
                      </p>
                    </div>
                  ))}

                  {/* Recent gallery items */}
                  {galleryData?.data?.slice(0, 2).map((item, index) => (
                    <div key={`gallery-${index}`} className="border-l-4 border-primary pl-4 py-2">
                      <p className="text-sm font-medium">Gallery: {item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.date).toLocaleDateString("en-US", { 
                          month: "short", 
                          day: "numeric", 
                          year: "numeric"
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <Link href="/cms/sermons">
                  <a className="flex items-center gap-4 p-2 hover:bg-muted rounded-md border transition-colors">
                    <Mic className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Manage Sermons</p>
                      <p className="text-xs text-muted-foreground">Add, edit or delete sermon content</p>
                    </div>
                  </a>
                </Link>
                
                <Link href="/cms/events">
                  <a className="flex items-center gap-4 p-2 hover:bg-muted rounded-md border transition-colors">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Manage Events</p>
                      <p className="text-xs text-muted-foreground">Create and schedule church events</p>
                    </div>
                  </a>
                </Link>
                
                <Link href="/cms/gallery">
                  <a className="flex items-center gap-4 p-2 hover:bg-muted rounded-md border transition-colors">
                    <Image className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Manage Gallery</p>
                      <p className="text-xs text-muted-foreground">Upload and organize church photos</p>
                    </div>
                  </a>
                </Link>
                
                <Link href="/cms/contact">
                  <a className="flex items-center gap-4 p-2 hover:bg-muted rounded-md border transition-colors">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">View Contact Messages</p>
                      <p className="text-xs text-muted-foreground">Respond to contact requests and prayer needs</p>
                    </div>
                  </a>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}