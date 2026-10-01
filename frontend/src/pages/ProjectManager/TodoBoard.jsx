import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import TodoCard from "../../components/TodoCard";
import CreateTodoModal from "../../components/CreateTodoModal";
import EditTodoModal from "../../components/EditTodoModal";
import TodoDetailModal from "../../components/TodoDetailModal";
import Swal from "sweetalert2";

function TodoBoard() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const { api, user, logout } = useAuth();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await api.get("/todos");
      setTodos(response.data.todos);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setLoading(false);
    }
  };

  const handleDragStart = (e, todoId) => {
    e.dataTransfer.setData("todoId", todoId.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const todoId = e.dataTransfer.getData("todoId");

    try {
      await api.patch(`/todos/${todoId}/status`, { status: newStatus });

      await Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      }).fire({
        icon: "success",
        title: "Status updated",
      });

      fetchTodos();
    } catch (error) {
      Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      }).fire({
        icon: "error",
        title: error.response?.data?.message || "Failed to update status",
      });
    }
  };

  const handleEdit = (todo) => {
    setSelectedTodo(todo);
    setEditModalOpen(true);
  };

  const handleViewDetail = (todo) => {
    setSelectedTodo(todo);
    setDetailModalOpen(true);
  };

  const handleDelete = async (todoId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/todos/${todoId}`);

        await Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        }).fire({
          icon: "success",
          title: "Todo deleted",
        });

        fetchTodos();
      } catch (error) {
        Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        }).fire({
          icon: "error",
          title: error.response?.data?.message || "Failed to delete todo",
        });
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const columns = [
    { id: "publish", title: "Publish" },
    { id: "review", title: "Review" },
    { id: "done", title: "Done" },
  ];

  const stats = {
    total: todos.length,
    publish: todos.filter((t) => t.status === "publish").length,
    review: todos.filter((t) => t.status === "review").length,
    done: todos.filter((t) => t.status === "done").length,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-sm text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Todo Board</h1>
              <p className="text-sm text-gray-500">{user?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <CreateTodoModal onTodoCreated={fetchTodos} />
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-6 text-sm">
          <span className="text-gray-500">
            Total: <span className="font-medium text-gray-900">{stats.total}</span>
          </span>
          <span className="text-gray-500">
            Publish: <span className="font-medium text-gray-900">{stats.publish}</span>
          </span>
          <span className="text-gray-500">
            Review: <span className="font-medium text-gray-900">{stats.review}</span>
          </span>
          <span className="text-gray-500">
            Done: <span className="font-medium text-gray-900">{stats.done}</span>
          </span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((column) => (
            <div
              key={column.id}
              className="bg-gray-50 rounded-lg p-3 min-h-[400px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-gray-700">
                  {column.title}
                </h2>
                <span className="text-xs text-gray-400">
                  {todos.filter((todo) => todo.status === column.id).length}
                </span>
              </div>

              <div className="space-y-2">
                {todos
                  .filter((todo) => todo.status === column.id)
                  .map((todo) => (
                    <div key={todo.id} className="relative group">
                      <TodoCard
                        todo={todo}
                        onClick={() => handleViewDetail(todo)}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, todo.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, column.id)}
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(todo);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(todo.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <EditTodoModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        todo={selectedTodo}
        onTodoUpdated={fetchTodos}
      />

      <TodoDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        todo={selectedTodo}
      />
    </div>
  );
}

export default TodoBoard;
