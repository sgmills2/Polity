import {
  people,
  researchPerson,
  histogram,
  metadata,
} from "../../data/research";
import { PositionBar } from "../../components/ResearchProfile";
import { useMemo, useState, useEffect } from "react";
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
  Slider,
  Link,
  Typography,
} from "@mui/joy";
import { getPoliticians } from "../../api/politicians";
import { partyCode } from "../../data/evidence";

export default function PoliticianList() {
  const [range, setRange] = useState<number[]>([-1, 1]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("name");
  const [search, setSearch] = useState("");
  const [party, setParty] = useState("");
  const [state, setState] = useState("");
  const [chamber, setChamber] = useState("");
  useEffect(() => setPage(1), [range, search, party, state, chamber, sort]);
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
      (!chamber || person.chamber === chamber) &&
      ((range[0] === -1 && range[1] === 1) ||
        (researchPerson(person.id)?.nominate != null &&
          researchPerson(person.id)!.nominate! >= range[0] &&
          researchPerson(person.id)!.nominate! <= range[1])),
  );
  matches.sort((a, b) =>
    sort === "name"
      ? a.name.localeCompare(b.name)
      : ((researchPerson(a.id)?.nominate ?? 2) -
          (researchPerson(b.id)?.nominate ?? 2)) *
        (sort === "right" ? -1 : 1),
  );
  const bins = histogram(
    people.filter((p) => matches.some((m) => m.id === p.id)),
  );
  const maxCount = Math.max(1, ...bins.map((b) => b.count));
  const active = !!(
    search ||
    party ||
    state ||
    chamber ||
    range[0] !== -1 ||
    range[1] !== 1
  );
  const clear = () => {
    setRange([-1, 1]);
    setSearch("");
    setParty("");
    setState("");
    setChamber("");
  };
  return (
    <Stack spacing={3}>
      <Box>
        <Typography level="h1">People behind the votes</Typography>
        <Typography level="body-lg">
          119th Congress records. Start with a person, follow the evidence.
        </Typography>
      </Box>

      <Card variant="soft" color="primary" sx={{ p: { xs: 2, md: 3 } }}>
        <Typography level="h2">Explore the congressional spectrum</Typography>
        <Typography level="body-sm">
          A left-to-right view of roll-call alignment, not a global
          communist-to-fascist scale. Our broader political framework stays
          separate.
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "end",
            height: 105,
            gap: "3px",
            mt: 2,
          }}
          role="img"
          aria-label={`Distribution of ${bins.reduce((a, b) => a + b.count, 0)} scored matching records across 20 equal score bins`}
        >
          {bins.map((bin, i) => (
            <Box
              key={i}
              title={`${bin.start.toFixed(1)} to ${(bin.start + 0.1).toFixed(1)}: ${bin.count} records`}
              sx={{
                flex: 1,
                height: `${Math.max(2, (bin.count / maxCount) * 100)}%`,
                bgcolor: "primary.500",
                borderRadius: "4px 4px 0 0",
                opacity: 0.55 + i / 50,
              }}
            />
          ))}
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography level="body-xs">← Left · −1</Typography>
          <Typography level="body-xs">Right · +1 →</Typography>
        </Box>
        <Typography id="range-label" level="body-sm">
          Filter alignment range: {range[0].toFixed(2)} to {range[1].toFixed(2)}
        </Typography>
        <Slider
          getAriaLabel={(i) =>
            i === 0 ? "Minimum alignment" : "Maximum alignment"
          }
          value={range}
          onChange={(_, v) => setRange(v as number[])}
          min={-1}
          max={1}
          step={0.05}
          valueLabelDisplay="auto"
          sx={{ mx: 1, width: "calc(100% - 16px)" }}
        />
        <Typography level="body-xs">
          DW-NOMINATE · Voteview snapshot retrieved {metadata.snapshotDate}.
          Missing scores remain visible only when the full range is selected.
          Bars count records, not necessarily unique people.
        </Typography>
        <Link
          href="https://voteview.com/about"
          target="_blank"
          rel="noreferrer"
        >
          Read the methodology ↗
        </Link>
      </Card>
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
        <Select
          aria-label="Sort profiles"
          value={sort}
          onChange={(_, v) => setSort(v || "name")}
        >
          <Option value="name">Name A–Z</Option>
          <Option value="left">Left to right</Option>
          <Option value="right">Right to left</Option>
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
            {matches.length} of {data.length} records
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
            {matches.slice((page - 1) * 24, page * 24).map((person) => (
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
                  {researchPerson(person.id) && (
                    <PositionBar score={researchPerson(person.id)!.nominate} />
                  )}
                  <Typography level="body-xs">
                    119th Congress · source record
                  </Typography>
                  <Typography level="body-sm">
                    View profile & history →
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
          {matches.length > 24 && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Typography>
                Page {page} / {Math.ceil(matches.length / 24)}
              </Typography>
              <Button
                disabled={page * 24 >= matches.length}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </Box>
          )}
          <Typography level="body-xs">{metadata.coverage}</Typography>
        </>
      )}
    </Stack>
  );
}
