"use client";

import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#102B46",
      light: "#174A70",
      dark: "#0a1c2e",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#174A70",
      light: "#2A6496",
      dark: "#102B46",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#F28C28",
      light: "#fef3e7",
      dark: "#d9771a",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F7F8FA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#102B46",
      secondary: "#64748B",
    },
    divider: "#E2E8F0",
  },
  typography: {
    fontFamily: ['"Poppins"', '"Inter"', "sans-serif"].join(","),
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.02em",
      fontSize: "clamp(2rem, 5vw, 3.5rem)",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.015em",
      fontSize: "clamp(1.75rem, 4vw, 2.625rem)",
    },
    h3: {
      fontWeight: 700,
      fontSize: "clamp(1.375rem, 3vw, 2rem)",
    },
    h4: {
      fontWeight: 600,
      fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
    },
    h5: {
      fontWeight: 600,
      fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
    },
    h6: {
      fontWeight: 600,
      fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
    },
    body1: {
      fontSize: "clamp(0.875rem, 1.2vw, 1rem)",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "clamp(0.8125rem, 1vw, 0.875rem)",
      lineHeight: 1.55,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 14,
  },
  breakpoints: {
    values: {
      xs: 0,      // Small mobile: 320px+
      sm: 480,    // Standard/Large mobile
      md: 768,    // Small tablet
      lg: 1024,   // Tablet / Large tablet
      xl: 1280,   // Laptop / Desktop
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "10px 22px",
          minHeight: 44, // Touch target guideline
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(16, 43, 70, 0.12)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: "1px solid #E2E8F0",
          boxShadow: "0 2px 8px rgba(16, 43, 70, 0.04)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 12,
            minHeight: 44,
          },
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;

