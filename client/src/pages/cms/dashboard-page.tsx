import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { DashboardLayout } from "@/components/cms/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, Image, MessageSquare, Mic, Users } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const name = user?.name || "";

  // For a real application, these would be fetched from the API
  const stats = [
    {
      title: "Total Sermons",
      value: "54",
      icon: <Mic className="h-6 w-6 text-primary" />,
      description: "Recorded sermons and teachings"
    },
    {
      title: "Upcoming Events",
      value: "12",
      icon: <Calendar className="h-6 w-6 text-primary" />,
      description: "Events in next 30 days"
    },
    {
      title: "Gallery Photos",
      value: "347",
      icon: <Image className="h-6 w-6 text-primary" />,
      description: "Images across all albums"
    },
    {
      title: "Team Members",
      value: "23",
      icon: <Users className="h-6 w-6 text-primary" />,
      description: "Staff and volunteers"
    },
    {
      title: "Prayer Requests",
      value: "18",
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      description: "Pending prayer requests"
    },
    {
      title: "Magazines",
      value: "9",
      icon: <FileText className="h-6 w-6 text-primary" />,
      description: "Published digital magazines"
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

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest content updates and changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-primary pl-4 py-2">
                  <p className="text-sm">New sermon uploaded: "The Power of Faith"</p>
                  <p className="text-xs text-muted-foreground">Today at 10:45 AM</p>
                </div>
                <div className="border-l-4 border-primary pl-4 py-2">
                  <p className="text-sm">Event created: "Youth Summer Retreat"</p>
                  <p className="text-xs text-muted-foreground">Yesterday at 3:22 PM</p>
                </div>
                <div className="border-l-4 border-primary pl-4 py-2">
                  <p className="text-sm">Added 24 new photos to "Easter Service" gallery</p>
                  <p className="text-xs text-muted-foreground">Apr 14, 2025 at 9:30 AM</p>
                </div>
                <div className="border-l-4 border-primary pl-4 py-2">
                  <p className="text-sm">Team member updated: Added new worship leader</p>
                  <p className="text-xs text-muted-foreground">Apr 12, 2025 at 2:15 PM</p>
                </div>
              </div>
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
              <div className="grid gap-2">
                <div className="flex items-center gap-4 p-2 hover:bg-muted cursor-pointer rounded-md">
                  <Mic className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Upload New Sermon</p>
                    <p className="text-xs text-muted-foreground">Add video, audio, or text sermon</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-2 hover:bg-muted cursor-pointer rounded-md">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Create Event</p>
                    <p className="text-xs text-muted-foreground">Schedule a new church event</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-2 hover:bg-muted cursor-pointer rounded-md">
                  <Image className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Upload Gallery Images</p>
                    <p className="text-xs text-muted-foreground">Add photos to existing galleries</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-2 hover:bg-muted cursor-pointer rounded-md">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">View Prayer Requests</p>
                    <p className="text-xs text-muted-foreground">Check recent prayer submissions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}