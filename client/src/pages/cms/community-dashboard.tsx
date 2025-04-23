import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { DashboardLayout } from "@/components/cms/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, UsersRound, CalendarDays, UserCheck } from "lucide-react";
import MembersTab from "@/components/cms/community/MembersTab";
import AttendanceTab from "@/components/cms/community/AttendanceTab";
import MinistryGroupsTab from "@/components/cms/community/MinistryGroupsTab";

export default function CommunityDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("members");

  // Fetch member statistics
  const {
    data: membersStatsData,
    isLoading: membersStatsLoading,
  } = useQuery<{ success: boolean, data: any }>({
    queryKey: ["/api/community/members/stats"],
  });

  // Fetch attendance statistics
  const {
    data: attendanceStatsData,
    isLoading: attendanceStatsLoading,
  } = useQuery<{ success: boolean, data: any }>({
    queryKey: ["/api/community/attendance/stats"],
  });

  // Fetch ministry groups
  const {
    data: ministryGroupsData,
    isLoading: ministryGroupsLoading,
  } = useQuery<{ success: boolean, data: any }>({
    queryKey: ["/api/community/ministry-groups"],
  });

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Community Engagement Dashboard</h2>
          <p className="text-muted-foreground">
            Manage church members, track attendance, and organize ministry groups
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {membersStatsLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : membersStatsData?.data ? (
                  membersStatsData.data.totalMembers.toLocaleString()
                ) : (
                  "0"
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total registered members
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Members</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {membersStatsLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : membersStatsData?.data ? (
                  membersStatsData.data.newMembersThisMonth.toLocaleString()
                ) : (
                  "0"
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Added this month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {attendanceStatsLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : attendanceStatsData?.data ? (
                  attendanceStatsData.data.averageAttendance.toLocaleString()
                ) : (
                  "0"
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Per service
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ministry Groups</CardTitle>
              <UsersRound className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {ministryGroupsLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : ministryGroupsData?.data ? (
                  ministryGroupsData.data.length.toLocaleString()
                ) : (
                  "0"
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Active groups
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="members">
              <Users className="h-4 w-4 mr-2" />
              Members
            </TabsTrigger>
            <TabsTrigger value="attendance">
              <CalendarDays className="h-4 w-4 mr-2" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="groups">
              <UsersRound className="h-4 w-4 mr-2" />
              Groups
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="members" className="space-y-4">
            <MembersTab />
          </TabsContent>
          
          <TabsContent value="attendance" className="space-y-4">
            <AttendanceTab />
          </TabsContent>
          
          <TabsContent value="groups" className="space-y-4">
            <MinistryGroupsTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}