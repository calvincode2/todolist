import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  // Tampilkan loading saat sedang validasi token
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  // Redirect ke login jika belum login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Cek role jika ada batasan role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect ke dashboard sesuai role user
    if (user.role === "project_manager") {
      return <Navigate to="/project-manager/dashboard" replace />;
    } else if (user.role === "programmer") {
      return <Navigate to="/programmer/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
