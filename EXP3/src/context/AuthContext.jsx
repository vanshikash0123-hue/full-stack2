import { createContext, useContext, useState, useCallback } from "react";

const API_URL = "http://localhost:5000";

const AuthContext = createContext(null);

// Decodes a JWT payload without verifying the signature.
// Verification always happens server-side; this is only so the UI
// can read the role/username without an extra round trip.
function decodeToken(token) {
    try {
        const payload = token.split(".")[1];
        const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token") || "");
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("token");
        return stored ? decodeToken(stored) : null;
    });

    const apiRequest = useCallback(async (url, options = {}) => {
        const response = await fetch(`${API_URL}${url}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }

        return data;
    }, []);

    const authFetch = useCallback(
        (url, options = {}) => {
            return apiRequest(url, {
                ...options,
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...(options.headers || {}),
                },
            });
        },
        [apiRequest, token]
    );

    const register = useCallback(
        (username, password, role) => {
            return apiRequest("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({ username, password, role }),
            });
        },
        [apiRequest]
    );

    const login = useCallback(
        async (username, password) => {
            const data = await apiRequest("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ username, password }),
            });

            localStorage.setItem("token", data.token);
            setToken(data.token);
            setUser(decodeToken(data.token));

            return data;
        },
        [apiRequest]
    );

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setToken("");
        setUser(null);
    }, []);

    const value = {
        token,
        user,
        isAuthenticated: Boolean(token),
        login,
        register,
        logout,
        authFetch,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}