"use client";
import { useGetTodosQuery } from "@/src/features/todosApi";
import { BoardHeader } from "./BoardHeader";
import { KanbanBoard } from "./KanbanBoard";
import { KanbanBoardSkeleton } from "./skeletons";

import { useDispatch, useSelector } from "react-redux";
import { selectFilters, clearFilters } from "@/src/features/filtersSlice";
import { Button } from "@/components/ui/button";

export const KanbanView = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);

  const {
    data: todoListResponse,
    isLoading,
    isError,
    isFetching,
  } = useGetTodosQuery(filters);

  if (isLoading) {
    return (
      <>
        <BoardHeader />
        <KanbanBoardSkeleton />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <BoardHeader />
        <div className="flex justify-center items-center h-64">
          <p className="text-destructive">
            Görevler yüklenirken bir hata oluştu.
          </p>
        </div>
      </>
    );
  }

  if (!todoListResponse?.data?.length && !isFetching) {
    const areFiltersActive =
      filters.search || filters.status?.length || filters.priority?.length;

    const message = areFiltersActive
      ? "Aradığınız kriterlere uygun görev bulunamadı."
      : "Gösterilecek görev bulunamadı.";

    return (
      <>
        <BoardHeader />
        <div className="flex flex-col justify-center items-center text-center h-64 gap-4">
          <p className="text-muted-foreground">{message}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <BoardHeader />
      {isFetching ? (
        <KanbanBoardSkeleton />
      ) : (
        <KanbanBoard todos={todoListResponse.data} />
      )}
    </>
  );
};
