<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TodoResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'description' => $this->description,
            'status'      => $this->status,
            'priority'    => $this->priority,
            'dueDate'     => optional($this->due_date)?->toDateString(),
            'createdAt'   => optional($this->created_at)?->toISOString(),
            'updatedAt'   => optional($this->updated_at)?->toISOString(),
        ];
    }
}
