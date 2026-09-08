import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
    const { authFetch, user } = useAuth();
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const result = await authFetch("/api/profile");
                if (!cancelled) setData(result);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [authFetch]);

    return (
        <div className="container">
            <h1>Profile</h1>
            <p className="subtitle">Available to any signed-in user, regardless of role.</p>

            <div className="card">
                <h2>
                    Your account <span className={`role-badge ${user?.role}`}>{user?.role}</span>
                </h2>

                {loading && <p>Loading...</p>}

                {error && <div className="message error">{error}</div>}

                {data && (
                    <>
                        <div className="field-row">
                            <span className="field-label">Username</span>
                            <span className="field-value">{data.user.username}</span>
                        </div>
                        <div className="field-row">
                            <span className="field-label">User ID</span>
                            <span className="field-value">{data.user.id}</span>
                        </div>
                        <div className="field-row">
                            <span className="field-label">Role</span>
                            <span className="field-value">{data.user.role}</span>
                        </div>
                        <div className="field-row">
                            <span className="field-label">Token expires</span>
                            <span className="field-value">
                                {new Date(data.user.exp * 1000).toLocaleTimeString()}
                            </span>
                        </div>
                    </>
                )}
            </div>

            {data && (
                <div className="card">
                    <h2>Raw response</h2>
                    <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}