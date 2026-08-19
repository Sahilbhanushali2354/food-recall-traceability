"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import StatCard, { PageHeader } from "@/components/StatCard";
import { TableSkeleton, EmptyState, ErrorState } from "@/components/States";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddProductDialog from "@/components/AddProductDialog";
import { useProducts, ApiError } from "@/actions";

export default function ProductsPage() {
  const { products, isLoading, error, refetch, deleteProduct } = useProducts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const isBlocked =
    deleteProduct.error instanceof ApiError && deleteProduct.error.kind === "conflict";

  const rows = useMemo(() => {
    const term = filter.trim().toLowerCase();
    if (!term) return products ?? [];
    return (products ?? []).filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term),
    );
  }, [products, filter]);

  const intermediates = (products ?? []).filter((p) => p.storeCount === 0).length;
  const onSale = (products ?? []).filter((p) => p.storeCount > 0).length;

  return (
    <>
      <PageHeader
        title="Products"
        description="Everything made in-house, from intermediates that never leave the factory to the multipacks on shelves. Add a product and it becomes traceable straight away."
        action={
          <Button
            variant="contained"
            startIcon={<AddRoundedIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Add product
          </Button>
        }
      />

      {products && !error && (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            mb: 3,
          }}
        >
          <StatCard value={products.length} label="Products" />
          <StatCard value={onSale} label="On sale" hint="Reach a store directly" />
          <StatCard value={intermediates} label="Made in-house" hint="Never sold on their own" />
        </Box>
      )}

      {products && products.length > 0 && (
        <TextField
          size="small"
          placeholder="Filter by name, brand or category…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ mb: 2, width: { xs: "100%", sm: 360 } }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ fontSize: 18, color: "text.disabled" }} />
                </InputAdornment>
              ),
            },
          }}
        />
      )}

      {isLoading && (
        <Paper>
          <TableSkeleton rows={8} columns={5} />
        </Paper>
      )}

      {error && <ErrorState error={error} onRetry={() => refetch()} />}

      {products && rows.length === 0 && (
        <Paper>
          <EmptyState
            icon={<Inventory2RoundedIcon sx={{ fontSize: 40 }} />}
            title={filter ? "Nothing matches that filter" : "No products yet"}
            description={
              filter
                ? "Try a different name, brand or category."
                : "Add your first product and its ingredients to start tracing."
            }
            action={
              !filter && (
                <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setDialogOpen(true)}>
                  Add product
                </Button>
              )
            }
          />
        </Paper>
      )}

      {products && rows.length > 0 && (
        <Paper sx={{ overflow: "hidden" }}>
          <TableContainer>
            <Table size="small" sx={{ minWidth: 720 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Ingredients</TableCell>
                  <TableCell align="right">Components</TableCell>
                  <TableCell>Availability</TableCell>
                  <TableCell align="right" sx={{ width: 56 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((product) => (
                  <TableRow key={product.name} hover>
                    <TableCell>
                      <Typography
                        component={Link}
                        href={`/products/${encodeURIComponent(product.name)}`}
                        variant="body2"
                        sx={{
                          fontWeight: 650,
                          textDecoration: "none",
                          color: "text.primary",
                          "&:hover": { color: "primary.main" },
                        }}
                      >
                        {product.name}
                      </Typography>
                      {product.batchCode && (
                        <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                          {product.batchCode}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>{product.brand}</TableCell>
                    <TableCell>
                      <Chip label={product.category} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                      {product.ingredientCount}
                    </TableCell>
                    <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>
                      {product.componentCount}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {product.storeCount > 0 ? (
                        <Typography variant="body2">
                          {product.storeCount} store{product.storeCount === 1 ? "" : "s"}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          In-house only
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Delete product">
                        <IconButton
                          size="small"
                          aria-label={`Delete ${product.name}`}
                          onClick={() => {

                            deleteProduct.reset();
                            setPendingDelete(product.name);
                          }}
                          sx={{

                            color: "text.disabled",
                            "&:hover": { color: "error.main", bgcolor: "#FCEEED" },
                          }}
                        >
                          <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <AddProductDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />

      <Dialog
        open={pendingDelete !== null}
        onClose={() => setPendingDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{isBlocked ? "Can't delete this yet" : "Delete this product?"}</DialogTitle>
        <DialogContent>

          {!isBlocked && (
            <DialogContentText>
              <strong>{pendingDelete}</strong> and its links to ingredients, components and
              shops will be removed. Nothing else is affected.
            </DialogContentText>
          )}
          {deleteProduct.error instanceof ApiError && (
            <Alert severity={isBlocked ? "warning" : "error"} sx={{ mt: isBlocked ? 0 : 2 }}>
              {deleteProduct.error.message}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>

          {isBlocked ? (
            <Button variant="contained" onClick={() => setPendingDelete(null)}>
              Close
            </Button>
          ) : (
            <>
              <Button
                onClick={() => setPendingDelete(null)}
                color="inherit"
                disabled={deleteProduct.isPending}
              >
                Cancel
              </Button>
              <Button
            variant="contained"
            color="error"
            disabled={deleteProduct.isPending}
            startIcon={
              deleteProduct.isPending ? (
                <CircularProgress size={15} color="inherit" />
              ) : (
                <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
              )
            }
            onClick={() =>
              pendingDelete &&
              deleteProduct.mutate(pendingDelete, {

                onSuccess: () => setPendingDelete(null),
              })
            }

            sx={{
              "&.Mui-disabled": { bgcolor: "error.main", color: "#fff", opacity: 0.75 },
            }}
          >
                {deleteProduct.isPending ? "Deleting…" : "Delete product"}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
