import { memo } from "react";
import type { Todo } from "@/src/types/todo";
import { Badge } from "@/components/ui/badge";
import { TodoCard } from "./TodoCard";

interface KanbanColumnProps {
  title: string;
  todos: Todo[];
}

export const KanbanColumn = memo(({ title, todos }: KanbanColumnProps) => {
  return (
    <div className="bg-card/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">{title}</h2>
        <Badge variant="secondary">{todos.length}</Badge>
      </div>
      <div>
        {todos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
});

KanbanColumn.displayName = "KanbanColumn";
