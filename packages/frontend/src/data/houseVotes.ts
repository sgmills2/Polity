// Public trial key only. Never place private API keys in browser code.
export type HouseVote = {
  congress: number;
  sessionNumber: number;
  rollCallNumber: number;
  legislationType: string;
  legislationNumber: string;
  startDate: string;
  updateDate: string;
  result: string;
  sourceDataURL: string;
  voteQuestion?: string;
};
export type MemberVote = {
  bioguideID: string;
  firstName: string;
  lastName: string;
  voteState: string;
  voteParty: string;
  voteCast: string;
};
export function record(v: unknown): Record<string, unknown> {
  if (!v || typeof v !== "object" || Array.isArray(v))
    throw Error("Unexpected API response.");
  return v as Record<string, unknown>;
}
export function parseVote(value: unknown): HouseVote {
  const v = { ...record(value) };
  for (const k of ["congress", "sessionNumber", "rollCallNumber"])
    if (!Number.isInteger(v[k])) throw Error("Invalid vote identity.");
  for (const k of ["startDate", "updateDate", "result", "sourceDataURL"])
    if (typeof v[k] !== "string") throw Error("Incomplete vote record.");
  const u = new URL(v.sourceDataURL as string);
  if (
    u.protocol !== "https:" ||
    u.hostname !== "clerk.house.gov" ||
    u.username ||
    u.password
  )
    throw Error("Unexpected source.");
  if (
    !Number.isFinite(Date.parse(v.startDate as string)) ||
    !Number.isFinite(Date.parse(v.updateDate as string))
  )
    throw Error("Invalid vote date.");
  // Amendments and non-legislation motions legitimately omit bill fields.
  v.legislationType =
    typeof v.legislationType === "string"
      ? v.legislationType
      : typeof v.amendmentType === "string"
        ? v.amendmentType
        : "Roll call";
  v.legislationNumber =
    typeof v.legislationNumber === "string"
      ? v.legislationNumber
      : typeof v.amendmentNumber === "string"
        ? v.amendmentNumber
        : String(v.rollCallNumber);
  return v as HouseVote;
}
export function parseMembers(value: unknown): MemberVote[] {
  const rows = record(record(value).houseRollCallVoteMemberVotes).results;
  if (!Array.isArray(rows)) throw Error("Member votes unavailable.");
  const ids = new Set();
  return rows.map((row) => {
    const v = record(row);
    for (const k of [
      "bioguideID",
      "firstName",
      "lastName",
      "voteState",
      "voteParty",
      "voteCast",
    ])
      if (typeof v[k] !== "string") throw Error("Incomplete member record.");
    if (ids.has(v.bioguideID)) throw Error("Duplicate member.");
    ids.add(v.bioguideID);
    return v as MemberVote;
  });
}
export function normalizedVote(cast: string): string {
  return (
    (
      {
        Aye: "Yea",
        Yes: "Yea",
        Yea: "Yea",
        No: "Nay",
        Nay: "Nay",
        Present: "Present",
        "Not Voting": "Not Voting",
      } as Record<string, string>
    )[cast] ?? `Other: ${cast}`
  );
}
export function votePath(c: number, s: number, roll?: number): string {
  if (
    ![118, 119].includes(c) ||
    ![1, 2].includes(s) ||
    (roll !== undefined && (!Number.isInteger(roll) || roll < 1))
  )
    throw Error("Unsupported selection.");
  return `/house-vote/${c}/${s}${roll === undefined ? "" : `/${roll}`}`;
}
async function request(path: string, offset = 0): Promise<unknown> {
  if (!Number.isInteger(offset) || offset < 0 || offset > 10000)
    throw Error("Invalid page.");
  const url = new URL(`https://api.congress.gov/v3${path}`);
  url.search = new URLSearchParams({
    api_key: "DEMO_KEY",
    format: "json",
    limit: "250",
    offset: String(offset),
  }).toString();
  let res: Response;
  try {
    res = await fetch(url, {
      credentials: "omit",
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw Error("Congress.gov could not be reached. Try later.");
  }
  if (res.status === 429)
    throw Error(
      "Public trial request limit reached. Try later or open the official record.",
    );
  if (!res.ok) throw Error(`Congress.gov unavailable (HTTP ${res.status}).`);
  try {
    return await res.json();
  } catch {
    throw Error("Congress.gov returned unreadable data.");
  }
}
export async function loadVotes(c: number, s: number) {
  const votes: HouseVote[] = [];
  const ids = new Set<number>();
  let expected: number | undefined;
  // Full-session sorting avoids presenting arbitrary API order as recent votes.
  // Eight pages bound trial cost; failure never silently produces a partial list.
  for (let page = 0; page < 8; page++) {
    const data = record(await request(votePath(c, s), page * 250));
    if (!Array.isArray(data.houseRollCallVotes))
      throw Error("Vote list unavailable.");
    const count = record(data.pagination).count;
    if (!Number.isInteger(count) || Number(count) < 0 || Number(count) > 2000)
      throw Error(
        "Session exceeds trial coverage limits. Open Congress.gov for the complete record.",
      );
    if (expected !== undefined && expected !== count)
      throw Error(
        "Congress.gov changed during loading. Please try again later.",
      );
    expected = Number(count);
    const rows = data.houseRollCallVotes.map(parseVote);
    for (const v of rows) {
      if (v.congress !== c || v.sessionNumber !== s)
        throw Error("Session mismatch.");
      if (ids.has(v.rollCallNumber))
        throw Error("Overlapping source pages. Please try again later.");
      ids.add(v.rollCallNumber);
      votes.push(v);
    }
    if (votes.length === expected) {
      votes.sort(
        (a, b) =>
          Date.parse(b.startDate) - Date.parse(a.startDate) ||
          b.rollCallNumber - a.rollCallNumber,
      );
      return { votes, count: expected, fetchedAt: new Date().toISOString() };
    }
    if (votes.length > expected || rows.length !== 250)
      throw Error("Incomplete source response. No partial session is shown.");
  }
  throw Error("Session exceeds trial coverage limits.");
}
export async function loadMembers(v: HouseVote) {
  const data = record(
    await request(
      `${votePath(v.congress, v.sessionNumber, v.rollCallNumber)}/members`,
    ),
  );
  const detail = parseVote(data.houseRollCallVoteMemberVotes);
  if (
    detail.congress !== v.congress ||
    detail.sessionNumber !== v.sessionNumber ||
    detail.rollCallNumber !== v.rollCallNumber
  )
    throw Error("Vote identity mismatch.");
  if (data.pagination)
    throw Error("Pagination changed; consult official record.");
  return {
    members: parseMembers(data),
    detail,
    fetchedAt: new Date().toISOString(),
  };
}
