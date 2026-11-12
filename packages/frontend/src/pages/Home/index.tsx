import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  Chip,
  Stack,
} from "@mui/joy";

const pillars = [
  [
    "Follow the vote",
    "What happened, who voted, and the primary record. Missing evidence stays missing.",
  ],
  [
    "Read the fine print",
    "A future legislation workspace for the text, exceptions, beneficiaries, trade-offs and implementation dates.",
  ],
  [
    "Look beyond party",
    "Explore economics, political authority, equality and foreign policy without reducing everyone to red or blue.",
  ],
];
export default function Home() {
  return (
    <Stack spacing={4}>
      <Box sx={{ py: { xs: 2, md: 5 }, maxWidth: 800 }}>
        <Chip variant="outlined" sx={{ mb: 2 }}>
          Independent research prototype
        </Chip>
        <Typography
          level="h1"
          sx={{
            fontSize: { xs: "2.7rem", md: "4.4rem" },
            lineHeight: 1.05,
            mb: 2,
          }}
        >
          Less team sport.
          <br />
          More public record.
        </Typography>
        <Typography level="body-lg" sx={{ maxWidth: 650, mb: 3 }}>
          Understand what elected officials do, not just what they call
          themselves. A voter guide in the making, built around inspectable
          evidence and room for disagreement.
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button component={Link} to="/politicians" size="lg">
            Explore politicians
          </Button>
          <Button component={Link} to="/spectrum" variant="outlined" size="lg">
            Explore the political framework
          </Button>
        </Box>
      </Box>
      <Alert color="neutral">
        Early prototype, not a finished voter guide. The directory is connected
        to the existing API; voting provenance and assessments are still being
        built. No politician is assigned an invented score.
      </Alert>
      <Grid container spacing={2}>
        {pillars.map(([title, description]) => (
          <Grid xs={12} md={4} key={title}>
            <Card sx={{ height: "100%", boxSizing: "border-box" }}>
              <Typography level="h2" sx={{ fontSize: "1.4rem" }}>
                {title}
              </Typography>
              <Typography>{description}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Card variant="soft" sx={{ p: { xs: 2, md: 4 } }}>
        <Chip size="sm" variant="outlined">
          On the roadmap
        </Chip>
        <Typography level="h2">From your neighborhood to Washington</Typography>
        <Typography>
          Find your officials, read their records and contact their offices.
          Local coverage and address lookup are not connected yet. This
          prototype does not collect your address or create a voter profile.
        </Typography>
        <Typography level="body-sm">
          Planned: sourced speech highlights, contextual idea-frequency views,
          public legal records with dispositions, and contact drafts you review
          before sending.
        </Typography>
      </Card>
      <Typography level="body-sm">
        Our standard: apply the same evidence rules across parties. Separate
        documented facts, disputed claims and editorial analysis. Make methods,
        dates, sources and corrections visible.
      </Typography>
    </Stack>
  );
}
