import bcrypt from "bcrypt";
import pool from "../config/db.js";


// ==========================================
// GET PROFILE
// ==========================================

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
        console.error(
            "Get profile error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch profile",
        });
    }
};


// ==========================================
// UPDATE PROFILE
// ==========================================

export const updateProfile = async (req, res) => {
    try {
        const { full_name, email } = req.body;

        // Validate input
        if (!full_name || !email) {
            return res.status(400).json({
                message:
                    "Full name and email are required",
            });
        }

        // Check if another user already has this email
        const emailExists = await pool.query(
            `SELECT id
             FROM users
             WHERE email = $1
             AND id != $2`,
            [
                email,
                req.user.id,
            ]
        );

        if (emailExists.rows.length > 0) {
            return res.status(400).json({
                message:
                    "Email is already being used by another account",
            });
        }

        // Update profile
        const result = await pool.query(
            `UPDATE users
             SET full_name = $1,
                 email = $2
             WHERE id = $3
             RETURNING id, full_name, email, role, created_at`,
            [
                full_name,
                email,
                req.user.id,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            user: result.rows[0],
        });
    } catch (error) {
        console.error(
            "Update profile error:",
            error
        );

        res.status(500).json({
            message: "Failed to update profile",
        });
    }
};


// ==========================================
// DELETE ACCOUNT
// ==========================================

export const deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;

        // Password required
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

        // Permanently delete account
        await pool.query(
            `DELETE FROM users
             WHERE id = $1`,
            [req.user.id]
        );

        res.status(200).json({
            message:
                "Account deleted successfully",
        });
    } catch (error) {
        console.error(
            "Delete account error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to delete account",
        });
    }
};