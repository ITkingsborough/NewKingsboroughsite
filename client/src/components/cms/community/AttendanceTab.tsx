import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle, Search, Edit, Trash2, ChevronRight, Calendar, LineChart } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, parseISO, isValid } from "date-fns";
import { AttendanceRecord, AttendanceStats } from "@/lib/types";

const eventTypes = [
  "Sunday Service",
  "Midweek Service",
  "Bible Study",
  "Prayer Meeting",
  "Youth Service",
  "Special Event",
  "Other"
];

const attendanceSchema = z.object({
  date: z.string().min(1, "Date is required"),
  eventType: z.string().min(1, "Event type is required"),
  totalCount: z.coerce.number().min(0, "Total count must be a non-negative number"),
  newVisitorsCount: z.coerce.number().min(0, "New visitors count must be a non-negative number").optional(),
  memberCount: z.coerce.number().min(0, "Member count must be a non-negative number").optional(),
  notes: z.string().optional(),
  eventId: z.coerce.number().optional(),
});

type AttendanceFormValues = z.infer<typeof attendanceSchema>;

export default function AttendanceTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Fetch all attendance records
  const {
    data: attendanceData,
    isLoading,
    error,
  } = useQuery<{ success: boolean, data: AttendanceRecord[] }>({
    queryKey: ["/api/community/attendance"],
  });

  // Fetch attendance statistics
  const {
    data: statsData,
    isLoading: statsLoading,
  } = useQuery<{ success: boolean, data: AttendanceStats }>({
    queryKey: ["/api/community/attendance/stats"],
  });

  // Create attendance record mutation
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

  // Update attendance record mutation
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

  // Delete attendance record mutation
  const deleteAttendanceMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/community/attendance/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Attendance record deleted successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/community/attendance"] });
      queryClient.invalidateQueries({ queryKey: ["/api/community/attendance/stats"] });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to delete attendance record",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter records based on search term and active tab
  const filteredRecords = attendanceData?.data
    ? attendanceData.data
        .filter((record) => {
          const matchesSearch = 
            record.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (record.notes && record.notes.toLowerCase().includes(searchTerm.toLowerCase()));
          
          let matchesTab = true;
          if (activeTab === 'sunday') {
            matchesTab = record.eventType === 'Sunday Service';
          } else if (activeTab === 'midweek') {
            matchesTab = record.eventType === 'Midweek Service';
          } else if (activeTab === 'other') {
            matchesTab = !['Sunday Service', 'Midweek Service'].includes(record.eventType);
          }
          
          return matchesSearch && matchesTab;
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  // Form for adding new attendance record
  const addForm = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      eventType: "Sunday Service",
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
      date: "",
      eventType: "",
      totalCount: 0,
      newVisitorsCount: 0,
      memberCount: 0,
      notes: "",
    },
  });

  // Setup edit form when a record is selected
  const handleEditRecord = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    
    // Format the date to YYYY-MM-DD
    let formattedDate = "";
    if (typeof record.date === 'string') {
      const parsed = parseISO(record.date);
      formattedDate = isValid(parsed) ? format(parsed, 'yyyy-MM-dd') : record.date;
    } else {
      // If it's somehow a Date object or other type, convert to string
      const dateStr = String(record.date);
      formattedDate = dateStr;
    }
    
    editForm.reset({
      date: formattedDate,
      eventType: record.eventType,
      totalCount: record.totalCount,
      newVisitorsCount: record.newVisitorsCount || 0,
      memberCount: record.memberCount || 0,
      notes: record.notes || "",
      eventId: record.eventId,
    });
    setIsEditDialogOpen(true);
  };

  // Prepare to delete a record
  const handleDeleteRecord = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setIsDeleteDialogOpen(true);
  };

  const formatDateForDisplay = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'dd MMM yyyy') : dateString;
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Attendance Records</h2>
          <p className="text-muted-foreground">Track and manage church attendance</p>
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
              <form 
                onSubmit={addForm.handleSubmit((data) => createAttendanceMutation.mutate(data))} 
                className="space-y-4"
              >
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
                          {eventTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-3 gap-4">
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
                </div>
                
                <FormField
                  control={addForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter any additional notes about this service or event"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit" disabled={createAttendanceMutation.isPending}>
                    {createAttendanceMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Add Record
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : statsData?.data ? (
                statsData.data.averageAttendance.toLocaleString()
              ) : (
                "N/A"
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all services
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : statsData?.data ? (
                statsData.data.totalAttendance.toLocaleString()
              ) : (
                "N/A"
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Over the last 3 months
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : statsData?.data ? (
                statsData.data.totalNewVisitors.toLocaleString()
              ) : (
                "N/A"
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Over the last 3 months
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Highest Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : statsData?.data ? (
                statsData.data.highestAttendance.toLocaleString()
              ) : (
                "N/A"
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Single service record
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and records */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-3">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative md:w-1/3">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search records..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                <TabsList className="grid grid-cols-4 w-full md:w-auto">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="sunday">Sunday</TabsTrigger>
                  <TabsTrigger value="midweek">Midweek</TabsTrigger>
                  <TabsTrigger value="other">Other</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="flex justify-center py-8 text-destructive">
                Failed to load attendance records
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-8 border rounded-lg">
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "No records found matching your search"
                    : "No attendance records found. Add your first record with the button above."}
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Event Type</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">New Visitors</TableHead>
                      <TableHead className="text-right">Members</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{formatDateForDisplay(record.date)}</TableCell>
                        <TableCell>{record.eventType}</TableCell>
                        <TableCell className="text-right font-medium">{record.totalCount}</TableCell>
                        <TableCell className="text-right">{record.newVisitorsCount || 0}</TableCell>
                        <TableCell className="text-right">{record.memberCount || 0}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditRecord(record)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRecord(record)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Record Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Attendance Record</DialogTitle>
            <DialogDescription>
              Update attendance details for this service or event.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form 
              onSubmit={editForm.handleSubmit((data) => 
                updateAttendanceMutation.mutate({ 
                  id: selectedRecord?.id || 0, 
                  data 
                })
              )} 
              className="space-y-4"
            >
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
                        {eventTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-3 gap-4">
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
              </div>
              
              <FormField
                control={editForm.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter any additional notes about this service or event"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit" disabled={updateAttendanceMutation.isPending}>
                  {updateAttendanceMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this attendance record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedRecord && (
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  Date: {formatDateForDisplay(selectedRecord.date)}
                </p>
                <p className="text-sm">
                  Event: {selectedRecord.eventType}
                </p>
                <p className="text-sm">
                  Attendance: {selectedRecord.totalCount} total
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedRecord && deleteAttendanceMutation.mutate(selectedRecord.id)}
              disabled={deleteAttendanceMutation.isPending}
            >
              {deleteAttendanceMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}