import express from "express";

import {
    register,
    login
} from "../controllers/authController.js";

const router = express.Router();


// Student registration
router.post("/register", register);


// Student + Admin login
router.post("/login", login);





export default router;