<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Task;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'is_admin' => true,
        ]);

        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'user@example.com',
            'password' => bcrypt('password'),
            'is_admin' => false,
        ]);

        // Seed tasks
        for ($i = 0; $i < 5; $i++) {
            Task::create([
                'user_id' => $admin->id,
                'title' => "Admin Task $i",
                'description' => 'Description for admin task',
                'status' => 'pending',
                'due_date' => now()->addDays(rand(1, 10)),
            ]);

            Task::create([
                'user_id' => $user->id,
                'title' => "User Task $i",
                'description' => 'Description for user task',
                'status' => ['pending', 'in_progress', 'completed'][rand(0, 2)],
                'due_date' => now()->addDays(rand(-2, 10)),
            ]);
        }
    }
}
