import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UploadFile from "../pages/UploadFile";
import MyFiles from "../pages/MyFiles";
import VerifyFile from "../pages/VerifyFile";
import AuditLogs from "../pages/AuditLogs";
import Profile from "../pages/Profile";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/upload" element={<UploadFile />} />
      <Route path="/files" element={<MyFiles />} />
      <Route path="/verify" element={<VerifyFile />} />
      <Route path="/logs" element={<AuditLogs />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default AppRoutes;