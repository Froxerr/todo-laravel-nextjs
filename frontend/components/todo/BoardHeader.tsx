import { AddTodoDialog } from "./header/AddTodoDialog";
import { BoardFilters } from "./header/BoardFilters";
import { BoardBulkActions } from "./header/BoardBulkActions";

export const BoardHeader = () => {
  return (
    <>
      <header className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight w-full text-center sm:w-auto sm:text-left">
          Proje Panosu
        </h1>
        <div className="w-full px-4 sm:w-auto sm:px-0">
          <AddTodoDialog />
        </div>
      </header>
      <div className="w-full px-3 sm:px-0">
        <BoardFilters />

        <BoardBulkActions />
      </div>
    </>
  );
};
