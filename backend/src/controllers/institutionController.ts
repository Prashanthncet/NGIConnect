import { Request, Response, NextFunction } from "express";
import { Institution } from "../models/Institution";
import { initialInstitutions } from "../utils/seedData";

export async function getInstitutions(req: Request, res: Response, next: NextFunction) {
  try {
    let institutions = await Institution.find({ isActive: true });

    if (institutions.length === 0) {
      institutions = await Institution.insertMany(initialInstitutions);
    }

    return res.json({ success: true, data: institutions });
  } catch (error) {
    next(error);
  }
}

