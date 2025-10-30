import { KanbanView } from "@/components/todo/KanbanView";

export default function HomePage() {
  return (
    <main className="bg-muted/40 min-h-screen">
      <div className="container mx-auto py-8">
        <KanbanView />
      </div>
    </main>
  );
}
