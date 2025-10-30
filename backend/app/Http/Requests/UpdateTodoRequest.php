<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTodoRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array {
        return [
            'title'       => ['sometimes','string','max:255'],
            'description' => ['sometimes','nullable','string'],
            'status'      => ['sometimes','in:todo,in_progress,done'],
            'priority'    => ['sometimes','in:low,medium,high'],
            'dueDate'     => ['sometimes','nullable','date'],
        ];
    }

    public function validated($key = null, $default = null) {
        $data = parent::validated($key, $default);
        if (array_key_exists('dueDate', $data)) {
            $data['due_date'] = $data['dueDate'];
            unset($data['dueDate']);
        }
        return $data;
    }
}
