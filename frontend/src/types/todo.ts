export type TodoStatus = 'todo' | 'in_progress' | 'done';
export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
    id: number;
    title: string;
    description: string | null;
    status: TodoStatus;
    priority: TodoPriority;
    dueDate: string | null; // YYYY-MM-DD
    createdAt: string; // ISO
    updatedAt: string; // ISO
}

export interface TodoListResponse {
    data: Todo[];
    meta?: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
    summary?: {
        page: number; perPage: number; total: number; lastPage: number;
    };
}