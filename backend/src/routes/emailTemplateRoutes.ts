import { Router } from "express";
import {
  getTemplate,
  updateTemplate,
  renderPreview,
  sendTestEmail,
} from "../controllers/emailTemplateController";
import { requireAdminAuth } from "../middleware/auth";

const router = Router();

// All email template endpoints require authenticated admin session
router.use(requireAdminAuth);

// Retrieve current template settings
router.get("/", getTemplate);

// Render live HTML preview for split-screen editor
router.post("/preview", renderPreview);

// Update template
router.put("/", updateTemplate);

// Dispatch a live test email
router.post("/test", sendTestEmail);

export default router;
