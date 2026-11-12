/** Publication gate, not a claim that a URL alone proves a fact.
 * A reviewed ingestion pipeline must supply this provenance before a vote is shown.
 */
export interface SourcedVote {
  id: string;
  politician_id: string;
  vote: "Yea" | "Nay" | "Present" | "Not Voting";
  vote_date: string;
  bill_title: string;
  source_url: string;
  verification_status: "verified";
  reviewed_at: string;
}

const officialHosts = new Set([
  "www.congress.gov",
  "congress.gov",
  "clerk.house.gov",
  "www.senate.gov",
  "senate.gov",
]);
export function officialSource(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      officialHosts.has(url.hostname) &&
      url.pathname !== "/"
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export function sourcedVotes(
  input: unknown,
  politicianId: string,
): SourcedVote[] {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  return input
    .filter((row): row is SourcedVote => {
      if (
        !row ||
        typeof row !== "object" ||
        typeof row.id !== "string" ||
        !row.id ||
        seen.has(row.id) ||
        row.politician_id !== politicianId ||
        row.verification_status !== "verified" ||
        !officialSource(row.source_url) ||
        typeof row.reviewed_at !== "string" ||
        !Number.isFinite(Date.parse(row.reviewed_at)) ||
        typeof row.vote_date !== "string" ||
        !Number.isFinite(Date.parse(row.vote_date)) ||
        typeof row.bill_title !== "string" ||
        !row.bill_title.trim() ||
        !["Yea", "Nay", "Present", "Not Voting"].includes(row.vote)
      )
        return false;
      seen.add(row.id);
      return true;
    })
    .sort((a, b) => Date.parse(b.vote_date) - Date.parse(a.vote_date));
}

export function partyCode(party: string): string {
  const label = party.toLowerCase();
  if (["d", "democrat", "democratic"].includes(label)) return "D";
  if (["r", "republican"].includes(label)) return "R";
  if (["i", "independent"].includes(label)) return "I";
  return party;
}
