import test from "node:test";
import assert from "node:assert/strict";
import {
  DEMO_POLITICIANS,
  demoPolitician,
} from "../packages/frontend/src/data/demo.ts";
import { readFileSync } from "node:fs";
test("preview identities are unmistakably fictional and contain no personal data", () => {
  assert.equal(DEMO_POLITICIANS.length, 2);
  for (const person of DEMO_POLITICIANS) {
    assert.match(person.id, /^demo-/);
    assert.match(person.description, /Invented preview profile/);
    assert.equal(person.photoUrl, "");
    assert.equal(person.servingSince, "");
    assert.equal(person.overallScore, undefined);
  }
  assert.throws(() => demoPolitician("real-person"));
});
test("all preview API entry points short circuit before network calls", () => {
  const source = readFileSync(
    new URL("../packages/frontend/src/api/politicians.ts", import.meta.url),
    "utf8",
  );
  const functions = source.split("export async function ").slice(1);
  assert.equal(functions.length, 7);
  for (const body of functions) {
    assert.ok(body.indexOf("if (DEMO_MODE)") >= 0);
    assert.ok(body.indexOf("if (DEMO_MODE)") < body.indexOf("await api."));
  }
});
