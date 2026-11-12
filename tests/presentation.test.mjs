import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const source = (p) =>
  readFileSync(
    new URL(`../packages/frontend/src/${p}`, import.meta.url),
    "utf8",
  );
test("presentation removes warning clutter while retaining discreet data distinctions", () => {
  assert.doesNotMatch(
    source("components/Layout/index.tsx"),
    /DEMO ONLY|No live API/,
  );
  assert.match(source("components/Layout/index.tsx"), /Illustrative profiles/);
  assert.match(
    source("pages/PoliticianDetail/index.tsx"),
    /Illustrative profile/,
  );
  assert.match(
    source("components/HistoricalTimeline/index.tsx"),
    /Illustrative history/,
  );
  assert.match(
    source("components/HistoricalTimeline/index.tsx"),
    /component="details"/,
  );
});
