import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/cms/DashboardLayout";
import { Contact } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { 
  AlertCircle, 
  Eye,
  MoreHorizontal, 
  Mail,
  Trash,
  Phone,
  Clock,
  Loader2,
  PrayingHands
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ContactPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAdmin } = useAuth();
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Contact | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch contact messages
  const { 
    data: messages, 
    isLoading, 
    error 
  } = useQuery<{ success: boolean; data: Contact[] }>({
    queryKey: ["/api/cms/contacts"],
    refetchOnWindowFocus: false,
  });

  // Delete contact message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/cms/contacts/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Message deleted",
        description: "The contact message has been deleted successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/contacts"] });
      setDeleteDialogOpen(false);
      setSelectedMessage(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete message: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle view message
  const handleViewMessage = (message: Contact) => {
    setSelectedMessage(message);
    setViewDialogOpen(true);
  };

  // Handle delete message
  const handleDeleteMessage = (message: Contact) => {
    setSelectedMessage(message);
    setDeleteDialogOpen(true);
  };

  // Confirm delete message
  const confirmDeleteMessage = () => {
    if (selectedMessage) {
      deleteMessageMutation.mutate(selectedMessage.id);
    }
  };

  // Filter messages by type
  const filteredMessages = messages?.data
    ? activeTab === "all"
      ? messages.data
      : activeTab === "prayer"
      ? messages.data.filter((message) => message.isPrayer)
      : messages.data.filter((message) => !message.isPrayer)
    : [];

  // Count prayer and general messages
  const prayerCount = messages?.data?.filter((m) => m.isPrayer).length || 0;
  const generalCount = messages?.data?.filter((m) => !m.isPrayer).length || 0;
  const totalCount = messages?.data?.length || 0;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[500px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load contact messages. Please try again later.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Contact Messages</h1>
          <p className="text-muted-foreground">
            View and manage contact form submissions and prayer requests
          </p>
        </div>
      </div>

      <Tabs 
        defaultValue="all" 
        className="mb-6"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-2">
            All
            <Badge variant="secondary">{totalCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="prayer" className="flex items-center gap-2">
            Prayer Requests
            <Badge variant="secondary">{prayerCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            General
            <Badge variant="secondary">{generalCount}</Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredMessages.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell className="font-medium">{message.name}</TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell>
                    {format(new Date(message.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {message.isPrayer ? (
                      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                        <PrayingHands className="h-3 w-3 mr-1" />
                        Prayer
                      </Badge>
                    ) : (
                      <Badge variant="outline">General</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleViewMessage(message)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => window.open(`mailto:${message.email}`)}
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Email
                        </DropdownMenuItem>
                        {message.phone && (
                          <DropdownMenuItem
                            onClick={() => window.open(`tel:${message.phone}`)}
                          >
                            <Phone className="mr-2 h-4 w-4" />
                            Call
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {isAdmin && (
                          <DropdownMenuItem
                            onClick={() => handleDeleteMessage(message)}
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border rounded-md">
          <Mail className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No messages found</h3>
          <p className="text-muted-foreground mt-1">
            {activeTab === "all"
              ? "There are no contact messages yet."
              : activeTab === "prayer"
              ? "There are no prayer requests yet."
              : "There are no general contact messages yet."}
          </p>
        </div>
      )}

      {/* View Message Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {selectedMessage?.isPrayer ? (
                <>
                  <PrayingHands className="h-5 w-5 mr-2 text-purple-600" />
                  Prayer Request
                </>
              ) : (
                <>
                  <Mail className="h-5 w-5 mr-2" />
                  Contact Message
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Received on{" "}
              {selectedMessage
                ? format(new Date(selectedMessage.createdAt), "MMMM d, yyyy 'at' h:mm a")
                : ""}
            </DialogDescription>
          </DialogHeader>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{selectedMessage?.name}</CardTitle>
              <CardDescription className="flex flex-col space-y-1">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href={`mailto:${selectedMessage?.email}`} className="text-primary hover:underline">
                    {selectedMessage?.email}
                  </a>
                </div>
                {selectedMessage?.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`tel:${selectedMessage.phone}`} className="text-primary hover:underline">
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  {selectedMessage
                    ? format(new Date(selectedMessage.createdAt), "MMMM d, yyyy 'at' h:mm a")
                    : ""}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Message</h4>
                <p className="whitespace-pre-line">{selectedMessage?.message}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between space-x-2">
              <Button
                variant="outline"
                onClick={() => setViewDialogOpen(false)}
              >
                Close
              </Button>
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => window.open(`mailto:${selectedMessage?.email}`)}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Reply by Email
                </Button>
                {selectedMessage?.phone && (
                  <Button
                    variant="secondary"
                    onClick={() => window.open(`tel:${selectedMessage.phone}`)}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message from {selectedMessage?.name}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteMessage}
              disabled={deleteMessageMutation.isPending}
            >
              {deleteMessageMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}