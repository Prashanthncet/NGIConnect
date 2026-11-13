import { Response, NextFunction } from "express";
import { Registration } from "../models/Registration";
import { AuthenticatedRequest } from "../middleware/auth";

export async function getDashboardStats(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [total, today, week, ncetCount, ncmsCount, verifiedCount, pendingCount] = await Promise.all([
      Registration.countDocuments(),
      Registration.countDocuments({ submittedAt: { $gte: startOfToday } }),
      Registration.countDocuments({ submittedAt: { $gte: startOfWeek } }),
      Registration.countDocuments({ institutionShortName: "NCET" }),
      Registration.countDocuments({ institutionShortName: "NCMS" }),
      Registration.countDocuments({ status: "Verified" }),
      Registration.countDocuments({ status: "Pending" }),
    ]);

    // Build 14-day daily trend
    const trendDays: { date: string; ncet: number; ncms: number; total: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const dStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i, 0, 0, 0);
      const dEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i, 23, 59, 59);

      const [dNcet, dNcms] = await Promise.all([
        Registration.countDocuments({
          institutionShortName: "NCET",
          submittedAt: { $gte: dStart, $lte: dEnd },
        }),
        Registration.countDocuments({
          institutionShortName: "NCMS",
          submittedAt: { $gte: dStart, $lte: dEnd },
        }),
      ]);

      trendDays.push({
        date: dStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        ncet: dNcet,
        ncms: dNcms,
        total: dNcet + dNcms,
      });
    }

    // Category breakdown
    const categories = await Registration.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    return res.json({
      success: true,
      data: {
        total,
        today,
        week,
        ncetCount,
        ncmsCount,
        verifiedCount,
        pendingCount,
        trends: trendDays,
        categories: categories.map((c) => ({ name: c._id || "Other", count: c.count })),
      },
    });
  } catch (error) {
    next(error);
  }
}

