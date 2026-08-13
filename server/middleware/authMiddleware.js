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

export default authMiddleware;