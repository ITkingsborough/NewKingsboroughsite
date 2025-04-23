import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/cms/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import MembersTab from "@/components/cms/community/MembersTab";
import AttendanceTab from "@/components/cms/community/AttendanceTab";
import MinistryGroupsTab from "@/components/cms/community/MinistryGroupsTab";
import { Loader2, Users, CalendarDays, UserPlus2, UsersRound } from "lucide-react";

export default function CommunityDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch member statistics
  const {
    data: memberStats,
    isLoading: memberStatsLoading,
    error: memberStatsError
  } = useQuery({
    queryKey: ["/api/community/members/stats"],
    enabled: !!user
  });

  // Fetch attendance statistics
  const {
    data: attendanceStats,
    isLoading: attendanceStatsLoading,
    error: attendanceStatsError
  } = useQuery({
    queryKey: ["/api/community/attendance/stats"],
    enabled: !!user
  });

  // Fetch recent members
  const {
    data: recentMembers,
    isLoading: recentMembersLoading,
    error: recentMembersError
  } = useQuery({
    queryKey: ["/api/community/members/recent"],
    enabled: !!user
  });

  // Fetch active ministry groups
  const {
    data: activeGroups,
    isLoading: activeGroupsLoading,
    error: activeGroupsError
  } = useQuery({
    queryKey: ["/api/community/ministry-groups/active"],
    enabled: !!user
  });

  useEffect(() => {
    if (memberStatsError) {
      toast({
        title: "Error fetching member statistics",
        description: "Please try again later",
        variant: "destructive",
      });
    }

    if (attendanceStatsError) {
      toast({
        title: "Error fetching attendance statistics",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  }, [memberStatsError, attendanceStatsError, toast]);

  const isLoading = memberStatsLoading || attendanceStatsLoading || 
                   recentMembersLoading || activeGroupsLoading;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Community Engagement Dashboard</h1>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="ministry-groups">Ministry Groups</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="py-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {memberStats?.data?.totalMembers || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {memberStats?.data?.newMembersThisMonth || 0} new this month
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {attendanceStats?.data?.averageAttendance || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {attendanceStats?.data?.newVisitorAverage || 0} new visitors on average
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
                  <UsersRound className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {activeGroups?.data?.length || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Serving various ministry areas
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">New Visitors</CardTitle>
                  <UserPlus2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {attendanceStats?.data?.totalNewVisitors || 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total new visitors tracked
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Recent Members</CardTitle>
                <CardDescription>Recently added members in our congregation</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                {recentMembersLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : recentMembers?.data?.length ? (
                  <div className="space-y-2">
                    {recentMembers.data.slice(0, 5).map((member: any) => (
                      <div 
                        key={member.id} 
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                            {member.firstName[0]}{member.lastName[0]}
                          </div>
                          <div>
                            <div className="font-medium">{member.firstName} {member.lastName}</div>
                            <div className="text-sm text-muted-foreground">
                              {member.email}
                            </div>
                          </div>
                        </div>
                        <div className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                          {member.status}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">No recent members found</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ministry Groups</CardTitle>
                <CardDescription>Active ministry groups</CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                {activeGroupsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : activeGroups?.data?.length ? (
                  <div className="space-y-2">
                    {activeGroups.data.slice(0, 5).map((group: any) => (
                      <div 
                        key={group.id} 
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div>
                          <div className="font-medium">{group.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {group.memberCount} members
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-muted-foreground">No active groups found</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="members">
          <MembersTab />
        </TabsContent>
        
        <TabsContent value="attendance">
          <AttendanceTab />
        </TabsContent>
        
        <TabsContent value="ministry-groups">
          <MinistryGroupsTab />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}