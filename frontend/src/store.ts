import { configureStore } from "@reduxjs/toolkit";
import { todosApi } from "./features/todosApi";
import selectionReducer from "@/src/features/selectionSlice";
import filtersReducer from "@/src/features/filtersSlice";

export const store = configureStore({
  reducer: {
    [todosApi.reducerPath]: todosApi.reducer,
    selection: selectionReducer,
    filters: filtersReducer,
  },
  middleware: (getDefault) => getDefault().concat(todosApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
