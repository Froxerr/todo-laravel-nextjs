"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useCreateTodoMutation } from "@/src/features/todosApi";
import type { TodoPriority, TodoStatus } from "@/src/types/todo";

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
import { CalendarIcon, FilePlus2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const AddTodoDialog = () => {
  const [createTodo, { isLoading }] = useCreateTodoMutation();

  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("medium");
  const [status, setStatus] = useState<TodoStatus>("todo");
  const [dueDate, setDueDate] = useState<Date | undefined>();

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setStatus("todo");
    setDueDate(undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || isLoading) return;

    try {
      await createTodo({
        title,
        description,
        priority,
        status,
        dueDate: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
      }).unwrap();
      toast.success("Başarılı!", {
        description: `"${title}" görevi panoya eklendi.`,
      });
      resetForm();
      setOpen(false);
    } catch (err) {
      console.error("Görev oluşturulamadı:", err);
      toast.error("Hata!", {
        description: "Görev oluşturulurken bir sorun oluştu.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex w-full sm:w-auto items-center gap-2 h-11 rounded-xl px-4">
          <FilePlus2 size={18} />
          <span>Yeni Görev Ekle</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl">Yeni Görev Oluştur</DialogTitle>
            <DialogDescription>
              Aşağıdaki alanları doldurarak yeni bir görev ekleyin.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Başlık</Label>
              <Input
                id="title"
                placeholder="Örn: Proje sunumunu hazırla"
                className="h-11 rounded-xl"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                placeholder="Görevle ilgili detaylar..."
                className="min-h-[110px] rounded-xl"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Durum</Label>
                <div className="sm:w-52">
                  <Select
                    value={status}
                    onValueChange={(value: TodoStatus) => setStatus(value)}
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
                    onValueChange={(value: TodoPriority) => setPriority(value)}
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
              Görevi Kaydet
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
