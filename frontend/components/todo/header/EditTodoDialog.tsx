"use client";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { useUpdateTodoMutation } from "@/src/features/todosApi";
import type { Todo, TodoPriority, TodoStatus } from "@/src/types/todo";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditTodoDialogProps {
  todo: Todo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditTodoDialog = ({
  todo,
  open,
  onOpenChange,
}: EditTodoDialogProps) => {
  const [updateTodo, { isLoading }] = useUpdateTodoMutation();

  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description ?? "");
  const [priority, setPriority] = useState<TodoPriority>(todo.priority);
  const [status, setStatus] = useState<TodoStatus>(todo.status);
  const [dueDate, setDueDate] = useState<Date | undefined>(
    todo.dueDate ? parseISO(todo.dueDate) : undefined
  );

  useEffect(() => {
    setTitle(todo.title);
    setDescription(todo.description ?? "");
    setPriority(todo.priority);
    setStatus(todo.status);
    setDueDate(todo.dueDate ? parseISO(todo.dueDate) : undefined);
  }, [todo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || isLoading) return;

    try {
      await updateTodo({
        id: todo.id,
        patch: {
          title,
          description,
          priority,
          status,
          dueDate: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
        },
      }).unwrap();

      toast.success("Görev güncellendi!", {
        description: `"${title}" görevi başarıyla güncellendi.`,
      });

      onOpenChange(false);
    } catch (err) {
      console.error("Görev güncellenemedi:", err);
      toast.error("Hata!", {
        description: "Görev güncellenirken bir sorun oluştu.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl">Görevi Düzenle</DialogTitle>
            <DialogDescription>
              Aşağıdaki alanları güncelleyerek görevi düzenleyin.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Başlık</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-11 rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[110px] rounded-xl"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Durum</Label>
                <div className="sm:w-52">
                  <Select
                    value={status}
                    onValueChange={(v: TodoStatus) => setStatus(v)}
                  >
                    <SelectTrigger className="h-11 rounded-xl w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">Yapılacak</SelectItem>
                      <SelectItem value="in_progress">Yapılıyor</SelectItem>
                      <SelectItem value="done">Tamamlandı</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Öncelik</Label>
                <div className="sm:w-52">
                  <Select
                    value={priority}
                    onValueChange={(v: TodoPriority) => setPriority(v)}
                  >
                    <SelectTrigger className="h-11 rounded-xl w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Yüksek</SelectItem>
                      <SelectItem value="medium">Orta</SelectItem>
                      <SelectItem value="low">Düşük</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Bitiş Tarihi</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "h-11 w-full justify-start rounded-xl text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? (
                      format(dueDate, "PPP")
                    ) : (
                      <span>Bir tarih seçin</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto rounded-xl p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              size="lg"
              className="h-11 rounded-xl"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Değişiklikleri Kaydet
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
