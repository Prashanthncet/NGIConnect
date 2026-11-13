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
  Tooltip,
} from "@mui/material";
import {
  EmailOutlined as EmailIcon,
  LockOutlined as LockIcon,
  VisibilityOutlined as VisibilityIcon,
  VisibilityOffOutlined as VisibilityOffIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircleOutlined as CheckCircleIcon,
  ContentCopyOutlined as CopyIcon,
} from "@mui/icons-material";

export default function AdminLoginPage() {
  const router = useRouter();

  // Form State
  const [email, setEmail] = useState("admin@ngi.org.in");
  const [password, setPassword] = useState("AdminNGI@2026");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Quick fill default admin credentials
  const fillDefaultCredentials = () => {
    setEmail("admin@ngi.org.in");
    setPassword("AdminNGI@2026");
    setError(null);
  };

  // Direct Email + Password Login -> Dashboard
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Ensure database seed is initialized if first spin-up
      await fetch("/api/seed");

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
        }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Authentication failed. Please verify your email and password.");
        return;
      }

      // Successful login -> Redirect directly to Admin Dashboard
      router.push("/admin/dashboard");
    } catch {
      setError("Unable to connect to authentication server. Please ensure the backend is running.");
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
              width: { xs: 64, sm: 76 },
              height: { xs: 64, sm: 76 },
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

          <Box component="form" onSubmit={handleLogin} noValidate>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: "#102B46",
                fontSize: "1.1rem",
                mb: 0.5,
              }}
            >
              Administrator Sign In
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#64748B",
                fontSize: "0.825rem",
                mb: 3,
              }}
            >
              Enter your administrative credentials to access the control panel.
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
                  Password
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

            {/* Credentials Note */}
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
                  Default Admin Credentials:
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

            {/* Submit Button */}
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
                  <span>Signing In...</span>
                </Box>
              ) : (
                "Authenticate & Open Studio →"
              )}
            </Button>
          </Box>
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
