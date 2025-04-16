import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/cms/DashboardLayout";
import { Sermon } from "@shared/schema";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { 
  AlertCircle, 
  Calendar as CalendarIcon, 
  Edit, 
  MoreHorizontal, 
  Plus, 
  Trash,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Form schema for sermon creation/editing
const sermonFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  speaker: z.string().min(1, "Speaker name is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  description: z.string().min(1, "Description is required"),
  series: z.string().optional(),
  preacher: z.string().optional(),
  image: z.string().url("Valid image URL is required"),
  video_url: z.string().url("Valid video URL is required").optional().or(z.literal("")),
  audio_url: z.string().url("Valid audio URL is required").optional().or(z.literal("")),
  download_url: z.string().url("Valid download URL is required").optional().or(z.literal("")),
  featured: z.boolean().optional(),
});

type SermonFormValues = z.infer<typeof sermonFormSchema>;

export default function SermonsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAdmin, isEditor } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sermonToDelete, setSermonToDelete] = useState<Sermon | null>(null);

  // Fetch sermons
  const { 
    data: sermons, 
    isLoading, 
    error 
  } = useQuery<{ success: boolean; data: Sermon[] }>({
    queryKey: ["/api/cms/sermons"],
    refetchOnWindowFocus: false,
  });

  // Form initialization
  const form = useForm<SermonFormValues>({
    resolver: zodResolver(sermonFormSchema),
    defaultValues: {
      title: "",
      speaker: "",
      date: new Date(),
      description: "",
      series: "",
      preacher: "",
      image: "",
      video_url: "",
      audio_url: "",
      download_url: "",
      featured: false,
    },
  });

  // Create sermon mutation
  const createSermonMutation = useMutation({
    mutationFn: async (values: SermonFormValues) => {
      const res = await apiRequest("POST", "/api/cms/sermons", values);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Sermon created",
        description: "The sermon has been created successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/sermons"] });
      setDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create sermon: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update sermon mutation
  const updateSermonMutation = useMutation({
    mutationFn: async ({ id, values }: { id: number; values: SermonFormValues }) => {
      const res = await apiRequest("PUT", `/api/cms/sermons/${id}`, values);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Sermon updated",
        description: "The sermon has been updated successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/sermons"] });
      setDialogOpen(false);
      setEditingSermon(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update sermon: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete sermon mutation
  const deleteSermonMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/cms/sermons/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Sermon deleted",
        description: "The sermon has been deleted successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/sermons"] });
      setDeleteDialogOpen(false);
      setSermonToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete sermon: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (values: SermonFormValues) => {
    if (editingSermon) {
      updateSermonMutation.mutate({ id: editingSermon.id, values });
    } else {
      createSermonMutation.mutate(values);
    }
  };

  // Handle edit sermon
  const handleEditSermon = (sermon: Sermon) => {
    setEditingSermon(sermon);
    form.reset({
      title: sermon.title,
      speaker: sermon.speaker,
      date: new Date(sermon.date),
      description: sermon.description,
      series: sermon.series || "",
      preacher: sermon.preacher || "",
      image: sermon.image || "",
      video_url: sermon.video_url || "",
      audio_url: sermon.audio_url || "",
      download_url: sermon.download_url || "",
      featured: sermon.featured || false,
    });
    setDialogOpen(true);
  };

  // Handle new sermon
  const handleNewSermon = () => {
    setEditingSermon(null);
    form.reset({
      title: "",
      speaker: "",
      date: new Date(),
      description: "",
      series: "",
      preacher: "",
      image: "",
      video_url: "",
      audio_url: "",
      download_url: "",
      featured: false,
    });
    setDialogOpen(true);
  };

  // Handle delete sermon
  const handleDeleteSermon = (sermon: Sermon) => {
    setSermonToDelete(sermon);
    setDeleteDialogOpen(true);
  };

  // Confirm delete sermon
  const confirmDeleteSermon = () => {
    if (sermonToDelete) {
      deleteSermonMutation.mutate(sermonToDelete.id);
    }
  };

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
            Failed to load sermons. Please try again later.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sermon Management</h1>
          <p className="text-muted-foreground">
            Manage sermon recordings, videos and details
          </p>
        </div>
        {(isAdmin || isEditor) && (
          <Button onClick={handleNewSermon}>
            <Plus className="mr-2 h-4 w-4" /> Add Sermon
          </Button>
        )}
      </div>

      {sermons?.data && sermons.data.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Speaker</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Series</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sermons.data.map((sermon) => (
                <TableRow key={sermon.id}>
                  <TableCell className="font-medium">{sermon.title}</TableCell>
                  <TableCell>{sermon.speaker}</TableCell>
                  <TableCell>{format(new Date(sermon.date), "MMM d, yyyy")}</TableCell>
                  <TableCell>{sermon.series || "-"}</TableCell>
                  <TableCell>
                    {sermon.featured ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground" />
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
                        {(isAdmin || isEditor) && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleEditSermon(sermon)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        {isAdmin && (
                          <DropdownMenuItem
                            onClick={() => handleDeleteSermon(sermon)}
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
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No sermons found</h3>
          <p className="text-muted-foreground mt-1">
            There are no sermons in the system yet.
          </p>
          {(isAdmin || isEditor) && (
            <Button onClick={handleNewSermon} className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add your first sermon
            </Button>
          )}
        </div>
      )}

      {/* Create/Edit Sermon Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSermon ? "Edit Sermon" : "Add New Sermon"}
            </DialogTitle>
            <DialogDescription>
              {editingSermon
                ? "Update the sermon details below."
                : "Fill in the sermon details below."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter sermon title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="speaker"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Speaker</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter speaker name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preacher"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preacher</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter preacher name (optional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="series"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Series (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter sermon series" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Featured
                        </FormLabel>
                        <FormDescription>
                          Mark sermon as featured to appear on homepage
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter sermon description"
                        {...field}
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter image URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="video_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter video URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="audio_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Audio URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter audio URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="download_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Download URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter download URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createSermonMutation.isPending || updateSermonMutation.isPending
                  }
                >
                  {(createSermonMutation.isPending || updateSermonMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingSermon ? "Update Sermon" : "Add Sermon"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the sermon "{sermonToDelete?.title}"?
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
              onClick={confirmDeleteSermon}
              disabled={deleteSermonMutation.isPending}
            >
              {deleteSermonMutation.isPending && (
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

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}