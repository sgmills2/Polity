import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Card, Link, Stack, Typography } from "@mui/joy";
import {
  EVIDENCE_REQUIREMENTS,
  POLITICAL_DIMENSIONS,
  POLITICAL_TRADITIONS,
} from "../../components/evidence/politicalFramework";

export default function PoliticalSpectrum() {
  const [dimensionId, setDimensionId] = useState<string>("economy");
  const dimension =
    POLITICAL_DIMENSIONS.find((item) => item.id === dimensionId) ??
    POLITICAL_DIMENSIONS[0];

  return (
    <Stack
      spacing={4}
      sx={{ maxWidth: 1160, mx: "auto", py: { xs: 1, md: 3 } }}
    >
      <Box>
        <Typography
          level="title-sm"
          sx={{
            color: "primary.600",
            mb: 1,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          The political spectrum
        </Typography>
        <Typography
          level="h1"
          sx={{ fontSize: { xs: "2rem", md: "3rem" }, maxWidth: 800, mb: 2 }}
        >
          Beyond two parties.
        </Typography>
        <Typography
          level="body-lg"
          sx={{ maxWidth: 760, color: "text.secondary" }}
        >
          Explore the ideas behind the labels: who holds power, who benefits,
          and whose rights are protected.
        </Typography>
      </Box>

      <Box component="section" aria-labelledby="dimensions-heading">
        <Typography id="dimensions-heading" level="h2" sx={{ mb: 2 }}>
          Different questions. Different dimensions.
        </Typography>
        <Box
          role="group"
          aria-label="Choose a political dimension"
          sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}
        >
          {POLITICAL_DIMENSIONS.map((item) => (
            <Button
              key={item.id}
              aria-pressed={dimension.id === item.id}
              variant={dimension.id === item.id ? "solid" : "outlined"}
              color="primary"
              onClick={() => setDimensionId(item.id)}
              sx={{
                minHeight: 44,
                ...(dimension.id === item.id
                  ? {
                      bgcolor: "#6d28d9",
                      color: "#fff",
                      "&:hover": { bgcolor: "#5b21b6" },
                    }
                  : {}),
              }}
            >
              {item.title}
            </Button>
          ))}
        </Box>
        <Card
          variant="outlined"
          sx={{ p: { xs: 2, md: 4 }, borderTop: "4px solid #7c3aed" }}
        >
          <Box aria-live="polite" aria-atomic="true">
            <Typography level="h3" sx={{ mb: 1 }}>
              {dimension.question}
            </Typography>
            <Typography level="body-md" sx={{ maxWidth: 800, mb: 3 }}>
              {dimension.description}
            </Typography>
            <Box component="figure" sx={{ m: 0, mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 2,
                  mb: 1,
                }}
              >
                <Typography level="title-sm" sx={{ maxWidth: "45%" }}>
                  {dimension.start}
                </Typography>
                <Typography
                  level="title-sm"
                  sx={{ maxWidth: "45%", textAlign: "right" }}
                >
                  {dimension.end}
                </Typography>
              </Box>
              <Box
                aria-hidden="true"
                sx={{
                  height: 8,
                  borderRadius: 8,
                  background:
                    "linear-gradient(90deg, #c4b5fd, #7c3aed, #4c1d95)",
                }}
              />
              <Typography
                component="figcaption"
                level="body-xs"
                sx={{ mt: 1, color: "text.secondary" }}
              >
                A guide to ideas, not politician ratings.
              </Typography>
            </Box>
            <Typography level="title-sm">Look at the record</Typography>
            <Box component="ul" sx={{ pl: 2.5, mb: 0 }}>
              {dimension.evidence.map((item) => (
                <Typography
                  component="li"
                  key={item}
                  level="body-sm"
                  sx={{ mb: 0.5 }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>
        </Card>
      </Box>

      <Box component="section" aria-labelledby="traditions-heading">
        <Typography id="traditions-heading" level="h2" sx={{ mb: 1 }}>
          Know the traditions
        </Typography>
        <Typography level="body-md" sx={{ mb: 2, maxWidth: 850 }}>
          A wider vocabulary than Democrat or Republican. These traditions
          overlap and differ across countries and eras; they are not evenly
          spaced stops on a single line.
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {POLITICAL_TRADITIONS.map((tradition) => (
            <Card
              key={tradition.name}
              variant="outlined"
              sx={{ borderRadius: "lg" }}
            >
              <Typography
                level="h3"
                sx={{ fontSize: "1.15rem", color: "primary.600" }}
              >
                {tradition.name}
              </Typography>
              <Typography level="body-sm">{tradition.description}</Typography>
            </Card>
          ))}
        </Box>
      </Box>

      <Box
        component="details"
        sx={{ borderTop: "1px solid", borderColor: "divider", pt: 2 }}
      >
        <Box
          component="summary"
          sx={{
            cursor: "pointer",
            py: 1,
            fontWeight: 600,
            "&:focus-visible": {
              outline: "2px solid #7c3aed",
              outlineOffset: 4,
            },
          }}
        >
          How to read this framework · sources & standards
        </Box>
        <Stack spacing={2} sx={{ mt: 2, maxWidth: 900 }}>
          <Typography level="body-sm">
            These descriptive axes are not calibrated measurements. The U.S.
            party midpoint is not a universal center. Individual assessments
            require linked evidence, issue-specific context and review; missing
            evidence does not mean a centrist position.
          </Typography>
          {EVIDENCE_REQUIREMENTS.map((item) => (
            <Box key={item.title}>
              <Typography level="title-sm">{item.title}</Typography>
              <Typography level="body-sm">{item.body}</Typography>
            </Box>
          ))}
          <Typography level="body-sm">
            Background reading:{" "}
            <Link
              href="https://plato.stanford.edu/entries/socialism/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Stanford Encyclopedia: socialism
            </Link>
            ,{" "}
            <Link
              href="https://plato.stanford.edu/entries/anarchism/"
              target="_blank"
              rel="noopener noreferrer"
            >
              anarchism
            </Link>
            ,{" "}
            <Link
              href="https://www.britannica.com/topic/fascism"
              target="_blank"
              rel="noopener noreferrer"
            >
              Britannica: fascism
            </Link>
            . These references inform the concepts; they do not validate
            Polity’s framework.
          </Typography>
        </Stack>
      </Box>
      <Box>
        <Button
          component={RouterLink}
          to="/politicians"
          variant="solid"
          color="primary"
        >
          Explore politician profiles
        </Button>
      </Box>
    </Stack>
  );
}
