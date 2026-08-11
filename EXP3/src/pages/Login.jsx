import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const redirectTo = location.state?.from || "/profile";

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Username and password are required");
            return;
        }

        try {
            setLoading(true);
            setError("");
            await login(username, password);
            navigate(redirectTo, { replace: true });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="card auth-card">
                <h2>Log in</h2>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoFocus
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Log in"}
                    </button>
                </form>

                {error && <div className="message error">{error}</div>}

                <p className="auth-switch">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}