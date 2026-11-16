import { DEMO_MODE } from "../../data/mode";
import { ReactNode } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
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
  { path: "/votes", label: "House votes" },
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
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main")?.focus();
          document.getElementById("main")?.scrollIntoView();
        }}
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
          bgcolor: "primary.softBg",
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
          sx={{
            textDecoration: "none",
            color: "primary.plainColor",
            display: "block",
          }}
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
                sx={{
                  borderRadius: "md",
                  "&.Mui-selected": {
                    bgcolor: "primary.solidBg",
                    color: "primary.solidColor",
                    "&:hover": { bgcolor: "primary.solidHoverBg" },
                  },
                }}
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
        {children}
        <Box
          component="footer"
          sx={{
            mt: 6,
            pt: 2,
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            gap: 2,
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Typography level="body-xs">
            Polity · Power, policy, evidence.
          </Typography>
          {DEMO_MODE && (
            <Typography level="body-xs">
              Voteview congressional records · Official House votes
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
