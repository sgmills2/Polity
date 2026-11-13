import test from "node:test";
import assert from "node:assert/strict";
import {
  parseVote,
  parseMembers,
  normalizedVote,
  votePath,
  loadVotes,
} from "../packages/frontend/src/data/houseVotes.ts";
const vote = {
  congress: 119,
  sessionNumber: 2,
  rollCallNumber: 74,
  legislationType: "HRES",
  legislationNumber: "1075",
  startDate: "2026-02-24T14:18:00-05:00",
  updateDate: "2026-02-25T14:09:11-05:00",
  result: "Passed",
  sourceDataURL: "https://clerk.house.gov/evs/2026/roll074.xml",
};
test("official source and dates are mandatory", () => {
  assert.equal(parseVote(vote).rollCallNumber, 74);
  for (const change of [
    { sourceDataURL: "https://evil.example/x" },
    { startDate: "invalid" },
    { rollCallNumber: "74" },
  ])
    assert.throws(() => parseVote({ ...vote, ...change }));
});
test("actual API uppercase bioguideID and original vote wording retained", () => {
  const m = {
    bioguideID: "TEST001",
    firstName: "Test",
    lastName: "Fixture",
    voteState: "IL",
    voteParty: "D",
    voteCast: "No",
  };
  assert.equal(
    parseMembers({ houseRollCallVoteMemberVotes: { results: [m] } })[0]
      .voteCast,
    "No",
  );
  assert.throws(() =>
    parseMembers({ houseRollCallVoteMemberVotes: { results: [m, m] } }),
  );
  assert.equal(normalizedVote("No"), "Nay");
  assert.equal(normalizedVote("Not Voting"), "Not Voting");
  assert.equal(normalizedVote("Unknown"), "Other: Unknown");
});
test("bounded endpoint selection", () => {
  assert.equal(votePath(119, 2, 74), "/house-vote/119/2/74");
  assert.throws(() => votePath(117, 1));
  assert.throws(() => votePath(119, 2, -1));
});
test("read-only credential-free browser request and rate-limit state", async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async (url, options) => {
      assert.equal(url.origin, "https://api.congress.gov");
      assert.equal(url.searchParams.get("api_key"), "DEMO_KEY");
      assert.equal(options.credentials, "omit");
      return { ok: false, status: 429 };
    };
    await assert.rejects(loadVotes(119, 2), /request limit/);
  } finally {
    globalThis.fetch = original;
  }
});

test("sorts full session rather than arbitrary page order", async () => {
  const original = globalThis.fetch;
  let calls = 0;
  try {
    globalThis.fetch = async (url) => {
      assert.equal(url.searchParams.get("limit"), "250");
      const offset = Number(url.searchParams.get("offset"));
      calls++;
      const rows =
        offset === 0
          ? Array.from({ length: 250 }, (_, i) => ({
              ...vote,
              rollCallNumber: i + 1,
            }))
          : [
              {
                ...vote,
                rollCallNumber: 323,
                startDate: "2026-11-12T10:59:00-05:00",
              },
            ];
      return {
        ok: true,
        json: async () => ({
          houseRollCallVotes: rows,
          pagination: { count: 251 },
        }),
      };
    };
    const result = await loadVotes(119, 2);
    assert.equal(calls, 2);
    assert.equal(result.votes.length, 251);
    assert.equal(result.votes[0].rollCallNumber, 323);
  } finally {
    globalThis.fetch = original;
  }
});
test("does not show partial, duplicate or changing sessions", async () => {
  const original = globalThis.fetch;
  try {
    for (const [rows, count] of [
      [[vote], 2],
      [[vote, vote], 2],
    ]) {
      globalThis.fetch = async () => ({
        ok: true,
        json: async () => ({ houseRollCallVotes: rows, pagination: { count } }),
      });
      await assert.rejects(loadVotes(119, 2));
    }
  } finally {
    globalThis.fetch = original;
  }
});
test("amendment and procedural votes do not require invented bill fields", () => {
  const { legislationType, legislationNumber, ...motion } = vote;
  assert.equal(
    parseVote({ ...motion, amendmentType: "HAMDT", amendmentNumber: "12" })
      .legislationType,
    "HAMDT",
  );
  assert.equal(parseVote(motion).legislationType, "Roll call");
});
