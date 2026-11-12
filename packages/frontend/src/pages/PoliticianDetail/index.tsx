import { Link as RouterLink, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Grid,
  Link,
  Stack,
  Typography,
} from "@mui/joy";
import {
  getPolitician,
  getPoliticianVotingHistory,
} from "../../api/politicians";
import { sourcedVotes } from "../../data/evidence";

const researchAreas = [
  [
    "Legislation, beyond the title",
    "Read the provision, affected groups, funding, exceptions and sunset dates. Separate enacted law from proposals, and analysis from the text.",
  ],
  [
    "Words and ideas over time",
    "Future speech and post analysis will show the sampled period, missing material and quotations in context. Frequency alone cannot establish blame, prejudice or intent.",
  ],
  [
    "Public legal record",
    "Future entries need a source, identity match, date, jurisdiction and current disposition. Allegations, charges, civil findings and convictions are different. An arrest is not proof of guilt.",
  ],
];

export default function PoliticianDetail() {
  const { id = "" } = useParams<{ id: string }>();
  const profile = useQuery({
    queryKey: ["politician", id],
    queryFn: () => getPolitician(id),
    enabled: !!id,
    retry: 1,
  });
  const history = useQuery({
    queryKey: ["politician-voting-history", id],
    queryFn: () => getPoliticianVotingHistory(id),
    enabled: !!id,
    retry: 1,
  });
  const votes = sourcedVotes(history.data, id);
  const politician = profile.data;
  if (profile.isPending)
    return (
      <Box role="status" sx={{ p: 4 }}>
        <CircularProgress />
        <Typography>Loading profile…</Typography>
      </Box>
    );
  if (profile.error)
    return (
      <Alert
        color="danger"
        endDecorator={<Button onClick={() => profile.refetch()}>Retry</Button>}
      >
        This profile could not be loaded. No substitute data is shown.
      </Alert>
    );
  if (!politician) return <Alert>Profile not found.</Alert>;

  return (
    <Stack spacing={3}>
      <Link component={RouterLink} to="/politicians">
        ← All politicians
      </Link>
      <Card variant="soft" sx={{ p: { xs: 2, md: 4 } }}>
        <Chip size="sm" variant="outlined">
          Research prototype · coverage incomplete
        </Chip>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
            mt: 1,
          }}
        >
          <Avatar
            src={politician.photoUrl || undefined}
            alt=""
            sx={{ width: 72, height: 72 }}
          >
            {politician.name?.[0]}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              level="h1"
              sx={{
                fontSize: { xs: "1.8rem", md: "2.5rem" },
                overflowWrap: "anywhere",
              }}
            >
              {politician.name}
            </Typography>
            <Typography>
              {politician.party} · {politician.state} ·{" "}
              {politician.chamber === "senate"
                ? "Senate"
                : politician.chamber === "house"
                  ? "House"
                  : "Office not specified"}
            </Typography>
          </Box>
        </Box>
        <Typography level="body-sm">
          Directory information is imported and may be outdated. Current office
          and contact details still require source verification.
        </Typography>
      </Card>
      <Grid container spacing={2}>
        <Grid xs={12} md={4}>
          <Card sx={{ height: "100%", boxSizing: "border-box" }}>
            <Typography level="h2" sx={{ fontSize: "1.4rem" }}>
              Positions, not party guesses
            </Typography>
            <Chip color="neutral">Not yet assessed</Chip>
            <Typography>
              No ideology, vote count or confidence score is inferred from this
              person’s party or name. Missing evidence is not a centrist
              position.
            </Typography>
            <Button component={RouterLink} to="/spectrum" variant="outlined">
              Explore the framework
            </Button>
          </Card>
        </Grid>
        <Grid xs={12} md={8}>
          <Card sx={{ height: "100%", boxSizing: "border-box" }}>
            <Typography level="h2" sx={{ fontSize: "1.4rem" }}>
              Voting evidence
            </Typography>
            <Typography level="body-sm">
              Only records with a reviewed primary-source reference appear here.
              This is not a complete voting history.
            </Typography>
            {history.isPending ? (
              <Typography role="status">Checking available records…</Typography>
            ) : history.error ? (
              <Alert
                color="warning"
                endDecorator={
                  <Button size="sm" onClick={() => history.refetch()}>
                    Retry
                  </Button>
                }
              >
                Voting records could not be loaded. The profile remains
                available.
              </Alert>
            ) : votes.length === 0 ? (
              <Alert color="neutral">
                No source-reviewed votes are available here yet. Existing
                imports without provenance are withheld, not replaced with
                fictional votes.
              </Alert>
            ) : (
              <Stack component="ul" spacing={2} sx={{ pl: 2 }}>
                {votes.map((vote) => (
                  <Box component="li" key={vote.id}>
                    <Typography sx={{ fontWeight: 600 }}>
                      {vote.bill_title}
                    </Typography>
                    <Typography level="body-sm">
                      {vote.vote_date.slice(0, 10)} · {vote.vote}
                    </Typography>
                    <Link
                      href={vote.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Primary voting record ↗
                    </Link>
                  </Box>
                ))}
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>
      <Typography level="h2" sx={{ fontSize: "1.5rem" }}>
        The next layer of accountability
      </Typography>
      <Typography>
        These are planned research modules, not findings about {politician.name}
        .
      </Typography>
      <Grid container spacing={2}>
        {researchAreas.map(([title, description]) => (
          <Grid xs={12} md={4} key={title}>
            <Card sx={{ height: "100%", boxSizing: "border-box" }}>
              <Chip size="sm" variant="outlined">
                Not connected yet
              </Chip>
              <Typography level="h3" sx={{ fontSize: "1.2rem" }}>
                {title}
              </Typography>
              <Typography>{description}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography level="body-sm">
        No allegation, quotation or legal history has been collected for this
        page. Lack of an entry does not mean a complete search found nothing.
      </Typography>
    </Stack>
  );
}
