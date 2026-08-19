"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useSearch } from "@/actions";
import type { SearchResult } from "@/types";

const TYPE_ROUTES: Record<string, (name: string) => string | null> = {
  Product: (name) => `/products/${encodeURIComponent(name)}`,
  Recall: (name) => `/recalls/${encodeURIComponent(name)}`,
  Allergen: (name) => `/allergens?allergen=${encodeURIComponent(name)}`,
  Supplier: (name) => `/trace?supplier=${encodeURIComponent(name)}`,
  Store: (name) => `/trace?store=${encodeURIComponent(name)}`,
  Ingredient: () => null, // no dedicated page; ingredients surface within products
};

export default function GlobalSearch() {
  const router = useRouter();
  const [term, setTerm] = useState("");

  const { data, isFetching } = useSearch(term);

  const grouped = useMemo(
    () => [...(data ?? [])].sort((a, b) => a.type.localeCompare(b.type)),
    [data],
  );

  return (
    <Autocomplete<SearchResult, false, false, true>
      freeSolo
      size="small"
      sx={{ width: { xs: 150, sm: 240, md: 320 } }}
      options={grouped}
      groupBy={(option) => option.type}
      filterOptions={(x) => x}
      loading={isFetching}
      inputValue={term}
      onInputChange={(_, value) => setTerm(value)}
      getOptionLabel={(option) => (typeof option === "string" ? option : option.name)}

      isOptionEqualToValue={(a, b) =>
        typeof a === "string" || typeof b === "string"
          ? a === b
          : a.name === b.name && a.type === b.type
      }
      noOptionsText={
        term.trim().length < 2 ? "Type at least two letters" : "Nothing matched that"
      }
      onChange={(_, value) => {
        if (!value || typeof value === "string") return;
        const href = TYPE_ROUTES[value.type]?.(value.name);
        if (href) router.push(href);
      }}
      renderOption={(props, option) => {
        const { key, ...rest } = props as React.HTMLAttributes<HTMLLIElement> & { key: string };
        return (
          <Box component="li" key={key} {...rest} sx={{ display: "flex", gap: 1 }}>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>
              {option.name}
            </Typography>
            {option.detail && (
              <Chip label={option.detail} size="small" variant="outlined" />
            )}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search…"

          slotProps={{
            ...params.slotProps,
            input: {
              ...params.slotProps.input,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon sx={{ fontSize: 18, color: "text.disabled" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <>
                  {isFetching && <CircularProgress size={15} />}
                  {params.slotProps.input.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
}
