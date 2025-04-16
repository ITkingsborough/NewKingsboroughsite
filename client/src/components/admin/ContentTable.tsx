import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Column {
  key: string;
  header: string;
  cell?: (item: any) => React.ReactNode;
}

interface ContentTableProps {
  title: string;
  data: any[];
  columns: Column[];
  isLoading?: boolean;
  onAdd: () => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => Promise<void>;
  onView?: (item: any) => void;
}

export default function ContentTable({
  title,
  data,
  columns,
  isLoading = false,
  onAdd,
  onEdit,
  onDelete,
  onView,
}: ContentTableProps) {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    try {
      await onDelete(itemToDelete);
      toast({
        title: 'Success',
        description: 'Item deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete item',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const confirmDelete = (item: any) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        <Button 
          onClick={onAdd} 
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Plus className="h-4 w-4 mr-2" /> Add New
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-64 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-gray-500 mb-4">No items found</p>
          <Button 
            onClick={onAdd} 
            variant="outline"
            className="border-amber-300 text-amber-700 hover:text-amber-800 hover:bg-amber-50 hover:border-amber-400"
          >
            <Plus className="h-4 w-4 mr-2" /> Add your first item
          </Button>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.key}>{column.header}</TableHead>
                ))}
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  {columns.map((column) => (
                    <TableCell key={`${item.id}-${column.key}`}>
                      {column.cell 
                        ? column.cell(item) 
                        : String(item[column.key] || '')}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(item)}
                        className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {onView && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onView(item)}
                          className="h-8 w-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDelete(item)}
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this item
              and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}