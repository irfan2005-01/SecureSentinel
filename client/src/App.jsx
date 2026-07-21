import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";

import Dashboard from "./pages/dashboard/Dashboard";
import Upload from "./pages/dashboard/Upload";
import Verify from "./pages/dashboard/Verify";
import Logs from "./pages/dashboard/Logs";
import Alerts from "./pages/dashboard/Alerts";
import Profile from "./pages/dashboard/Profile";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
       <Route
  path="/upload"
  element={
    <ProtectedRoute>
      <Upload />
    </ProtectedRoute>
  }
/>
        <Route
  path="/verify"
  element={
    <ProtectedRoute>
      <Verify />
    </ProtectedRoute>
  }
/>
        <Route
  path="/logs"
  element={
    <ProtectedRoute>
      <Logs />
    </ProtectedRoute>
  }
/>
       <Route
  path="/alerts"
  element={
    <ProtectedRoute>
      <Alerts />
    </ProtectedRoute>
  }
/>
       <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;