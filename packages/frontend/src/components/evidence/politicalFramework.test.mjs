import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  EVIDENCE_REQUIREMENTS,
  POLITICAL_DIMENSIONS,
  POLITICAL_TRADITIONS,
} from "./politicalFramework.ts";

test("dimensions have distinct stable IDs, readable endpoints and evidence criteria", () => {
  assert.equal(new Set(POLITICAL_DIMENSIONS.map((axis) => axis.id)).size, 4);
  for (const axis of POLITICAL_DIMENSIONS) {
    assert.ok(axis.start && axis.end && axis.start !== axis.end);
    assert.ok(axis.evidence.length >= 3);
    assert.equal("score" in axis, false);
  }
});

test("framework includes traditions beyond the American party midpoint", () => {
  const names = POLITICAL_TRADITIONS.map((item) => item.name);
  for (const tradition of ["Communism", "Socialism", "Anarchism", "Fascism"]) {
    assert.ok(names.includes(tradition));
  }
  assert.ok(
    EVIDENCE_REQUIREMENTS.some((item) => item.body.includes("unassessed")),
  );
});

test("spectrum cannot fabricate random politician scores or request legacy scores", () => {
  const source = readFileSync(
    new URL("../../pages/PoliticalSpectrum/index.tsx", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(
    source,
    /Math\.random|generateMock|getPoliticianScores|generatePoliticianScore/,
  );
  assert.match(source, /aria-pressed/);
  assert.match(source, /A guide to ideas, not politician ratings/);
});
