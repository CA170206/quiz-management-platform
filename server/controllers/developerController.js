import pool from "../config/db.js";

// ==========================================
// GET ALL USERS
// ==========================================

export const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                id,
                full_name,
                email,
                role,
                created_at
             FROM users
             ORDER BY id DESC`
        );

        res.status(200).json({
            users: result.rows,
        });
    } catch (error) {
        console.error(
            "Get all users error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch users",
        });
    }
};