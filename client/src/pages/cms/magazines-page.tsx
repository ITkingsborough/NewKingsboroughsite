import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { DashboardLayout } from "@/components/cms/DashboardLayout";
import { Calendar } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Trash2, Edit, Eye, FileUp, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

interface Magazine {
  id: number;
  title: string;
  description: string | null;
  type: string;
  date: string;
  coverImage: string;
  pdfUrl: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: number | null;
  updatedBy: number | null;
}

export default function MagazinesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [selectedMagazine, setSelectedMagazine] = useState<Magazine | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("monthly");
  const [featured, setFeatured] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Query magazines
  const { data: magazinesData, isLoading } = useQuery<{ success: boolean; data: Magazine[] }>({
    queryKey: ["/api/cms/magazines"],
    refetchOnWindowFocus: false,
  });
  
  // Create magazine mutation
  const createMagazineMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await apiRequest("POST", "/api/cms/magazines", formData, {
        headers: {
          // Don't set Content-Type here, it will be set automatically with boundary
        },
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Magazine created",
        description: "The magazine has been successfully created.",
      });
      resetForm();
      setIsAddModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/cms/magazines"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error creating magazine",
        description: error.message || "An error occurred while creating the magazine.",
        variant: "destructive",
      });
    },
  });
  
  // Update magazine mutation
  const updateMagazineMutation = useMutation({
    mutationFn: async ({id, formData}: {id: number, formData: FormData}) => {
      const res = await apiRequest("PUT", `/api/cms/magazines/${id}`, formData, {
        headers: {
          // Don't set Content-Type here, it will be set automatically with boundary
        },
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Magazine updated",
        description: "The magazine has been successfully updated.",
      });
      resetForm();
      setIsEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/cms/magazines"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating magazine",
        description: error.message || "An error occurred while updating the magazine.",
        variant: "destructive",
      });
    },
  });
  
  // Delete magazine mutation
  const deleteMagazineMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/cms/magazines/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Magazine deleted",
        description: "The magazine has been successfully deleted.",
      });
      setIsDeleteAlertOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/cms/magazines"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting magazine",
        description: error.message || "An error occurred while deleting the magazine.",
        variant: "destructive",
      });
    },
  });
  
  // Reset form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setType("monthly");
    setFeatured(false);
    setCoverImage(null);
    setPdfFile(null);
    setSelectedMagazine(null);
    setIsSubmitting(false);
  };
  
  // Handle edit button click
  const handleEditClick = (magazine: Magazine) => {
    setSelectedMagazine(magazine);
    setTitle(magazine.title);
    setDescription(magazine.description || "");
    setDate(magazine.date);
    setType(magazine.type);
    setFeatured(magazine.featured);
    setIsEditModalOpen(true);
  };
  
  // Handle delete button click
  const handleDeleteClick = (magazine: Magazine) => {
    setSelectedMagazine(magazine);
    setIsDeleteAlertOpen(true);
  };
  
  // Handle form submission for creating a magazine
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !coverImage || !pdfFile) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields and upload both cover image and PDF file.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("type", type);
    formData.append("featured", featured.toString());
    formData.append("coverImage", coverImage);
    formData.append("pdfFile", pdfFile);
    
    await createMagazineMutation.mutateAsync(formData);
  };
  
  // Handle form submission for updating a magazine
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMagazine || !title || !date) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("date", date);
    formData.append("type", type);
    formData.append("featured", featured.toString());
    
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }
    
    if (pdfFile) {
      formData.append("pdfFile", pdfFile);
    }
    
    await updateMagazineMutation.mutateAsync({
      id: selectedMagazine.id,
      formData
    });
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (selectedMagazine) {
      await deleteMagazineMutation.mutateAsync(selectedMagazine.id);
    }
  };
  
  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    try {
      // Try to parse as ISO date
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return format(date, 'MMMM yyyy');
      }
      // If not a valid ISO date, return the original string (it might be a formatted date already)
      return dateString;
    } catch {
      return dateString;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Magazines</h1>
          <Button onClick={() => setIsAddModalOpen(true)}>
            Add New Magazine
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !magazinesData?.data || magazinesData.data.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No magazines found. Create your first magazine.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {magazinesData.data.map((magazine) => (
              <Card key={magazine.id} className="overflow-hidden flex flex-col h-full">
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={magazine.coverImage}
                    alt={magazine.title}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                  {magazine.featured && (
                    <Badge className="absolute top-2 right-2 bg-primary">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardHeader>
                  <CardTitle>{magazine.title}</CardTitle>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDisplayDate(magazine.date)}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {magazine.description || "No description provided."}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between mt-auto">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(magazine.pdfUrl, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a href={magazine.pdfUrl} download>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </a>
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(magazine)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(magazine)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        {/* Add Magazine Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Magazine</DialogTitle>
              <DialogDescription>
                Upload a new magazine to the website. Fill in all the required fields.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Magazine title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Publication Date *</Label>
                    <Input
                      id="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="June 2023"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the magazine content"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Magazine Type</Label>
                    <Select
                      value={type}
                      onValueChange={setType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="special">Special Edition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="featured"
                      checked={featured}
                      onCheckedChange={setFeatured}
                    />
                    <Label htmlFor="featured">Featured Magazine</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coverImage">Cover Image *</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="coverImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                      required
                      className="flex-1"
                    />
                    {coverImage && (
                      <div className="w-16 h-16 bg-gray-100 relative rounded overflow-hidden">
                        <img
                          src={URL.createObjectURL(coverImage)}
                          alt="Cover preview"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pdfFile">PDF File *</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="pdfFile"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                      required
                      className="flex-1"
                    />
                    {pdfFile && (
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <FileUp className="h-4 w-4" />
                        <span>{pdfFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsAddModalOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload Magazine"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Edit Magazine Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Magazine</DialogTitle>
              <DialogDescription>
                Update the magazine information. Only upload new files if you want to replace the existing ones.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Title *</Label>
                    <Input
                      id="edit-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Magazine title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-date">Publication Date *</Label>
                    <Input
                      id="edit-date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="June 2023"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the magazine content"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-type">Magazine Type</Label>
                    <Select
                      value={type}
                      onValueChange={setType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="special">Special Edition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="edit-featured"
                      checked={featured}
                      onCheckedChange={setFeatured}
                    />
                    <Label htmlFor="edit-featured">Featured Magazine</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-coverImage">
                    Cover Image {selectedMagazine ? "(Optional)" : "*"}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="edit-coverImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                      className="flex-1"
                    />
                    {coverImage ? (
                      <div className="w-16 h-16 bg-gray-100 relative rounded overflow-hidden">
                        <img
                          src={URL.createObjectURL(coverImage)}
                          alt="Cover preview"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : selectedMagazine && (
                      <div className="w-16 h-16 bg-gray-100 relative rounded overflow-hidden">
                        <img
                          src={selectedMagazine.coverImage}
                          alt="Current cover"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-pdfFile">
                    PDF File {selectedMagazine ? "(Optional)" : "*"}
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="edit-pdfFile"
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                      className="flex-1"
                    />
                    {pdfFile ? (
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <FileUp className="h-4 w-4" />
                        <span>{pdfFile.name}</span>
                      </div>
                    ) : selectedMagazine && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(selectedMagazine.pdfUrl, '_blank')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Current PDF
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setIsEditModalOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Magazine"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete {selectedMagazine?.title}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDeleteAlertOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteMagazineMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
}