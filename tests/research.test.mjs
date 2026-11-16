import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const { politicians: p, metadata: m } = JSON.parse(
  readFileSync(
    new URL(
      "../packages/frontend/src/data/research-politicians.json",
      import.meta.url,
    ),
  ),
);
test("sourced records have stable distinct identities, provenance and bounded scores", () => {
  assert.equal(p.length, m.rowCount);
  assert.equal(new Set(p.map((x) => x.id)).size, p.length);
  assert.equal(new Set(p.map((x) => x.bioguideId)).size, m.uniquePeople);
  assert.match(m.sourceUrl, /^https:\/\/voteview.com\//);
  for (const r of p) {
    assert.match(r.bioguideId, /^[A-Z]\d{6}$/);
    assert.ok(["house", "senate"].includes(r.chamber));
    assert.equal(r.congress, 119);
    for (const h of [r, ...r.history]) {
      assert.ok(h.nominate === null || (h.nominate >= -1 && h.nominate <= 1));
      assert.ok(
        h.nokkenPoole === null || (h.nokkenPoole >= -1 && h.nokkenPoole <= 1),
      );
      assert.ok(h.votes === null || Number.isInteger(h.votes));
      assert.doesNotMatch(h.party, /\.0/);
    }
  }
});
test("nulls and separate party records survive import rather than invented zeros", () => {
  assert.ok(p.some((x) => x.nominate === null));
  assert.ok(p.some((x) => x.votes === null));
  const k = p.filter((x) => x.bioguideId === "K000401");
  assert.ok(k.length === 2);
  assert.notEqual(k[0].id, k[1].id);
});
test("real profiles do not use illustrative histories and model is named", () => {
  const src = readFileSync(
    new URL(
      "../packages/frontend/src/components/ResearchProfile/index.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(src, /nokkenPoole/);
  assert.match(src, /DW-NOMINATE/);
  assert.doesNotMatch(src, /illustrativeHistory|Math.random/);
});
