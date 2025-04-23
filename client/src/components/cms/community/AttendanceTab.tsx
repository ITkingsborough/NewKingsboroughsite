import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, PlusCircle, Search, Edit, Trash2, Calendar } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Date formatting function
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('en-GB', options);
};

const attendanceSchema = z.object({
  eventType: z.string().min(1, "Event type is required"),
  date: z.string().min(1, "Date is required"),
  totalCount: z.coerce.number().min(0, "Attendance count must be a positive number"),
  newVisitorsCount: z.coerce.number().min(0, "New visitor count must be a positive number").optional(),
  memberCount: z.coerce.number().min(0, "Member count must be a positive number").optional(),
  notes: z.string().optional(),
});

type AttendanceFormValues = z.infer<typeof attendanceSchema>;

export default function AttendanceTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  // Fetch attendance statistics
  const {
    data: stats,
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ["/api/community/attendance/stats"],
  });

  // Fetch all attendance records
  const {
    data: attendanceData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/community/attendance", dateFilter],
    queryFn: async () => {
      if (dateFilter.startDate && dateFilter.endDate) {
        const response = await fetch(
          `/api/community/attendance/date-range?startDate=${dateFilter.startDate}&endDate=${dateFilter.endDate}`
        );
        return response.json();
      } else {
        const response = await fetch(`/api/community/attendance`);
        return response.json();
      }
    },
  });

  // Create mutation
  const createAttendanceMutation = useMutation({
    mutationFn: async (data: AttendanceFormValues) => {
      const response = await apiRequest("POST", "/api/community/attendance", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Attendance record created successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/community/attendance"] });
      queryClient.invalidateQueries({ queryKey: ["/api/community/attendance/stats"] });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to create attendance record",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateAttendanceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<AttendanceFormValues> }) => {
      const response = await apiRequest("PUT", `/api/community/attendance/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Attendance record updated successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/community/attendance"] });
      queryClient.invalidateQueries({ queryKey: ["/api/community/attendance/stats"] });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to update attendance record",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Form for adding new attendance record
  const addForm = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      eventType: "Sunday Service",
      date: new Date().toISOString().split('T')[0],
      totalCount: 0,
      newVisitorsCount: 0,
      memberCount: 0,
      notes: "",
    },
  });

  // Form for editing attendance record
  const editForm = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      eventType: "",
      date: "",
      totalCount: 0,
      newVisitorsCount: 0,
      memberCount: 0,
      notes: "",
    },
  });

  // Set up edit form when a record is selected
  const handleEditRecord = (record: any) => {
    setSelectedRecord(record);
    editForm.reset({
      eventType: record.eventType,
      date: new Date(record.date).toISOString().split('T')[0],
      totalCount: record.totalCount,
      newVisitorsCount: record.newVisitorsCount || 0,
      memberCount: record.memberCount || 0,
      notes: record.notes || "",
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Attendance Records</h2>
          <p className="text-muted-foreground">Track and analyze church attendance</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Record
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Attendance Record</DialogTitle>
              <DialogDescription>
                Enter attendance details for a service or event.
              </DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit((data) => createAttendanceMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={addForm.control}
                  name="eventType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Type*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select event type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Sunday Service">Sunday Service</SelectItem>
                          <SelectItem value="Midweek Service">Midweek Service</SelectItem>
                          <SelectItem value="Bible Study">Bible Study</SelectItem>
                          <SelectItem value="Prayer Meeting">Prayer Meeting</SelectItem>
                          <SelectItem value="Youth Service">Youth Service</SelectItem>
                          <SelectItem value="Special Event">Special Event</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date*</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="totalCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Attendance*</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="memberCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Members</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={addForm.control}
                    name="newVisitorsCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Visitors</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={addForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Input placeholder="Any additional information" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit" disabled={createAttendanceMutation.isPending}>
                    {createAttendanceMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Save Record
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      {statsLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : stats?.data ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.data.averageAttendance}</div>
              <p className="text-xs text-muted-foreground">
                People per service
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Highest Attendance</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.data.highestAttendance}</div>
              <p className="text-xs text-muted-foreground">
                Peak attendance record
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Visitors</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.data.totalNewVisitors}</div>
              <p className="text-xs text-muted-foreground">
                Total new visitors
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Attendance</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.data.totalAttendance}</div>
              <p className="text-xs text-muted-foreground">
                Across all services
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Date Filter */}
      <div className="flex items-center gap-4">
        <div className="grid grid-cols-2 gap-4 w-full max-w-md">
          <div>
            <FormLabel>Start Date</FormLabel>
            <Input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
            />
          </div>
          <div>
            <FormLabel>End Date</FormLabel>
            <Input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Attendance Records Table */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex justify-center py-8 text-destructive">
          Failed to load attendance records
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Total Attendance</TableHead>
                <TableHead>New Visitors</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    No attendance records found for the selected period.
                  </TableCell>
                </TableRow>
              ) : (
                attendanceData?.data?.map((record: any) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="font-medium">{formatDate(record.date)}</div>
                    </TableCell>
                    <TableCell>{record.eventType}</TableCell>
                    <TableCell>{record.totalCount}</TableCell>
                    <TableCell>{record.newVisitorsCount || 0}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditRecord(record)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Edit Attendance Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Attendance Record</DialogTitle>
            <DialogDescription>
              Update the attendance details.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form 
              onSubmit={editForm.handleSubmit((data) => 
                updateAttendanceMutation.mutate({ id: selectedRecord.id, data })
              )} 
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Sunday Service">Sunday Service</SelectItem>
                        <SelectItem value="Midweek Service">Midweek Service</SelectItem>
                        <SelectItem value="Bible Study">Bible Study</SelectItem>
                        <SelectItem value="Prayer Meeting">Prayer Meeting</SelectItem>
                        <SelectItem value="Youth Service">Youth Service</SelectItem>
                        <SelectItem value="Special Event">Special Event</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date*</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="totalCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Attendance*</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="memberCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Members</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="newVisitorsCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Visitors</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input placeholder="Any additional information" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit" disabled={updateAttendanceMutation.isPending}>
                  {updateAttendanceMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Record
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}