import { Router } from "express";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "../controllers/adminUserController";
import { requireAdminAuth } from "../middleware/auth";

const router = Router();

router.use(requireAdminAuth);

router.get("/", getAdminUsers);
router.post("/", createAdminUser);
router.patch("/:id", updateAdminUser);
router.delete("/:id", deleteAdminUser);

export default router;

