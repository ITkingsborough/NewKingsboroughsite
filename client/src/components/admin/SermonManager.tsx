import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { format } from 'date-fns';
import { z } from 'zod';
import { Calendar, Video, ExternalLink } from 'lucide-react';

import ContentTable from './ContentTable';
import ContentFormDialog from './ContentFormDialog';
import { insertSermonSchema } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/use-admin-auth';

const sermonFormSchema = insertSermonSchema
  .extend({
    // Add any additional validation or optional fields
    date: z.string().min(1, "Date is required"),
    videoUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    downloadUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    imageFile: z.any().optional(),
  });

export default function SermonManager() {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentSermon, setCurrentSermon] = useState<any>(null);

  const { data: sermons = [], isLoading } = useQuery({
    queryKey: ['/api/sermons'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/sermons');
        return await response.json();
      } catch (error) {
        console.error('Error fetching sermons:', error);
        return [];
      }
    },
  });

  const createSermonMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest('POST', '/api/sermons', undefined, data);
      if (!response.ok) {
        throw new Error('Failed to create sermon');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sermons'] });
      setIsFormOpen(false);
      toast({
        title: 'Success',
        description: 'Sermon has been created successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create sermon: ' + (error as Error).message,
        variant: 'destructive',
      });
    },
  });

  const updateSermonMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const response = await apiRequest('PATCH', `/api/sermons/${id}`, undefined, data);
      if (!response.ok) {
        throw new Error('Failed to update sermon');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sermons'] });
      setIsFormOpen(false);
      toast({
        title: 'Success',
        description: 'Sermon has been updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update sermon: ' + (error as Error).message,
        variant: 'destructive',
      });
    },
  });

  const deleteSermonMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/sermons/${id}`);
      if (!response.ok) {
        throw new Error('Failed to delete sermon');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sermons'] });
      toast({
        title: 'Success',
        description: 'Sermon has been deleted successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete sermon: ' + (error as Error).message,
        variant: 'destructive',
      });
    },
  });

  const handleAdd = () => {
    setCurrentSermon(null);
    setIsFormOpen(true);
  };

  const handleEdit = (sermon: any) => {
    setCurrentSermon({
      ...sermon,
      date: sermon.date ? sermon.date.split('T')[0] : '', // Format date for input
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (sermon: any) => {
    await deleteSermonMutation.mutateAsync(sermon.id);
  };

  const handleFormSubmit = async (data: any) => {
    const formData = new FormData();
    
    // Add all text fields to FormData
    Object.keys(data).forEach(key => {
      if (key !== 'imageFile' && data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    
    // Add image file if it exists
    if (data.imageFile instanceof File) {
      formData.append('image', data.imageFile);
    }
    
    if (currentSermon) {
      await updateSermonMutation.mutateAsync({
        id: currentSermon.id,
        data: formData,
      });
    } else {
      await createSermonMutation.mutateAsync(formData);
    }
  };

  const columns = [
    {
      key: 'title',
      header: 'Title',
    },
    {
      key: 'date',
      header: 'Date',
      cell: (sermon: any) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          {sermon.date ? format(new Date(sermon.date), 'PPP') : 'N/A'}
        </div>
      ),
    },
    {
      key: 'preacher',
      header: 'Preacher',
    },
    {
      key: 'videoUrl',
      header: 'Video',
      cell: (sermon: any) => sermon.videoUrl ? (
        <a 
          href={sermon.videoUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-blue-500 hover:text-blue-700"
        >
          <Video className="h-4 w-4 mr-1" />
          Watch
        </a>
      ) : 'None',
    },
    {
      key: 'downloadUrl',
      header: 'Download',
      cell: (sermon: any) => sermon.downloadUrl ? (
        <a 
          href={sermon.downloadUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-green-500 hover:text-green-700"
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Download
        </a>
      ) : 'None',
    },
  ];

  const formFields = [
    {
      name: 'title',
      label: 'Title',
      type: 'text' as const,
      placeholder: 'Enter sermon title',
      required: true,
    },
    {
      name: 'preacher',
      label: 'Preacher',
      type: 'text' as const,
      placeholder: 'Enter preacher name',
      required: true,
    },
    {
      name: 'date',
      label: 'Date',
      type: 'date' as const,
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea' as const,
      placeholder: 'Enter sermon description',
      required: true,
    },
    {
      name: 'videoUrl',
      label: 'Video URL',
      type: 'url' as const,
      placeholder: 'Enter video URL (YouTube, Vimeo, etc.)',
    },
    {
      name: 'downloadUrl',
      label: 'Download URL',
      type: 'url' as const,
      placeholder: 'Enter download URL for audio/PDF',
    },
    {
      name: 'imageFile',
      label: 'Cover Image',
      type: 'file' as const,
    },
  ];

  return (
    <div>
      <ContentTable
        title="Sermons"
        data={sermons}
        columns={columns}
        isLoading={isLoading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ContentFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        title={currentSermon ? 'Edit Sermon' : 'Add New Sermon'}
        schema={sermonFormSchema}
        fields={formFields}
        defaultValues={currentSermon || {}}
        isSubmitting={createSermonMutation.isPending || updateSermonMutation.isPending}
      />
    </div>
  );
}