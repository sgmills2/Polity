import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Grid,
  Input,
  Option,
  Select,
  Stack,
  Typography,
} from "@mui/joy";
import { getPoliticians } from "../../api/politicians";
import { partyCode } from "../../data/evidence";

export default function PoliticianList() {
  const [search, setSearch] = useState("");
  const [party, setParty] = useState("");
  const [state, setState] = useState("");
  const [chamber, setChamber] = useState("");
  const {
    data = [],
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["politicians"],
    queryFn: getPoliticians,
    retry: 1,
  });
  const states = useMemo(
    () =>
      [...new Set(data.map((person) => person.state).filter(Boolean))].sort(),
    [data],
  );
  const matches = data.filter(
    (person) =>
      (!search ||
        `${person.name} ${person.state}`
          .toLowerCase()
          .includes(search.trim().toLowerCase())) &&
      (!party || partyCode(person.party) === party) &&
      (!state || person.state === state) &&
      (!chamber || person.chamber === chamber),
  );
  const active = !!(search || party || state || chamber);
  const clear = () => {
    setSearch("");
    setParty("");
    setState("");
    setChamber("");
  };
  return (
    <Stack spacing={3}>
      <Box>
        <Typography level="h1">Who represents us?</Typography>
        <Typography level="body-lg">
          Start with a person. Follow the evidence.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
        <Input
          slotProps={{
            input: { "aria-label": "Search politicians by name or state" },
          }}
          placeholder="Search name or state"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ flex: "1 1 230px", minWidth: 0 }}
        />
        <Select
          aria-label="Filter by party"
          placeholder="All parties"
          value={party || null}
          onChange={(_, value) => setParty(value || "")}
          sx={{ minWidth: 140 }}
        >
          <Option value="">All parties</Option>
          <Option value="D">Democratic</Option>
          <Option value="R">Republican</Option>
          <Option value="I">Independent</Option>
        </Select>
        <Select
          aria-label="Filter by state"
          placeholder="All states"
          value={state || null}
          onChange={(_, value) => setState(value || "")}
          sx={{ minWidth: 120 }}
        >
          <Option value="">All states</Option>
          {states.map((value) => (
            <Option value={value} key={value}>
              {value}
            </Option>
          ))}
        </Select>
        <Select
          aria-label="Filter by chamber"
          placeholder="All chambers"
          value={chamber || null}
          onChange={(_, value) => setChamber(value || "")}
          sx={{ minWidth: 140 }}
        >
          <Option value="">All chambers</Option>
          <Option value="house">House</Option>
          <Option value="senate">Senate</Option>
        </Select>
        {active && (
          <Button variant="plain" onClick={clear}>
            Clear filters
          </Button>
        )}
      </Box>
      {isPending ? (
        <Typography role="status">Loading the directory…</Typography>
      ) : error ? (
        <Alert
          color="danger"
          endDecorator={<Button onClick={() => refetch()}>Retry</Button>}
        >
          The directory could not be loaded. No sample politicians are
          substituted.
        </Alert>
      ) : (
        <>
          <Typography role="status">
            {matches.length} of {data.length} profiles
          </Typography>
          {!matches.length && (
            <Card>
              <Typography level="h2" sx={{ fontSize: "1.4rem" }}>
                {active ? "No matching profiles" : "No profiles available yet"}
              </Typography>
              <Typography>
                {active
                  ? "Try another name or clear your filters."
                  : "The data connection may not be populated yet. This is not a complete list of elected officials."}
              </Typography>
            </Card>
          )}
          <Grid container spacing={2}>
            {matches.map((person) => (
              <Grid xs={12} sm={6} lg={4} key={person.id}>
                <Card
                  component={RouterLink}
                  to={`/politicians/${encodeURIComponent(person.id)}`}
                  sx={{
                    height: "100%",
                    boxSizing: "border-box",
                    textDecoration: "none",
                    "&:hover": { borderColor: "primary.500" },
                    "&:focus-visible": {
                      outline: "3px solid",
                      outlineColor: "primary.500",
                    },
                  }}
                >
                  <Avatar
                    src={person.photoUrl || undefined}
                    alt=""
                    sx={{ width: 56, height: 56 }}
                  >
                    {person.name[0]}
                  </Avatar>
                  <Typography
                    level="h2"
                    sx={{ fontSize: "1.3rem", overflowWrap: "anywhere" }}
                  >
                    {person.name}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Chip size="sm">{person.party || "Party not listed"}</Chip>
                    <Chip size="sm" variant="outlined">
                      {person.state || "State not listed"}
                    </Chip>
                  </Box>
                  <Typography>
                    {person.chamber === "house"
                      ? "House"
                      : person.chamber === "senate"
                        ? "Senate"
                        : "Office not listed"}
                  </Typography>
                  <Typography level="body-sm">View profile →</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Stack>
  );
}
