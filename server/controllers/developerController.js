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

// ==========================================
// GET SINGLE USER
// ==========================================

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT
                id,
                full_name,
                email,
                role,
                created_at
             FROM users
             WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            user: result.rows[0],
        });
    } catch (error) {
        console.error(
            "Get user by ID error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch user",
        });
    }
};