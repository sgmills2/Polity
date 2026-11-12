import test from "node:test";
import assert from "node:assert/strict";
import {
  illustrativeHistory,
  filterHistory,
  HISTORY_YEARS,
} from "../packages/frontend/src/data/history.ts";
import { PURPLE_SOLID } from "../packages/frontend/src/data/palette.ts";

test("invented timeline cannot attach to a real or non-demo profile", () => {
  assert.deepEqual(illustrativeHistory("demo-alex", false), []);
  assert.deepEqual(illustrativeHistory("real-person", true), []);
  assert.deepEqual(illustrativeHistory("demo-jordan", true), []);
  const events = illustrativeHistory("demo-alex", true);
  assert.equal(events.length, 9);
  assert(
    events.every(
      (event) => event.status === "illustrative" && !("source_url" in event),
    ),
  );
});
test("dimension, kind and year filters preserve gaps and chronological order", () => {
  const events = illustrativeHistory("demo-alex", true);
  const economy = filterHistory(events, "economy", "all", null);
  assert.deepEqual(
    economy.map((event) => Number(event.date.slice(0, 4))),
    HISTORY_YEARS,
  );
  assert.equal(filterHistory(events, "economy", "vote", null).length, 2);
  assert.equal(filterHistory(events, "economy", "statement", 2024).length, 1);
  assert.deepEqual(filterHistory(events, "authority", "all", 2022), []);
  assert.deepEqual(filterHistory(events, "rights", "vote", null), []);
});
test("fixture copies cannot mutate the underlying series", () => {
  const events = illustrativeHistory("demo-alex", true);
  events[0].title = "changed";
  assert.notEqual(illustrativeHistory("demo-alex", true)[0].title, "changed");
});
test("purple primary button contrast meets WCAG AA normal text contrast", () => {
  const luminance = (hex) => {
    const c = hex
      .slice(1)
      .match(/../g)
      .map((x) => parseInt(x, 16) / 255)
      .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const ratio =
    (luminance(PURPLE_SOLID.foreground) + 0.05) /
    (luminance(PURPLE_SOLID.background) + 0.05);
  assert(ratio >= 4.5, `contrast ${ratio}`);
});
