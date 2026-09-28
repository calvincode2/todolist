import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Register gagal",
        text: "Password dan konfirmasi password tidak sama.",
      });
      return;
    }
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", {
        name: name,
        email: email,
        password: password,
      });
      await Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      }).fire({ icon: "success", title: response.data.message });
      navigate("/login");
    } catch (error) {
      Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      }).fire({
        icon: "error",
        title: error.response?.data?.message || "Register gagal",
      });
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      {" "}
      <Card className="w-full max-w-md">
        {" "}
        <CardHeader>
          {" "}
          <CardTitle className="text-2xl">Register</CardTitle>{" "}
          <CardDescription>
            {" "}
            Buat akun baru untuk menggunakan Todolist{" "}
          </CardDescription>{" "}
        </CardHeader>{" "}
        <CardContent>
          {" "}
          <form onSubmit={handleSubmit} className="space-y-5">
            {" "}
            <div className="space-y-2">
              {" "}
              <Label htmlFor="name">Nama</Label>{" "}
              <Input
                id="name"
                type="text"
                placeholder="Masukkan nama"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />{" "}
            </div>{" "}
            <div className="space-y-2">
              {" "}
              <Label htmlFor="email">Email</Label>{" "}
              <Input
                id="email"
                type="email"
                placeholder="Masukkan email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />{" "}
            </div>{" "}
            <div className="space-y-2">
              {" "}
              <Label htmlFor="password">Password</Label>{" "}
              <Input
                id="password"
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />{" "}
            </div>{" "}
            <div className="space-y-2">
              {" "}
              <Label htmlFor="confirmPassword">
                {" "}
                Konfirmasi Password{" "}
              </Label>{" "}
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Masukkan ulang password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />{" "}
            </div>{" "}
            <Button type="submit" className="w-full">
              {" "}
              Register{" "}
            </Button>{" "}
            <p className="text-center text-sm text-gray-600">
              Sudah punya akun?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-medium text-primary hover:underline"
              >
                Login
              </button>
            </p>
          </form>{" "}
        </CardContent>{" "}
      </Card>{" "}
    </div>
  );
}
export default Register;
