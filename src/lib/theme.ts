"use client";

import { createTheme } from "@mui/material/styles";
import type { Severity } from "@/types";

export const SEVERITY_COLORS: Record<
  Severity,
  { main: string; bg: string; border: string; label: string }
> = {
  critical: { main: "#B3261E", bg: "#FCEEED", border: "#F3C9C6", label: "Critical" },
  high: { main: "#B54708", bg: "#FEF3E6", border: "#F7D9B5", label: "High" },
  moderate: { main: "#8A6D00", bg: "#FDF6E0", border: "#F0E1AC", label: "Moderate" },
};

export type SeverityKey = Severity;

export const CATEGORY_COLORS: Record<string, string> = {
  nut: "#8B5E34",
  oil: "#A67C1A",
  dairy: "#2E6BA8",
  grain: "#8A6D00",
  cocoa: "#6B4423",
  additive: "#6A6A78",
  sweetener: "#A34A7B",
  seed: "#6B7F3A",
  spice: "#A64B2A",
  egg: "#B08900",
  fruit: "#A33A5B",
};

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: { main: "#0F6E6E", light: "#3D8C8C", dark: "#0A4F4F" },
    secondary: { main: "#4A5568" },
    error: { main: SEVERITY_COLORS.critical.main },
    warning: { main: SEVERITY_COLORS.high.main },
    background: { default: "#F7F8F8", paper: "#FFFFFF" },
    text: { primary: "#16191D", secondary: "#5A6472" },
    divider: "#E3E6E9",
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: "var(--app-font), system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",

    h1: { fontSize: "1.9rem", fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontSize: "1.45rem", fontWeight: 700, letterSpacing: "-0.015em" },
    h3: { fontSize: "1.15rem", fontWeight: 650, letterSpacing: "-0.01em" },
    h4: { fontSize: "1rem", fontWeight: 650 },
    body1: { fontSize: "0.94rem", lineHeight: 1.6 },
    body2: { fontSize: "0.86rem", lineHeight: 1.55 },
    button: { textTransform: "none", fontWeight: 600 },
    caption: { fontSize: "0.76rem", letterSpacing: "0.01em" },
  },
  components: {
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { border: "1px solid #E3E6E9", backgroundImage: "none" },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: "1px solid #E3E6E9",
          transition: "border-color 140ms ease, box-shadow 140ms ease",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 8 } },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 6 },
        sizeSmall: { height: 22, fontSize: "0.74rem" },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 650, fontSize: "0.8rem", color: "#5A6472", whiteSpace: "nowrap" },
        root: { borderColor: "#EDEFF1" },
      },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
    },

    MuiDialogContent: {
      styleOverrides: { root: { overscrollBehavior: "contain" } },
    },
    MuiTableContainer: {

      styleOverrides: { root: { overscrollBehaviorX: "contain" } },
    },

    MuiAutocomplete: {
      styleOverrides: {
        listbox: { overscrollBehavior: "contain", maxHeight: "40vh" },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: { overscrollBehavior: "contain" },
        list: { overscrollBehavior: "contain" },
      },
    },
    MuiPopover: {
      styleOverrides: { paper: { overscrollBehavior: "contain" } },
    },
    MuiLink: {
      defaultProps: { underline: "hover" },
    },
  },
});

export default theme;
