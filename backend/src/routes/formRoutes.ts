import { Router } from "express";
import {
  getForms,
  getFormById,
  createForm,
  updateForm,
  publishForm,
} from "../controllers/formController";
import { requireAdminAuth } from "../middleware/auth";

const router = Router();

// Public: Get published forms
router.get("/", getForms);
router.get("/:id", getFormById);

// Protected Admin Actions
router.post("/", requireAdminAuth, createForm);
router.put("/:id", requireAdminAuth, updateForm);
router.post("/:id/publish", requireAdminAuth, publishForm);

export default router;

