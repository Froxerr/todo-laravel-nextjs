"use client";
import { useState, useEffect, memo } from "react";
import type { Todo } from "@/src/types/todo";
import { useDeleteTodoMutation } from "@/src/features/todosApi";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleSelection,
  selectIsSelected,
} from "@/src/features/selectionSlice";
import type { RootState } from "@/src/store";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Pencil, Trash2 } from "lucide-react";
import { EditTodoDialog } from "./header/EditTodoDialog";

interface TodoCardProps {
  todo: Todo;
}

export const TodoCard = memo(({ todo }: TodoCardProps) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  const isSelected = useSelector((state: RootState) =>
    state.selection.ids.includes(todo.id)
  );
  const dispatch = useDispatch();

  const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteTodo(todo.id).unwrap();
      toast.success("Görev silindi!", {
        description: `"${todo.title}" görevi panodan kaldırıldı.`,
      });
    } catch (err) {
      toast.error("Hata!", {
        description: "Görev silinirken bir sorun oluştu.",
      });
    }
  };

  return (
    <>
      <Card
        data-mounted={mounted}
        data-selected={isSelected}
        className="relative mb-4
                   transition-[opacity,transform,box-shadow] duration-200 ease-out
                   opacity-0 translate-y-2
                   data-[mounted=true]:opacity-100 data-[mounted=true]:translate-y-0
                   hover:-translate-y-1 hover:shadow-lg
                   ring-0 data-[selected=true]:ring-2 data-[selected=true]:ring-primary/40
                   data-[selected=true]:bg-primary/5
                   motion-reduce:transition-none motion-reduce:transform-none"
      >
        <CardHeader className="p-0">
          <label
            htmlFor={`todo-${todo.id}`}
            className="flex items-start gap-4 p-4 cursor-pointer"
          >
            <Checkbox
              id={`todo-${todo.id}`}
              className="mt-1 transition-transform duration-150 ease-out
              scale-95 data-[state=checked]:scale-110"
              checked={isSelected}
              onCheckedChange={() => dispatch(toggleSelection(todo.id))}
            />
            <div className="flex-1 pr-12">
              <CardTitle className="text-base font-medium">
                {todo.title}
              </CardTitle>
              {todo.description && (
                <p className="text-sm text-muted-foreground mt-2 leading-snug">
                  {todo.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant={
                    todo.priority === "high"
                      ? "destructive"
                      : todo.priority === "medium"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {todo.priority === "high"
                    ? "Yüksek"
                    : todo.priority === "medium"
                    ? "Orta"
                    : "Düşük"}
                </Badge>
                {todo.dueDate && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarIcon size={14} />
                    <span>{todo.dueDate}</span>
                  </div>
                )}
              </div>
            </div>
          </label>
        </CardHeader>

        <div className="absolute top-2 right-2 flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Pencil size={15} />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-destructive hover:text-destructive"
              >
                <Trash2 size={15} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                <AlertDialogDescription>
                  Bu işlem geri alınamaz. "{todo.title}" görevini kalıcı olarak
                  sileceksiniz.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Siliniyor..." : "Sil"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>

      {isEditDialogOpen && (
        <EditTodoDialog todo={todo} open onOpenChange={setIsEditDialogOpen} />
      )}
    </>
  );
});

TodoCard.displayName = "TodoCard";
