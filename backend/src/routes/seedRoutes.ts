import { Router } from "express";
import { seedDatabase } from "../controllers/seedController";
import { ENV } from "../config/env";
import { requireAdminAuth } from "../middleware/auth";

const router = Router();

// In development, allow auto-seed; in production, require admin credentials
router.get("/", (req, res, next) => {
  if (ENV.NODE_ENV === "production") {
    return requireAdminAuth(req as any, res, () => seedDatabase(req, res, next));
  }
  return seedDatabase(req, res, next);
});

router.post("/", (req, res, next) => {
  if (ENV.NODE_ENV === "production") {
    return requireAdminAuth(req as any, res, () => seedDatabase(req, res, next));
  }
  return seedDatabase(req, res, next);
});

export default router;
