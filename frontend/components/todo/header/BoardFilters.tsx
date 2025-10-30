"use client";

import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import type { TodoPriority, TodoStatus } from "@/src/types/todo";

import { useDispatch, useSelector } from "react-redux";
import {
  selectFilters,
  setSearch,
  toggleStatus,
  togglePriority,
  clearFilters,
} from "@/src/features/filtersSlice";

export const BoardFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);

  const [localSearch, setLocalSearch] = useState(filters.search || "");

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localSearch !== filters.search) {
        dispatch(setSearch(localSearch || undefined));
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [localSearch, dispatch, filters.search]);

  const statuses: TodoStatus[] = ["todo", "in_progress", "done"];
  const priorities: TodoPriority[] = ["high", "medium", "low"];

  const handleClear = () => {
    setLocalSearch("");
    dispatch(clearFilters());
  };

  return (
    <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 rounded-2xl border border-border/60 bg-card/70 p-3 sm:p-4 backdrop-blur supports-backdrop-filter:bg-card/60">
      <div className="relative flex-1 w-full min-w-0">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={20}
        />
        <Input
          placeholder="Görevlerde ara..."
          className="h-11 rounded-xl pl-10"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-1 rounded-full h-10 px-3">
              <Plus size={16} />
              <span>Durum</span>
              {(filters.status?.length ?? 0) > 0 && (
                <Badge className="ml-1">{filters.status?.length}</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[calc(100vw-2rem)] sm:w-64 p-2 rounded-xl">
            <div className="grid gap-2">
              {statuses.map((status) => (
                <label
                  key={status}
                  className="flex items-center gap-2 font-normal p-2 hover:bg-muted rounded-md text-sm"
                >
                  <Checkbox
                    checked={!!filters.status?.includes(status)}
                    onCheckedChange={() => dispatch(toggleStatus(status))}
                  />
                  {status === "todo"
                    ? "Yapılacak"
                    : status === "in_progress"
                    ? "Yapılıyor"
                    : "Tamamlandı"}
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-1 rounded-full h-10 px-3">
              <Plus size={16} />
              <span>Öncelik</span>
              {(filters.priority?.length ?? 0) > 0 && (
                <Badge className="ml-1">{filters.priority?.length}</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[calc(100vw-2rem)] sm:w-64 p-2 rounded-xl">
            <div className="grid gap-2">
              {priorities.map((priority) => (
                <label
                  key={priority}
                  className="flex items-center gap-2 font-normal p-2 hover:bg-muted rounded-md text-sm"
                >
                  <Checkbox
                    checked={!!filters.priority?.includes(priority)}
                    onCheckedChange={() => dispatch(togglePriority(priority))}
                  />
                  {priority === "high"
                    ? "Yüksek"
                    : priority === "medium"
                    ? "Orta"
                    : "Düşük"}
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Button
          variant="outline"
          className="rounded-full h-10"
          onClick={handleClear}
        >
          Filtreleri Temizle
        </Button>
      </div>
    </div>
  );
};
