import { Router } from "express";
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
  res.json({
    status: "ok",
    service: "Nagarjuna Connect Backend API",
    timestamp: new Date().toISOString(),
  });
});

export default router;

