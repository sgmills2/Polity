import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";

import App from "./App";
import { PURPLE, PURPLE_SOLID } from "./data/palette";

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          ...PURPLE,
          solidBg: PURPLE_SOLID.background,
          solidColor: PURPLE_SOLID.foreground,
          solidHoverBg: PURPLE[800],
          solidActiveBg: PURPLE[900],
          softBg: PURPLE[100],
          softColor: PURPLE[900],
          plainColor: PURPLE[800],
          outlinedColor: PURPLE[800],
        },
        background: { body: "#fcfaff", surface: "#ffffff" },
      },
    },
    dark: {
      palette: {
        primary: {
          ...PURPLE,
          solidBg: PURPLE_SOLID.background,
          solidColor: PURPLE_SOLID.foreground,
          solidHoverBg: PURPLE[800],
          softBg: "#37204f",
          softColor: PURPLE[100],
          plainColor: PURPLE[200],
          outlinedColor: PURPLE[200],
        },
        background: { body: "#160e24", surface: "#21172f" },
      },
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1, // Reduce retries for cleaner console output
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CssVarsProvider theme={theme}>
        <CssBaseline />
        <App />
      </CssVarsProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
