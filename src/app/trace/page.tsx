"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Alert from "@mui/material/Alert";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import LinkOffRoundedIcon from "@mui/icons-material/LinkOffRounded";
import ChainTrail from "@/components/ChainTrail";
import { PageHeader } from "@/components/StatCard";
import { ChainSkeleton, EmptyState, ErrorState } from "@/components/States";
import { useSupplyChainOptions, useTraceRoute } from "@/actions";
import { toTraceSteps, stepLabel } from "@/lib/chain";

export default function TracePage() {
  return (
    <Suspense fallback={<TraceSkeleton />}>
      <TraceExplorer />
    </Suspense>
  );
}

function TraceSkeleton() {
  return (
    <>
      <PageHeader title="Trace a route" description="Loading…" />
      <Skeleton variant="rounded" height={56} sx={{ mb: 2 }} />
    </>
  );
}

function TraceExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: pickers } = useSupplyChainOptions();

  const [supplier, setSupplier] = useState<string | null>(searchParams.get("supplier"));
  const [store, setStore] = useState<string | null>(searchParams.get("store"));

  useEffect(() => {
    const next = new URLSearchParams();
    if (supplier) next.set("supplier", supplier);
    if (store) next.set("store", store);
    const qs = next.toString();
    router.replace(qs ? `/trace?${qs}` : "/trace", { scroll: false });
  }, [supplier, store, router]);

  const { data, isLoading, error, refetch } = useTraceRoute(supplier, store);
  const hasSelection = Boolean(supplier && store);

  return (
    <>
      <PageHeader
        title="Trace a route"
        description="Pick a supplier and a store to see the shortest chain that connects them — through the ingredient, every processing step, and onto the shelf."
      />

      <Paper sx={{ p: { xs: 2, sm: 2.5 }, mb: 3 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ alignItems: "center" }}>
          <Autocomplete
            sx={{ width: "100%" }}
            options={pickers?.suppliers.map((s) => s.name) ?? []}
            value={supplier}
            onChange={(_, value) => setSupplier(value)}
            loading={!pickers}
            renderInput={(params) => (
              <TextField {...params} label="Supplier" placeholder="Where it came from" />
            )}
          />
          <Box
            sx={{
              color: "text.disabled",
              display: { xs: "none", md: "block" },
              flexShrink: 0,
            }}
          >
            <RouteRoundedIcon />
          </Box>
          <Autocomplete
            sx={{ width: "100%" }}
            options={pickers?.stores.map((s) => s.name) ?? []}
            groupBy={(option) =>
              pickers?.stores.find((s) => s.name === option)?.city ?? ""
            }
            value={store}
            onChange={(_, value) => setStore(value)}
            loading={!pickers}
            renderInput={(params) => (
              <TextField {...params} label="Store" placeholder="Where it ended up" />
            )}
          />
        </Stack>
      </Paper>

      {!hasSelection && (
        <Paper>
          <EmptyState
            icon={<RouteRoundedIcon sx={{ fontSize: 40 }} />}
            title="Choose a supplier and a store"
            description="Try Gujarat Peanut Co and FreshMart Andheri — there are two different routes between them, and the app finds the shortest."
          />
        </Paper>
      )}

      {isLoading && (
        <Paper>
          <ChainSkeleton rows={2} />
        </Paper>
      )}

      {error && <ErrorState error={error} onRetry={() => refetch()} />}

      {data && data.length === 0 && (
        <Paper>
          <EmptyState
            icon={<LinkOffRoundedIcon sx={{ fontSize: 40 }} />}
            title="No connection between these two"
            description={`Nothing ${supplier} supplies ends up at ${store}. That is a real answer, not a missing one — it means this store carries none of their ingredients, however indirectly.`}
          />
        </Paper>
      )}

      {data && data.length > 0 && (
        <>
          <Alert severity="success" variant="outlined" sx={{ mb: 2 }}>
            Found {data.length === 1 ? "one route" : `${data.length} equally short routes`} from{" "}
            <strong>{supplier}</strong> to <strong>{store}</strong>.
          </Alert>

          <Stack spacing={1.5}>
            {data.map((row, index) => (
              <Paper key={index} sx={{ p: { xs: 1.75, sm: 2.25 } }}>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: "center", justifyContent: "space-between", mb: 1.25 }}
                >
                  <Typography variant="h4">Route {index + 1}</Typography>
                  <Chip size="small" variant="outlined" label={stepLabel(row.hops)} />
                </Stack>
                <ChainTrail steps={toTraceSteps(row.chain)} />
              </Paper>
            ))}
          </Stack>
        </>
      )}
    </>
  );
}
