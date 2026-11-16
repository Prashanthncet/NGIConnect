import { Router } from "express";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "../controllers/adminUserController";
import { requireAdminAuth, requireSuperAdmin } from "../middleware/auth";

const router = Router();

router.use(requireAdminAuth);

router.get("/", getAdminUsers);
router.post("/", requireSuperAdmin, createAdminUser);
router.patch("/:id", requireSuperAdmin, updateAdminUser);
router.delete("/:id", requireSuperAdmin, deleteAdminUser);

export default router;

