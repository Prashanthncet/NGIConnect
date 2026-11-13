import { Router } from "express";
import { login, logout, getMe, sendOtp, verifyOtp } from "../controllers/authController";
import { requireAdminAuth } from "../middleware/auth";

const router = Router();

router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/logout", logout);
router.get("/me", requireAdminAuth, getMe);

export default router;

