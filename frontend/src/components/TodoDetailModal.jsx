import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "../contexts/AuthContext";

function TodoDetailModal({ open, onOpenChange, todo, onTodoUpdated }) {
  const { user } = useAuth();

  if (!todo) return null;

  const statusColors = {
    publish: "bg-blue-500",
    review: "bg-yellow-500",
    done: "bg-green-500",
  };

  const isProgrammer = user?.role === "programmer";
  const canEdit = !isProgrammer || todo.user_id === user?.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {todo.name}
            <Badge className={`${statusColors[todo.status]} text-white`}>
              {todo.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>Detail informasi todo</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Programmer</p>
              <p className="font-medium">{todo.user?.name || "Unassigned"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Point</p>
              <p className="font-medium">{todo.point}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-2">Description</p>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm">
                {todo.todoDetail?.description || "Tidak ada description"}
              </p>
            </div>
          </div>

          {todo.todoDetail?.comment && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Comment</p>
              <div className="bg-yellow-50 p-3 rounded-md">
                <p className="text-sm">{todo.todoDetail.comment}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
          {canEdit && (
            <Button
              onClick={() => {
                onOpenChange(false);
                // Trigger edit modal
                const editButton = document.querySelector(
                  '[data-edit-todo="true"]'
                );
                if (editButton) {
                  editButton.click();
                }
              }}
            >
              Edit
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TodoDetailModal;
