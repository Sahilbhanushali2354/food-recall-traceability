"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CloudOffRoundedIcon from "@mui/icons-material/CloudOffRounded";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

import { ApiError } from "@/actions";

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <Box sx={{ p: 2 }} aria-busy="true" aria-label="Loading results">
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" width={`${100 / columns}%`} height={20} />
        ))}
      </Stack>
      {Array.from({ length: rows }).map((_, r) => (
        <Stack key={r} direction="row" spacing={2} sx={{ mb: 1.5 }}>
          {Array.from({ length: columns }).map((_, c) => (
            <Skeleton
              key={c}
              variant="rounded"
              width={`${100 / columns}%`}
              height={c === 0 ? 34 : 28}
            />
          ))}
        </Stack>
      ))}
    </Box>
  );
}

export function CardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
      }}
      aria-busy="true"
      aria-label="Loading"
    >
      {Array.from({ length: count }).map((_, i) => (
        <Paper key={i} sx={{ p: 2.5 }}>
          <Skeleton variant="rounded" width={92} height={22} sx={{ mb: 1.5 }} />
          <Skeleton variant="text" height={26} width="70%" />
          <Skeleton variant="text" height={18} />
          <Skeleton variant="text" height={18} width="85%" />
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Skeleton variant="rounded" width={78} height={30} />
            <Skeleton variant="rounded" width={78} height={30} />
          </Stack>
        </Paper>
      ))}
    </Box>
  );
}

export function ChainSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <Stack spacing={2} sx={{ p: 2 }} aria-busy="true" aria-label="Loading chains">
      {Array.from({ length: rows }).map((_, i) => (
        <Box key={i}>
          <Skeleton variant="text" width="35%" height={22} />
          <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} variant="rounded" width={110 + j * 14} height={30} />
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        textAlign: "center",
        py: { xs: 5, sm: 7 },
        px: 3,
        color: "text.secondary",
      }}
    >
      <Box sx={{ mb: 1.5, color: "text.disabled", display: "flex", justifyContent: "center" }}>
        {icon ?? <SearchOffRoundedIcon sx={{ fontSize: 40 }} />}
      </Box>
      <Typography variant="h4" sx={{ color: "text.primary", mb: 0.75 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" sx={{ maxWidth: 460, mx: "auto" }}>
          {description}
        </Typography>
      )}
      {action && <Box sx={{ mt: 2.5 }}>{action}</Box>}
    </Box>
  );
}

export function ErrorState({ error, onRetry }: { error: Error; onRetry?: () => void }) {

  const isOffline = error instanceof ApiError && error.kind === "unavailable";

  return (
    <Paper
      sx={{
        textAlign: "center",
        py: { xs: 4, sm: 6 },
        px: 3,
        borderColor: isOffline ? "#F3C9C6" : undefined,
        bgcolor: isOffline ? "#FEF7F6" : "background.paper",
      }}
      role="alert"
    >
      <Box sx={{ mb: 1.5, color: isOffline ? "error.main" : "text.disabled" }}>
        {isOffline ? (
          <CloudOffRoundedIcon sx={{ fontSize: 42 }} />
        ) : (
          <ErrorOutlineRoundedIcon sx={{ fontSize: 42 }} />
        )}
      </Box>
      <Typography variant="h4" sx={{ mb: 0.75 }}>
        {isOffline ? "Traceability database unavailable" : "That didn't work"}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480, mx: "auto" }}>
        {error.message}
      </Typography>
      {onRetry && (
        <Button
          variant="outlined"
          color={isOffline ? "error" : "primary"}
          startIcon={<RefreshRoundedIcon />}
          onClick={onRetry}
          sx={{ mt: 2.5 }}
        >
          Try again
        </Button>
      )}
    </Paper>
  );
}
