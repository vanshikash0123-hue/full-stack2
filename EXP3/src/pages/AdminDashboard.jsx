import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

const ROLES = ["user", "editor", "admin"];

export default function AdminDashboard() {
    const { authFetch, user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const result = await authFetch("/api/admin/users");
            setUsers(result.users);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    useEffect(() => { loadUsers(); }, [loadUsers]);

    const handleRoleChange = async (id, newRole) => {
        try {
            setUpdatingId(id);
            setError("");
            await authFetch(`/api/admin/users/${id}/role`, {
                method: "PATCH",
                body: JSON.stringify({ role: newRole }),
            });
            await loadUsers();
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="container">
            <h1>Admin dashboard</h1>
            <p className="subtitle">Restricted to the admin role only.</p>

            <div className="card">
                {loading && <p>Loading...</p>}
                {error && <div className="message error">{error}</div>}

                {!loading && !error && users.length > 0 && (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Change role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.username}{u.id === currentUser?.id ? " (you)" : ""}</td>
                                    <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                                    <td>
                                        <select
                                            value={u.role}
                                            disabled={updatingId === u.id}
                                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                        >
                                            {ROLES.map((r) => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}