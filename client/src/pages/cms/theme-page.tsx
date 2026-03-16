import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/cms/DashboardLayout";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Trash2, Edit, Plus, CheckCircle2, BookOpen } from "lucide-react";
import type { ThemeOfMonth } from "@shared/schema";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const currentYear = new Date().getFullYear();
const MONTH_OPTIONS = MONTHS.flatMap(m => [`${m} ${currentYear}`, `${m} ${currentYear + 1}`]);

interface ThemeFormData {
  title: string;
  subtitle: string;
  scripture: string;
  scriptureRef: string;
  description: string;
  month: string;
  isActive: boolean;
}

const defaultForm: ThemeFormData = {
  title: "",
  subtitle: "Theme of the Month",
  scripture: "",
  scriptureRef: "",
  description: "",
  month: MONTHS[new Date().getMonth()] + " " + currentYear,
  isActive: false,
};

export default function ThemePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<ThemeOfMonth | null>(null);
  const [form, setForm] = useState<ThemeFormData>(defaultForm);

  const { data, isLoading } = useQuery<{ success: boolean; data: ThemeOfMonth[] }>({
    queryKey: ["/api/cms/theme-of-month"],
  });

  const themes = data?.data || [];

  const createMutation = useMutation({
    mutationFn: (body: ThemeFormData) =>
      apiRequest("POST", "/api/cms/theme-of-month", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/theme-of-month"] });
      queryClient.invalidateQueries({ queryKey: ["/api/theme-of-month"] });
      toast({ title: "Theme created", description: "The theme has been saved." });
      setDialogOpen(false);
    },
    onError: () => toast({ title: "Error", description: "Failed to create theme.", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<ThemeFormData> }) =>
      apiRequest("PUT", `/api/cms/theme-of-month/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/theme-of-month"] });
      queryClient.invalidateQueries({ queryKey: ["/api/theme-of-month"] });
      toast({ title: "Theme updated", description: "Changes saved successfully." });
      setDialogOpen(false);
    },
    onError: () => toast({ title: "Error", description: "Failed to update theme.", variant: "destructive" }),
  });

  const activateMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest("POST", `/api/cms/theme-of-month/${id}/activate`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/theme-of-month"] });
      queryClient.invalidateQueries({ queryKey: ["/api/theme-of-month"] });
      toast({ title: "Theme activated", description: "This theme is now live on the homepage." });
    },
    onError: () => toast({ title: "Error", description: "Failed to activate theme.", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest("DELETE", `/api/cms/theme-of-month/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cms/theme-of-month"] });
      queryClient.invalidateQueries({ queryKey: ["/api/theme-of-month"] });
      toast({ title: "Theme deleted" });
    },
    onError: () => toast({ title: "Error", description: "Failed to delete theme.", variant: "destructive" }),
  });

  const openCreate = () => {
    setEditingTheme(null);
    setForm(defaultForm);
    setDialogOpen(true);
  };

  const openEdit = (theme: ThemeOfMonth) => {
    setEditingTheme(theme);
    setForm({
      title: theme.title,
      subtitle: theme.subtitle || "Theme of the Month",
      scripture: theme.scripture || "",
      scriptureRef: theme.scriptureRef || "",
      description: theme.description,
      month: theme.month,
      isActive: theme.isActive ?? false,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title || !form.description || !form.month) {
      toast({ title: "Required fields missing", variant: "destructive" });
      return;
    }
    if (editingTheme) {
      updateMutation.mutate({ id: editingTheme.id, body: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Theme of the Month</h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage the monthly spiritual focus theme shown on the homepage.
            </p>
          </div>
          <Button onClick={openCreate} className="bg-[#4c006D] hover:bg-[#3a0054] text-white gap-2">
            <Plus className="w-4 h-4" />
            New Theme
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#4c006D]" />
          </div>
        ) : themes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No themes yet</h3>
              <p className="text-gray-500 text-sm mb-4">
                Create your first monthly theme to display on the homepage.
              </p>
              <Button onClick={openCreate} variant="outline">
                <Plus className="w-4 h-4 mr-2" /> Create Theme
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {themes.map((theme) => (
              <Card key={theme.id} className={`border-2 transition-colors ${theme.isActive ? "border-[#4c006D]" : "border-transparent"}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <Badge variant="outline" className="text-xs font-normal text-gray-500">
                          {theme.month}
                        </Badge>
                        {theme.isActive && (
                          <Badge className="bg-[#4c006D] text-white text-xs gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg text-gray-900 truncate">{theme.title}</CardTitle>
                      {theme.scriptureRef && (
                        <p className="text-sm text-gray-500 mt-0.5 italic">— {theme.scriptureRef}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!theme.isActive && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[#4c006D] border-[#4c006D] hover:bg-[#4c006D] hover:text-white"
                          onClick={() => activateMutation.mutate(theme.id)}
                          disabled={activateMutation.isPending}
                        >
                          {activateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Set Active"}
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => openEdit(theme)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Theme</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{theme.title}"? This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => deleteMutation.mutate(theme.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm line-clamp-2">{theme.description}</p>
                  {theme.scripture && (
                    <p className="text-sm text-gray-400 italic mt-2 line-clamp-1">
                      "{theme.scripture}"
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTheme ? "Edit Theme" : "New Theme of the Month"}</DialogTitle>
            <DialogDescription>
              Fill in the details for this month's spiritual focus theme.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="month">Month *</Label>
                <select
                  id="month"
                  value={form.month}
                  onChange={e => setForm(f => ({ ...f, month: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4c006D]"
                >
                  {MONTH_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="subtitle">Label / Subtitle</Label>
                <Input
                  id="subtitle"
                  placeholder="e.g. Theme of the Month"
                  value={form.subtitle}
                  onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="title">Theme Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Rooted & Grounded in Love"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                rows={4}
                placeholder="Describe what this theme means for the congregation this month..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="scripture">Scripture Verse</Label>
                <Textarea
                  id="scripture"
                  rows={3}
                  placeholder="e.g. And I pray that you, being rooted and established in love..."
                  value={form.scripture}
                  onChange={e => setForm(f => ({ ...f, scripture: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="scriptureRef">Scripture Reference</Label>
                <Input
                  id="scriptureRef"
                  placeholder="e.g. Ephesians 3:17–18"
                  value={form.scriptureRef}
                  onChange={e => setForm(f => ({ ...f, scriptureRef: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="isActive"
                checked={form.isActive}
                onCheckedChange={val => setForm(f => ({ ...f, isActive: val }))}
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Set as active theme (will deactivate all others)
              </Label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="bg-[#4c006D] hover:bg-[#3a0054] text-white"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {editingTheme ? "Save Changes" : "Create Theme"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
