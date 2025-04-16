import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/cms/DashboardLayout";
import { GalleryItem } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  Loader2,
  Image
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Form schema for gallery item creation/editing
const galleryItemFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  imageUrl: z.string().url("Valid image URL is required"),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  isFeatured: z.boolean().default(false),
});

type GalleryItemFormValues = z.infer<typeof galleryItemFormSchema>;

// Available tags based on schema
const availableTags = ["all", "hadassah", "kingsmen", "youth", "service"];

export default function GalleryPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isAdmin, isMediaManager } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Check if user has permission to edit gallery
  const hasEditPermission = isAdmin || isMediaManager;

  // Fetch gallery items
  const { 
    data: galleryItems, 
    isLoading, 
    error 
  } = useQuery<{ success: boolean; data: GalleryItem[] }>({
    queryKey: ["/api/cms/gallery"],
    refetchOnWindowFocus: false,
  });

  // Form initialization
  const form = useForm<GalleryItemFormValues>({
    resolver: zodResolver(galleryItemFormSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      tags: ["all"],
      date: new Date(),
      isFeatured: false,
    },
  });

  // Create gallery item mutation
  const createGalleryItemMutation = useMutation({
    mutationFn: async (values: GalleryItemFormValues) => {
      const res = await apiRequest("POST", "/api/cms/gallery", values);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Gallery item created",
        description: "The gallery item has been created successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/gallery"] });
      setDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create gallery item: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Update gallery item mutation
  const updateGalleryItemMutation = useMutation({
    mutationFn: async ({ id, values }: { id: number; values: GalleryItemFormValues }) => {
      const res = await apiRequest("PUT", `/api/cms/gallery/${id}`, values);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Gallery item updated",
        description: "The gallery item has been updated successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/gallery"] });
      setDialogOpen(false);
      setEditingItem(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update gallery item: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Delete gallery item mutation
  const deleteGalleryItemMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/cms/gallery/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Gallery item deleted",
        description: "The gallery item has been deleted successfully.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cms/gallery"] });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete gallery item: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (values: GalleryItemFormValues) => {
    if (editingItem) {
      updateGalleryItemMutation.mutate({ id: editingItem.id, values });
    } else {
      createGalleryItemMutation.mutate(values);
    }
  };

  // Handle edit gallery item
  const handleEditItem = (item: GalleryItem) => {
    setEditingItem(item);
    form.reset({
      title: item.title,
      description: item.description || "",
      imageUrl: item.imageUrl,
      tags: item.tags,
      date: new Date(item.date),
      isFeatured: item.isFeatured,
    });
    setDialogOpen(true);
  };

  // Handle new gallery item
  const handleNewItem = () => {
    setEditingItem(null);
    form.reset({
      title: "",
      description: "",
      imageUrl: "",
      tags: ["all"],
      date: new Date(),
      isFeatured: false,
    });
    setDialogOpen(true);
  };

  // Handle delete gallery item
  const handleDeleteItem = (item: GalleryItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  // Confirm delete gallery item
  const confirmDeleteItem = () => {
    if (itemToDelete) {
      deleteGalleryItemMutation.mutate(itemToDelete.id);
    }
  };

  // Filter gallery items by selected tags
  const filteredItems = galleryItems?.data && selectedTags.length > 0
    ? galleryItems.data.filter(item => 
        selectedTags.some(tag => item.tags.includes(tag))
      )
    : galleryItems?.data || [];

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
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
            Failed to load gallery items. Please try again later.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gallery Management</h1>
          <p className="text-muted-foreground">
            Manage church photos and media content
          </p>
        </div>
        {hasEditPermission && (
          <Button onClick={handleNewItem}>
            <Plus className="mr-2 h-4 w-4" /> Add Image
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {availableTags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative aspect-square">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="object-cover w-full h-full"
                />
                {item.isFeatured && (
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    Featured
                  </Badge>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{item.title}</CardTitle>
                {item.description && (
                  <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="py-0">
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {format(new Date(item.date), "MMMM d, yyyy")}
                </p>
              </CardContent>
              {hasEditPermission && (
                <CardFooter className="flex justify-end pt-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEditItem(item)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteItem(item)}
                        className="text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border rounded-md">
          <Image className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No gallery items found</h3>
          <p className="text-muted-foreground mt-1">
            {selectedTags.length > 0 
              ? "No items match the selected filters." 
              : "There are no images in the gallery yet."}
          </p>
          {hasEditPermission && selectedTags.length === 0 && (
            <Button onClick={handleNewItem} className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add your first image
            </Button>
          )}
        </div>
      )}

      {/* Create/Edit Gallery Item Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? "Edit Gallery Item" : "Add New Gallery Item"}
            </DialogTitle>
            <DialogDescription>
              {editingItem
                ? "Update the gallery item details below."
                : "Fill in the gallery item details below."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter image title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="imageUrl"
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
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter image description"
                        {...field}
                        className="min-h-[80px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormDescription>
                      Select at least one tag for the image
                    </FormDescription>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {availableTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant={
                            form.watch("tags")?.includes(tag)
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => {
                            const currentTags = form.watch("tags") || [];
                            if (currentTags.includes(tag)) {
                              // Don't allow removing all tags or the "all" tag if it's the only one
                              if (currentTags.length > 1 && (tag !== "all" || currentTags.filter(t => t !== "all").length > 0)) {
                                form.setValue(
                                  "tags",
                                  currentTags.filter((t) => t !== tag)
                                );
                              }
                            } else {
                              form.setValue("tags", [...currentTags, tag]);
                            }
                          }}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Featured Image</FormLabel>
                      <FormDescription>
                        Feature this image on the homepage and gallery page
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

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
                    createGalleryItemMutation.isPending || updateGalleryItemMutation.isPending
                  }
                >
                  {(createGalleryItemMutation.isPending || updateGalleryItemMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingItem ? "Update Image" : "Add Image"}
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
              Are you sure you want to delete "{itemToDelete?.title}"?
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
              onClick={confirmDeleteItem}
              disabled={deleteGalleryItemMutation.isPending}
            >
              {deleteGalleryItemMutation.isPending && (
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