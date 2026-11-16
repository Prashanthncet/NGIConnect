import { Router } from "express";
import { login, logout, getMe, sendOtp, verifyOtp } from "../controllers/authController";
import { requireAdminAuth } from "../middleware/auth";
import { authRateLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/login", authRateLimiter, login);
router.post("/send-otp", authRateLimiter, sendOtp);
router.post("/verify-otp", authRateLimiter, verifyOtp);
router.post("/logout", logout);
router.get("/me", requireAdminAuth, getMe);

export default router;

