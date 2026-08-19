"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import ChainTrail from "@/components/ChainTrail";
import StatCard, { PageHeader } from "@/components/StatCard";
import { ChainSkeleton, EmptyState, ErrorState } from "@/components/States";
import { useAllergens, useHiddenAllergens } from "@/actions";
import type { HiddenAllergenRow } from "@/types";
import { toChainSteps, depthLabel, countLabel } from "@/lib/chain";

const ALLERGEN_BLURB: Record<string, string> = {
  peanut: "Peanut traces cause the largest share of serious allergic reactions to packaged food.",
  gluten: "Coeliac disease affects roughly 1 in 100 people; undeclared gluten is a common recall cause.",
  dairy: "Milk protein survives processing and is easily carried by fats and powders.",
  soy: "Soy lecithin is used as an emulsifier in almost every chocolate product.",
  egg: "Egg powder is used as a binder well beyond the products people expect.",
  sesame: "Sesame became a mandatory declared allergen only recently; older specs often miss it.",
};

export default function AllergenPage() {
  return (

    <Suspense fallback={<AllergenSkeleton />}>
      <AllergenChecker />
    </Suspense>
  );
}

function AllergenSkeleton() {
  return (
    <>
      <PageHeader title="Allergen checker" description="Loading…" />
      <Skeleton variant="rounded" height={48} sx={{ mb: 3, maxWidth: 560 }} />
      <Paper>
        <ChainSkeleton rows={4} />
      </Paper>
    </>
  );
}

function AllergenChecker() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: allergens } = useAllergens();

  const selected = searchParams.get("allergen") ?? "peanut";

  const choose = (value: string | null) => {
    if (!value) return;
    router.replace(`/allergens?allergen=${encodeURIComponent(value)}`, { scroll: false });
  };

  const { data, isLoading, error, refetch } = useHiddenAllergens(selected);

  const distinctProducts = new Set(data?.map((r) => r.product) ?? []).size;
  const distinctStores = new Set(data?.flatMap((r) => r.stores) ?? []).size;
  const deepest = Math.max(0, ...(data?.map((r) => r.depth) ?? [0]));

  return (
    <>
      <PageHeader
        title="Allergen checker"
        description="Find products that contain an allergen which never appears in their own recipe — it arrived inside an ingredient, inside another ingredient. These are the ones most likely to carry an incomplete label."
      />

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          Choose an allergen
        </Typography>
        <ToggleButtonGroup
          value={selected}
          exclusive
          onChange={(_, value) => choose(value)}
          sx={{ flexWrap: "wrap", gap: 1, "& .MuiToggleButton-root": { borderRadius: "8px !important", border: "1px solid", borderColor: "divider", px: 2 } }}
        >
          {(allergens ?? []).map((a) => (
            <ToggleButton key={a.name} value={a.name} sx={{ textTransform: "capitalize" }}>
              {a.name}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {ALLERGEN_BLURB[selected] && (
        <Alert severity="info" variant="outlined" sx={{ mb: 3, maxWidth: 860 }}>
          {ALLERGEN_BLURB[selected]}
        </Alert>
      )}

      {data && !error && data.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            mb: 3,
          }}
        >
          <StatCard value={distinctProducts} label="Products with hidden traces" tone="alert" />
          <StatCard value={distinctStores} label="Stores stocking them" />
          <StatCard
            value={deepest}
            label="Deepest occurrence"
            hint={`${deepest} layers below the label`}
          />
        </Box>
      )}

      {isLoading && (
        <Paper>
          <ChainSkeleton rows={4} />
        </Paper>
      )}

      {error && <ErrorState error={error} onRetry={() => refetch()} />}

      {data && data.length === 0 && (
        <Paper>
          <EmptyState
            icon={<CheckCircleOutlineRoundedIcon sx={{ fontSize: 40, color: "success.main" }} />}
            title={`No hidden ${selected} found`}
            description={`Every product that contains ${selected} has it listed in its own recipe, so the label should already declare it. Nothing is arriving unnoticed through a sub-ingredient.`}
          />
        </Paper>
      )}

      {data && data.length > 0 && (
        <Stack spacing={1.5}>
          {data.map((row) => (
            <HiddenRow key={`${row.product}-${row.sourceIngredient}`} row={row} allergen={selected} />
          ))}
        </Stack>
      )}
    </>
  );
}

function HiddenRow({ row, allergen }: { row: HiddenAllergenRow; allergen: string }) {

  const steps = [
    { label: allergen, kind: "allergen" as const },
    ...toChainSteps(row.chain, { start: "ingredient", end: "product" }),
  ];

  return (
    <Paper sx={{ p: { xs: 1.75, sm: 2.25 } }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1}
        sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" }, mb: 1.5 }}
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
            Arrives through {row.sourceIngredient}
          </Typography>
        </Box>

        <Chip
          size="small"
          icon={<VisibilityOffRoundedIcon sx={{ fontSize: 15 }} />}
          label={depthLabel(row.depth)}
          sx={{ bgcolor: "#FCEEED", color: "#B3261E", fontWeight: 700, flexShrink: 0 }}
        />
      </Stack>

      <ChainTrail steps={steps} />

      {row.stores.length > 0 && (
        <>
          <Divider sx={{ my: 1.5 }} />
          <Typography variant="caption" color="text.secondary">
            Currently sold at {countLabel(row.storeCount, "store")}: {row.stores.slice(0, 4).join(", ")}
            {row.stores.length > 4 && ` and ${row.stores.length - 4} more`}
          </Typography>
        </>
      )}
    </Paper>
  );
}
