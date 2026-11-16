import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error("[Server Error]", err);
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  // Prevent internal database details or exception traces from leaking in production
  const message =
    isProduction && statusCode >= 500
      ? "An unexpected internal server error occurred. Please contact system support."
      : err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}

