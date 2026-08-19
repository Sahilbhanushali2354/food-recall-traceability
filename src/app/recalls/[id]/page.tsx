"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import FactoryRoundedIcon from "@mui/icons-material/FactoryRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import SeverityChip from "@/components/SeverityChip";
import ChainTrail from "@/components/ChainTrail";
import StatCard from "@/components/StatCard";
import { ChainSkeleton, EmptyState, ErrorState } from "@/components/States";
import { useRecallImpact } from "@/actions";
import type { RecallImpactRow } from "@/types";
import { toChainSteps, stepLabel, countLabel } from "@/lib/chain";

export default function RecallImpactPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ? decodeURIComponent(params.id) : "";

  const { data, isLoading, error, refetch } = useRecallImpact(id);

  const onShelves = data?.impact.filter((r) => r.storeCount > 0) ?? [];
  const internalOnly = data?.impact.filter((r) => r.storeCount === 0) ?? [];
  const deepest = Math.max(0, ...(data?.impact.map((r) => r.hops) ?? [0]));
  const uniqueStores = new Set(data?.impact.flatMap((r) => r.stores) ?? []).size;

  return (
    <>
      <Button
        component={Link}
        href="/"
        startIcon={<ArrowBackRoundedIcon />}
        sx={{ mb: 2, ml: -1, color: "text.secondary" }}
      >
        All recalls
      </Button>

      {isLoading && (
        <Paper sx={{ mb: 3 }}>
          <ChainSkeleton rows={5} />
        </Paper>
      )}

      {error && <ErrorState error={error} onRetry={() => refetch()} />}

      {data && (
        <>

          <Paper sx={{ p: { xs: 2.25, sm: 3 }, mb: 3 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                mb: 2,
              }}
            >
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
                <SeverityChip severity={data.recall.severity} />
                <Typography variant="caption" color="text.secondary">
                  {data.recall.id}
                </Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                Issued {formatDate(data.recall.issuedAt)}
              </Typography>
            </Stack>

            <Typography variant="h1" sx={{ mb: 1.25 }}>
              {[...new Set(data.impact.map((r) => r.ingredient))].join(", ") || "Recall"}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 820 }}>
              {data.recall.reason}
            </Typography>

            {data.impact[0]?.affectedBatches && (
              <Stack direction="row" spacing={1} useFlexGap sx={{ mt: 2, flexWrap: "wrap" }}>
                <Typography variant="body2" sx={{ fontWeight: 600, alignSelf: "center" }} component="span">
                  Affected batches:
                </Typography>
                {[...new Set(data.impact.map((r) => r.affectedBatches))]
                  .filter(Boolean)
                  .flatMap((batches) => batches.split(",").map((b) => b.trim()))
                  .map((batch) => (
                    <Chip key={batch} label={batch} size="small" variant="outlined" />
                  ))}
              </Stack>
            )}
          </Paper>

          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
              mb: 3,
            }}
          >
            <StatCard value={data.impact.length} label="Products affected" />
            <StatCard
              value={onShelves.length}
              label="On sale now"
              tone={onShelves.length > 0 ? "alert" : "neutral"}
              hint={onShelves.length > 0 ? "Pull these first" : "Nothing to withdraw"}
            />
            <StatCard value={uniqueStores} label="Stores to notify" />
            <StatCard
              value={deepest}
              label="Longest route"
              hint={`${deepest} processing steps from the ingredient`}
            />
          </Box>

          {data.impact.length === 0 && (
            <Paper>
              <EmptyState
                icon={<CheckCircleOutlineRoundedIcon sx={{ fontSize: 40, color: "success.main" }} />}
                title="No products affected by this recall"
                description="This ingredient hasn't been used in any product yet, so nothing needs to be pulled from shelves. Quarantine the raw batches and you're done."
              />
            </Paper>
          )}

          {onShelves.length > 0 && (
            <Section
              title="On sale now — withdraw these"
              caption={`${countLabel(onShelves.length, "product")} reached retail. The route shows how the contaminated ingredient got into each one.`}
              tone="alert"
            >
              {onShelves.map((row) => (
                <ImpactRow key={`${row.ingredient}-${row.product}`} row={row} />
              ))}
            </Section>
          )}

          {internalOnly.length > 0 && (
            <Section
              title="In production — quarantine these"
              caption="These are made in-house and never sold directly, but they carry the contaminated ingredient into everything above."
            >
              {internalOnly.map((row) => (
                <ImpactRow key={`${row.ingredient}-${row.product}`} row={row} />
              ))}
            </Section>
          )}
        </>
      )}
    </>
  );
}

function Section({
  title,
  caption,
  tone = "neutral",
  children,
}: {
  title: string;
  caption: string;
  tone?: "neutral" | "alert";
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ mb: 4 }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.5 }}>
        {tone === "alert" ? (
          <StorefrontRoundedIcon sx={{ fontSize: 19, color: "error.main" }} />
        ) : (
          <FactoryRoundedIcon sx={{ fontSize: 19, color: "text.secondary" }} />
        )}
        <Typography variant="h2">{title}</Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 760 }}>
        {caption}
      </Typography>
      <Stack spacing={1.5}>{children}</Stack>
    </Box>
  );
}

function ImpactRow({ row }: { row: RecallImpactRow }) {
  const steps = toChainSteps(row.chain, { start: "ingredient", end: "product" });

  return (
    <Paper sx={{ p: { xs: 1.75, sm: 2.25 } }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          mb: 1.5,
        }}
      >
        <Box>
          <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: "baseline", flexWrap: "wrap" }}>
            <Typography
              component={Link}
              href={`/products/${encodeURIComponent(row.product)}`}
              variant="h3"
              sx={{ textDecoration: "none", color: "text.primary", "&:hover": { color: "primary.main" } }}
            >
              {row.product}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {row.brand}
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Batch {row.batchCode}
          </Typography>
        </Box>

        <Chip
          size="small"
          variant="outlined"
          label={stepLabel(row.hops)}
          sx={{ flexShrink: 0 }}
        />
      </Stack>

      <ChainTrail steps={steps} />

      {row.stores.length > 0 && (
        <>
          <Divider sx={{ my: 1.5 }} />
          <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: "center", flexWrap: "wrap" }}>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
              ON SALE AT
            </Typography>
            {row.stores.slice(0, 6).map((store) => (
              <Chip key={store} label={store} size="small" />
            ))}
            {row.stores.length > 6 && (
              <Tooltip title={row.stores.slice(6).join(", ")}>
                <Chip label={`+${row.stores.length - 6} more`} size="small" variant="outlined" />
              </Tooltip>
            )}
          </Stack>
        </>
      )}
    </Paper>
  );
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
