import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function EditorDashboard() {
    const { authFetch } = useAuth();
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const result = await authFetch("/api/editor");
                if (!cancelled) setData(result);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => { cancelled = true; };
    }, [authFetch]);

    return (
        <div className="container">
            <h1>Editor dashboard</h1>
            <p className="subtitle">Restricted to the editor and admin roles.</p>

            <div className="card">
                {loading && <p>Loading...</p>}
                {error && <div className="message error">{error}</div>}
                {data && (
                    <>
                        <p>{data.message}</p>
                        <pre style={{ marginTop: 16 }}>{JSON.stringify(data, null, 2)}</pre>
                    </>
                )}
            </div>
        </div>
    );
}