import pool from "../config/db.js";
import bcrypt from "bcrypt";
import { sendAdminCredentialsEmail } from "../utils/email.js";


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
                message:
                    "You cannot delete your own developer account",
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
            message:
                "User deleted successfully",
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
    let client;

    try {
        const {
            full_name,
            email,
            password,
            recipient_email,
        } = req.body;


        // ------------------------------------------
        // Validate input
        // ------------------------------------------

        if (
            !full_name ||
            !email ||
            !password ||
            !recipient_email
        ) {
            return res.status(400).json({
                message:
                    "Full name, login email, password and personal/official email are required",
            });
        }


        const trimmedName =
            full_name.trim();

        const loginEmail =
            email.trim().toLowerCase();

        const deliveryEmail =
            recipient_email.trim().toLowerCase();


        if (!trimmedName) {
            return res.status(400).json({
                message:
                    "Full name is required",
            });
        }


        if (password.length < 8) {
            return res.status(400).json({
                message:
                    "Password must be at least 8 characters",
            });
        }


        // Basic email validation
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(loginEmail)) {
            return res.status(400).json({
                message:
                    "Please enter a valid login email address",
            });
        }


        if (!emailRegex.test(deliveryEmail)) {
            return res.status(400).json({
                message:
                    "Please enter a valid personal or official email address",
            });
        }


        // ------------------------------------------
        // Get database client
        // ------------------------------------------

        client = await pool.connect();

        await client.query("BEGIN");


        // ------------------------------------------
        // Check if email already exists
        // ------------------------------------------

        const existingUser =
            await client.query(
                `SELECT id, role
                 FROM users
                 WHERE email = $1`,
                [loginEmail]
            );


        if (existingUser.rows.length > 0) {
            await client.query("ROLLBACK");

            return res.status(400).json({
                message:
                    "An account with this email already exists",
            });
        }


        // ------------------------------------------
        // Hash password
        // ------------------------------------------

        const hashedPassword =
            await bcrypt.hash(password, 10);


        // ------------------------------------------
        // Create admin
        // ------------------------------------------

        const result =
            await client.query(
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
                    trimmedName,
                    loginEmail,
                    hashedPassword,
                    "admin",
                ]
            );


        const admin = result.rows[0];


        // ------------------------------------------
        // Send credentials email
        // ------------------------------------------

        await sendAdminCredentialsEmail({
            recipientEmail:
                deliveryEmail,

            adminName:
                admin.full_name,

            loginEmail:
                admin.email,

            temporaryPassword:
                password,
        });


        // ------------------------------------------
        // Everything succeeded
        // ------------------------------------------

        await client.query("COMMIT");


        res.status(201).json({
            message:
                "Admin created successfully and login credentials were sent by email",

            user: admin,

            credentialsSentTo:
                deliveryEmail,
        });


    } catch (error) {

        if (client) {
            try {
                await client.query("ROLLBACK");
            } catch (rollbackError) {
                console.error(
                    "Rollback error:",
                    rollbackError
                );
            }
        }


        console.error(
            "Create admin error:",
            error
        );


        res.status(500).json({
            message:
                "Failed to create admin or send credentials email",
        });

    } finally {

        if (client) {
            client.release();
        }

    }
};