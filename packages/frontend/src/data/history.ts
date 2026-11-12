/** Synthetic UI fixtures only. This is not an ingestion endpoint or assessment model. */
export type HistoryDimension =
  | "economy"
  | "authority"
  | "rights"
  | "foreign-policy";
export type EvidenceKind = "vote" | "statement";
export interface IllustrativeEvent {
  id: string;
  date: string;
  dimension: HistoryDimension;
  kind: EvidenceKind;
  title: string;
  position: string;
  context: string;
  status: "illustrative";
}

const fixtures: IllustrativeEvent[] = [
  {
    id: "e1",
    date: "2020-05-12",
    dimension: "economy",
    kind: "statement",
    title: "Healthcare: a targeted expansion",
    position: "Public coverage for a limited group",
    context:
      "The speaker favors expanding an existing program for low-income households, while retaining the private insurance system.",
    status: "illustrative",
  },
  {
    id: "e2",
    date: "2022-08-16",
    dimension: "economy",
    kind: "vote",
    title: "Healthcare: a public-option proposal",
    position: "Supports an optional public plan",
    context:
      "A yes vote on a standalone public-option proposal. Bill text, amendments and vote stage would be necessary to interpret a real vote.",
    status: "illustrative",
  },
  {
    id: "e3",
    date: "2024-03-22",
    dimension: "economy",
    kind: "statement",
    title: "Healthcare: a wider commitment",
    position: "Calls for universal public coverage",
    context:
      "The stated aim has broadened. This does not establish what the person would vote for or how the proposal would be funded.",
    status: "illustrative",
  },
  {
    id: "e4",
    date: "2026-02-10",
    dimension: "economy",
    kind: "vote",
    title: "Healthcare: a narrower enacted step",
    position: "Supports a limited expansion",
    context:
      "A vote for a narrower measure after a broader statement. Compromise, available alternatives and legislative context matter; this is not automatically a reversal.",
    status: "illustrative",
  },
  {
    id: "a1",
    date: "2020-06-15",
    dimension: "authority",
    kind: "vote",
    title: "Emergency powers",
    position: "Supports temporary executive authority",
    context:
      "A time-limited authorization with a sunset clause. Scope and oversight would need to be read in the text.",
    status: "illustrative",
  },
  {
    id: "a2",
    date: "2024-04-19",
    dimension: "authority",
    kind: "statement",
    title: "Oversight of emergency powers",
    position: "Calls for stronger legislative review",
    context:
      "A later statement favors additional checks. There are no illustrative events for the intervening years; the gap is not interpolated.",
    status: "illustrative",
  },
  {
    id: "r1",
    date: "2022-09-01",
    dimension: "rights",
    kind: "statement",
    title: "Access to public services",
    position: "Supports broader accessibility",
    context:
      "A commitment to accessible public services. A statement alone does not show implementation or an enforcement record.",
    status: "illustrative",
  },
  {
    id: "f1",
    date: "2020-07-20",
    dimension: "foreign-policy",
    kind: "vote",
    title: "Military assistance",
    position: "Supports an assistance package",
    context:
      "A vote for assistance without a rights-reporting condition. No country or real legislation is represented.",
    status: "illustrative",
  },
  {
    id: "f2",
    date: "2024-11-08",
    dimension: "foreign-policy",
    kind: "statement",
    title: "Conditions on military assistance",
    position: "Calls for civilian-protection conditions",
    context:
      "A later statement adds conditions. Country, recipient, funding and exceptions must be compared before describing a real shift.",
    status: "illustrative",
  },
];

export const HISTORY_YEARS = [2020, 2022, 2024, 2026];
export function illustrativeHistory(
  politicianId: string,
  demoMode: boolean,
): IllustrativeEvent[] {
  // One known fixture only. Never silently attach invented history to other profiles.
  return demoMode && politicianId === "demo-alex"
    ? fixtures.map((event) => ({ ...event }))
    : [];
}
export function filterHistory(
  events: IllustrativeEvent[],
  dimension: HistoryDimension,
  kind: EvidenceKind | "all",
  year: number | null,
): IllustrativeEvent[] {
  return events
    .filter(
      (event) =>
        event.dimension === dimension &&
        (kind === "all" || event.kind === kind) &&
        (year === null || Number(event.date.slice(0, 4)) === year),
    )
    .sort((a, b) => a.date.localeCompare(b.date));
}
