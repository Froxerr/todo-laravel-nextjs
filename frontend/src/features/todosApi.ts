import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Todo,
  TodoListResponse,
  TodoPriority,
  TodoStatus,
} from "../types/todo";

const baseQuery = fetchBaseQuery({ baseUrl: "/api" }); // Next route handlers

export const todosApi = createApi({
  reducerPath: "todosApi",
  baseQuery,
  tagTypes: ["Todos"],
  endpoints: (build) => ({
    getTodos: build.query<
      TodoListResponse,
      {
        status?: TodoStatus[];
        priority?: TodoPriority[];
        search?: string;
        sort?:
          | "createdAt:asc"
          | "createdAt:desc"
          | "dueDate:asc"
          | "dueDate:desc";
      } | void
    >({
      query: (args) => {
        const p = new URLSearchParams();
        if (args?.status?.length) p.set("status", args.status.join(","));
        if (args?.priority?.length) p.set("priority", args.priority.join(","));
        if (args?.search) p.set("search", args.search);
        if (args?.sort) p.set("sort", args.sort);
        const qs = p.toString();
        return { url: `/todos${qs ? `?${qs}` : ""}` };
      },
      providesTags: (result) => [{ type: "Todos", id: "LIST" }],
    }),

    createTodo: build.mutation<Todo, Partial<Todo>>({
      query: (body) => ({
        url: "/todos",
        method: "POST",
        body: {
          title: body.title,
          description: body.description ?? null,
          priority: body.priority ?? "medium",
          dueDate: body.dueDate ?? null,
          status: body.status ?? "todo",
        },
        headers: { "content-type": "application/json" },
      }),
      invalidatesTags: [{ type: "Todos", id: "LIST" }],
    }),

    updateTodo: build.mutation<Todo, { id: number; patch: Partial<Todo> }>({
      query: ({ id, patch }) => ({
        url: `/todos/${id}`,
        method: "PATCH",
        body: patch,
        headers: { "content-type": "application/json" },
      }),
      invalidatesTags: [{ type: "Todos", id: "LIST" }],
    }),

    deleteTodo: build.mutation<void, number>({
      query: (id) => ({ url: `/todos/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Todos", id: "LIST" }],
    }),
  }),
});

export const {
  useGetTodosQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useDeleteTodoMutation,
} = todosApi;
