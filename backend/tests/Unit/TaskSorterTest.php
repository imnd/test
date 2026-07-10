<?php

namespace Tests\Unit;

use App\Sorters\TaskSorter;
use App\Models\Task;
use Illuminate\Http\Request;
use Tests\TestCase;

class TaskSorterTest extends TestCase
{
    public function test_it_applies_sorting_with_default_values()
    {
        $request = new Request();
        $sorter = new TaskSorter($request);
        
        $query = Task::query();
        $sorter->apply($query);
        
        $orders = $query->getQuery()->orders;
        
        $this->assertIsArray($orders);
        $this->assertCount(1, $orders);
        $this->assertEquals('created_at', $orders[0]['column']);
        $this->assertEquals('desc', $orders[0]['direction']);
    }

    public function test_it_applies_custom_sorting()
    {
        $request = new Request(['sort' => 'due_date', 'dir' => 'asc']);
        $sorter = new TaskSorter($request);
        
        $query = Task::query();
        $sorter->apply($query);
        
        $orders = $query->getQuery()->orders;
        
        $this->assertIsArray($orders);
        $this->assertCount(1, $orders);
        $this->assertEquals('due_date', $orders[0]['column']);
        $this->assertEquals('asc', $orders[0]['direction']);
    }
}
