<?php

namespace Tests\Feature;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_task()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/tasks', [
            'title' => 'New Task',
            'status' => 'pending',
        ]);

        $response->assertStatus(201)
                 ->assertJsonFragment(['title' => 'New Task']);

        $this->assertDatabaseHas('tasks', ['title' => 'New Task', 'user_id' => $user->id]);
    }

    public function test_task_requires_title()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')->postJson('/api/tasks', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['title']);
    }

    public function test_user_can_see_only_their_tasks()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $admin = User::factory()->create(['is_admin' => true]);

        Task::factory()->create(['user_id' => $user1->id, 'title' => 'User1 Task']);
        Task::factory()->create(['user_id' => $user2->id, 'title' => 'User2 Task']);

        // User1 should only see User1 Task
        $response1 = $this->actingAs($user1, 'sanctum')->getJson('/api/tasks');
        $response1->assertStatus(200)
                  ->assertJsonCount(1, 'data')
                  ->assertJsonFragment(['title' => 'User1 Task'])
                  ->assertJsonMissing(['title' => 'User2 Task']);

        // Admin should see both tasks
        $responseAdmin = $this->actingAs($admin, 'sanctum')->getJson('/api/tasks');
        $responseAdmin->assertStatus(200)
                      ->assertJsonCount(2, 'data');
    }

    public function test_user_cannot_view_others_task()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user2->id]);

        $response = $this->actingAs($user1, 'sanctum')->getJson('/api/tasks/' . $task->id);

        $response->assertStatus(403);
    }

    public function test_user_can_view_own_task()
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')->getJson('/api/tasks/' . $task->id);

        $response->assertStatus(200)
                 ->assertJsonFragment(['id' => $task->id]);
    }

    public function test_admin_can_view_any_task()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($admin, 'sanctum')->getJson('/api/tasks/' . $task->id);

        $response->assertStatus(200)
                 ->assertJsonFragment(['id' => $task->id]);
    }

    public function test_user_cannot_update_others_task()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user2->id]);

        $response = $this->actingAs($user1, 'sanctum')->putJson('/api/tasks/' . $task->id, [
            'title' => 'Updated Title',
        ]);

        $response->assertStatus(403);
    }

    public function test_user_can_update_own_task()
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')->putJson('/api/tasks/' . $task->id, [
            'title' => 'Updated Title',
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['title' => 'Updated Title']);

        $this->assertDatabaseHas('tasks', ['id' => $task->id, 'title' => 'Updated Title']);
    }

    public function test_user_cannot_delete_others_task()
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user2->id]);

        $response = $this->actingAs($user1, 'sanctum')->deleteJson('/api/tasks/' . $task->id);

        $response->assertStatus(403);
    }

    public function test_user_can_delete_own_task()
    {
        $user = User::factory()->create();
        $task = Task::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user, 'sanctum')->deleteJson('/api/tasks/' . $task->id);

        $response->assertStatus(204);

        $this->assertDatabaseMissing('tasks', ['id' => $task->id]);
    }
}
