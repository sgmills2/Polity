import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/joy";

import { DEMO_MODE } from "./data/mode";

const Router = DEMO_MODE ? HashRouter : BrowserRouter;

import Layout from "./components/Layout";
import HouseVotes from "./pages/HouseVotes";
import Home from "./pages/Home";
import PoliticianDetail from "./pages/PoliticianDetail";
import PoliticianList from "./pages/PoliticianList";
import PoliticalSpectrum from "./pages/PoliticalSpectrum";

function App() {
  return (
    <Router>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.body",
        }}
      >
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/politicians" element={<PoliticianList />} />
            <Route path="/politicians/:id" element={<PoliticianDetail />} />
            <Route path="/votes" element={<HouseVotes />} />
            <Route path="/spectrum" element={<PoliticalSpectrum />} />
          </Routes>
        </Layout>
      </Box>
    </Router>
  );
}

export default App;
