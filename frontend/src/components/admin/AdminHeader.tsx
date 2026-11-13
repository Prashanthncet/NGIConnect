"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Shield as ShieldIcon,
} from "@mui/icons-material";

interface AdminHeaderProps {
  title?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function AdminHeader({ title, onRefresh, isRefreshing }: AdminHeaderProps) {
  const pathname = usePathname();
  const [backendStatus, setBackendStatus] = useState<"connected" | "checking" | "error">("checking");

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch("/api/health");
        if (res.ok) {
          setBackendStatus("connected");
        } else {
          setBackendStatus("error");
        }
      } catch {
        setBackendStatus("error");
      }
    }
    checkHealth();
  }, []);

  const getPageTitle = () => {
    if (title) return title;
    if (pathname.includes("/dashboard")) return "Executive Overview";
    if (pathname.includes("/registrations")) return "Registrations Console";
    if (pathname.includes("/form-builder")) return "Dynamic Form Studio";
    if (pathname.includes("/users")) return "User Management & Access Control";
    return "Admin Portal";
  };

  return (
    <Box
      component="header"
      sx={{
        bgcolor: "#FFFFFF",
        borderBottom: "1px solid #E2E8F0",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 1.5, sm: 2 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 1px 3px rgba(16,43,70,0.03)",
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          noWrap
          variant="h6"
          sx={{
            fontWeight: 800,
            color: "#102B46",
            letterSpacing: "-0.015em",
            fontSize: { xs: "1.05rem", sm: "1.25rem" },
            lineHeight: 1.2,
          }}
        >
          {getPageTitle()}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "#64748B",
            fontSize: { xs: "0.68rem", sm: "0.75rem" },
            display: { xs: "none", sm: "block" },
          }}
        >
          Nagarjuna Group of Institutions • NCET & NCMS Central Control
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 1.5 } }}>
        {/* Backend Status Indicator */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 1.5,
            py: 0.5,
            borderRadius: "20px",
            bgcolor: backendStatus === "connected" ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)",
            border: `1px solid ${backendStatus === "connected" ? "rgba(16, 185, 129, 0.25)" : "rgba(239, 68, 68, 0.25)"}`,
          }}
        >
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              bgcolor: backendStatus === "connected" ? "#10B981" : "#EF4444",
            }}
          />
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              fontSize: "0.7rem",
              color: backendStatus === "connected" ? "#065F46" : "#991B1B",
            }}
          >
            {backendStatus === "connected" ? "Backend Online" : "Service Disconnected"}
          </Typography>
        </Box>

        {/* Security / Role Chip */}
        <Chip
          icon={<ShieldIcon sx={{ fontSize: "14px !important", color: "#102B46 !important" }} />}
          label="Root Access"
          size="small"
          sx={{
            display: { xs: "none", md: "inline-flex" },
            bgcolor: "#F1F5F9",
            fontWeight: 700,
            color: "#102B46",
            fontSize: "0.72rem",
            height: 28,
            borderRadius: "8px",
          }}
        />

        {/* Manual Refresh Button */}
        {onRefresh && (
          <Tooltip title="Refresh Registry Data">
            <IconButton
              onClick={onRefresh}
              disabled={isRefreshing}
              size="small"
              sx={{
                bgcolor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                width: 36,
                height: 36,
                borderRadius: "10px",
                "&:hover": { bgcolor: "#EDF2F7" },
              }}
            >
              <RefreshIcon
                sx={{
                  fontSize: 18,
                  color: "#102B46",
                  animation: isRefreshing ? "spin 1s linear infinite" : "none",
                  "@keyframes spin": {
                    "0%": { transform: "rotate(0deg)" },
                    "100%": { transform: "rotate(360deg)" },
                  },
                }}
              />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}

