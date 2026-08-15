import express from "express";

import {
    register,
    login,
    developerLogin,
} from "../controllers/authController.js";

const router = express.Router();


// Student registration
router.post("/register", register);


// Student + Admin login
router.post("/login", login);

// Developer login
router.post(
    "/developer-login",
    developerLogin
);



export default router;