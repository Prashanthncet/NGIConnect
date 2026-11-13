"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  EmailOutlined as EmailIcon,
  LockOutlined as LockIcon,
  VisibilityOutlined as VisibilityIcon,
  VisibilityOffOutlined as VisibilityOffIcon,
  ArrowForward as ArrowForwardIcon,
  PinOutlined as PinIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  SecurityOutlined as SecurityIcon,
  KeyOutlined as KeyIcon,
  CheckCircleOutlined as CheckCircleIcon,
  ContentCopyOutlined as CopyIcon,
} from "@mui/icons-material";

export default function AdminLoginPage() {
  const router = useRouter();

  // Form State
  const [email, setEmail] = useState("admin@ngi.org.in");
  const [password, setPassword] = useState("AdminNGI@2026");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Authentication Flow Steps:
  // "credentials" (Step 1: Enter Email & Password) -> "otp" (Step 2: Enter 6-digit OTP -> Dashboard)
  const [step, setStep] = useState<"credentials" | "otp">("credentials");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Quick fill default admin credentials
  const fillDefaultCredentials = () => {
    setEmail("admin@ngi.org.in");
    setPassword("AdminNGI@2026");
    setError(null);
  };

  // STEP 1: Submit Email and Password -> Validate & Dispatch OTP
  const handleValidateAndSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessInfo(null);
    setLoading(true);

    try {
      // Ensure seed data is initialized if first load
      await fetch("/api/seed");

      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Invalid email or password. Please check your credentials.");
        return;
      }

      setSuccessInfo(data.message || `Verification code sent to ${email}`);
      if (data.debugOtp) {
        setDevOtp(data.debugOtp);
      }
      setStep("otp");
    } catch {
      setError("Unable to connect to authentication server. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP -> Receive Auth Cookie & Navigate to Dashboard
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Invalid or expired verification code. Please try again.");
        return;
      }

      // Success! Open Dashboard
      router.push("/admin/dashboard");
    } catch {
      setError("Verification failed due to a network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setSuccessInfo("A fresh 6-digit verification code has been dispatched.");
        if (data.debugOtp) setDevOtp(data.debugOtp);
      } else {
        setError(data.error || "Failed to resend code.");
      }
    } catch {
      setError("Failed to resend code due to network error.");
    } finally {
      setLoading(false);
    }
  };

  const copyPasswordToClipboard = () => {
    navigator.clipboard.writeText("AdminNGI@2026");
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F7F8FA",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        py: { xs: 4, sm: 8 },
        px: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="sm">
        {/* Top Branding Section */}
        <Box sx={{ textAlign: "center", mb: { xs: 3, sm: 4 } }}>
          <Box
            component="img"
            src="/images/ngi-logo.png"
            alt="NGi Logo"
            sx={{
              width: { xs: 60, sm: 72 },
              height: { xs: 60, sm: 72 },
              objectFit: "contain",
              mx: "auto",
              mb: 2,
              filter: "drop-shadow(0 8px 16px rgba(16, 43, 70, 0.18))",
            }}
          />

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#102B46",
              letterSpacing: "-0.02em",
              fontSize: { xs: "1.5rem", sm: "1.875rem" },
            }}
          >
            NGi Connect <Box component="span" sx={{ color: "#F28C28" }}>Admin Studio</Box>
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#64748B",
              mt: 0.5,
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
            }}
          >
            Executive Academic Registry & Dynamic Form Engine
          </Typography>

          {/* Step Progress Pill */}
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1.5, mt: 2.5 }}>
            <Chip
              size="small"
              icon={<KeyIcon sx={{ fontSize: "14px !important" }} />}
              label="1. Email & Password"
              sx={{
                fontWeight: 700,
                fontSize: "0.75rem",
                bgcolor: step === "credentials" ? "#102B46" : "#E2E8F0",
                color: step === "credentials" ? "#FFFFFF" : "#64748B",
                "& .MuiChip-icon": {
                  color: step === "credentials" ? "#F28C28" : "#94A3B8",
                },
              }}
            />
            <Chip
              size="small"
              icon={<SecurityIcon sx={{ fontSize: "14px !important" }} />}
              label="2. OTP Verification"
              sx={{
                fontWeight: 700,
                fontSize: "0.75rem",
                bgcolor: step === "otp" ? "#102B46" : "#E2E8F0",
                color: step === "otp" ? "#FFFFFF" : "#64748B",
                "& .MuiChip-icon": {
                  color: step === "otp" ? "#F28C28" : "#94A3B8",
                },
              }}
            />
          </Box>
        </Box>

        {/* Main Authentication Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: { xs: "20px", sm: "28px" },
            border: "1px solid #E2E8F0",
            bgcolor: "#FFFFFF",
            boxShadow: "0 12px 32px rgba(16, 43, 70, 0.06)",
          }}
        >
          {/* Alerts */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: "12px",
                fontSize: "0.825rem",
              }}
              onClose={() => setError(null)}
            >
              {error}
            </Alert>
          )}

          {successInfo && (
            <Alert
              severity="success"
              sx={{
                mb: 3,
                borderRadius: "12px",
                fontSize: "0.825rem",
              }}
              onClose={() => setSuccessInfo(null)}
            >
              {successInfo}
            </Alert>
          )}

          {/* STEP 1: EMAIL & PASSWORD INPUT */}
          {step === "credentials" && (
            <Box component="form" onSubmit={handleValidateAndSendOtp} noValidate>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: "#102B46",
                  fontSize: "1.1rem",
                  mb: 0.5,
                }}
              >
                Sign In to Admin Console
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#64748B",
                  fontSize: "0.825rem",
                  mb: 3,
                }}
              >
                Enter your administrative credentials to request a two-factor verification OTP.
              </Typography>

              {/* Email Field */}
              <Box sx={{ mb: 2.5 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "#1E293B",
                    display: "block",
                    mb: 1,
                  }}
                >
                  Administrator Email
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ngi.org.in"
                  variant="outlined"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "#94A3B8", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              {/* Password Field */}
              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "#1E293B",
                      display: "block",
                    }}
                  >
                    Admin Password
                  </Typography>
                  <Tooltip title="Copy default admin password">
                    <Button
                      size="small"
                      onClick={copyPasswordToClipboard}
                      startIcon={copiedKey ? <CheckCircleIcon sx={{ fontSize: 13 }} /> : <CopyIcon sx={{ fontSize: 13 }} />}
                      sx={{
                        textTransform: "none",
                        fontSize: "0.72rem",
                        color: copiedKey ? "#10B981" : "#F28C28",
                        p: 0,
                        minWidth: 0,
                        fontWeight: 700,
                      }}
                    >
                      {copiedKey ? "Copied!" : "Copy Password"}
                    </Button>
                  </Tooltip>
                </Box>
                <TextField
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  variant="outlined"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "#94A3B8", fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            aria-label="toggle password visibility"
                            size="small"
                          >
                            {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              {/* Institutional Credentials Information Box */}
              <Box
                sx={{
                  bgcolor: "rgba(242, 140, 40, 0.07)",
                  border: "1px dashed rgba(242, 140, 40, 0.35)",
                  borderRadius: "14px",
                  p: 2,
                  mb: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1.5,
                }}
              >
                <Box>
                  <Typography variant="caption" sx={{ color: "#B45309", fontWeight: 700, display: "block" }}>
                    Standard Admin Credentials:
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#102B46", fontSize: "0.78rem", mt: 0.2 }}>
                    <strong>Email:</strong> admin@ngi.org.in &nbsp;|&nbsp; <strong>Password:</strong> AdminNGI@2026
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={fillDefaultCredentials}
                  sx={{
                    textTransform: "none",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    borderColor: "#F28C28",
                    color: "#D97706",
                    whiteSpace: "nowrap",
                    borderRadius: "8px",
                    px: 1.5,
                    "&:hover": {
                      borderColor: "#B45309",
                      bgcolor: "rgba(242, 140, 40, 0.12)",
                    },
                  }}
                >
                  Quick Fill
                </Button>
              </Box>

              {/* Step 1 Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || !email || !password}
                endIcon={!loading && <ArrowForwardIcon />}
                sx={{
                  bgcolor: "#102B46",
                  color: "#FFFFFF",
                  py: { xs: 1.4, sm: 1.6 },
                  borderRadius: "14px",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  textTransform: "none",
                  letterSpacing: "-0.01em",
                  boxShadow: "0 8px 20px rgba(16, 43, 70, 0.25)",
                  "&:hover": {
                    bgcolor: "#174A70",
                    boxShadow: "0 10px 24px rgba(16, 43, 70, 0.35)",
                  },
                }}
              >
                {loading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <CircularProgress size={18} color="inherit" />
                    <span>Verifying & Generating OTP...</span>
                  </Box>
                ) : (
                  "Verify & Send OTP Code →"
                )}
              </Button>
            </Box>
          )}

          {/* STEP 2: ENTER OTP CODE */}
          {step === "otp" && (
            <Box component="form" onSubmit={handleVerifyOtp} noValidate>
              <Box sx={{ mb: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>
                    Verification Code Sent To:
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#102B46" }}>
                    {email}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  onClick={() => {
                    setError(null);
                    setStep("credentials");
                  }}
                  startIcon={<ArrowBackIcon sx={{ fontSize: 14 }} />}
                  sx={{ textTransform: "none", fontSize: "0.75rem", color: "#F28C28", fontWeight: 700 }}
                >
                  Change
                </Button>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "#1E293B",
                    display: "block",
                    mb: 1,
                  }}
                >
                  Enter 6-Digit OTP Code
                </Typography>
                <TextField
                  fullWidth
                  type="text"
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="• • • • • •"
                  variant="outlined"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PinIcon sx={{ color: "#F28C28", fontSize: 22 }} />
                        </InputAdornment>
                      ),
                      sx: {
                        fontSize: "1.4rem",
                        fontWeight: 800,
                        letterSpacing: "0.35em",
                        fontFamily: "monospace",
                        textAlign: "center",
                      },
                    },
                  }}
                />
                <Typography variant="caption" sx={{ color: "#64748B", display: "block", mt: 1, fontSize: "0.75rem" }}>
                  Please check your inbox at {email}. (Dev master fallback: <strong>999999</strong>)
                </Typography>
                {devOtp && (
                  <Box sx={{ mt: 1, display: "inline-block" }}>
                    <Chip
                      size="small"
                      color="warning"
                      variant="outlined"
                      label={`Dev Code: ${devOtp} (Click to fill)`}
                      onClick={() => setOtp(devOtp)}
                      sx={{ cursor: "pointer", fontWeight: 700 }}
                    />
                  </Box>
                )}
              </Box>

              {/* Step 2 Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || otp.length < 6}
                endIcon={!loading && <ArrowForwardIcon />}
                sx={{
                  bgcolor: "#102B46",
                  color: "#FFFFFF",
                  py: { xs: 1.4, sm: 1.6 },
                  borderRadius: "14px",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  textTransform: "none",
                  letterSpacing: "-0.01em",
                  boxShadow: "0 8px 20px rgba(16, 43, 70, 0.25)",
                  "&:hover": {
                    bgcolor: "#174A70",
                    boxShadow: "0 10px 24px rgba(16, 43, 70, 0.35)",
                  },
                }}
              >
                {loading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <CircularProgress size={18} color="inherit" />
                    <span>Verifying Code & Logging in...</span>
                  </Box>
                ) : (
                  "Verify OTP & Enter Dashboard →"
                )}
              </Button>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: 3,
                  pt: 2,
                  borderTop: "1px solid #F1F5F9",
                }}
              >
                <Button
                  onClick={handleResendOtp}
                  disabled={loading}
                  size="small"
                  startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
                  sx={{ textTransform: "none", fontSize: "0.78rem", color: "#F28C28", fontWeight: 700 }}
                >
                  Resend OTP
                </Button>

                <Button
                  onClick={() => {
                    setError(null);
                    setStep("credentials");
                  }}
                  size="small"
                  startIcon={<ArrowBackIcon sx={{ fontSize: 14 }} />}
                  sx={{ textTransform: "none", fontSize: "0.78rem", color: "#64748B", fontWeight: 600 }}
                >
                  Back to Password
                </Button>
              </Box>
            </Box>
          )}
        </Paper>

        {/* Back Link to Candidate Portal */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography
            component={Link}
            href="/"
            variant="caption"
            sx={{
              color: "#94A3B8",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.78rem",
              "&:hover": { color: "#102B46", textDecoration: "underline" },
            }}
          >
            ← Return to Candidate Portal
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
