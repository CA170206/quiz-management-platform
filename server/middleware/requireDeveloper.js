import pool from "../config/db.js";

const requireDeveloper = async (req, res, next) => {
    try {
        // User must already be authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        // Get the actual user from database
        const result = await pool.query(
            `SELECT id, email, role
             FROM users
             WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "User not found",
            });
        }

        const user = result.rows[0];

        // Must have developer role
        if (user.role !== "developer") {
            return res.status(403).json({
                message: "Developer access denied",
            });
        }

        // Must also match the single developer email
        if (
            user.email.toLowerCase() !==
            process.env.DEVELOPER_EMAIL.toLowerCase()
        ) {
            return res.status(403).json({
                message: "Developer access denied",
            });
        }

        // Developer verified
        req.user = {
            ...req.user,
            id: user.id,
            email: user.email,
            role: user.role,
        };

        next();
    } catch (error) {
        console.error(
            "Developer authorization error:",
            error
        );

        res.status(500).json({
            message: "Failed to verify developer access",
        });
    }
};

export default requireDeveloper;