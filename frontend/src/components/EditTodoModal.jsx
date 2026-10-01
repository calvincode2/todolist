import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "../contexts/AuthContext";
import Swal from "sweetalert2";

function EditTodoModal({ open, onOpenChange, todo, onTodoUpdated }) {
  const [programmers, setProgrammers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    user_id: "",
    point: "",
    status: "",
  });
  const { api, user } = useAuth();

  useEffect(() => {
    if (todo) {
      setFormData({
        name: todo.name || "",
        description: todo.todoDetail?.description || "",
        user_id: todo.user_id?.toString() || "",
        point: todo.point?.toString() || "",
        status: todo.status || "",
      });
    }
  }, [todo]);

  useEffect(() => {
    // Fetch programmers list
    api.get("/users?role=programmer").then((response) => {
      setProgrammers(response.data.users || []);
    }).catch(() => {
      // Fallback: fetch all users and filter
      api.get("/users").then((response) => {
        setProgrammers(response.data.users?.filter(u => u.role === "programmer") || []);
      });
    });
  }, [api]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.put(`/todos/${todo.id}`, formData);

      await Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      }).fire({
        icon: "success",
        title: "Todo berhasil diperbarui",
      });

      onOpenChange(false);

      if (onTodoUpdated) {
        onTodoUpdated();
      }
    } catch (error) {
      Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      }).fire({
        icon: "error",
        title: error.response?.data?.message || "Gagal memperbarui todo",
      });
    }
  };

  // Programmer hanya bisa edit description
  const isProgrammer = user?.role === "programmer";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
          <DialogDescription>
            {isProgrammer
              ? "Perbarui detail pekerjaan"
              : "Perbarui informasi todo"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isProgrammer && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Nama Todo</Label>
                <Input
                  id="name"
                  placeholder="Masukkan nama todo"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="user_id">Programmer</Label>
                <Select
                  value={formData.user_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, user_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih programmer" />
                  </SelectTrigger>
                  <SelectContent>
                    {programmers.map((programmer) => (
                      <SelectItem
                        key={programmer.id}
                        value={programmer.id.toString()}
                      >
                        {programmer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="point">Point</Label>
                <Input
                  id="point"
                  type="number"
                  placeholder="Masukkan point"
                  value={formData.point}
                  onChange={(e) =>
                    setFormData({ ...formData, point: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="publish">Publish</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Masukkan description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <DialogFooter>
            <Button type="submit">Simpan Perubahan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditTodoModal;
