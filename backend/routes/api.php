<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TodoController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Todo routes
    Route::get('/todos', [TodoController::class, 'index']);
    Route::post('/todos', [TodoController::class, 'store']);
    Route::get('/todos/{id}', [TodoController::class, 'show']);
    Route::put('/todos/{id}', [TodoController::class, 'update']);
    Route::delete('/todos/{id}', [TodoController::class, 'destroy']);
    Route::patch('/todos/{id}/status', [TodoController::class, 'updateStatus']);

    // User routes
    Route::get('/users', [UserController::class, 'index']);
});

Route::middleware(['auth:sanctum', 'role:project_manager'])->group(function () {
    Route::get('/test-manager', function () {
        return response()->json([
            'message' => 'Kamu adalah project manager'
        ]);
    });
});

Route::middleware(['auth:sanctum', 'role:programmer'])->group(function () {
    Route::get('/test-programmer', function () {
        return response()->json([
            'message' => 'Kamu adalah programmer'
        ]);
    });
});
