import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProjectManagerDashboard from "./pages/ProjectManager/Dashboard";
import ProgrammerDashboard from "./pages/Programmer/Dashboard";
import ProjectManagerTodoBoard from "./pages/ProjectManager/TodoBoard";
import ProgrammerTodoBoard from "./pages/Programmer/TodoBoard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/project-manager/dashboard"
        element={
          <ProtectedRoute allowedRoles={["project_manager"]}>
            <ProjectManagerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/project-manager/todos"
        element={
          <ProtectedRoute allowedRoles={["project_manager"]}>
            <ProjectManagerTodoBoard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/programmer/dashboard"
        element={
          <ProtectedRoute allowedRoles={["programmer"]}>
            <ProgrammerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/programmer/todos"
        element={
          <ProtectedRoute allowedRoles={["programmer"]}>
            <ProgrammerTodoBoard />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
