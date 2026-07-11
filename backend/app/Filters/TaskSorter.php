<?php

namespace App\Filters;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class TaskSorter
{
    protected Request $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function apply(Builder $builder): Builder
    {
        $sort = $this->request->input('sort', 'created_at');
        $dir = $this->request->input('dir', 'desc');
        $builder->orderBy($sort, $dir)->orderBy('id', $dir);

        return $builder;
    }
}
