import { DEMO_MODE } from "../../data/mode";
import { ReactNode } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  Alert,
  Box,
  Sheet,
  List,
  ListItem,
  ListItemButton,
  Typography,
  Link,
} from "@mui/joy";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/politicians", label: "Politicians" },
  { path: "/spectrum", label: "Political framework" },
];
export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        minHeight: "100vh",
      }}
    >
      <Link
        href="#main"
        sx={{
          position: "absolute",
          left: "-10000px",
          "&:focus": {
            left: 8,
            top: 8,
            zIndex: 100,
            bgcolor: "background.surface",
            p: 2,
          },
        }}
      >
        Skip to content
      </Link>
      <Sheet
        component="nav"
        aria-label="Main navigation"
        sx={{
          width: { xs: "auto", md: 220 },
          flexShrink: 0,
          p: 2,
          borderRight: { md: "1px solid" },
          borderBottom: { xs: "1px solid", md: 0 },
          borderColor: "divider",
        }}
      >
        <Typography
          level="h4"
          component={RouterLink}
          to="/"
          sx={{ textDecoration: "none", color: "inherit", display: "block" }}
        >
          Polity
        </Typography>
        <Typography level="body-xs" sx={{ mb: 2 }}>
          Power, policy, evidence.
        </Typography>
        <List
          sx={{
            display: "flex",
            flexDirection: { xs: "row", md: "column" },
            flexWrap: "wrap",
            gap: 0.5,
          }}
        >
          {navItems.map((item) => (
            <ListItem key={item.path}>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={location.pathname === item.path}
                aria-current={
                  location.pathname === item.path ? "page" : undefined
                }
              >
                {item.label}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Sheet>
      <Box
        component="main"
        id="main"
        tabIndex={-1}
        sx={{ minWidth: 0, flex: 1, p: { xs: 2, md: 4 }, maxWidth: 1400 }}
      >
        {DEMO_MODE && (
          <Alert color="warning" sx={{ mb: 3 }}>
            DEMO ONLY · All people shown are fictional. No live API, database,
            account, address collection or messages are connected.
          </Alert>
        )}
        {children}
      </Box>
    </Box>
  );
}
