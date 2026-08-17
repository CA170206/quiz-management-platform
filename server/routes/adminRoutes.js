import express from "express";

import {
    getAdminAnalytics,
} from "../controllers/adminController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
    "/analytics",
    authMiddleware,
    getAdminAnalytics
);

export default router;