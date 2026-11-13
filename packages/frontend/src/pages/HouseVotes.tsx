import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Card,
  Button,
  Select,
  Option,
  Input,
  Link,
  Chip,
  Alert,
} from "@mui/joy";
import {
  HouseVote,
  loadVotes,
  loadMembers,
  normalizedVote,
} from "../data/houseVotes";
const date = (v: string) => new Date(v).toLocaleString();
export default function HouseVotes() {
  const [period, setPeriod] = useState("119-2"),
    [offset, setOffset] = useState(0),
    [selected, setSelected] = useState<HouseVote | null>(null),
    [search, setSearch] = useState("");
  const [c, s] = period.split("-").map(Number);
  const options = {
    staleTime: 300000,
    retry: false,
    refetchOnWindowFocus: false,
  };
  const list = useQuery({
    queryKey: ["house-votes", period],
    queryFn: () => loadVotes(c, s),
    ...options,
  });
  const detail = useQuery({
    queryKey: [
      "house-members",
      selected?.congress,
      selected?.sessionNumber,
      selected?.rollCallNumber,
    ],
    queryFn: () => loadMembers(selected!),
    enabled: !!selected,
    ...options,
  });
  const members = detail.data?.members.filter((m) =>
    `${m.firstName} ${m.lastName} ${m.voteState} ${m.voteParty}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <Box>
      <Chip color="primary">Official House records</Chip>
      <Typography level="h1" sx={{ mt: 1 }}>
        Follow the vote.
      </Typography>
      <Typography sx={{ my: 2 }}>
        Explore Congress.gov roll calls and individual representatives’ votes.
        These official records are separate from the illustrative politician
        profiles.
      </Typography>
      <Alert sx={{ mb: 3 }}>
        Public API trial: strict shared request limits apply. Not yet a
        continuous production feed. Coverage: House votes supplied for the 118th
        and 119th Congresses only, not Senate votes or a complete historical
        record. Some non-legislation votes may be absent.
      </Alert>
      <Select
        aria-label="Congress and session"
        value={period}
        onChange={(_, v) => {
          if (v) {
            setPeriod(v);
            setOffset(0);
            setSelected(null);
          }
        }}
        sx={{ maxWidth: 380, mb: 2 }}
      >
        {[
          ["119-2", "2026"],
          ["119-1", "2025"],
          ["118-2", "2024"],
          ["118-1", "2023"],
        ].map(([v, label]) => (
          <Option key={v} value={v}>
            {label} · Congress {v.slice(0, 3)}
          </Option>
        ))}
      </Select>
      {list.isLoading && (
        <Typography role="status">Loading official roll calls…</Typography>
      )}
      {list.error && (
        <Alert color="warning">{(list.error as Error).message}</Alert>
      )}
      {list.data && (
        <>
          <Typography level="body-sm" sx={{ mb: 2 }}>
            Retrieved {date(list.data.fetchedAt)} · {list.data.count} records
            reported. Sorted newest vote first after loading the complete API
            session. Newest returned vote:{" "}
            {list.data.votes[0] ? date(list.data.votes[0].startDate) : "none"}.
            API coverage may lag the House Clerk.
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "minmax(260px,1fr) minmax(0,2fr)",
              },
              gap: 2,
            }}
          >
            <Box>
              {list.data.votes.slice(offset, offset + 20).map((v) => (
                <Card key={v.rollCallNumber} sx={{ mb: 1 }}>
                  <Typography level="title-lg">
                    {v.legislationType} {v.legislationNumber}
                  </Typography>
                  <Typography level="body-sm">
                    Roll {v.rollCallNumber} · {date(v.startDate)}
                  </Typography>
                  <Typography>{v.result}</Typography>
                  <Button
                    variant="soft"
                    onClick={() => {
                      setSelected(v);
                      setSearch("");
                    }}
                  >
                    See member votes
                  </Button>
                </Card>
              ))}
              {!list.data.votes.length && (
                <Typography>No records returned.</Typography>
              )}
              <Box sx={{ display: "flex", gap: 1, my: 2 }}>
                <Button
                  disabled={!offset}
                  onClick={() => setOffset(offset - 20)}
                >
                  Previous
                </Button>
                <Button
                  disabled={offset + 20 >= list.data.count}
                  onClick={() => setOffset(offset + 20)}
                >
                  Next
                </Button>
              </Box>
            </Box>
            <Box>
              {!selected ? (
                <Card>
                  <Typography level="h2">From motion to member.</Typography>
                  <Typography>
                    Select a roll call. Procedural votes are not necessarily
                    votes for or against the underlying policy. No ideology
                    score is inferred.
                  </Typography>
                </Card>
              ) : (
                <Card>
                  <Typography level="h2">
                    {selected.legislationType} {selected.legislationNumber} ·
                    Roll {selected.rollCallNumber}
                  </Typography>
                  <Link
                    href={selected.sourceDataURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Original House Clerk record ↗
                  </Link>
                  <Typography level="body-sm">
                    Held {date(selected.startDate)} · Source updated{" "}
                    {date(selected.updateDate)}
                  </Typography>
                  {detail.isLoading && (
                    <Typography role="status">Loading members…</Typography>
                  )}
                  {detail.error && (
                    <Alert color="warning">
                      {(detail.error as Error).message}
                    </Alert>
                  )}
                  {detail.data && (
                    <>
                      <Typography level="title-lg">
                        {detail.data.detail.voteQuestion}
                      </Typography>
                      <Typography level="body-sm">
                        {detail.data.members.length} member records · Retrieved{" "}
                        {date(detail.data.fetchedAt)}. “Not Voting” is not a
                        vote against.
                      </Typography>
                      <Input
                        aria-label="Find member, state or party"
                        placeholder="Find member, state or party"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <Box
                        role="list"
                        aria-label="Member votes"
                        sx={{ maxHeight: 650, overflowY: "auto" }}
                      >
                        {members?.map((m) => (
                          <Box
                            role="listitem"
                            key={m.bioguideID}
                            sx={{
                              py: 1.5,
                              borderBottom: "1px solid",
                              borderColor: "divider",
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 1,
                              flexWrap: "wrap",
                            }}
                          >
                            <Box>
                              <Typography level="title-sm">
                                {m.firstName} {m.lastName}
                              </Typography>
                              <Typography level="body-xs">
                                {m.voteState} · {m.voteParty} · {m.bioguideID}
                              </Typography>
                            </Box>
                            <Chip title={`Source: ${m.voteCast}`}>
                              {normalizedVote(m.voteCast)}
                            </Chip>
                          </Box>
                        ))}
                        {members?.length === 0 && (
                          <Typography>No matching members.</Typography>
                        )}
                      </Box>
                    </>
                  )}
                </Card>
              )}
            </Box>
          </Box>
        </>
      )}
      <Link
        sx={{ display: "block", mt: 3 }}
        href="https://github.com/LibraryOfCongress/api.congress.gov/blob/main/Documentation/HouseRollCallVoteEndpoint.md"
        target="_blank"
        rel="noopener noreferrer"
      >
        API documentation and coverage
      </Link>
    </Box>
  );
}
