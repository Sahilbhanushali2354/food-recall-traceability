"use client";

import Box from "@mui/material/Box";
import { SEVERITY_COLORS, type SeverityKey } from "@/lib/theme";

export default function SeverityChip({
  severity,
  size = "medium",
}: {
  severity: string;
  size?: "small" | "medium";
}) {
  const key = (severity?.toLowerCase() ?? "moderate") as SeverityKey;
  const tone = SEVERITY_COLORS[key] ?? SEVERITY_COLORS.moderate;

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.6,
        px: size === "small" ? 0.85 : 1.1,
        py: size === "small" ? 0.25 : 0.4,
        borderRadius: 1,
        bgcolor: tone.bg,
        border: "1px solid",
        borderColor: tone.border,
        color: tone.main,
        fontWeight: 700,
        fontSize: size === "small" ? "0.7rem" : "0.76rem",
        letterSpacing: "0.02em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      <Box
        component="span"
        sx={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          bgcolor: tone.main,
          flexShrink: 0,
        }}
      />
      {tone.label}
    </Box>
  );
}
