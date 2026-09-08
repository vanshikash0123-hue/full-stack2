const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authenticateToken = require("./middleware/auth");
const authorizeRole = require("./middleware/role");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "JWT Authentication and RBAC API is working" });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/profile", authenticateToken, (req, res) => {
    res.status(200).json({ message: "Welcome to your profile", user: req.user });
});

app.get(
    "/api/editor",
    authenticateToken,
    authorizeRole("editor", "admin"),
    (req, res) => {
        res.status(200).json({ message: "Welcome to the editor dashboard", user: req.user });
    }
);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing in .env file");
    process.exit(1);
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});