"use client";

import { useEffect, useMemo } from "react";
import { useForm, useWatch, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import CircularProgress from "@mui/material/CircularProgress";
import { useAllergens, useIngredients, ApiError } from "@/actions";
import { buildCreateIngredientSchema, INGREDIENT_CATEGORIES } from "@/schemas/ingredient";
import type { CreateIngredientInput } from "@/types";

export const SELECT_MENU_PROPS = {
  disableAutoFocusItem: true,
  anchorOrigin: { vertical: "bottom", horizontal: "left" } as const,
  transformOrigin: { vertical: "top", horizontal: "left" } as const,
  slotProps: { paper: { sx: { maxHeight: 320, mt: 0.5 } } },
};

export default function AddIngredientDialog({
  open,
  initialName,
  onClose,
  onCreated,
}: {
  open: boolean;
  initialName: string;
  onClose: () => void;
  onCreated: (name: string) => void;
}) {
  const { data: allergens } = useAllergens();
  const { ingredients, createIngredient } = useIngredients();
  const resetCreateIngredient = createIngredient.reset;

  const schema = useMemo(
    () => buildCreateIngredientSchema((ingredients ?? []).map((i) => i.name)),
    [ingredients],
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateIngredientInput>({
    resolver: zodResolver(schema) as Resolver<CreateIngredientInput>,
    defaultValues: { name: initialName, category: "additive", allergens: [] },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (open) {
      reset({ name: initialName, category: "additive", allergens: [] });
      resetCreateIngredient();
    }
  }, [open, initialName, reset, resetCreateIngredient]);

  const chosenAllergens = useWatch({ control, name: "allergens" });

  const onSubmit = handleSubmit((values) => {
    createIngredient.mutate(values, {
      onSuccess: (result) => {
        onCreated(result.name);
        onClose();
      },
      onError: (error) => {
        if (error instanceof ApiError && error.kind === "conflict") {
          setError("name", { message: error.message });
        }
      },
    });
  });

  const submitError =
    createIngredient.error instanceof ApiError && createIngredient.error.kind !== "conflict"
      ? createIngredient.error.message
      : null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        New ingredient
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          It will be available to every product, not just this one.
        </Typography>
      </DialogTitle>

      <Box
        component="form"
        onSubmit={onSubmit}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: "1 1 auto",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <DialogContent dividers>
          <Stack spacing={2.5}>
            {submitError && <Alert severity="error">{submitError}</Alert>}

            <TextField
              label="Ingredient name"
              fullWidth
              autoFocus
              {...register("name")}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />

            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Category"
                  fullWidth
                  error={Boolean(errors.category)}
                  helperText={errors.category?.message}
                  slotProps={{ select: { MenuProps: SELECT_MENU_PROPS } }}
                >
                  {INGREDIENT_CATEGORIES.map((c) => (
                    <MenuItem key={c} value={c} sx={{ textTransform: "capitalize" }}>
                      {c}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Allergens it carries
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.25 }}>
                Anything selected here will surface in every product this ingredient reaches,
                however many steps away. Leave empty if it carries none.
              </Typography>

              <Controller
                name="allergens"
                control={control}
                render={({ field }) => (
                  <ToggleButtonGroup
                    value={field.value}
                    onChange={(_, value: string[]) => field.onChange(value)}
                    sx={{
                      flexWrap: "wrap",
                      gap: 1,
                      "& .MuiToggleButton-root": {
                        borderRadius: "8px !important",
                        border: "1px solid",
                        borderColor: "divider",
                        px: 1.75,
                        textTransform: "capitalize",
                      },
                    }}
                  >
                    {(allergens ?? []).map((a) => (
                      <ToggleButton key={a.name} value={a.name}>
                        {a.name}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                )}
              />
            </Box>

            {chosenAllergens.length > 0 && (
              <Alert severity="warning">
                <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                  {chosenAllergens.map((a) => (
                    <Chip key={a} label={a} size="small" />
                  ))}
                </Stack>
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={
              createIngredient.isPending ? <CircularProgress size={15} color="inherit" /> : undefined
            }
          >
            {createIngredient.isPending ? "Saving…" : "Create ingredient"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
