import React from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ContentFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  title: string;
  schema: z.ZodSchema<any>;
  fields: {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'date' | 'file' | 'number' | 'email' | 'url';
    placeholder?: string;
    required?: boolean;
  }[];
  defaultValues?: Record<string, any>;
  isSubmitting?: boolean;
}

export default function ContentFormDialog({
  isOpen,
  onClose,
  onSubmit,
  title,
  schema,
  fields,
  defaultValues = {},
  isSubmitting = false,
}: ContentFormDialogProps) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  // Reset form when dialog opens with new defaultValues
  React.useEffect(() => {
    if (isOpen) {
      form.reset(defaultValues);
    }
  }, [isOpen, defaultValues, form]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription>
            Fill in the form below to create or update content.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
            {fields.map((field) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel className="font-medium">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </FormLabel>
                    <FormControl>
                      {field.type === 'textarea' ? (
                        <Textarea
                          placeholder={field.placeholder}
                          className="min-h-[100px]"
                          {...formField}
                        />
                      ) : field.type === 'file' ? (
                        <Input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            formField.onChange(file);
                          }}
                          className="cursor-pointer"
                        />
                      ) : (
                        <Input
                          type={field.type}
                          placeholder={field.placeholder}
                          {...formField}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <DialogFooter className="pt-4">
              <Button 
                variant="outline" 
                onClick={onClose} 
                type="button"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting || !form.formState.isValid}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}