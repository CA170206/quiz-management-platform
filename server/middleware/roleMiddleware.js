const adminOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required",
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied. Admins only.",
        });
    }

    next();
};

const studentOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required",
        });
    }

    if (req.user.role !== "student") {
        return res.status(403).json({
            message: "Access denied. Students only.",
        });
    }

    next();
};

export {
    adminOnly,
    studentOnly,
};