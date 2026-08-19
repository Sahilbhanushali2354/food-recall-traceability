"use client";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function StatCard({
  value,
  label,
  hint,
  tone = "neutral",
}: {
  value: React.ReactNode;
  label: string;
  hint?: string;
  tone?: "neutral" | "alert";
}) {
  return (
    <Paper sx={{ p: { xs: 1.75, sm: 2.25 }, height: "100%" }}>
      <Typography
        sx={{
          fontSize: { xs: "1.5rem", sm: "1.8rem" },
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          color: tone === "alert" ? "error.main" : "text.primary",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.35 }}>
        {label}
      </Typography>
      {hint && (
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.25 }}>
          {hint}
        </Typography>
      )}
    </Paper>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "flex-end" },
        justifyContent: "space-between",
        gap: 2,
        mb: { xs: 2.5, md: 3.5 },
      }}
    >
      <Box>
        <Typography variant="h1" sx={{ mb: description ? 0.75 : 0 }}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
            {description}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Box>
  );
}
