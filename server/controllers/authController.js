import bcrypt from "bcrypt";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";

// ==========================================
// REGISTER STUDENT
// ==========================================

export const register = async (req, res) => {
    try {
        const { full_name, email, password } = req.body;

        // Validate input
        if (!full_name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Check if email already exists
        const userExists = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({
                message: "Email already registered",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        /*
         * Do NOT allow the frontend to specify role.
         *
         * Your users table should have:
         *
         * role DEFAULT 'student'
         *
         * Therefore normal registration creates students.
         */

        const result = await pool.query(
            `INSERT INTO users
            (full_name, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, full_name, email, role`,
            [
                full_name,
                email,
                hashedPassword,
            ]
        );

        const user = result.rows[0];

        // Generate JWT
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        // Return user + token
        res.status(201).json({
            message: "User registered successfully!",
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Register error:", error);

        res.status(500).json({
            message: "Registration failed",
        });
    }
};


// ==========================================
// LOGIN
// ==========================================

export const login = async (req, res) => {
    try {
        const { email, password, loginType } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message:
                    "Email and password are required",
            });
        }

        // Validate login type
        if (
            loginType !== "student" &&
            loginType !== "admin"
        ) {
            return res.status(400).json({
                message: "Invalid login type",
            });
        }

        // Find user
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        const user = result.rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // ==========================================
        // VERIFY SELECTED LOGIN TYPE
        // ==========================================

        if (
            loginType === "admin" &&
            user.role !== "admin"
        ) {
            return res.status(403).json({
                message: "Invalid admin credentials",
            });
        }

        if (
            loginType === "student" &&
            user.role !== "student"
        ) {
            return res.status(403).json({
                message: "Invalid student credentials",
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        // Return user information
        res.status(200).json({
            message: "Login Successful",

            token,

            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Login failed",
        });
    }
};


// ==========================================
// CREATE ADMIN
// ==========================================
//
// USE THIS ONLY ONCE TO CREATE YOUR ADMIN.
// After creating the admin, remove the route
// from authRoutes.js.
//

export const createAdmin = async (req, res) => {
    try {
        const full_name = "Quiz Master Admin";
        const email = "admin1@quizmaster.com";
        const password = "Admin@12345";

        // Check if admin already exists
        const existingAdmin = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingAdmin.rows.length > 0) {
            return res.status(400).json({
                message: "Admin already exists",
            });
        }

        // Hash admin password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        // Insert admin
        const result = await pool.query(
            `INSERT INTO users
            (full_name, email, password, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, full_name, email, role`,
            [
                full_name,
                email,
                hashedPassword,
                "admin",
            ]
        );

        const user = result.rows[0];

        res.status(201).json({
            message: "Admin created successfully",

            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(
            "Create admin error:",
            error
        );

        res.status(500).json({
            message: "Failed to create admin",
        });
    }
};

// ==========================================
// DEVELOPER LOGIN
// ==========================================

export const developerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message:
                    "Email and password are required",
            });
        }

        // Only the configured developer email
        // can use developer login
        if (
            email.toLowerCase() !==
            process.env.DEVELOPER_EMAIL.toLowerCase()
        ) {
            return res.status(403).json({
                message:
                    "Developer access denied",
            });
        }

        // Find developer account
        const result = await pool.query(
            `SELECT *
             FROM users
             WHERE email = $1
             AND role = 'developer'`,
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({
                message:
                    "Developer account not found",
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
                message:
                    "Invalid email or password",
            });
        }

        // Generate developer JWT
        const token = jwt.sign(
            {
                id: user.id,
                role: "developer",
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        res.status(200).json({
            message:
                "Developer login successful",

            token,

            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: "developer",
            },
        });

    } catch (error) {
        console.error(
            "Developer login error:",
            error
        );

        res.status(500).json({
            message:
                "Developer login failed",
        });
    }
};