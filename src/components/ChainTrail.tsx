"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Link from "next/link";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import AgricultureRoundedIcon from "@mui/icons-material/AgricultureRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import type { ChainKind, ChainStep } from "@/types";

const KIND_STYLES: Record<
  ChainKind,
  { color: string; bg: string; border: string; Icon: typeof ScienceRoundedIcon; noun: string }
> = {
  supplier: {
    color: "#7A4B12",
    bg: "#FDF4E7",
    border: "#EFD9B8",
    Icon: AgricultureRoundedIcon,
    noun: "Supplier",
  },
  ingredient: {
    color: "#8A5A00",
    bg: "#FFF6E3",
    border: "#F0DEB0",
    Icon: ScienceRoundedIcon,
    noun: "Ingredient",
  },
  product: {
    color: "#26313D",
    bg: "#F1F4F7",
    border: "#DCE2E8",
    Icon: Inventory2RoundedIcon,
    noun: "Product",
  },
  store: {
    color: "#0A4F4F",
    bg: "#E5F2F1",
    border: "#B9DAD8",
    Icon: StorefrontRoundedIcon,
    noun: "Store",
  },
  allergen: {
    color: "#B3261E",
    bg: "#FCEEED",
    border: "#F3C9C6",
    Icon: WarningAmberRoundedIcon,
    noun: "Allergen",
  },
};

function Step({ step, emphasis }: { step: ChainStep; emphasis: boolean }) {
  const style = KIND_STYLES[step.kind];
  const { Icon } = style;

  const pill = (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.15,
        py: 0.55,
        borderRadius: 1.5,
        bgcolor: style.bg,
        border: "1px solid",
        borderColor: style.border,
        color: style.color,
        fontWeight: emphasis ? 700 : 550,
        fontSize: "0.82rem",
        lineHeight: 1.3,
        whiteSpace: "nowrap",

        opacity: emphasis ? 1 : 0.92,
        transition: "background-color 120ms ease, border-color 120ms ease",
        ...(step.href && {
          "&:hover": { bgcolor: style.border, borderColor: style.color },
        }),
      }}
    >
      <Icon sx={{ fontSize: 15, opacity: 0.75 }} />
      {step.label}
    </Box>
  );

  const wrapped = (
    <Tooltip title={style.noun} placement="top" enterDelay={500}>
      {pill}
    </Tooltip>
  );

  if (!step.href) return wrapped;

  return (
    <Link href={step.href} style={{ textDecoration: "none" }}>
      {wrapped}
    </Link>
  );
}

export default function ChainTrail({
  steps,
  dense = false,
}: {
  steps: ChainStep[];
  dense?: boolean;
}) {
  if (steps.length === 0) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: dense ? 0.5 : 0.75,
        overflowX: "auto",
        overflowY: "hidden",

        overscrollBehaviorX: "contain",
        py: 0.5,

        "&::-webkit-scrollbar": { height: 6 },
        "&::-webkit-scrollbar-thumb": { background: "transparent" },
        "&:hover::-webkit-scrollbar-thumb": { background: "#cfd4d9" },
      }}
    >
      {steps.map((step, index) => (
        <Box key={`${step.label}-${index}`} sx={{ display: "flex", alignItems: "center", gap: dense ? 0.5 : 0.75 }}>
          {index > 0 && (
            <ArrowForwardRoundedIcon
              sx={{ fontSize: 15, color: "text.disabled", flexShrink: 0 }}
            />
          )}
          <Step step={step} emphasis={index === 0 || index === steps.length - 1} />
        </Box>
      ))}
    </Box>
  );
}

export function ChainSummary({ steps }: { steps: ChainStep[] }) {
  if (steps.length === 0) return null;
  return (
    <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
      {steps.map((s) => s.label).join("  →  ")}
    </Typography>
  );
}
