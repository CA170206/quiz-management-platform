import bcrypt from "bcrypt";
import pool from "../config/db.js";

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