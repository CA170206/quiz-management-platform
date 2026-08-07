import bcrypt from "bcrypt";
import pool from "../config/db.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {

    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const userExists = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if (userExists.rows.length > 0) {
        return res.status(400).json({
            message: "Email already registered"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
        `INSERT INTO users (full_name, email, password)
         VALUES ($1, $2, $3)`,
        [full_name, email, hashedPassword]
    );

    res.status(201).json({
        message: "User registered successfully!"
    });

};

export const login = async (req, res) => {

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    // Check if user exists
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if (result.rows.length === 0) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    const user = result.rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({
            message: "Invalid email or password"
        });
    }

    // Generate JWT
    const token = jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    res.status(200).json({
        message: "Login Successful",
        token
    });

};