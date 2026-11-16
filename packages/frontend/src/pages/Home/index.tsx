import { DEMO_MODE } from "../../data/mode";
import { Link } from "react-router-dom";
import { Box, Typography, Button, Grid, Card, Chip, Stack } from "@mui/joy";

export default function Home() {
  return (
    <Stack spacing={5}>
      <Box sx={{ py: { xs: 2, md: 5 }, maxWidth: 900 }}>
        <Typography
          level="body-sm"
          sx={{
            fontWeight: 700,
            letterSpacing: ".12em",
            color: "primary.plainColor",
            mb: 2,
          }}
        >
          PEOPLE. POSITIONS. POWER.
        </Typography>
        <Typography
          level="h1"
          sx={{
            fontSize: { xs: "3rem", md: "5rem" },
            letterSpacing: "-.045em",
            lineHeight: 1.02,
            mb: 3,
            color: "primary.plainColor",
          }}
        >
          Less team sport.
          <br />
          More public record.
        </Typography>
        <Typography level="body-lg" sx={{ maxWidth: 620, mb: 3 }}>
          Look beyond the party label. Explore political ideas, follow positions
          over time, and get closer to the decisions that shape everyday life.
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          <Button component={Link} to="/politicians" size="lg">
            Explore people →
          </Button>
          <Button component={Link} to="/spectrum" variant="outlined" size="lg">
            Explore ideas
          </Button>
        </Box>
      </Box>
      {DEMO_MODE && (
        <Card
          variant="soft"
          color="primary"
          sx={{ p: { xs: 2.5, md: 4 }, overflow: "hidden" }}
        >
          <Grid container spacing={3} sx={{ alignItems: "center" }}>
            <Grid xs={12} md={6}>
              <Typography level="body-sm" sx={{ fontWeight: 700, mb: 1 }}>
                THE LONG VIEW
              </Typography>
              <Typography
                level="h2"
                sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" }, mb: 2 }}
              >
                A position is a story.
                <br />
                Not a single score.
              </Typography>
              <Typography sx={{ maxWidth: 450, mb: 2 }}>
                Browse 119th Congress records, compare voting alignment, and
                trace per-Congress estimates alongside the underlying sources.
              </Typography>
              <Button
                component={Link}
                to="/politicians/S000033-29147"
                color="primary"
              >
                Explore Sanders’s record →
              </Button>
            </Grid>
            <Grid xs={12} md={6}>
              <Box
                sx={{
                  borderLeft: "2px solid",
                  borderColor: "primary.300",
                  pl: 2.5,
                  display: "grid",
                  gap: 2,
                }}
              >
                {[
                  ["01", "Find a representative"],
                  ["02", "See voting alignment"],
                  ["03", "Explore the historical record"],
                  ["04", "Read the source evidence"],
                ].map(([year, title]) => (
                  <Box
                    key={year}
                    sx={{ display: "flex", gap: 2, alignItems: "center" }}
                  >
                    <Chip color="primary" variant="outlined" size="sm">
                      {year}
                    </Chip>
                    <Typography level="title-md">{title}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Card>
      )}
      <Grid container spacing={2}>
        {[
          {
            number: "01",
            title: "Know the people",
            body: "Browse profiles by state, chamber and party.",
            to: "/politicians",
          },
          {
            number: "02",
            title: "Think in dimensions",
            body: "Economics, authority, rights and foreign policy. One axis is never enough.",
            to: "/spectrum",
          },
        ].map((item) => (
          <Grid key={item.number} xs={12} sm={6}>
            <Card
              component={Link}
              to={item.to}
              sx={{
                p: 3,
                height: "100%",
                boxSizing: "border-box",
                textDecoration: "none",
                "&:hover": {
                  borderColor: "primary.500",
                  bgcolor: "primary.softBg",
                },
              }}
            >
              <Typography
                level="body-sm"
                sx={{ color: "primary.plainColor", fontWeight: 700 }}
              >
                {item.number}
              </Typography>
              <Typography level="h2" sx={{ fontSize: "1.4rem" }}>
                {item.title} ↗
              </Typography>
              <Typography>{item.body}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
