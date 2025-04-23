import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, PlusCircle, Search, Edit, Trash2, Users, UserPlus, UserMinus } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ministryGroupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  meetingDay: z.string().optional(),
  meetingTime: z.string().optional(),
  meetingLocation: z.string().optional(),
  active: z.boolean().default(true),
});

const groupMemberSchema = z.object({
  memberId: z.coerce.number().min(1, "Please select a member"),
  role: z.string().min(1, "Please select a role"),
});

type MinistryGroupFormValues = z.infer<typeof ministryGroupSchema>;
type GroupMemberFormValues = z.infer<typeof groupMemberSchema>;

export default function MinistryGroupsTab() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Fetch all ministry groups
  const {
    data: groupsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["/api/community/ministry-groups"],
  });

  // Fetch all members when needed for adding to group
  const {
    data: membersData,
    isLoading: membersLoading,
  } = useQuery({
    queryKey: ["/api/community/members"],
    enabled: isAddMemberDialogOpen,
  });

  // Fetch group members when a group is selected
  const {
    data: groupMembersData,
    isLoading: groupMembersLoading,
    refetch: refetchGroupMembers,
  } = useQuery({
    queryKey: ["/api/community/ministry-groups", selectedGroup?.id, "members"],
    queryFn: async () => {
      if (!selectedGroup) return { success: true, data: [] };
      const response = await fetch(`/api/community/ministry-groups/${selectedGroup.id}/members`);
      return response.json();
    },
    enabled: !!selectedGroup,
  });

  // Create ministry group mutation
  const createGroupMutation = useMutation({
    mutationFn: async (data: MinistryGroupFormValues) => {
      const response = await apiRequest("POST", "/api/community/ministry-groups", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Ministry group created successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/community/ministry-groups"] });
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to create ministry group",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update ministry group mutation
  const updateGroupMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<MinistryGroupFormValues> }) => {
      const response = await apiRequest("PUT", `/api/community/ministry-groups/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Ministry group updated successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/community/ministry-groups"] });
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to update ministry group",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Add member to group mutation
  const addMemberMutation = useMutation({
    mutationFn: async ({ groupId, data }: { groupId: number; data: GroupMemberFormValues }) => {
      const response = await apiRequest(
        "POST", 
        `/api/community/ministry-groups/${groupId}/members`, 
        data
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Member added to group successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ 
        queryKey: ["/api/community/ministry-groups", selectedGroup?.id, "members"] 
      });
      queryClient.invalidateQueries({ queryKey: ["/api/community/ministry-groups"] });
      setIsAddMemberDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Failed to add member to group",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Remove member from group mutation
  const removeMemberMutation = useMutation({
    mutationFn: async ({ groupId, memberId }: { groupId: number; memberId: number }) => {
      const response = await apiRequest(
        "DELETE", 
        `/api/community/ministry-groups/${groupId}/members/${memberId}`
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Member removed from group successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ 
        queryKey: ["/api/community/ministry-groups", selectedGroup?.id, "members"] 
      });
      queryClient.invalidateQueries({ queryKey: ["/api/community/ministry-groups"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to remove member from group",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter groups based on search term and active tab
  const filteredGroups = groupsData?.data
    ? groupsData.data.filter((group: any) => {
        const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             group.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'all' || 
                          (activeTab === 'active' && group.active) || 
                          (activeTab === 'inactive' && !group.active);
        return matchesSearch && matchesTab;
      })
    : [];

  // Form for adding new ministry group
  const addForm = useForm<MinistryGroupFormValues>({
    resolver: zodResolver(ministryGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      meetingDay: "",
      meetingTime: "",
      meetingLocation: "",
      active: true,
    },
  });

  // Form for editing ministry group
  const editForm = useForm<MinistryGroupFormValues>({
    resolver: zodResolver(ministryGroupSchema),
    defaultValues: {
      name: "",
      description: "",
      meetingDay: "",
      meetingTime: "",
      meetingLocation: "",
      active: true,
    },
  });

  // Form for adding member to group
  const addMemberForm = useForm<GroupMemberFormValues>({
    resolver: zodResolver(groupMemberSchema),
    defaultValues: {
      memberId: 0,
      role: "member",
    },
  });

  // Setup edit form when a group is selected
  const handleEditGroup = (group: any) => {
    setSelectedGroup(group);
    editForm.reset({
      name: group.name,
      description: group.description,
      meetingDay: group.meetingDay || "",
      meetingTime: group.meetingTime || "",
      meetingLocation: group.meetingLocation || "",
      active: group.active,
    });
    setIsEditDialogOpen(true);
  };

  // Prepare to delete a group
  const handleDeleteGroup = (group: any) => {
    setSelectedGroup(group);
    setIsDeleteDialogOpen(true);
  };

  // Setup to add member to a group
  const handleAddMember = (group: any) => {
    setSelectedGroup(group);
    setIsAddMemberDialogOpen(true);
  };

  // Handle removing a member from a group
  const handleRemoveMember = (memberId: number) => {
    if (!selectedGroup) return;
    
    if (confirm("Are you sure you want to remove this member from the group?")) {
      removeMemberMutation.mutate({
        groupId: selectedGroup.id,
        memberId
      });
    }
  };

  // View details of a group
  const handleViewGroupDetails = (group: any) => {
    setSelectedGroup(group);
    refetchGroupMembers();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Ministry Groups</h2>
          <p className="text-muted-foreground">Manage church ministry groups and teams</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Ministry Group</DialogTitle>
              <DialogDescription>
                Add a new ministry group or team.
              </DialogDescription>
            </DialogHeader>
            <Form {...addForm}>
              <form onSubmit={addForm.handleSubmit((data) => createGroupMutation.mutate(data))} className="space-y-4">
                <FormField
                  control={addForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Worship Team" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description*</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the purpose and activities of this ministry group" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addForm.control}
                    name="meetingDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meeting Day</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Monday">Monday</SelectItem>
                            <SelectItem value="Tuesday">Tuesday</SelectItem>
                            <SelectItem value="Wednesday">Wednesday</SelectItem>
                            <SelectItem value="Thursday">Thursday</SelectItem>
                            <SelectItem value="Friday">Friday</SelectItem>
                            <SelectItem value="Saturday">Saturday</SelectItem>
                            <SelectItem value="Sunday">Sunday</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={addForm.control}
                    name="meetingTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meeting Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={addForm.control}
                  name="meetingLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Main Hall" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Active</FormLabel>
                        <FormDescription>
                          Is this ministry group currently active?
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit" disabled={createGroupMutation.isPending}>
                    {createGroupMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Group
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/3">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search groups..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex justify-center py-8 text-destructive">
              Failed to load ministry groups
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="text-center py-8 border rounded-lg">
              <p className="text-muted-foreground">
                {searchTerm
                  ? "No groups found matching your search"
                  : "No ministry groups found. Create your first group with the button above."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredGroups.map((group: any) => (
                <div 
                  key={group.id}
                  onClick={() => handleViewGroupDetails(group)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted
                    ${selectedGroup?.id === group.id ? 'bg-muted border-primary' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">{group.name}</h3>
                    {group.active ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
                  <div className="flex items-center mt-2 text-xs text-muted-foreground">
                    <Users className="h-3 w-3 mr-1" />
                    <span>{group.memberCount || 0} members</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="md:w-2/3">
          {selectedGroup ? (
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>{selectedGroup.name}</CardTitle>
                  <CardDescription>
                    {selectedGroup.active ? 'Active Ministry Group' : 'Inactive Ministry Group'}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditGroup(selectedGroup)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddMember(selectedGroup)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Member
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedGroup.description}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Meeting Day</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedGroup.meetingDay || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Meeting Time</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedGroup.meetingTime || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Location</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedGroup.meetingLocation || 'Not specified'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Members ({groupMembersData?.data?.length || 0})</h4>
                  {groupMembersLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : groupMembersData?.data?.length === 0 ? (
                    <div className="text-center py-4 border rounded-lg">
                      <p className="text-muted-foreground">
                        No members in this group yet. Add members using the button above.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {groupMembersData?.data?.map((member: any) => (
                            <TableRow key={member.id}>
                              <TableCell>
                                <div className="font-medium">{member.firstName} {member.lastName}</div>
                                <div className="text-xs text-muted-foreground">{member.email}</div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={
                                  member.role === 'leader' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  member.role === 'assistant_leader' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                  'bg-gray-50 text-gray-700 border-gray-200'
                                }>
                                  {member.role === 'leader' ? 'Leader' : 
                                   member.role === 'assistant_leader' ? 'Assistant Leader' : 
                                   'Member'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {member.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'N/A'}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveMember(member.id)}
                                  disabled={removeMemberMutation.isPending}
                                >
                                  {removeMemberMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <UserMinus className="h-4 w-4" />
                                  )}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full border rounded-lg p-8">
              <div className="text-center">
                <Users className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Ministry Group</h3>
                <p className="text-muted-foreground max-w-md">
                  Select a ministry group from the list to see details and manage members.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Group Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Ministry Group</DialogTitle>
            <DialogDescription>
              Update the ministry group details.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form 
              onSubmit={editForm.handleSubmit((data) => 
                updateGroupMutation.mutate({ id: selectedGroup.id, data })
              )} 
              className="space-y-4"
            >
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Worship Team" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the purpose and activities of this ministry group" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="meetingDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Day</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Monday">Monday</SelectItem>
                          <SelectItem value="Tuesday">Tuesday</SelectItem>
                          <SelectItem value="Wednesday">Wednesday</SelectItem>
                          <SelectItem value="Thursday">Thursday</SelectItem>
                          <SelectItem value="Friday">Friday</SelectItem>
                          <SelectItem value="Saturday">Saturday</SelectItem>
                          <SelectItem value="Sunday">Sunday</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="meetingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="meetingLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meeting Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Main Hall" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Is this ministry group currently active?
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit" disabled={updateGroupMutation.isPending}>
                  {updateGroupMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add Member to {selectedGroup?.name}</DialogTitle>
            <DialogDescription>
              Select a member to add to this ministry group.
            </DialogDescription>
          </DialogHeader>
          <Form {...addMemberForm}>
            <form 
              onSubmit={addMemberForm.handleSubmit((data) => 
                addMemberMutation.mutate({ groupId: selectedGroup.id, data })
              )} 
              className="space-y-4"
            >
              <FormField
                control={addMemberForm.control}
                name="memberId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Member*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {membersLoading ? (
                          <div className="flex justify-center py-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        ) : membersData?.data?.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">
                            No members available
                          </div>
                        ) : (
                          membersData?.data?.map((member: any) => (
                            <SelectItem key={member.id} value={member.id.toString()}>
                              {member.firstName} {member.lastName}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={addMemberForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="leader">Leader</SelectItem>
                        <SelectItem value="assistant_leader">Assistant Leader</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit" disabled={addMemberMutation.isPending}>
                  {addMemberMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Add to Group
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}