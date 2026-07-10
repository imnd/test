<?php

namespace Tests\Unit;

use App\Models\Task;
use App\Models\User;
use App\Policies\TaskPolicy;
use Tests\TestCase;

class TaskPolicyTest extends TestCase
{
    public function test_admin_can_view_any_task()
    {
        $policy = new TaskPolicy();
        $admin = new User();
        $admin->id = 1;
        $admin->is_admin = true;

        $task = new Task();
        $task->user_id = 2;
        
        $this->assertTrue($policy->view($admin, $task));
    }

    public function test_user_can_view_own_task()
    {
        $policy = new TaskPolicy();
        $user = new User();
        $user->id = 2;
        $user->is_admin = false;

        $task = new Task();
        $task->user_id = 2;
        
        $this->assertTrue($policy->view($user, $task));
    }

    public function test_user_cannot_view_others_task()
    {
        $policy = new TaskPolicy();
        $user = new User();
        $user->id = 2;
        $user->is_admin = false;

        $task = new Task();
        $task->user_id = 3;
        
        $this->assertFalse($policy->view($user, $task));
    }
}
