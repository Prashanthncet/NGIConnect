import { Router } from "express";
import {
  submitRegistration,
  getRegistrations,
  getRegistrationById,
  updateRegistrationStatus,
  deleteRegistration,
  exportRegistrations,
} from "../controllers/registrationController";
import { requireAdminAuth } from "../middleware/auth";

const router = Router();

// Public: Submit candidate registration
router.post("/", submitRegistration);

// Protected Admin: Export registrations to Excel (must precede /:id)
router.get("/export", requireAdminAuth, exportRegistrations);

// Protected Admin: Query, read, update, delete
router.get("/", requireAdminAuth, getRegistrations);
router.get("/:id", requireAdminAuth, getRegistrationById);
router.patch("/:id", requireAdminAuth, updateRegistrationStatus);
router.delete("/:id", requireAdminAuth, deleteRegistration);

export default router;

