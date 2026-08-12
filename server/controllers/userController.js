import bcrypt from "bcrypt";
import pool from "../config/db.js";

export const getProfile = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, full_name, email, role, created_at
             FROM users
             WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Get profile error:", error);

        res.status(500).json({
            message: "Failed to fetch profile",
        });
    }
};


// Delete account permanently
export const deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                message: "Password is required",
            });
        }

        // Get user's hashed password
        const result = await pool.query(
            `SELECT password
             FROM users
             WHERE id = $1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const user = result.rows[0];

        // Verify password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Incorrect password",
            });
        }

        // Delete user
        await pool.query(
            `DELETE FROM users
             WHERE id = $1`,
            [req.user.id]
        );

        res.status(200).json({
            message: "Account deleted successfully",
        });
    } catch (error) {
        console.error("Delete account error:", error);

        res.status(500).json({
            message: "Failed to delete account",
        });
    }
};