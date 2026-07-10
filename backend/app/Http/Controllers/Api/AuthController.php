<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use OpenApi\Attributes as OA;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Validation\ValidationException;

#[OA\Info(
    version: "1.0.0",
    description: "API documentation for the To-Do List Application",
    title: "To-Do API Documentation"
)]
#[OA\SecurityScheme(
    securityScheme: "sanctum",
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT"
)]
class AuthController extends Controller
{
    #[OA\Post(
        path: "/api/auth/login",
        summary: "Вход в систему",
        tags: ["Auth"]
    )]
    #[OA\RequestBody(
        required: true,
        content: new OA\JsonContent(
            required: ["email", "password"],
            properties: [
                new OA\Property(property: "email", type: "string", format: "email", example: "admin@example.com"),
                new OA\Property(property: "password", type: "string", example: "password")
            ]
        )
    )]
    #[OA\Response(response: 200, description: "Успешный вход")]
    #[OA\Response(response: 422, description: "Ошибка валидации")]
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Неверные учетные данные.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    #[OA\Post(
        path: "/api/auth/logout",
        summary: "Выход из системы",
        security: [["sanctum" => []]],
        tags: ["Auth"]
    )]
    #[OA\Response(response: 200, description: "Успешный выход")]
    #[OA\Response(response: 401, description: "Не авторизован")]
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Успешный выход']);
    }

    #[OA\Get(
        path: "/api/user",
        summary: "Получение профиля текущего пользователя",
        security: [["sanctum" => []]],
        tags: ["Auth"]
    )]
    #[OA\Response(response: 200, description: "Профиль пользователя")]
    #[OA\Response(response: 401, description: "Не авторизован")]
    public function user(Request $request)
    {
        return $request->user();
    }
}
