import dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const defaultJwtSecret = "ngi_connect_super_secret_jwt_key_2026_institutional_secure";

if (isProduction && (!process.env.JWT_SECRET || process.env.JWT_SECRET === defaultJwtSecret)) {
  throw new Error("SECURITY FATAL: You must define a unique, high-entropy JWT_SECRET in production.");
}

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ngiconnect",
  JWT_SECRET: process.env.JWT_SECRET || defaultJwtSecret,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  ADMIN_URL: process.env.ADMIN_URL || "http://localhost:3001",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "admin@ngi.org.in",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "AdminNGI@2026",
  ADMIN_NAME: process.env.ADMIN_NAME || "Dr. Rajesh Sharma",
};
