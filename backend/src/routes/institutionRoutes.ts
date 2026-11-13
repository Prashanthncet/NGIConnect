import { Router } from "express";
import { getInstitutions } from "../controllers/institutionController";

const router = Router();

router.get("/", getInstitutions);

export default router;

