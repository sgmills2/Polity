import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Link,
  Stack,
  Typography,
} from "@mui/joy";
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
        <Chip variant="outlined" size="sm" sx={{ mb: 2 }}>
          Methodology lab · prototype
        </Chip>
        <Typography
          level="h1"
          sx={{ fontSize: { xs: "2rem", md: "3rem" }, maxWidth: 800, mb: 2 }}
        >
          Politics is bigger than two parties.
        </Typography>
        <Typography
          level="body-lg"
          sx={{ maxWidth: 820, color: "text.secondary" }}
        >
          Explore power, ownership, rights and foreign policy separately. The
          U.S. party midpoint is not a universal political center, and one label
          cannot explain an entire record.
        </Typography>
      </Box>

      <Alert color="neutral" variant="soft">
        <Box>
          <Typography level="title-sm">
            No politician rankings published yet
          </Typography>
          <Typography level="body-sm">
            This is a working framework, not a validated scoring system.
            Generated scores have been removed. No person is placed on these
            axes until a sourced, reviewable assessment exists.
          </Typography>
        </Box>
      </Alert>

      <Box component="section" aria-labelledby="dimensions-heading">
        <Typography id="dimensions-heading" level="h2" sx={{ mb: 1 }}>
          Explore the dimensions
        </Typography>
        <Typography level="body-sm" sx={{ mb: 2 }}>
          These descriptive axes are not equal-interval measurements or a
          ranking of moral worth.
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
              color="neutral"
              onClick={() => setDimensionId(item.id)}
              sx={{ minHeight: 44 }}
            >
              {item.title}
            </Button>
          ))}
        </Box>
        <Card
          variant="outlined"
          sx={{
            p: { xs: 2, md: 4 },
            borderTop: "4px solid",
            borderTopColor: "primary.500",
          }}
        >
          <Box aria-live="polite" aria-atomic="true">
            <Typography level="h3" sx={{ mb: 1 }}>
              {dimension.question}
            </Typography>
            <Typography level="body-md" sx={{ maxWidth: 800, mb: 3 }}>
              {dimension.description}
            </Typography>
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
                height: 10,
                bgcolor: "neutral.200",
                borderRadius: 8,
                border: "1px solid",
                borderColor: "neutral.400",
              }}
            />
            <Typography
              level="body-sm"
              sx={{ my: 2, textAlign: "center", color: "text.secondary" }}
            >
              Unassessed: no markers, no inferred center.
            </Typography>
            <Typography level="title-sm">Evidence to examine</Typography>
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
          A wider political vocabulary
        </Typography>
        <Typography level="body-md" sx={{ mb: 2, maxWidth: 850 }}>
          These are overlapping, contested traditions, not evenly spaced stops
          on one bar. “Progressive” is also context-dependent: ask progressive
          on which issue, compared with whom, and when?
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
            <Card key={tradition.name} variant="soft">
              <Typography level="h3" sx={{ fontSize: "1.15rem" }}>
                {tradition.name}
              </Typography>
              <Typography level="body-sm">{tradition.description}</Typography>
            </Card>
          ))}
        </Box>
        <Typography level="body-sm" sx={{ mt: 2 }}>
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
          . These references inform the concepts, not endorsements of this
          prototype’s methodology.
        </Typography>
      </Box>

      <Box component="section" aria-labelledby="evidence-heading">
        <Typography id="evidence-heading" level="h2" sx={{ mb: 2 }}>
          Same standard, every politician
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
            gap: 2,
          }}
        >
          {EVIDENCE_REQUIREMENTS.map((item, index) => (
            <Card key={item.title} variant="outlined">
              <Typography level="title-lg">
                {String(index + 1).padStart(2, "0")} / {item.title}
              </Typography>
              <Typography level="body-sm">{item.body}</Typography>
            </Card>
          ))}
        </Box>
        <Typography level="body-sm" sx={{ mt: 2 }}>
          Strong conclusions need strong evidence. A word frequency is not proof
          of prejudice; an allegation is not a finding; a party label is not a
          substitute for a record.
        </Typography>
      </Box>
      <Box>
        <Button
          component={RouterLink}
          to="/politicians"
          variant="solid"
          color="neutral"
        >
          Explore politician profiles
        </Button>
      </Box>
    </Stack>
  );
}
