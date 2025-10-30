"use client";

import { useEffect, useState } from "react";
import {
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from "@/src/features/todosApi";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
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
import { Loader2, Trash2 } from "lucide-react";
import type { TodoStatus } from "@/src/types/todo";

import { useDispatch, useSelector } from "react-redux";
import {
  clearSelection,
  selectSelectedIds,
} from "@/src/features/selectionSlice";

export const BoardBulkActions = () => {
  const selectedIds = useSelector(selectSelectedIds);
  const dispatch = useDispatch();

  const [deleteTodo] = useDeleteTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const [isLoading, setIsLoading] = useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  if (selectedIds.length === 0) {
    return null;
  }

  const handleBulkDelete = async () => {
    setIsLoading(true);
    try {
      await Promise.all(selectedIds.map((id) => deleteTodo(id).unwrap()));
      toast.success(`${selectedIds.length} görev başarıyla silindi.`);
      dispatch(clearSelection());
    } catch (error) {
      toast.error("Görevler silinirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (status: TodoStatus) => {
    setIsLoading(true);
    try {
      await Promise.all(
        selectedIds.map((id) => updateTodo({ id, patch: { status } }).unwrap())
      );
      toast.success(`${selectedIds.length} görevin durumu güncellendi.`);
      dispatch(clearSelection());
    } catch (error) {
      toast.error("Durum güncellenirken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      data-mounted={mounted}
      className="relative mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3
                 rounded-2xl border border-border/60 bg-card/70 p-3 sm:p-4
                 backdrop-blur supports-backdrop-filter:bg-card/60
                 transition-[opacity,transform] duration-200 ease-out will-change-[opacity,transform]
                 opacity-0 translate-y-2 data-[mounted=true]:opacity-100 data-[mounted=true]:translate-y-0"
    >
      <span className="text-sm font-medium">
        {selectedIds.length} görev seçildi
      </span>
      <div className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <Select onValueChange={handleStatusChange} disabled={isLoading}>
          <SelectTrigger className="w-full sm:w-[220px] h-11 rounded-xl">
            <SelectValue placeholder="Durumu Değiştir" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todo">Yapılacak</SelectItem>
            <SelectItem value="in_progress">Yapılıyor</SelectItem>
            <SelectItem value="done">Tamamlandı</SelectItem>
          </SelectContent>
        </Select>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              className="gap-2 h-11 rounded-xl w-full sm:w-auto"
              disabled={isLoading}
            >
              <Trash2 size={16} /> Seçilenleri Sil
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
              <AlertDialogDescription>
                Seçili {selectedIds.length} görevi kalıcı olarak sileceksiniz.
                Bu işlem geri alınamaz.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleBulkDelete}
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Evet, Sil
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
