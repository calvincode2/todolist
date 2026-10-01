import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function ProgrammerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();

    await Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    }).fire({
      icon: "success",
      title: "Berhasil logout",
    });

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Programmer</h1>

          <p className="mt-2 text-gray-600">
            Selamat datang, {user?.name || "Programmer"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default ProgrammerDashboard;
