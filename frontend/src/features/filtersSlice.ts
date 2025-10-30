import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/src/store";
import type { TodoPriority, TodoStatus } from "../types/todo";

interface FiltersState {
  search?: string;
  status?: TodoStatus[];
  priority?: TodoPriority[];
}

const initialState: FiltersState = {
  search: undefined,
  status: undefined,
  priority: undefined,
};

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string | undefined>) => {
      state.search = action.payload;
    },
    toggleStatus: (state, action: PayloadAction<TodoStatus>) => {
      const status = action.payload;
      const current = state.status || [];
      const newStatus = current.includes(status)
        ? current.filter((s) => s !== status)
        : [...current, status];
      state.status = newStatus.length ? newStatus : undefined;
    },
    togglePriority: (state, action: PayloadAction<TodoPriority>) => {
      const priority = action.payload;
      const current = state.priority || [];
      const newPriority = current.includes(priority)
        ? current.filter((p) => p !== priority)
        : [...current, priority];
      state.priority = newPriority.length ? newPriority : undefined;
    },
    clearFilters: (state) => {
      state.search = undefined;
      state.status = undefined;
      state.priority = undefined;
    },
  },
});

export const { setSearch, toggleStatus, togglePriority, clearFilters } =
  filtersSlice.actions;
export const selectFilters = (state: RootState) => state.filters;
export default filtersSlice.reducer;
