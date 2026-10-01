<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Todo;
use App\Models\TodoDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        // Project Manager melihat semua todo
        if ($user->role === 'project_manager') {
            $todos = Todo::with('user', 'todoDetail')->get();
        } else {
            // Programmer hanya melihat todo miliknya
            $todos = Todo::with('user', 'todoDetail')
                ->where('user_id', $user->id)
                ->get();
        }

        return response()->json([
            'message' => 'Todos retrieved successfully',
            'todos' => $todos
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        // Hanya Project Manager yang bisa membuat todo
        if ($user->role !== 'project_manager') {
            return response()->json([
                'message' => 'Only Project Manager can create todo'
            ], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_id' => 'required|exists:users,id',
            'point' => 'required|integer|min:0',
            'status' => 'required|in:publish,review,done',
        ]);

        $todo = Todo::create([
            'name' => $request->name,
            'status' => $request->status,
            'user_id' => $request->user_id,
            'point' => $request->point,
        ]);

        // Buat todo detail jika ada description
        if ($request->description) {
            TodoDetail::create([
                'todo_id' => $todo->id,
                'description' => $request->description,
            ]);
        }

        return response()->json([
            'message' => 'Todo created successfully',
            'todo' => $todo->load('user', 'todoDetail')
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = Auth::user();
        $todo = Todo::with('user', 'todoDetail')->find($id);

        if (!$todo) {
            return response()->json([
                'message' => 'Todo not found'
            ], 404);
        }

        // Cek kepemilikan untuk programmer
        if ($user->role === 'programmer' && $todo->user_id !== $user->id) {
            return response()->json([
                'message' => 'You are not allowed to view this todo'
            ], 403);
        }

        return response()->json([
            'message' => 'Todo retrieved successfully',
            'todo' => $todo
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = Auth::user();
        $todo = Todo::find($id);

        if (!$todo) {
            return response()->json([
                'message' => 'Todo not found'
            ], 404);
        }

        // Cek kepemilikan untuk programmer
        if ($user->role === 'programmer' && $todo->user_id !== $user->id) {
            return response()->json([
                'message' => 'You are not allowed to update this todo'
            ], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'user_id' => 'sometimes|required|exists:users,id',
            'point' => 'sometimes|required|integer|min:0',
            'status' => 'sometimes|required|in:publish,review,done',
        ]);

        // Programmer hanya bisa update description
        if ($user->role === 'programmer') {
            if ($request->description) {
                $todoDetail = TodoDetail::where('todo_id', $todo->id)->first();
                if ($todoDetail) {
                    $todoDetail->update(['description' => $request->description]);
                } else {
                    TodoDetail::create([
                        'todo_id' => $todo->id,
                        'description' => $request->description,
                    ]);
                }
            }
        } else {
            // Project Manager bisa update semua field
            $todo->update($request->only(['name', 'status', 'user_id', 'point']));

            if ($request->description) {
                $todoDetail = TodoDetail::where('todo_id', $todo->id)->first();
                if ($todoDetail) {
                    $todoDetail->update(['description' => $request->description]);
                } else {
                    TodoDetail::create([
                        'todo_id' => $todo->id,
                        'description' => $request->description,
                    ]);
                }
            }
        }

        return response()->json([
            'message' => 'Todo updated successfully',
            'todo' => $todo->load('user', 'todoDetail')
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = Auth::user();

        // Hanya Project Manager yang bisa menghapus todo
        if ($user->role !== 'project_manager') {
            return response()->json([
                'message' => 'Only Project Manager can delete todo'
            ], 403);
        }

        $todo = Todo::find($id);

        if (!$todo) {
            return response()->json([
                'message' => 'Todo not found'
            ], 404);
        }

        // Hapus todo detail terlebih dahulu
        TodoDetail::where('todo_id', $todo->id)->delete();

        // Hapus todo
        $todo->delete();

        return response()->json([
            'message' => 'Todo deleted successfully'
        ], 200);
    }

    /**
     * Update todo status (untuk drag-and-drop)
     */
    public function updateStatus(Request $request, string $id)
    {
        $user = Auth::user();
        $todo = Todo::find($id);

        if (!$todo) {
            return response()->json([
                'message' => 'Todo not found'
            ], 404);
        }

        $request->validate([
            'status' => 'required|in:publish,review,done',
        ]);

        $newStatus = $request->status;

        // Cek kepemilikan untuk programmer
        if ($user->role === 'programmer') {
            if ($todo->user_id !== $user->id) {
                return response()->json([
                    'message' => 'You are not allowed to update this todo'
                ], 403);
            }

            // Programmer hanya bisa memindahkan dari publish ke review
            if ($todo->status === 'publish' && $newStatus === 'review') {
                $todo->update(['status' => $newStatus]);
            } else {
                return response()->json([
                    'message' => 'Programmer can only move todo from publish to review'
                ], 403);
            }
        } else {
            // Project Manager bisa memindahkan ke status mana saja
            $todo->update(['status' => $newStatus]);
        }

        return response()->json([
            'message' => 'Todo status updated successfully',
            'todo' => $todo
        ], 200);
    }
}
