<?php

namespace App\Http\Controllers\Api;

use App\Filters\TaskFilter;
use App\Filters\TaskSorter;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use OpenApi\Attributes as OA;

class TaskController extends Controller
{
    use AuthorizesRequests;

    #[OA\Get(
        path: "/api/tasks",
        summary: "Получение списка задач",
        security: [["sanctum" => []]],
        tags: ["Tasks"]
    )]
    #[OA\Parameter(name: "search", in: "query", required: false, schema: new OA\Schema(type: "string"))]
    #[OA\Parameter(name: "status", in: "query", required: false, schema: new OA\Schema(type: "string", enum: ["pending", "in_progress", "completed"]))]
    #[OA\Parameter(name: "sort", in: "query", required: false, schema: new OA\Schema(type: "string", default: "created_at"))]
    #[OA\Parameter(name: "dir", in: "query", required: false, schema: new OA\Schema(type: "string", enum: ["asc", "desc"], default: "desc"))]
    #[OA\Parameter(name: "page", in: "query", required: false, schema: new OA\Schema(type: "integer", default: 1))]
    #[OA\Response(response: 200, description: "Список задач с пагинацией")]
    #[OA\Response(response: 401, description: "Не авторизован")]
    public function index(
        Request $request,
        TaskFilter $filter,
        TaskSorter $sorter,
    ): LengthAwarePaginator {
        $query = Task::query()->forUser($request->user());

        $filter->apply($query);
        $sorter->apply($query);

        return $query->paginate(15);
    }

    #[OA\Post(
        path: "/api/tasks",
        summary: "Создание новой задачи",
        security: [["sanctum" => []]],
        tags: ["Tasks"]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["title"],
            properties: [
                new OA\Property(property: "title", type: "string", example: "Купить молоко"),
                new OA\Property(property: "description", type: "string", example: "В магазине у дома"),
                new OA\Property(property: "status", type: "string", enum: ["pending", "in_progress", "completed"], example: "pending"),
                new OA\Property(property: "due_date", type: "string", format: "date", example: "2026-08-01")
            ]
        )
    )]
    #[OA\Response(response: 201, description: "Задача создана")]
    #[OA\Response(response: 422, description: "Ошибка валидации")]
    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = $request->user()->tasks()->create($request->validated());

        return response()->json($task, 201);
    }

    /**
     * @throws AuthorizationException
     */
    #[OA\Get(
        path: "/api/tasks/{task}",
        summary: "Получение задачи",
        security: [["sanctum" => []]],
        tags: ["Tasks"]
    )]
    #[OA\Parameter(name: "task", in: "path", required: true, schema: new OA\Schema(type: "integer"))]
    #[OA\Response(response: 200, description: "Детали задачи")]
    #[OA\Response(response: 403, description: "Нет доступа")]
    #[OA\Response(response: 404, description: "Не найдено")]
    public function show(Task $task): Task
    {
        $this->authorize('view', $task);
        return $task;
    }

    /**
     * @throws AuthorizationException
     */
    #[OA\Put(
        path: "/api/tasks/{task}",
        summary: "Обновление задачи",
        security: [["sanctum" => []]],
        tags: ["Tasks"]
    )]
    #[OA\Parameter(name: "task", in: "path", required: true, schema: new OA\Schema(type: "integer"))]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: "title", type: "string"),
                new OA\Property(property: "description", type: "string"),
                new OA\Property(property: "status", type: "string", enum: ["pending", "in_progress", "completed"]),
                new OA\Property(property: "due_date", type: "string", format: "date")
            ]
        )
    )]
    #[OA\Response(response: 200, description: "Задача обновлена")]
    #[OA\Response(response: 403, description: "Нет доступа")]
    #[OA\Response(response: 404, description: "Не найдено")]
    #[OA\Response(response: 422, description: "Ошибка валидации")]
    public function update(UpdateTaskRequest $request, Task $task): Task
    {
        $this->authorize('update', $task);
        $task->update($request->validated());

        return $task;
    }

    /**
     * @throws AuthorizationException
     */
    #[OA\Delete(
        path: "/api/tasks/{task}",
        summary: "Удаление задачи",
        security: [["sanctum" => []]],
        tags: ["Tasks"]
    )]
    #[OA\Parameter(name: "task", in: "path", required: true, schema: new OA\Schema(type: "integer"))]
    #[OA\Response(response: 204, description: "Задача удалена")]
    #[OA\Response(response: 403, description: "Нет доступа")]
    #[OA\Response(response: 404, description: "Не найдено")]
    public function destroy(Task $task): JsonResponse
    {
        $this->authorize('delete', $task);
        $task->delete();

        return response()->json(null, 204);
    }
}
