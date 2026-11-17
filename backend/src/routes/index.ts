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
  const isResendConfigured = Boolean(process.env.RESEND_API_KEY);
  const isBrevoConfigured = Boolean(process.env.BREVO_API_KEY);
  const isSmtpConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

  const activeProvider = isResendConfigured
    ? "Resend (HTTP port 443)"
    : isBrevoConfigured
    ? "Brevo (HTTP port 443)"
    : isSmtpConfigured
    ? `SMTP (Port ${process.env.SMTP_PORT || "587"})`
    : "None";

  res.json({
    status: "ok",
    service: "Nagarjuna Connect Backend API",
    timestamp: new Date().toISOString(),
    mailer: {
      configured: isResendConfigured || isBrevoConfigured || isSmtpConfigured,
      activeProvider,
      resend: isResendConfigured,
      brevo: isBrevoConfigured,
      smtp: isSmtpConfigured,
    },
    database: {
      connected: mongoose.connection.readyState === 1,
    },
  });
});

export default router;

