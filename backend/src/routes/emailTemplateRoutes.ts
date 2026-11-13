import { Router } from "express";
import {
  getTemplate,
  updateTemplate,
  renderPreview,
  sendTestEmail,
} from "../controllers/emailTemplateController";
import { requireAdminAuth } from "../middleware/auth";

const router = Router();

// Retrieve current template settings
router.get("/", getTemplate);

// Render live HTML preview for split-screen editor
router.post("/preview", renderPreview);

// Update template (Protected)
router.put("/", requireAdminAuth, updateTemplate);

// Dispatch a live test email (Protected)
router.post("/test", requireAdminAuth, sendTestEmail);

export default router;
