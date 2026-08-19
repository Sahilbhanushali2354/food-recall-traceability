"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import { PageHeader } from "@/components/StatCard";
import { TableSkeleton, EmptyState, ErrorState } from "@/components/States";
import { useRisk } from "@/actions";
import { CATEGORY_COLORS } from "@/lib/theme";

export default function RiskPage() {
  const { data, isLoading, error, refetch } = useRisk();

  const maxSupplierProducts = Math.max(1, ...(data?.suppliers.map((s) => s.productsAffected) ?? [1]));
  const maxIngredientProducts = Math.max(1, ...(data?.ingredients.map((i) => i.productCount) ?? [1]));

  return (
    <>
      <PageHeader
        title="Risk overview"
        description="Where a single failure would hurt most. These are the concentration points in the supply chain — the suppliers and ingredients that reach the largest share of what we sell."
      />

      {isLoading && (
        <Stack spacing={3}>
          <Paper>
            <TableSkeleton rows={6} columns={4} />
          </Paper>
          <Paper>
            <TableSkeleton rows={5} columns={3} />
          </Paper>
        </Stack>
      )}

      {error && <ErrorState error={error} onRetry={() => refetch()} />}

      {data && (
        <Stack spacing={4}>

          <Box>
            <Typography variant="h2" sx={{ mb: 0.5 }}>
              If one supplier failed tomorrow
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 780 }}>
              Counting everything each supplier&rsquo;s ingredients end up in, however many
              processing steps away. A supplier near the top is a single point of failure — not
              because they are unreliable, but because so much depends on them.
            </Typography>

            <Paper sx={{ overflow: "hidden" }}>
              {data.suppliers.length === 0 ? (
                <EmptyState title="No supplier data" />
              ) : (
                <TableContainer>
                  <Table size="small" sx={{ minWidth: 720 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Supplier</TableCell>
                        <TableCell>Country</TableCell>
                        <TableCell>Certification</TableCell>
                        <TableCell align="right">Ingredients</TableCell>
                        <TableCell sx={{ minWidth: 190 }}>Products reached</TableCell>
                        <TableCell align="right">Stores</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.suppliers.map((supplier, index) => (
                        <TableRow key={supplier.supplier} hover>
                          <TableCell sx={{ fontWeight: 650, whiteSpace: "nowrap" }}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                              {index === 0 && (
                                <Tooltip title="Highest concentration risk">
                                  <Chip
                                    label="1"
                                    size="small"
                                    sx={{
                                      bgcolor: "#FCEEED",
                                      color: "#B3261E",
                                      fontWeight: 800,
                                      minWidth: 22,
                                    }}
                                  />
                                </Tooltip>
                              )}
                              <span>{supplier.supplier}</span>
                            </Stack>
                          </TableCell>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>{supplier.country}</TableCell>
                          <TableCell>
                            <Chip label={supplier.certification} size="small" variant="outlined" />
                          </TableCell>
                          <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                            {supplier.ingredientCount}
                          </TableCell>
                          <TableCell>
                            <BarCell
                              value={supplier.productsAffected}
                              max={maxSupplierProducts}
                              alert={index === 0}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                            {supplier.storesAffected}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Box>

          <Box>
            <Typography variant="h2" sx={{ mb: 0.5 }}>
              Ingredients with the widest reach
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 780 }}>
              A contamination in any of these would be the most expensive kind of recall. Note
              that the widest-reaching ingredients are usually the dullest ones — sugar, flour,
              emulsifiers — precisely because they go into everything.
            </Typography>

            <Paper sx={{ overflow: "hidden" }}>
              {data.ingredients.length === 0 ? (
                <EmptyState title="No ingredient data" />
              ) : (
                <TableContainer>
                  <Table size="small" sx={{ minWidth: 620 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Ingredient</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell sx={{ minWidth: 220 }}>Products reached</TableCell>
                        <TableCell align="right">Stores</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.ingredients.map((ingredient, index) => (
                        <TableRow key={ingredient.ingredient} hover>
                          <TableCell sx={{ fontWeight: 650 }}>{ingredient.ingredient}</TableCell>
                          <TableCell>
                            <Chip
                              label={ingredient.category}
                              size="small"
                              sx={{
                                bgcolor: "transparent",
                                border: "1px solid",
                                borderColor: CATEGORY_COLORS[ingredient.category] ?? "divider",
                                color: CATEGORY_COLORS[ingredient.category] ?? "text.secondary",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <BarCell
                              value={ingredient.productCount}
                              max={maxIngredientProducts}
                              alert={index === 0}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                            {ingredient.storeCount}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          </Box>
        </Stack>
      )}
    </>
  );
}

function BarCell({ value, max, alert }: { value: number; max: number; alert?: boolean }) {
  return (
    <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
      <Typography
        variant="body2"
        sx={{ fontWeight: 650, minWidth: 26, fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={(value / max) * 100}
        sx={{
          flexGrow: 1,
          height: 7,
          borderRadius: 4,
          bgcolor: "#EDEFF1",
          "& .MuiLinearProgress-bar": {
            borderRadius: 4,
            bgcolor: alert ? "#B3261E" : "primary.main",
          },
        }}
      />
    </Stack>
  );
}
