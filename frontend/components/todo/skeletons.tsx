import { Skeleton } from "@/components/ui/skeleton";

const TodoCardSkeleton = () => (
  <div className="relative mb-4 p-4 border rounded-2xl bg-card">
    <div className="flex items-start gap-4">
      <Skeleton className="h-5 w-5 mt-1 rounded-sm" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-3/5" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  </div>
);

const KanbanColumnSkeleton = () => (
  <div className="bg-card/50 rounded-lg p-4">
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-6 w-28" />
      <Skeleton className="h-6 w-10 rounded-md" />
    </div>
    <div>
      <TodoCardSkeleton />
      <TodoCardSkeleton />
      <TodoCardSkeleton />
    </div>
  </div>
);

export const KanbanBoardSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <KanbanColumnSkeleton />
    <KanbanColumnSkeleton />
    <KanbanColumnSkeleton />
  </div>
);
