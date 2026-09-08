// Usage: authorizeRole("admin")            -> only admins
//        authorizeRole("editor", "admin")  -> editors AND admins
// Must run AFTER authenticateToken, since it relies on req.user.
const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied. Insufficient permissions."
            });
        }

        next();
    };
};

module.exports = authorizeRole;