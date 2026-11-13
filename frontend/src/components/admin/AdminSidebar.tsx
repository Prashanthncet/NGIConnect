"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  DashboardOutlined as DashboardIcon,
  PeopleAltOutlined as PeopleIcon,
  DynamicFormOutlined as FormEditIcon,
  ManageAccountsOutlined as UsersIcon,
  LogoutOutlined as LogoutIcon,
  OpenInNew as OpenInNewIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { logoutAdmin } from "@/lib/auth";

interface AdminSidebarProps {
  registrationCount?: number;
}

export default function AdminSidebar({ registrationCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: DashboardIcon,
    },
    {
      name: "Registrations",
      href: "/admin/registrations",
      icon: PeopleIcon,
      badge: registrationCount > 0 ? registrationCount : undefined,
    },
    {
      name: "Dynamic Form Studio",
      href: "/admin/form-builder",
      icon: FormEditIcon,
    },
    {
      name: "User Management",
      href: "/admin/users",
      icon: UsersIcon,
    },
  ];

  const sidebarContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        bgcolor: "#102B46",
        color: "#FFFFFF",
        p: { xs: 2.5, sm: 3 },
      }}
    >
      <Box>
        {/* Brand Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            pb: 2.5,
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Box
            component="img"
            src="/images/ngi-logo.png"
            alt="NGi Logo"
            sx={{
              width: 42,
              height: 42,
              objectFit: "contain",
              bgcolor: "rgba(255, 255, 255, 0.12)",
              borderRadius: "12px",
              p: 0.5,
              flexShrink: 0,
            }}
          />
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "nowrap" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 800,
                  color: "#FFFFFF",
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  fontSize: "1rem",
                  lineHeight: 1.2,
                }}
              >
                NGi Connect
              </Typography>
              <Box
                component="span"
                sx={{
                  bgcolor: "rgba(242, 140, 40, 0.2)",
                  color: "#F28C28",
                  px: 0.8,
                  py: 0.2,
                  borderRadius: "6px",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Admin
              </Box>
            </Box>
            <Typography
              variant="caption"
              sx={{ color: "#94A3B8", fontSize: "0.72rem", whiteSpace: "nowrap", display: "block" }}
            >
              Registry Management Studio
            </Typography>
          </Box>
        </Box>

        {/* Navigation Menu */}
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="caption"
            sx={{
              color: "#64748B",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              px: 1,
              display: "block",
              mb: 1,
            }}
          >
            Core Modules
          </Typography>

          <List disablePadding>
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(link.href);
              return (
                <ListItem key={link.name} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    component={Link}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    sx={{
                      borderRadius: "12px",
                      py: 1.25,
                      px: 2,
                      minHeight: 46,
                      bgcolor: isActive ? "#174A70" : "transparent",
                      color: isActive ? "#FFFFFF" : "#CBD5E1",
                      "&:hover": {
                        bgcolor: isActive ? "#174A70" : "rgba(255, 255, 255, 0.06)",
                        color: "#FFFFFF",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: isActive ? "#F28C28" : "#94A3B8" }}>
                      <Icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontSize: "0.875rem", fontWeight: isActive ? 700 : 500 }}>
                          {link.name}
                        </Typography>
                      }
                    />
                    {link.badge !== undefined && (
                      <Box
                        sx={{
                          bgcolor: "#F28C28",
                          color: "#FFFFFF",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          px: 1,
                          py: 0.2,
                          borderRadius: "10px",
                        }}
                      >
                        {link.badge}
                      </Box>
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Box>

      {/* Footer User Info & Actions */}
      <Box
        sx={{
          pt: 2,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Link to Public Portal */}
        <Box
          component={Link}
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1,
            borderRadius: "10px",
            color: "#94A3B8",
            textDecoration: "none",
            fontSize: "0.75rem",
            bgcolor: "rgba(255,255,255,0.04)",
            "&:hover": { color: "#FFFFFF", bgcolor: "rgba(255,255,255,0.08)" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <OpenInNewIcon sx={{ fontSize: 14 }} />
            <span>Candidate Portal</span>
          </Box>
          <Box
            component="span"
            sx={{
              fontSize: "0.65rem",
              bgcolor: "rgba(255,255,255,0.1)",
              px: 0.8,
              py: 0.2,
              borderRadius: "4px",
            }}
          >
            Live Site
          </Box>
        </Box>

        {/* Administrator Profile Tile */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 1.5,
            borderRadius: "14px",
            bgcolor: "rgba(255,255,255,0.05)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                bgcolor: "#F28C28",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "0.75rem",
                flexShrink: 0,
              }}
            >
              AD
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap variant="body2" sx={{ fontWeight: 700, fontSize: "0.8rem", color: "#FFFFFF" }}>
                Administrator
              </Typography>
              <Typography noWrap variant="caption" sx={{ color: "#94A3B8", fontSize: "0.7rem", display: "block" }}>
                admin@ngi.org.in
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={() => logoutAdmin()}
            size="small"
            title="Sign out of Admin Console"
            sx={{
              color: "#94A3B8",
              width: 36,
              height: 36,
              "&:hover": { color: "#EF4444", bgcolor: "rgba(239, 68, 68, 0.1)" },
            }}
          >
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile Top Header (< lg) */}
      <Box
        sx={{
          display: { xs: "flex", lg: "none" },
          bgcolor: "#102B46",
          color: "#FFFFFF",
          px: 2,
          py: 1.25,
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 1050,
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box
            component="img"
            src="/images/ngi-logo.png"
            alt="NGi Logo"
            sx={{ width: 30, height: 30, objectFit: "contain" }}
          />
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "#FFFFFF" }}>
            NGi Connect Admin
          </Typography>
        </Box>
        <IconButton
          onClick={() => setMobileOpen(true)}
          sx={{
            color: "#FFFFFF",
            bgcolor: "rgba(255,255,255,0.1)",
            width: 40,
            height: 40,
            borderRadius: "10px",
          }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Temporary Mobile Drawer (< lg) */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "80vw", sm: 280 },
              maxWidth: 320,
              bgcolor: "#102B46",
            },
          },
        }}
      >
        <Box sx={{ position: "relative", height: "100%" }}>
          <IconButton
            onClick={() => setMobileOpen(false)}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
              color: "#94A3B8",
              zIndex: 10,
              "&:hover": { color: "#FFFFFF" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
          {sidebarContent}
        </Box>
      </Drawer>

      {/* Persistent Left Sidebar on Desktop (>= lg) */}
      <Box
        component="aside"
        sx={{
          display: { xs: "none", lg: "block" },
          width: 275,
          flexShrink: 0,
          height: "100vh",
          position: "sticky",
          top: 0,
          borderRight: "1px solid #E2E8F0",
        }}
      >
        {sidebarContent}
      </Box>
    </>
  );
}

