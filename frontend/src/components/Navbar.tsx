"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Box,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Container,
  Paper,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  School as SchoolIcon,
  ArrowForward as ArrowForwardIcon,
  OpenInNew as OpenInNewIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [campusMenuOpen, setCampusMenuOpen] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About NGi", href: "/#about" },
    { label: "Institutions", href: "/#institutions" },
    { label: "Why NGi Connect", href: "/#benefits" },
    { label: "Contact", href: "/#contact" },
  ];

  return (
    <>
      {/* 1. TOP UTILITY BAR (Hidden on small mobile < 480px and completely hidden on print) */}
      <Box
        sx={{
          bgcolor: "#102B46",
          color: "#94A3B8",
          fontSize: { xs: "0.7rem", sm: "0.75rem" },
          py: 0.75,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: { xs: "none", sm: "block" },
          "@media print": { display: "none !important" },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="span"
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#F28C28",
                  display: "inline-block",
                }}
              />
              <Typography variant="caption" sx={{ color: "#E2E8F0", fontWeight: 500 }}>
                Nagarjuna Group of Institutions (NGi)
              </Typography>
              <Typography variant="caption" sx={{ display: { xs: "none", md: "inline" }, color: "#64748B" }}>
                • Autonomous Engineering & Management Studies
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1.5, md: 2 } }}>
              <Box
                component="a"
                href="https://ncet.co.in/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#CBD5E1",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  "&:hover": { color: "#F28C28" },
                }}
              >
                NCET <OpenInNewIcon sx={{ fontSize: 11 }} />
              </Box>
              <Typography variant="caption" sx={{ color: "#475569" }}>|</Typography>
              <Box
                component="a"
                href="https://www.ncms.co.in/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#CBD5E1",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  "&:hover": { color: "#F28C28" },
                }}
              >
                NCMS <OpenInNewIcon sx={{ fontSize: 11 }} />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* 2. MAIN RESPONSIVE APP BAR */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.96)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #E2E8F0",
          color: "#102B46",
          zIndex: 1100,
          "@media print": { display: "none !important" },
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              height: { xs: 64, sm: 72, md: 80 },
              minHeight: { xs: 64, sm: 72, md: 80 },
              justifyContent: "space-between",
            }}
          >
            {/* Left: Brand Identity with Official NGi Logo */}
            <Box
              component={Link}
              href="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1.25, sm: 1.75 },
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Box
                component="img"
                src="/images/ngi-logo.png"
                alt="NGi Logo"
                sx={{
                  width: { xs: 40, sm: 46 },
                  height: { xs: 40, sm: 46 },
                  objectFit: "contain",
                  filter: "drop-shadow(0 2px 4px rgba(16,43,70,0.12))",
                }}
              />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "1.125rem", sm: "1.35rem" },
                    letterSpacing: "-0.02em",
                    lineHeight: 1.15,
                  }}
                >
                  NGi <Box component="span" sx={{ color: "#F28C28" }}>Connect</Box>
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: { xs: "0.625rem", sm: "0.7rem" },
                    color: "#64748B",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Academic Registry
                </Typography>
              </Box>
            </Box>

            {/* Desktop Navigation Links (>= md) */}
            {isDesktop ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  {navLinks.map((link) => (
                    <Box
                      key={link.label}
                      component={Link}
                      href={link.href}
                      sx={{
                        textDecoration: "none",
                        color: "#1E293B",
                        fontSize: "0.925rem",
                        fontWeight: 600,
                        transition: "color 0.2s ease",
                        "&:hover": { color: "#F28C28" },
                      }}
                    >
                      {link.label}
                    </Box>
                  ))}
                </Box>

                {/* Primary Registration Action */}
                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  color="warning"
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    px: 3,
                    py: 1.2,
                    fontSize: "0.9rem",
                    borderRadius: "12px",
                    fontWeight: 700,
                  }}
                >
                  Register Now
                </Button>
              </Box>
            ) : (
              /* Mobile / Tablet Controls (< md) */
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  color="warning"
                  size="small"
                  sx={{
                    fontSize: { xs: "0.75rem", sm: "0.825rem" },
                    px: { xs: 1.75, sm: 2.25 },
                    py: 0.75,
                    minHeight: 38,
                    borderRadius: "10px",
                    fontWeight: 700,
                  }}
                >
                  Register
                </Button>

                <IconButton
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open mobile navigation"
                  sx={{
                    color: "#102B46",
                    bgcolor: "rgba(16, 43, 70, 0.05)",
                    width: 44,
                    height: 44, // Touch target
                    borderRadius: "10px",
                    "&:hover": { bgcolor: "rgba(16, 43, 70, 0.1)" },
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* 3. MATERIAL UI RESPONSIVE DRAWER FOR MOBILE & TABLET */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "85vw", sm: 360 },
              maxWidth: 400,
              bgcolor: "#FFFFFF",
              p: { xs: 2.5, sm: 3 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            },
          },
        }}
      >
        <Box>
          {/* Drawer Top Header with NGi Logo */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: 2.5,
              borderBottom: "1px solid #E2E8F0",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                component="img"
                src="/images/ngi-logo.png"
                alt="NGi Logo"
                sx={{
                  width: 36,
                  height: 36,
                  objectFit: "contain",
                }}
              />
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#102B46" }}>
                NGi Connect
              </Typography>
            </Box>
            <IconButton
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              sx={{ width: 40, height: 40 }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Nav List */}
          <List sx={{ pt: 2 }}>
            {navLinks.map((item) => (
              <ListItem key={item.label} disablePadding sx={{ mb: 0.75 }}>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    borderRadius: "12px",
                    py: 1.25,
                    minHeight: 48, // 48px touch target
                    "&:hover": { bgcolor: "#F8FAFC" },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography sx={{ fontSize: "0.975rem", fontWeight: 600, color: "#1E293B" }}>
                        {item.label}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          {/* Registration Quick Switcher Cards with Authentic College Logos */}
          <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em", px: 1 }}>
            Select Campus Form
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1.5 }}>
            <Paper
              component={Link}
              href="/register?institution=NCET"
              onClick={() => setMobileOpen(false)}
              elevation={0}
              sx={{
                p: 1.75,
                borderRadius: "14px",
                border: "1px solid #FED7AA",
                bgcolor: "#FFF7ED",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                minHeight: 52,
                "&:hover": { bgcolor: "#FFEDD5" },
              }}
            >
              <Box
                component="img"
                src="/images/ncet-logo.png"
                alt="NCET Logo"
                sx={{ width: 42, height: 42, objectFit: "contain", bgcolor: "#FFFFFF", p: 0.5, borderRadius: "8px", border: "1px solid #FED7AA", flexShrink: 0 }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#102B46", lineHeight: 1.2 }}>
                  NCET Registration
                </Typography>
                <Typography variant="caption" sx={{ color: "#78350F" }}>
                  Engineering, Tech & AI
                </Typography>
              </Box>
              <ArrowForwardIcon sx={{ fontSize: 16, color: "#EA580C" }} />
            </Paper>

            <Paper
              component={Link}
              href="/register?institution=NCMS"
              onClick={() => setMobileOpen(false)}
              elevation={0}
              sx={{
                p: 1.75,
                borderRadius: "14px",
                border: "1px solid #BFDBFE",
                bgcolor: "#EFF6FF",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                minHeight: 52,
                "&:hover": { bgcolor: "#DBEAFE" },
              }}
            >
              <Box
                component="img"
                src="/images/ncms-logo.webp"
                alt="NCMS Logo"
                sx={{ width: 42, height: 42, objectFit: "contain", bgcolor: "#FFFFFF", p: 0.5, borderRadius: "8px", border: "1px solid #BFDBFE", flexShrink: 0 }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#174A70", lineHeight: 1.2 }}>
                  NCMS Registration
                </Typography>
                <Typography variant="caption" sx={{ color: "#1E40AF" }}>
                  Management & Commerce
                </Typography>
              </Box>
              <ArrowForwardIcon sx={{ fontSize: 16, color: "#2563EB" }} />
            </Paper>
          </Box>
        </Box>

        {/* Drawer Bottom Action */}
        <Box sx={{ pt: 3, borderTop: "1px solid #E2E8F0" }}>
          <Button
            component={Link}
            href="/register"
            onClick={() => setMobileOpen(false)}
            variant="contained"
            color="warning"
            fullWidth
            endIcon={<ArrowForwardIcon />}
            sx={{
              py: 1.5,
              borderRadius: "14px",
              fontWeight: 700,
              fontSize: "0.95rem",
              minHeight: 48,
            }}
          >
            Start Dynamic Registration
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
