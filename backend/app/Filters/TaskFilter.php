<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class TaskFilter
{
    protected Request $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function apply(Builder $builder): Builder
    {
        $this->filterStatus($builder);
        $this->filterSearch($builder);

        return $builder;
    }

    protected function filterStatus(Builder $builder): void
    {
        if ($this->request->filled('status')) {
            $builder->where('status', $this->request->status);
        }
    }

    protected function filterSearch(Builder $builder): void
    {
        if ($this->request->filled('search')) {
            $builder->where('title', 'like', '%' . $this->request->search . '%');
        }
    }
}
