<?php

namespace Tests\Unit;

use App\Filters\TaskFilter;
use App\Models\Task;
use Illuminate\Http\Request;
use Tests\TestCase;

class TaskFilterTest extends TestCase
{
    public function test_it_applies_status_filter()
    {
        $request = new Request(['status' => 'completed']);
        $filter = new TaskFilter($request);
        
        $query = Task::query();
        $filter->apply($query);
        
        $this->assertStringContainsString('`status` = ?', $query->toSql());
        $this->assertEquals('completed', $query->getBindings()[0]);
    }

    public function test_it_applies_search_filter()
    {
        $request = new Request(['search' => 'Hello']);
        $filter = new TaskFilter($request);
        
        $query = Task::query();
        $filter->apply($query);
        
        $this->assertStringContainsString('`title` like ?', $query->toSql());
        $this->assertEquals('%Hello%', $query->getBindings()[0]);
    }
}
