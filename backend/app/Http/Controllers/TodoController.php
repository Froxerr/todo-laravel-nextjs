<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTodoRequest;
use App\Http\Requests\UpdateTodoRequest;
use App\Http\Resources\TodoResource;
use App\Models\Todo;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    public function index(Request $request)
    {
        $q = Todo::query();

        // status=todo,in_progress
        if ($request->filled('status')) {
            $statuses = collect(explode(',', $request->string('status')))
                ->map('trim')->filter()->values();
            $q->whereIn('status', $statuses);
        }

        // priority=high veya low,medium
        if ($request->filled('priority')) {
            $priorities = collect(explode(',', $request->string('priority')))
                ->map('trim')->filter()->values();
            $q->whereIn('priority', $priorities);
        }

        // search başlık + açıklama
        if ($s = $request->string('search')) {
            $like = '%'.$s.'%';
            $q->where(function($w) use ($like) {
                $w->where('title','like',$like)
                    ->orWhere('description','like',$like);
            });
        }

        // sort=createdAt:asc | dueDate:desc
        $col = 'created_at'; $dir = 'desc';
        if ($sort = $request->string('sort')) {
            [$f, $d] = array_pad(explode(':', $sort, 2), 2, null);
            if (in_array($f, ['createdAt','dueDate'], true)) {
                $col = $f === 'createdAt' ? 'created_at' : 'due_date';
            }
            if (in_array(strtolower((string) $d), ['asc','desc'], true)) {
                $dir = strtolower($d);
            }
        }

        if ($col === 'due_date') {
            // null'lar sonda/solda
            if ($dir === 'asc') {
                $q->orderByRaw('due_date IS NULL')->orderBy('due_date','asc');
            } else {
                $q->orderByRaw('due_date IS NULL DESC')->orderBy('due_date','desc');
            }
        } else {
            $q->orderBy($col, $dir);
        }

        $todos = $q->get();

        return TodoResource::collection($todos);
    }

    public function store(StoreTodoRequest $request)
    {
        $todo = Todo::create($request->validated());
        return (new TodoResource($todo))
            ->response()
            ->setStatusCode(201);
    }

    public function update(UpdateTodoRequest $request, Todo $todo)
    {
        $todo->update($request->validated());
        return new TodoResource($todo);
    }

    public function destroy(Todo $todo)
    {
        $todo->delete();
        return response()->noContent();
    }
}
