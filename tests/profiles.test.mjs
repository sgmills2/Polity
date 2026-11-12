import test from "node:test";
import assert from "node:assert/strict";
import { normalizePolitician } from "../packages/frontend/src/data/politicians.ts";
test("snake case profiles normalize without inferring ideology", () => {
  const person = normalizePolitician({
    id: "fixture",
    name: "Example",
    chamber: "House",
    party: "D",
    photo_url: "https://example.org/photo",
    overall_score: 0.9,
  });
  assert.equal(person.chamber, "house");
  assert.equal(person.photoUrl, "https://example.org/photo");
  assert.equal(person.state, "");
  assert.equal(person.overallScore, undefined);
});
test("camel case profile metadata is preserved", () => {
  const person = normalizePolitician({
    id: "fixture",
    name: "Example",
    photoUrl: "https://example.org/photo",
    currentRole: "Representative",
  });
  assert.equal(person.currentRole, "Representative");
  assert.equal(person.photoUrl, "https://example.org/photo");
});
test("missing identity is an API error rather than a fabricated profile", () => {
  for (const value of [
    null,
    [],
    {},
    { id: "fixture" },
    { id: 12, name: "Example" },
  ])
    assert.throws(() => normalizePolitician(value));
});

test('real-person profiles never fall back to generated votes or scores', async () => {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(new URL('../packages/frontend/src/pages/PoliticianDetail/index.tsx', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /Math\.random|generateMock|generatePoliticianScore|getPoliticianScores/);
  assert.match(source, /sourcedVotes/);
  assert.match(source, /history\.error/);
});
