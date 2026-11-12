import HistoricalTimeline from "../../components/HistoricalTimeline";
import { DEMO_MODE } from "../../data/mode";
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
        This profile could not be loaded.
      </Alert>
    );
  if (!politician) return <Alert>Profile not found.</Alert>;
  return (
    <Stack spacing={3}>
      <Link component={RouterLink} to="/politicians">
        ← All people
      </Link>
      <Box
        sx={{
          py: { xs: 1, md: 3 },
          display: "flex",
          gap: 2.5,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Avatar
          src={politician.photoUrl || undefined}
          alt=""
          color="primary"
          sx={{ width: 88, height: 88, fontSize: "2rem" }}
        >
          {politician.name?.[0]}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          {DEMO_MODE && (
            <Typography
              level="body-xs"
              sx={{ color: "text.tertiary", mb: 0.5 }}
            >
              Illustrative profile
            </Typography>
          )}
          <Typography
            level="h1"
            sx={{
              fontSize: { xs: "2rem", md: "3rem" },
              letterSpacing: "-.03em",
              overflowWrap: "anywhere",
            }}
          >
            {politician.name}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
            <Chip size="sm" color="primary" variant="soft">
              {politician.party}
            </Chip>
            <Chip size="sm" variant="outlined">
              {politician.state}
            </Chip>
            <Chip size="sm" variant="outlined">
              {politician.chamber === "senate"
                ? "Senate"
                : politician.chamber === "house"
                  ? "House"
                  : "Office not listed"}
            </Chip>
          </Box>
        </Box>
      </Box>
      <HistoricalTimeline key={id} politicianId={id} />
      <Grid container spacing={2}>
        <Grid xs={12} md={4}>
          <Card sx={{ height: "100%", boxSizing: "border-box", p: 3 }}>
            <Typography level="h2" sx={{ fontSize: "1.3rem" }}>
              Political dimensions
            </Typography>
            <Typography>No assessment yet.</Typography>
            <Button
              component={RouterLink}
              to="/spectrum"
              variant="outlined"
              sx={{ mt: "auto" }}
            >
              Explore the framework →
            </Button>
          </Card>
        </Grid>
        <Grid xs={12} md={8}>
          <Card sx={{ height: "100%", boxSizing: "border-box", p: 3 }}>
            <Typography level="h2" sx={{ fontSize: "1.3rem" }}>
              Voting record
            </Typography>
            {history.isPending ? (
              <Typography role="status">Loading records…</Typography>
            ) : history.error ? (
              <Alert
                color="warning"
                endDecorator={
                  <Button size="sm" onClick={() => history.refetch()}>
                    Retry
                  </Button>
                }
              >
                Voting records could not be loaded.
              </Alert>
            ) : votes.length === 0 ? (
              <Typography>No source-reviewed records available yet.</Typography>
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
                      Primary record ↗
                    </Link>
                  </Box>
                ))}
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>
      <Box
        component="details"
        sx={{ fontSize: ".875rem", color: "text.secondary" }}
      >
        <Box component="summary" sx={{ cursor: "pointer", py: 1 }}>
          About this record
        </Box>
        <Typography level="body-sm">
          Profiles are incomplete. Voting records require reviewed
          primary-source references. Missing records do not imply a position or
          a clean record; real-person assessments are never inferred from party
          membership.
        </Typography>
      </Box>
    </Stack>
  );
}
