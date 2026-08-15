import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Access Denied. No Token Provided.",
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Access Denied. Invalid Token Format.",
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
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

export default authMiddleware;