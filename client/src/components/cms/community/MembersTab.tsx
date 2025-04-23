import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle, Search, Edit, Trash2, UserCog, Mail, Phone } from "lucide-react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format, parseISO, isValid } from "date-fns";
import { z } from "zod";
import { MemberItem, MemberStatus, memberStatusEnum, MemberStats } from "@/lib/types";

const memberSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  status: z.enum(memberStatusEnum),
  baptismDate: z.string().optional(),
  membershipDate: z.string().optional(),
  birthday: z.string().optional(),
  notes: z.string().optional(),
  profileImage: z.string().optional(),
});

type MemberFormValues = z.infer<typeof memberSchema>;

export default function MembersTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<MemberItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Fetch all members
  const {
    data: membersData,
    isLoading,
    error,
  } = useQuery<{ success: boolean, data: MemberItem[] }>({
    queryKey: ["/api/community/members"],
  });

  // Fetch member statistics
  const {
    data: statsData,
    isLoading: statsLoading,
  } = useQuery<{ success: boolean, data: MemberStats }>({
    queryKey: ["/api/community/members/stats"],
  });

  // Create member mutation
  const createMemberMutation = useMutation({
    mutationFn: async (data: MemberFormValues) => {
      const response = await apiRequest("POST", "/api/community/members", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Member created successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/community/members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/community/members/stats"] });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to create member",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update member mutation
  const updateMemberMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<MemberFormValues> }) => {
      const response = await apiRequest("PUT", `/api/community/members/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Member updated successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/community/members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/community/members/stats"] });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to update member",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete member mutation
  const deleteMemberMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/community/members/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Member deleted successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/community/members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/community/members/stats"] });
      setIsDeleteDialogOpen(false);
      setSelectedMember(null);
    },
    onError: (error) => {
      toast({
        title: "Failed to delete member",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter members based on search term and active tab
  const filteredMembers = membersData?.data
    ? membersData.data.filter((member) => {
        const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
        const matchesSearch = 
          fullName.includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (member.phone && member.phone.includes(searchTerm)) ||
          (member.notes && member.notes.toLowerCase().includes(searchTerm.toLowerCase()));
        
        let matchesTab = true;
        if (activeTab !== 'all') {
          matchesTab = member.status === activeTab;
        }
        
        return matchesSearch && matchesTab;
      })
    : [];

  // Form for adding new member
  const addForm = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      status: "visitor",
      baptismDate: "",
      membershipDate: "",
      birthday: "",
      notes: "",
      profileImage: "",
    },
  });

  // Form for editing member
  const editForm = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      status: "visitor",
      baptismDate: "",
      membershipDate: "",
      birthday: "",
      notes: "",
      profileImage: "",
    },
  });

  // Setup edit form when a member is selected
  const handleEditMember = (member: MemberItem) => {
    setSelectedMember(member);
    
    editForm.reset({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone || "",
      address: member.address || "",
      status: member.status,
      baptismDate: member.baptismDate || "",
      membershipDate: member.membershipDate || "",
      birthday: member.birthday || "",
      notes: member.notes || "",
      profileImage: member.profileImage || "",
    });
    setIsEditDialogOpen(true);
  };

  // Prepare to delete a member
  const handleDeleteMember = (member: MemberItem) => {
    setSelectedMember(member);
    setIsDeleteDialogOpen(true);
  };

  // View details of a member
  const handleViewMemberDetails = (member: MemberItem) => {
    setSelectedMember(member);
  };

  // Format date for display
  const formatDateForDisplay = (dateString?: string) => {
    if (!dateString) return "N/A";
    
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'dd MMM yyyy') : dateString;
    } catch (error) {
      return dateString;
    }
  };

  // Helper to get status badge color
  const getStatusBadgeClass = (status: MemberStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'visitor':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'new':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Church Members</h2>
          <p className="text-muted-foreground">Manage church members and visitors</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
              <DialogDescription>
                Enter the details of the new church member or visitor.
              </DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form 
                onSubmit={addForm.handleSubmit((data) => createMemberMutation.mutate(data))} 
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={addForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={addForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+44 123 456 7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={addForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status*</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active Member</SelectItem>
                            <SelectItem value="inactive">Inactive Member</SelectItem>
                            <SelectItem value="visitor">Visitor</SelectItem>
                            <SelectItem value="new">New Member</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={addForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="123 Church Street, London" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={addForm.control}
                    name="birthday"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birthday</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={addForm.control}
                    name="baptismDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Baptism Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={addForm.control}
                    name="membershipDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Membership Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
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
                          placeholder="Any additional information about this member"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit" disabled={createMemberMutation.isPending}>
                    {createMemberMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Add Member
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
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : statsData?.data ? (
                statsData.data.totalMembers.toLocaleString()
              ) : (
                "N/A"
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All registered members
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : statsData?.data ? (
                statsData.data.newMembersThisMonth.toLocaleString()
              ) : (
                "N/A"
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Members added this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : statsData?.data ? (
                (statsData.data.memberCounts.active || 0).toLocaleString()
              ) : (
                "N/A"
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently active members
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : statsData?.data ? (
                (statsData.data.memberCounts.visitor || 0).toLocaleString()
              ) : (
                "N/A"
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered visitors
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/3">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search members..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="visitor">Visitors</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex justify-center py-8 text-destructive">
              Failed to load members
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-8 border rounded-lg">
              <p className="text-muted-foreground">
                {searchTerm
                  ? "No members found matching your search"
                  : "No members found. Add your first member with the button above."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMembers.map((member) => (
                <div 
                  key={member.id}
                  onClick={() => handleViewMemberDetails(member)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted
                    ${selectedMember?.id === member.id ? 'bg-muted border-primary' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{member.firstName.charAt(0)}{member.lastName.charAt(0)}</AvatarFallback>
                      {member.profileImage && <AvatarImage src={member.profileImage} alt={`${member.firstName} ${member.lastName}`} />}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h3 className="font-medium truncate">{member.firstName} {member.lastName}</h3>
                        <Badge variant="outline" className={getStatusBadgeClass(member.status)}>
                          {member.status === 'active' ? 'Active' : 
                           member.status === 'inactive' ? 'Inactive' : 
                           member.status === 'visitor' ? 'Visitor' : 'New'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                      {member.phone && (
                        <p className="text-xs text-muted-foreground mt-1">{member.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:w-2/3">
          {selectedMember ? (
            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{selectedMember.firstName.charAt(0)}{selectedMember.lastName.charAt(0)}</AvatarFallback>
                      {selectedMember.profileImage && <AvatarImage src={selectedMember.profileImage} alt={`${selectedMember.firstName} ${selectedMember.lastName}`} />}
                    </Avatar>
                    <div>
                      <CardTitle>{selectedMember.firstName} {selectedMember.lastName}</CardTitle>
                      <CardDescription>
                        <Badge variant="outline" className={getStatusBadgeClass(selectedMember.status)}>
                          {selectedMember.status === 'active' ? 'Active Member' : 
                          selectedMember.status === 'inactive' ? 'Inactive Member' : 
                          selectedMember.status === 'visitor' ? 'Visitor' : 'New Member'}
                        </Badge>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditMember(selectedMember)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteMember(selectedMember)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium">Contact Information</h3>
                      <Separator />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedMember.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{selectedMember.phone || 'Not provided'}</span>
                        </div>
                      </div>
                      {selectedMember.address && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Address:</p>
                          <p className="text-sm">{selectedMember.address}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-medium">Church Information</h3>
                      <Separator />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Membership Date:</p>
                          <p className="text-sm">{formatDateForDisplay(selectedMember.membershipDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Baptism Date:</p>
                          <p className="text-sm">{formatDateForDisplay(selectedMember.baptismDate)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Birthday:</p>
                          <p className="text-sm">{formatDateForDisplay(selectedMember.birthday)}</p>
                        </div>
                      </div>
                    </div>

                    {selectedMember.ministryGroups && selectedMember.ministryGroups.length > 0 && (
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium">Ministry Groups</h3>
                        <Separator />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedMember.ministryGroups.map((group, index) => (
                            <Badge key={index} variant="secondary">
                              {group}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedMember.notes && (
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium">Notes</h3>
                        <Separator />
                        <p className="text-sm whitespace-pre-line mt-2">{selectedMember.notes}</p>
                      </div>
                    )}

                    {selectedMember.createdAt && (
                      <div className="text-xs text-muted-foreground mt-4">
                        Added on: {formatDateForDisplay(selectedMember.createdAt)}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full border rounded-lg p-8">
              <div className="text-center">
                <UserCog className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Member</h3>
                <p className="text-muted-foreground max-w-md">
                  Select a member from the list to view their details.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
            <DialogDescription>
              Update the member's details.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form 
              onSubmit={editForm.handleSubmit((data) => 
                updateMemberMutation.mutate({ id: selectedMember?.id || 0, data })
              )} 
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email*</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+44 123 456 7890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active Member</SelectItem>
                          <SelectItem value="inactive">Inactive Member</SelectItem>
                          <SelectItem value="visitor">Visitor</SelectItem>
                          <SelectItem value="new">New Member</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder="123 Church Street, London" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={editForm.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birthday</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="baptismDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Baptism Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="membershipDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Membership Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
                        placeholder="Any additional information about this member"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit" disabled={updateMemberMutation.isPending}>
                  {updateMemberMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
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
              Are you sure you want to delete this member? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedMember && (
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {selectedMember.firstName} {selectedMember.lastName}
                </p>
                <p className="text-sm">
                  {selectedMember.email}
                </p>
                <p className="text-sm">
                  Status: {selectedMember.status}
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
              onClick={() => selectedMember && deleteMemberMutation.mutate(selectedMember.id)}
              disabled={deleteMemberMutation.isPending}
            >
              {deleteMemberMutation.isPending ? (
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