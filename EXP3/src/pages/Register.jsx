import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLES = ["user", "editor", "admin"];

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError("Username and password are required");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            await register(username, password, role);

            setSuccess("Account created. Redirecting to login...");
            setTimeout(() => navigate("/login"), 900);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="card auth-card">
                <h2>Create an account</h2>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        placeholder="At least 3 characters"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoFocus
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <label>Role (for this lab, pick any role to test RBAC)</label>
                    <div className="role-options">
                        {ROLES.map((r) => (
                            <div
                                key={r}
                                className={`role-option ${role === r ? "selected" : ""}`}
                                onClick={() => setRole(r)}
                            >
                                {r}
                            </div>
                        ))}
                    </div>

                    <button type="submit" disabled={loading} style={{ marginTop: 18 }}>
                        {loading ? "Creating..." : "Register"}
                    </button>
                </form>

                {error && <div className="message error">{error}</div>}
                {success && <div className="message success">{success}</div>}

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </div>
        </div>
    );
}