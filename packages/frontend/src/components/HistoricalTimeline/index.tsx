import { useState } from "react";
import { Alert, Box, Button, Card, Chip, Stack, Typography } from "@mui/joy";
import { POLITICAL_DIMENSIONS } from "../evidence/politicalFramework";
import { DEMO_MODE } from "../../data/mode";
import {
  HISTORY_YEARS,
  illustrativeHistory,
  filterHistory,
  type HistoryDimension,
  type EvidenceKind,
} from "../../data/history";

export default function HistoricalTimeline({
  politicianId,
}: {
  politicianId: string;
}) {
  const [dimension, setDimension] = useState<HistoryDimension>("economy");
  const [kind, setKind] = useState<EvidenceKind | "all">("all");
  const [year, setYear] = useState<number | null>(null);
  const events = illustrativeHistory(politicianId, DEMO_MODE);
  const visible = filterHistory(events, dimension, kind, year);
  const allInDimension = filterHistory(events, dimension, kind, null);
  const activeDimension = POLITICAL_DIMENSIONS.find(
    (item) => item.id === dimension,
  )!;
  return (
    <Card
      component="section"
      aria-labelledby="historical-heading"
      variant="outlined"
      sx={{
        p: { xs: 2, md: 4 },
        borderTop: "4px solid",
        borderTopColor: "primary.600",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            level="body-sm"
            sx={{ color: "primary.plainColor", fontWeight: 700 }}
          >
            THE LONG VIEW
          </Typography>
          <Typography id="historical-heading" level="h2">
            Positions through time
          </Typography>
        </Box>
        <Chip color="primary" variant="soft">
          {events.length
            ? "Illustrative timeline · invented events"
            : "Historical evidence not connected"}
        </Chip>
      </Box>
      <Typography>
        Compare what someone said with what they voted for, issue by issue. A
        later position can reflect a change, a compromise or a different
        question. Let the record explain the difference.
      </Typography>
      {!events.length ? (
        <Alert color="neutral">
          No reviewed historical series is available for this profile. Missing
          years are not evidence of consistency, a reversal or a centrist
          position.
        </Alert>
      ) : (
        <>
          <Alert color="warning">
            Every event below is invented for Alex Example’s design demo. These
            are not real votes, quotations, bills or assessments. No sources are
            implied.
          </Alert>
          <Box
            role="group"
            aria-label="Timeline dimension"
            sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}
          >
            {POLITICAL_DIMENSIONS.map((item) => (
              <Button
                key={item.id}
                size="sm"
                variant={dimension === item.id ? "solid" : "outlined"}
                aria-pressed={dimension === item.id}
                onClick={() => {
                  setDimension(item.id);
                  setYear(null);
                }}
              >
                {item.title}
              </Button>
            ))}
          </Box>
          <Typography level="title-lg" sx={{ mt: 1 }}>
            {activeDimension.question}
          </Typography>
          <Box
            role="group"
            aria-label="Evidence type"
            sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
          >
            {(["all", "vote", "statement"] as const).map((value) => (
              <Button
                key={value}
                size="sm"
                variant={kind === value ? "soft" : "plain"}
                aria-pressed={kind === value}
                onClick={() => {
                  setKind(value);
                  setYear(null);
                }}
              >
                {value === "all"
                  ? "Votes + statements"
                  : value === "vote"
                    ? "Votes only"
                    : "Statements only"}
              </Button>
            ))}
          </Box>
          <Box
            role="group"
            aria-label="Filter timeline year"
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, minmax(0, 1fr))",
                sm: "repeat(4, minmax(0, 1fr))",
              },
              gap: 1,
              my: 1,
            }}
          >
            {HISTORY_YEARS.map((value) => {
              const count = allInDimension.filter((event) =>
                event.date.startsWith(String(value)),
              ).length;
              return (
                <Button
                  key={value}
                  variant={year === value ? "solid" : "outlined"}
                  aria-pressed={year === value}
                  onClick={() => setYear(year === value ? null : value)}
                  sx={{ flexDirection: "column", gap: 0.5, p: 2, minWidth: 0 }}
                >
                  <span>{value}</span>
                  <Box
                    component="span"
                    sx={{ fontSize: "0.75rem", fontWeight: 400 }}
                  >
                    {count
                      ? `${count} illustrative ${count === 1 ? "event" : "events"}`
                      : "No example evidence"}
                  </Box>
                </Button>
              );
            })}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography role="status" level="body-sm">
              {visible.length} illustrative{" "}
              {visible.length === 1 ? "event" : "events"} ·{" "}
              {year ?? "all years"} · oldest first
            </Typography>
            {year !== null && (
              <Button size="sm" variant="plain" onClick={() => setYear(null)}>
                Show all years
              </Button>
            )}
          </Box>
          {!visible.length ? (
            <Alert color="neutral">
              No illustrative events match these filters. We do not draw a trend
              through this gap.
            </Alert>
          ) : (
            <Stack
              component="ol"
              spacing={2}
              sx={{ listStyle: "none", p: 0, m: 0, mt: 1 }}
            >
              {visible.map((event) => (
                <Box
                  component="li"
                  key={event.id}
                  sx={{
                    borderLeft: "3px solid",
                    borderColor:
                      event.kind === "vote" ? "primary.600" : "primary.300",
                    pl: 2,
                    py: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      flexWrap: "wrap",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography
                      component="time"
                      dateTime={event.date}
                      level="body-sm"
                    >
                      {event.date}
                    </Typography>
                    <Chip
                      size="sm"
                      color="primary"
                      variant={event.kind === "vote" ? "solid" : "outlined"}
                    >
                      {event.kind === "vote"
                        ? "◇ Illustrative vote"
                        : "○ Illustrative statement"}
                    </Chip>
                  </Box>
                  <Typography level="h3" sx={{ fontSize: "1.1rem" }}>
                    {event.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: "primary.plainColor",
                      fontWeight: 600,
                      mt: 0.5,
                    }}
                  >
                    {event.position}
                  </Typography>
                  <Box component="details" sx={{ mt: 1 }}>
                    <Box
                      component="summary"
                      sx={{
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        color: "primary.plainColor",
                        py: 0.5,
                      }}
                    >
                      Read context and evidence status
                    </Box>
                    <Typography level="body-sm" sx={{ mt: 1 }}>
                      {event.context}
                    </Typography>
                    <Typography level="body-xs" sx={{ mt: 1 }}>
                      Evidence status: synthetic design fixture. No primary
                      source exists for this event; it is excluded from all
                      real-person assessments.
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
          <Typography level="body-sm" sx={{ mt: 2 }}>
            Read the dates, not just the direction. Different bills and
            statements are not interchangeable observations. No numeric ideology
            trend is calculated from this sample.
          </Typography>
        </>
      )}
      <Box
        sx={{
          bgcolor: "primary.softBg",
          color: "primary.softColor",
          borderRadius: "md",
          p: 2,
          mt: 1,
        }}
      >
        <Typography level="title-sm" sx={{ color: "inherit" }}>
          What a real timeline will need
        </Typography>
        <Typography level="body-sm" sx={{ color: "inherit" }}>
          Event date and publication date, exact vote question or statement
          context, primary source, document version, issue-specific
          interpretation, counterevidence and coverage gaps. Votes and
          statements stay distinguishable; missing periods are never filled in.
        </Typography>
      </Box>
    </Card>
  );
}
