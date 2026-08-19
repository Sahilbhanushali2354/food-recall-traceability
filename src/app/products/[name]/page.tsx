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
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import ChainTrail from "@/components/ChainTrail";
import StatCard from "@/components/StatCard";
import { TableSkeleton, EmptyState, ErrorState } from "@/components/States";
import { useProduct } from "@/actions";
import { toChainSteps, depthLabel, countLabel } from "@/lib/chain";
import { CATEGORY_COLORS } from "@/lib/theme";

export default function ProductDetailPage() {
  const params = useParams<{ name: string }>();
  const name = params?.name ? decodeURIComponent(params.name) : "";

  const { data, isLoading, error, refetch } = useProduct(name);

  const hidden = data?.allergens.filter((a) => !a.isDeclaredDirectly) ?? [];
  const declared = data?.allergens.filter((a) => a.isDeclaredDirectly) ?? [];
  const suppliers = new Set(data?.origins.flatMap((o) => o.suppliers).filter(Boolean) ?? []);

  return (
    <>
      <Button
        onClick={() => history.back()}
        startIcon={<ArrowBackRoundedIcon />}
        sx={{ mb: 2, ml: -1, color: "text.secondary" }}
      >
        Back
      </Button>

      {isLoading && (
        <Paper>
          <TableSkeleton rows={6} columns={4} />
        </Paper>
      )}

      {error && <ErrorState error={error} onRetry={() => refetch()} />}

      {data && (
        <>

          <Paper sx={{ p: { xs: 2.25, sm: 3 }, mb: 3 }}>
            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", mb: 1.25 }}>
              <Chip label={data.product.category} size="small" variant="outlined" />
              <Chip label={`Batch ${data.product.batchCode}`} size="small" variant="outlined" />
            </Stack>
            <Typography variant="h1">{data.product.name}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              {data.product.brand}
            </Typography>

            {data.product.components.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Made from
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                  {data.product.components.map((component) => (
                    <Chip
                      key={component}
                      label={component}
                      size="small"
                      component={Link}
                      href={`/products/${encodeURIComponent(component)}`}
                      clickable
                    />
                  ))}
                </Stack>
              </>
            )}
          </Paper>

          {hidden.length > 0 && (
            <Alert
              severity="error"
              variant="outlined"
              icon={<WarningAmberRoundedIcon />}
              sx={{ mb: 3 }}
            >
              <AlertTitle sx={{ fontWeight: 700 }}>
                {countLabel(hidden.length, "allergen")} not in this product&rsquo;s own recipe
              </AlertTitle>
              <Typography variant="body2" sx={{ mb: 1.5 }}>
                These arrived through sub-ingredients. Check that the label declares them.
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                {hidden.map((a) => (
                  <Chip
                    key={a.allergen}
                    size="small"
                    label={`${a.allergen} — ${depthLabel(a.minDepth).toLowerCase()}, via ${a.viaIngredients.join(", ")}`}
                    sx={{ bgcolor: "#FCEEED", color: "#B3261E", fontWeight: 600 }}
                  />
                ))}
              </Stack>
            </Alert>
          )}

          {declared.length > 0 && (
            <Alert severity="info" variant="outlined" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Declared in the recipe:</strong>{" "}
                {declared.map((a) => a.allergen).join(", ")} — these are visible on the ingredient
                list already.
              </Typography>
            </Alert>
          )}

          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
              mb: 3,
            }}
          >
            <StatCard value={data.origins.length} label="Raw ingredients" hint="At any depth" />
            <StatCard value={suppliers.size} label="Suppliers involved" />
            <StatCard
              value={data.allergens.length}
              label="Allergens present"
              tone={hidden.length > 0 ? "alert" : "neutral"}
            />
            <StatCard value={data.product.stores.length} label="Stores stocking it" />
          </Box>

          <Typography variant="h2" sx={{ mb: 0.5 }}>
            Where everything came from
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 760 }}>
            Every raw ingredient that ends up in this product, however many processing steps away,
            with the supplier and batch it arrived on. Deepest first.
          </Typography>

          <Paper sx={{ mb: 4, overflow: "hidden" }}>
            {data.origins.length === 0 ? (
              <EmptyState
                title="No ingredient trace available"
                description="This product has no recorded ingredients yet."
              />
            ) : (

              <TableContainer sx={{ maxWidth: "100%" }}>
                <Table size="small" sx={{ minWidth: 780 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ingredient</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Supplier</TableCell>
                      <TableCell>Batch</TableCell>
                      <TableCell>How it gets here</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[...data.origins]
                      .sort((a, b) => b.depth - a.depth || a.ingredient.localeCompare(b.ingredient))
                      .map((origin) => (
                        <TableRow key={origin.ingredient} hover>
                          <TableCell sx={{ fontWeight: 600 }}>{origin.ingredient}</TableCell>
                          <TableCell>
                            <Chip
                              label={origin.category}
                              size="small"
                              sx={{
                                bgcolor: "transparent",
                                border: "1px solid",
                                borderColor: CATEGORY_COLORS[origin.category] ?? "divider",
                                color: CATEGORY_COLORS[origin.category] ?? "text.secondary",
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            {origin.suppliers.filter(Boolean).join(", ") || "—"}
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption" color="text.secondary">
                              {origin.batches.filter(Boolean).join(", ") || "—"}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ minWidth: 340 }}>
                            <ChainTrail
                              dense
                              steps={toChainSteps(origin.chain, {
                                start: "ingredient",
                                end: "product",
                              })}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>

          <Typography variant="h2" sx={{ mb: 2 }}>
            On sale at
          </Typography>
          {data.product.stores.length === 0 ? (
            <Paper>
              <EmptyState
                icon={<StorefrontRoundedIcon sx={{ fontSize: 40 }} />}
                title="Not sold directly"
                description="This is an intermediate product made in-house. It reaches customers inside the finished goods listed above, not on its own."
              />
            </Paper>
          ) : (
            <Box
              sx={{
                display: "grid",
                gap: 1.5,
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
              }}
            >
              {data.product.stores.map((store) => (
                <Paper key={store.name} sx={{ p: 1.75 }}>
                  <Typography variant="body2" sx={{ fontWeight: 650 }}>
                    {store.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {store.city} · stocked since {store.since}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}
        </>
      )}
    </>
  );
}
