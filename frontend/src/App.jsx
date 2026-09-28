import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProjectManagerDashboard from "./pages/ProjectManager/Dashboard";
import programmerDashboard from "./pages/programmer/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/project-manager/dashboard"
        element={<ProjectManagerDashboard />}
      />

      <Route path="/programmer/dashboard" element={<programmerDashboard />} />

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
