import { Router } from "express";
import mongoose from "mongoose";
import authRoutes from "./authRoutes";
import formRoutes from "./formRoutes";
import registrationRoutes from "./registrationRoutes";
import statsRoutes from "./statsRoutes";
import institutionRoutes from "./institutionRoutes";
import seedRoutes from "./seedRoutes";
import adminUserRoutes from "./adminUserRoutes";
import emailTemplateRoutes from "./emailTemplateRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/admin/users", adminUserRoutes);
router.use("/email-template", emailTemplateRoutes);
router.use("/forms", formRoutes);
router.use("/registrations", registrationRoutes);
router.use("/stats", statsRoutes);
router.use("/institutions", institutionRoutes);
router.use("/seed", seedRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  const isSmtpConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
  res.json({
    status: "ok",
    service: "Nagarjuna Connect Backend API",
    timestamp: new Date().toISOString(),
    mailer: {
      configured: isSmtpConfigured,
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      userConfigured: Boolean(process.env.SMTP_USER),
      passConfigured: Boolean(process.env.SMTP_PASS),
    },
    database: {
      connected: mongoose.connection.readyState === 1,
    },
  });
});

export default router;

