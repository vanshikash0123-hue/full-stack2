const express = require("express");
const authenticateToken = require("../middleware/auth");
const authorizeRole = require("../middleware/role");
const users = require("../data/users");

const router = express.Router();
const ALLOWED_ROLES = ["user", "editor", "admin"];

router.use(authenticateToken, authorizeRole("admin"));

router.get("/users", (req, res) => {
    const safeUsers = users.map(({ id, username, role }) => ({ id, username, role }));
    res.status(200).json({ users: safeUsers });
});

router.patch("/users/:id/role", (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !ALLOWED_ROLES.includes(role)) {
        return res.status(400).json({ message: `Role must be one of: ${ALLOWED_ROLES.join(", ")}` });
    }

    const user = users.find((u) => String(u.id) === String(id));
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    res.status(200).json({
        message: "Role updated",
        user: { id: user.id, username: user.username, role: user.role },
    });
});

module.exports = router;