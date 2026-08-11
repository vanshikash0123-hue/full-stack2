import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import EditorDashboard from "./pages/EditorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";

import "./App.css";

function Home() {
    const { isAuthenticated } = useAuth();
    return <Navigate to={isAuthenticated ? "/profile" : "/login"} replace />;
}

function AppRoutes() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/editor"
                    element={
                        <ProtectedRoute allowedRoles={["editor", "admin"]}>
                            <EditorDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={
                        <div className="container">
                            <div className="card empty-state">
                                <h2>404 — Page not found</h2>
                            </div>
                        </div>
                    }
                />
            </Routes>
        </>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}