import type { Todo } from "@/src/types/todo";
import { KanbanColumn } from "./KanbanColumn";
import { useMemo } from "react";
interface KanbanBoardProps {
  todos: Todo[] | undefined;
}

export const KanbanBoard = ({ todos = [] }: KanbanBoardProps) => {
  const columns = useMemo(() => {
    const acc = {
      todo: [] as Todo[],
      in_progress: [] as Todo[],
      done: [] as Todo[],
    };
    for (const t of todos) (acc as any)[t.status]?.push(t);
    return acc;
  }, [todos]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KanbanColumn title="Yapılacak" todos={columns.todo} />
      <KanbanColumn title="Yapılıyor" todos={columns.in_progress} />
      <KanbanColumn title="Tamamlandı" todos={columns.done} />
    </div>
  );
};
