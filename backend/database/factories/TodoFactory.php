<?php

namespace Database\Factories;

use App\Models\Todo;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Todo>
 */
class TodoFactory extends Factory
{
    protected $model = Todo::class;

    public function definition(): array
    {
        $status    = $this->faker->randomElement(['todo','in_progress','done']);
        $priority  = $this->faker->randomElement(['low','medium','high']);
        $due       = $this->faker->optional(0.4)->dateTimeBetween('now', '+30 days'); // %60 dolu

        return [
            'title'       => ucfirst($this->faker->words(mt_rand(2,5), true)),
            'description' => $this->faker->optional()->paragraph(),
            'status'      => $status,
            'priority'    => $priority,
            'due_date'    => $due?->format('Y-m-d'),
            'created_at'  => $this->faker->dateTimeBetween('-30 days', 'now'),
            'updated_at'  => now(),
        ];
    }
}
