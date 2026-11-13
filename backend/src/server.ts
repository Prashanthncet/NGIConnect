import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ENV } from "./config/env";
import { connectToDatabase } from "./config/db";
import apiRoutes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Allowed Origins for CORS
const allowedOrigins = [
  ENV.FRONTEND_URL,
  ENV.ADMIN_URL,
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:3002",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server Next.js rewrites)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Automatically allow Vercel production and preview domains
      if (origin.endsWith(".vercel.app") || origin.includes("vercel.app")) {
        return callback(null, true);
      }
      if (ENV.NODE_ENV !== "production") {
        return callback(null, true); // Dev-friendly permissive fallback in development
      }
      callback(new Error(`CORS policy violation: domain ${origin} not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// Request Logger in Dev
if (ENV.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
  });
}

// API Routes
app.use("/api", apiRoutes);

// Root Welcome Route
app.get("/", (req, res) => {
  res.json({
    service: "NGi Connect Core REST API",
    version: "1.0.0",
    docs: "/api/health",
  });
});

// Centralized Error Handling
app.use(errorHandler);

// Start Server & Connect Database
async function startServer() {
  try {
    await connectToDatabase();
    app.listen(ENV.PORT, "0.0.0.0", () => {
      console.log(`===============================================`);
      console.log(`🚀 NGi Connect Backend REST API running on:`);
      console.log(`   http://localhost:${ENV.PORT} / http://127.0.0.1:${ENV.PORT}`);
      console.log(`   Health Check: http://127.0.0.1:${ENV.PORT}/api/health`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error("Failed to start backend server:", error);
    process.exit(1);
  }
}

startServer();

export default app;

