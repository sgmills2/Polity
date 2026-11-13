import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the actual request helper without importing the database client or
// running a sync. Every request, response and credential below is a fixture.
const source = readFileSync(new URL('../packages/backend/src/services/votingRecords.ts', import.meta.url), 'utf8');
const start = source.indexOf('async function fetchFromCongressApi(');
const end = source.indexOf('\nasync function classifyBillByTopic(', start);
assert.ok(start >= 0 && end > start);
const helper = ts.transpileModule(source.slice(start, end), {
  compilerOptions: { target: ts.ScriptTarget.ES2022 },
}).outputText;
const key = 'synthetic-not-a-real-key';

function harness(fetch) {
  const logs = [];
  const context = vm.createContext({
    URL, fetch, process: { env: { CONGRESS_API_KEY: key } },
    console: Object.fromEntries(['log', 'warn', 'error', 'info', 'debug'].map(level =>
      [level, (...args) => logs.push(args.join(' '))])),
  });
  vm.runInContext(helper, context);
  return { request: context.fetchFromCongressApi, logs };
}

test('Congress request authenticates without logging URL or query parameters', async () => {
  let requested;
  const { request, logs } = harness(async url => {
    requested = new URL(url);
    return { ok: true, json: async () => ({ bills: [] }) };
  });
  await request('/bill/119', { limit: 2 });
  assert.equal(requested.origin, 'https://api.congress.gov');
  assert.equal(requested.searchParams.get('api_key'), key);
  assert.equal(requested.searchParams.get('limit'), '2');
  assert.deepEqual(logs, []);
});

test('Congress failures do not propagate secret-bearing transport or response details', async () => {
  const cases = [
    [async () => { throw new Error(`Failed URL ?api_key=${key}`); }, 'Congress API request failed'],
    [async () => ({ ok: false, status: 403, statusText: key }), 'Congress API error: 403'],
    [async () => ({ ok: true, json: async () => { throw new Error(key); } }), 'Congress API returned invalid JSON'],
  ];
  for (const [fetch, expected] of cases) {
    const { request, logs } = harness(fetch);
    await assert.rejects(request('/bill/119'), error => {
      assert.equal(error.message, expected);
      assert.equal(error.cause, undefined);
      assert.ok(!String(error).includes(key));
      return true;
    });
    assert.deepEqual(logs, []);
  }
});
