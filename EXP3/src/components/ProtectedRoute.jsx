import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap any route element with this to require login, and optionally
// restrict it to a set of roles:
//   <ProtectedRoute><Profile /></ProtectedRoute>
//   <ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>
export default function ProtectedRoute({ children, allowedRoles }) {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Remember where the user was headed so Login can send them back.
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}