import { Link } from "react-router-dom";

export default function Unauthorized() {
    return (
        <div className="container">
            <div className="card access-denied empty-state">
                <h2>403 — Access denied</h2>
                <p>Your account role doesn't have permission to view that page.</p>
                <p style={{ marginTop: 16 }}>
                    <Link to="/profile">Back to your profile</Link>
                </p>
            </div>
        </div>
    );
}