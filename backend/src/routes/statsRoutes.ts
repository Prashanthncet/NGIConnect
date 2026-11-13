import { Router } from "express";
import { getDashboardStats } from "../controllers/statsController";
import { requireAdminAuth } from "../middleware/auth";

const router = Router();

router.get("/", requireAdminAuth, getDashboardStats);

export default router;

