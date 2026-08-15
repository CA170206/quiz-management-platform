import pool from "../config/db.js";
import bcrypt from "bcrypt";
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

// ==========================================
// DELETE USER
// ==========================================

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Never allow the developer to delete itself
        if (Number(id) === Number(req.user.id)) {
            return res.status(403).json({
                message: "You cannot delete your own developer account",
            });
        }

        // Check that the user exists
        const existingUser = await pool.query(
            `SELECT id, full_name, email, role
             FROM users
             WHERE id = $1`,
            [id]
        );

        if (existingUser.rows.length === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Delete user
        const result = await pool.query(
            `DELETE FROM users
             WHERE id = $1
             RETURNING id, full_name, email, role`,
            [id]
        );

        res.status(200).json({
            message: "User deleted successfully",
            user: result.rows[0],
        });
    } catch (error) {
        console.error(
            "Delete user error:",
            error
        );

        res.status(500).json({
            message: "Failed to delete user",
        });
    }
};

// ==========================================
// CREATE ADMIN
// ==========================================

export const createAdmin = async (req, res) => {
    try {
        const {
            full_name,
            email,
            password,
        } = req.body;

        // Validate input
        if (!full_name || !email || !password) {
            return res.status(400).json({
                message:
                    "Full name, email and password are required",
            });
        }

        // Check if email already exists
        const existingUser = await pool.query(
            `SELECT id, role
             FROM users
             WHERE email = $1`,
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                message:
                    "An account with this email already exists",
            });
        }

        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);

        // Create admin
        const result = await pool.query(
            `INSERT INTO users
                (full_name, email, password, role)
             VALUES
                ($1, $2, $3, $4)
             RETURNING
                id,
                full_name,
                email,
                role,
                created_at`,
            [
                full_name.trim(),
                email.trim().toLowerCase(),
                hashedPassword,
                "admin",
            ]
        );

        res.status(201).json({
            message:
                "Admin created successfully",
            user: result.rows[0],
        });
    } catch (error) {
        console.error(
            "Create admin error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to create admin",
        });
    }
};