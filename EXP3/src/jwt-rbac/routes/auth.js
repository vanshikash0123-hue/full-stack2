const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const users = require("../data/users");

const ALLOWED_ROLES = ["user", "editor", "admin"];

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env");
}

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );
};

router.get("/", (req, res) => {
    res.status(200).json({ message: "JWT Authentication and RBAC API is working" });
});

router.post("/register", async (req, res) => {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }
        if (username.length < 3) {
            return res.status(400).json({ message: "Username must be at least 3 characters" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const finalRole = ALLOWED_ROLES.includes(role) ? role : "user";

        const existingUser = users.find(
            (u) => u.username.toLowerCase() === username.toLowerCase()
        );
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = {
            id: Date.now(),
            username: username.trim(),
            password: hashedPassword,
            role: finalRole,
        };

        users.push(newUser);

        return res.status(201).json({
            message: "User registered successfully",
            user: { id: newUser.id, username: newUser.username, role: newUser.role },
        });
    } catch (error) {
        console.error("Registration Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const user = users.find(
            (u) => u.username.toLowerCase() === username.toLowerCase()
        );
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        const token = generateToken(user);

        return res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user.id, username: user.username, role: user.role },
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;