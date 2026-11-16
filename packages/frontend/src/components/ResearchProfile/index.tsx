import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Card, Chip, Link, Stack, Typography } from "@mui/joy";
import { type ResearchPerson, metadata, position } from "../../data/research";

export function PositionBar({
  score,
  label = "DW-NOMINATE",
}: {
  score: number | null;
  label?: string;
}) {
  return (
    <Box sx={{ py: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
        <Typography level="body-xs">← Left in Congress</Typography>
        <Typography level="body-xs">Right in Congress →</Typography>
      </Box>
      <Box
        role="img"
        aria-label={
          score === null
            ? `${label}: unavailable`
            : `${label}: ${score.toFixed(3)}, on a scale from minus one to plus one`
        }
        sx={{
          position: "relative",
          my: 1.5,
          height: 12,
          borderRadius: 12,
          background: "linear-gradient(90deg,#7c3aed,#e9d5ff,#9333ea)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            left: "50%",
            top: -4,
            height: 20,
            borderLeft: "1px solid #6b7280",
          }}
        />
        {score !== null && (
          <Box
            sx={{
              position: "absolute",
              left: `${position(score)}%`,
              top: -5,
              width: 18,
              height: 18,
              borderRadius: "50%",
              transform: "translateX(-50%)",
              bgcolor: "#fff",
              border: "3px solid #4c1d95",
              boxShadow: "0 1px 5px #0004",
            }}
          />
        )}
      </Box>
      <Typography level="body-xs">
        {label}: {score === null ? "not available" : score.toFixed(3)} · −1 to
        +1
      </Typography>
    </Box>
  );
}
export default function ResearchProfile({
  person,
}: {
  person: ResearchPerson;
}) {
  const points = person.history.filter((p) => p.nokkenPoole !== null);
  const series = [...new Set(points.map((p) => p.chamber + ":" + p.icpsr))].map(
    (key) => points.filter((p) => p.chamber + ":" + p.icpsr === key),
  );
  const first = points[0]?.congress ?? person.congress;
  const last = points[points.length - 1]?.congress ?? first;
  const x = (c: number) => 50 + ((c - first) / Math.max(1, last - first)) * 600;
  const y = (s: number) => 30 + (1 - s) * 100;
  return (
    <Stack spacing={3}>
      <Link component={RouterLink} to="/politicians">
        ← All people
      </Link>
      <Box>
        <Typography
          level="body-sm"
          sx={{ color: "primary.600", fontWeight: 700 }}
        >
          THE PUBLIC RECORD
        </Typography>
        <Typography
          level="h1"
          sx={{ fontSize: { xs: "2.4rem", md: "3.6rem" } }}
        >
          {person.name}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
          <Chip>{person.party}</Chip>
          <Chip variant="outlined">
            {person.state} · {person.chamber === "house" ? "House" : "Senate"}
            {person.chamber === "house" ? ` · District ${person.district}` : ""}
          </Chip>
          <Chip variant="outlined">119th Congress record</Chip>
        </Box>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: 2,
        }}
      >
        <Card sx={{ p: 3 }}>
          <Typography level="h2">Voting alignment</Typography>
          <Typography>
            Where this voting record sits within the U.S. congressional model.
          </Typography>
          <PositionBar score={person.nominate} />
          <Typography level="body-sm">
            This is a statistical estimate, not a global ideology label or a
            rating of character. Zero is the model midpoint, not political
            neutrality.
          </Typography>
          <Link
            href="https://voteview.com/about"
            target="_blank"
            rel="noreferrer"
          >
            How Voteview estimates positions ↗
          </Link>
        </Card>
        <Card sx={{ p: 3 }}>
          <Typography level="body-sm">SOURCE-REPORTED VOTES CAST</Typography>
          <Typography
            level="h2"
            sx={{ fontSize: "3rem", color: "primary.600" }}
          >
            {person.votes ?? "—"}
          </Typography>
          <Typography level="body-sm">
            In the 119th Congress data snapshot. Not an attendance rate or a
            measure of effectiveness.
          </Typography>
          <Typography level="body-xs">
            Retrieved {metadata.snapshotDate} · This may include former members
            or earlier party affiliations during this Congress.
          </Typography>
        </Card>
      </Box>
      <Card sx={{ p: { xs: 2, md: 3 } }}>
        <Typography level="h2">A record over time</Typography>
        <Typography level="body-sm">
          Independent per-Congress Nokken–Poole estimates. Changes can reflect
          the votes on the agenda, not just a change in personal beliefs. House
          lines are purple; Senate lines are amber. Separate chambers and
          party-record identities are not joined.
        </Typography>
        {points.length > 1 ? (
          <Box>
            <svg
              role="img"
              aria-label={`${person.name}: per-Congress voting alignment trend. Exact values in table below.`}
              viewBox="0 0 700 270"
              style={{ width: "100%", height: "auto", display: "block" }}
            >
              {[-1, 0, 1].map((v) => (
                <g key={v}>
                  <line
                    x1="50"
                    x2="650"
                    y1={y(v)}
                    y2={y(v)}
                    stroke="#d8c9eb"
                    strokeDasharray="4 4"
                  />
                  <text x="10" y={y(v) + 4} fill="#6b587e" fontSize="12">
                    {v === 1 ? "Right" : v === -1 ? "Left" : "0"}
                  </text>
                </g>
              ))}
              {series.map((rows, i) => (
                <polyline
                  key={i}
                  points={rows
                    .map((p) => `${x(p.congress)},${y(p.nokkenPoole!)}`)
                    .join(" ")}
                  fill="none"
                  stroke={rows[0].chamber === "house" ? "#7c3aed" : "#b45309"}
                  strokeWidth="3"
                />
              ))}
              {points.map((p) => (
                <circle
                  key={`${p.congress}-${p.chamber}-${p.icpsr}`}
                  cx={x(p.congress)}
                  cy={y(p.nokkenPoole!)}
                  r="4"
                  fill="#6d28d9"
                >
                  <title>
                    {p.congress}th Congress: {p.nokkenPoole!.toFixed(3)}
                  </title>
                </circle>
              ))}
              <text x="50" y="260" fill="#6b587e" fontSize="12">
                {first}th Congress
              </text>
              <text
                x="650"
                textAnchor="end"
                y="260"
                fill="#6b587e"
                fontSize="12"
              >
                {last}th Congress
              </text>
            </svg>
          </Box>
        ) : (
          <Typography>Not enough scored Congresses to draw a trend.</Typography>
        )}
        <Box component="details">
          <Box component="summary" sx={{ cursor: "pointer", py: 1 }}>
            Exact values and coverage
          </Box>
          <Box sx={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                textAlign: "left",
                borderCollapse: "collapse",
              }}
            >
              <caption>
                Published voting-model estimates, not issue-specific assessments
              </caption>
              <thead>
                <tr>
                  {[
                    "Congress",
                    "Chamber",
                    "Party",
                    "Nokken–Poole",
                    "Votes cast",
                  ].map((h) => (
                    <th key={h} style={{ padding: 8 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {person.history.map((p, i) => (
                  <tr key={`${p.congress}-${p.chamber}-${i}`}>
                    {[
                      p.congress,
                      p.chamber,
                      p.party,
                      p.nokkenPoole?.toFixed(3) ?? "Unavailable",
                      p.votes ?? "Unavailable",
                    ].map((v, j) => (
                      <td
                        key={j}
                        style={{ padding: 8, borderTop: "1px solid #eee" }}
                      >
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Box>
      </Card>
      <Card>
        <Typography level="h2">Follow the evidence</Typography>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Link
            href={`https://voteview.com/person/${person.icpsr}`}
            target="_blank"
            rel="noreferrer"
          >
            Voteview record & roll calls ↗
          </Link>
          <Link
            href={`https://bioguide.congress.gov/search/bio/${person.bioguideId}`}
            target="_blank"
            rel="noreferrer"
          >
            Official congressional biography ↗
          </Link>
          <Button component={RouterLink} to="/votes" variant="outlined">
            Explore House roll calls
          </Button>
          <Button component={RouterLink} to="/spectrum" variant="plain">
            Beyond one axis
          </Button>
        </Box>
        <Typography level="body-sm">
          Issue-by-issue positions, statements and legal records have not been
          assessed here. Absence of data is not an endorsement or a clean-record
          claim.
        </Typography>
        <Typography level="body-xs">{metadata.citation}</Typography>
        <Typography level="body-xs">
          Source files last modified{" "}
          {metadata.sourceLastModified["HS119_members.csv"]} (current) and{" "}
          {metadata.sourceLastModified["HSall_members.csv"]} (history). These
          timestamps are not the date of the latest vote.
        </Typography>
        <Link href="https://voteview.com/articles/data_help_members">
          Dataset definitions ↗
        </Link>
      </Card>
    </Stack>
  );
}
