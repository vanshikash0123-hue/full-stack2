import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand">JWT Auth + RBAC</Link>

                <nav className="navbar-links">
                    {isAuthenticated && <Link to="/profile">Profile</Link>}
                    {isAuthenticated && (user?.role === "editor" || user?.role === "admin") && (
                        <Link to="/editor">Editor</Link>
                    )}
                    {isAuthenticated && user?.role === "admin" && <Link to="/admin">Admin</Link>}
                </nav>

                <div className="navbar-auth">
                    {isAuthenticated ? (
                        <>
                            <span className={`role-badge ${user?.role}`}>{user?.username} · {user?.role}</span>
                            <button className="logout" onClick={handleLogout}>Sign out</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-btn ghost">Sign in</Link>
                            <Link to="/register" className="navbar-btn">Sign up</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}