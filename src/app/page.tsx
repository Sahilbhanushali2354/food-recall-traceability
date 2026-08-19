"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import SeverityChip from "@/components/SeverityChip";
import StatCard, { PageHeader } from "@/components/StatCard";
import { CardsSkeleton, EmptyState, ErrorState } from "@/components/States";
import { useRecalls } from "@/actions";
import type { RecallSummary } from "@/types";
import { countLabel } from "@/lib/chain";

export default function RecallDashboard() {
  const { data, isLoading, error, refetch } = useRecalls();

  const totals = {
    recalls: data?.length ?? 0,
    critical: data?.filter((r) => r.severity === "critical").length ?? 0,

    widestProducts: Math.max(0, ...(data?.map((r) => r.productCount) ?? [0])),
    widestStores: Math.max(0, ...(data?.map((r) => r.storeCount) ?? [0])),
  };

  return (
    <>
      <PageHeader
        title="Active recalls"
        description="Every recall currently open, with how far each one has spread through production and onto shelves. Open one to see the exact route from the contaminated ingredient to the products people can buy."
      />

      {data && !error && (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
            mb: 3,
          }}
        >
          <StatCard value={totals.recalls} label="Open recalls" />
          <StatCard
            value={totals.critical}
            label="Critical"
            tone={totals.critical > 0 ? "alert" : "neutral"}
            hint={totals.critical > 0 ? "Needs action today" : "None outstanding"}
          />
          <StatCard
            value={totals.widestProducts}
            label="Widest product reach"
            hint="From a single recall"
          />
          <StatCard
            value={totals.widestStores}
            label="Widest store reach"
            hint="From a single recall"
          />
        </Box>
      )}

      {isLoading && <CardsSkeleton count={6} />}

      {error && <ErrorState error={error} onRetry={() => refetch()} />}

      {data && data.length === 0 && (
        <Paper>
          <EmptyState
            icon={<CampaignRoundedIcon sx={{ fontSize: 40 }} />}
            title="No active recalls"
            description="Nothing is currently being withdrawn. When a recall is issued it will appear here with its full downstream impact."
          />
        </Paper>
      )}

      {data && data.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
          }}
        >
          {data.map((recall) => (
            <RecallCard key={recall.id} recall={recall} />
          ))}
        </Box>
      )}
    </>
  );
}

function RecallCard({ recall }: { recall: RecallSummary }) {
  const onShelves = recall.storeCount > 0;

  return (
    <Paper
      sx={{
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "border-color 140ms ease, transform 140ms ease",
        "&:hover": { borderColor: "primary.light", transform: "translateY(-1px)" },
      }}
    >
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
        <SeverityChip severity={recall.severity} />
        <Typography variant="caption" color="text.secondary">
          {formatDate(recall.issuedAt)}
        </Typography>
      </Stack>

      <Typography variant="h3" sx={{ mb: 0.5 }}>
        {recall.ingredients.join(", ")}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1.25 }}>
        {recall.id}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 2,

          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {recall.reason}
      </Typography>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ mb: 1.5 }} />

      <Stack direction="row" spacing={1} useFlexGap sx={{ mb: 2, flexWrap: "wrap" }}>
        <Chip
          size="small"
          variant="outlined"
          icon={<Inventory2RoundedIcon sx={{ fontSize: 15 }} />}
          label={countLabel(recall.productCount, "product")}
        />
        <Chip
          size="small"
          variant="outlined"
          color={onShelves ? "error" : "default"}
          icon={<StorefrontRoundedIcon sx={{ fontSize: 15 }} />}
          label={onShelves ? countLabel(recall.storeCount, "store") : "Not on shelves"}
        />
      </Stack>

      <Button
        component={Link}
        href={`/recalls/${encodeURIComponent(recall.id)}`}
        variant="contained"
        endIcon={<ArrowForwardRoundedIcon />}
        fullWidth
      >
        See what&rsquo;s affected
      </Button>
    </Paper>
  );
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
