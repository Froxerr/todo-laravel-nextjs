<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTodoRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array {
        return [
            'title'       => ['required','string','max:255'],
            'description' => ['nullable','string'],
            'status'      => ['sometimes','in:todo,in_progress,done'],
            'priority'    => ['required','in:low,medium,high'],
            'dueDate'     => ['nullable','date'],
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
