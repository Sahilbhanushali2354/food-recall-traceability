"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CampaignRoundedIcon from "@mui/icons-material/CampaignRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import RouteRoundedIcon from "@mui/icons-material/RouteRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import GlobalSearch from "./GlobalSearch";
import BrandMark from "./BrandMark";

const NAV = [
  { href: "/", label: "Recalls", Icon: CampaignRoundedIcon },
  { href: "/products", label: "Products", Icon: Inventory2RoundedIcon },
  { href: "/allergens", label: "Allergen checker", Icon: WarningAmberRoundedIcon },
  { href: "/trace", label: "Trace a route", Icon: RouteRoundedIcon },
  { href: "/risk", label: "Risk overview", Icon: InsightsRoundedIcon },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <AppBar
        position="sticky"
        color="inherit"
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "rgba(255,255,255,0.86)",
          backdropFilter: "blur(8px)",
          boxShadow: "none",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ gap: 1.5, minHeight: { xs: 60, md: 66 } }}>
            <IconButton
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { md: "none" } }}
              aria-label="Open navigation"
            >
              <MenuRoundedIcon />
            </IconButton>

            <Box
              component={Link}
              href="/"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.1,
                textDecoration: "none",
                color: "text.primary",
                flexShrink: 0,
              }}
            >
              <BrandMark size={30} />
              <Box sx={{ display: { xs: "none", sm: "block" }, lineHeight: 1.1 }}>
                <Typography sx={{ fontWeight: 750, fontSize: "0.95rem" }}>
                  Recall Traceability
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Farm to shelf, in one view
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 0.5, ml: 2 }}>
              {NAV.map(({ href, label, Icon }) => (
                <Button
                  key={href}
                  component={Link}
                  href={href}
                  startIcon={<Icon sx={{ fontSize: 18 }} />}
                  sx={{
                    color: isActive(href) ? "primary.main" : "text.secondary",
                    bgcolor: isActive(href) ? "action.hover" : "transparent",
                    px: 1.4,
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 1 }} />
            <GlobalSearch />
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 268, pt: 1 }} role="navigation">
          <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", px: 2, py: 1.5 }}>
            <BrandMark size={26} />
            <Typography sx={{ fontWeight: 750 }}>Recall Traceability</Typography>
          </Stack>
          <Divider />
          <List>
            {NAV.map(({ href, label, Icon }) => (
              <ListItemButton
                key={href}
                component={Link}
                href={href}
                selected={isActive(href)}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemIcon sx={{ minWidth: 38 }}>
                  <Icon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>

      <Container maxWidth="xl" component="main" sx={{ flexGrow: 1, py: { xs: 2.5, md: 4 } }}>
        {children}
      </Container>

    </Box>
  );
}
