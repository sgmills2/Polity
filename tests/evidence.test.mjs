import test from "node:test";
import assert from "node:assert/strict";
import {
  officialSource,
  sourcedVotes,
  partyCode,
} from "../packages/frontend/src/data/evidence.ts";
const vote = {
  id: "v1",
  politician_id: "p1",
  vote: "Yea",
  vote_date: "2025-01-09",
  bill_title: "Fixture bill",
  source_url: "https://clerk.house.gov/Votes/20251",
  verification_status: "verified",
  reviewed_at: "2026-11-12",
};
test("missing, malformed and unreviewed data never becomes a score or vote", () => {
  for (const value of [
    undefined,
    null,
    {},
    [],
    [null],
    [{}],
    [{ ...vote, verification_status: undefined }],
    [{ ...vote, source_url: undefined }],
  ])
    assert.deepEqual(sourcedVotes(value, "p1"), []);
});
test("reviewed primary source, subject match and valid vote required", () => {
  assert.deepEqual(sourcedVotes([vote], "p1"), [vote]);
  assert.deepEqual(sourcedVotes([vote], "other"), []);
  for (const change of [
    { vote: "Maybe" },
    { vote_date: "unknown" },
    { reviewed_at: null },
    { bill_title: "" },
    { id: "" },
  ])
    assert.deepEqual(sourcedVotes([{ ...vote, ...change }], "p1"), []);
});
test("source links reject script URLs, lookalike domains and credentials", () => {
  for (const url of [
    "javascript:alert(1)",
    "http://senate.gov/record",
    "https://senate.gov.evil.example/record",
    "https://user@senate.gov/record",
    "https://www.senate.gov/",
  ])
    assert.equal(officialSource(url), null);
  assert.equal(officialSource(vote.source_url), vote.source_url);
});
test("duplicate vote identities are displayed once and latest first", () => {
  const newer = { ...vote, id: "v2", vote_date: "2025-02-01" };
  assert.deepEqual(sourcedVotes([vote, vote, newer], "p1"), [newer, vote]);
});
test("party filters support database and display labels without scoring", () => {
  for (const value of ["D", "Democrat", "Democratic"])
    assert.equal(partyCode(value), "D");
  assert.equal(partyCode("Republican"), "R");
  assert.equal(partyCode("Independent"), "I");
  assert.equal(partyCode("Green"), "Green");
});
