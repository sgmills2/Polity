# Polity

An independent political-research prototype: follow public records, read legislation beyond its title, and assess positions with transparent evidence rather than party assumptions.

## What works today

- Existing API-backed politician directory with name, party, state and chamber filters.
- Profile pages with independent profile/voting loading and error states.
- An educational framework covering economic ownership, political authority, equal rights and foreign policy. It does **not** assign ratings to real people.
- A publication gate for votes: matched subject, reviewed status/date, valid vote/date and a specific official source URL. Existing records without this provenance are withheld, never replaced with invented votes.
- Responsive navigation and explicit prototype/coverage labels.

**Not yet connected:** source-reviewed voting ingestion, validated assessments, legislative fine-print reviews, social-post collections or heatmaps, legal records, address-to-official lookup, accounts and contact tools. These appear only as clearly marked roadmap concepts. This is not a complete voter guide.

The old party/name-derived scores, random vote counts and fabricated profile voting records are no longer displayed. The backend still contains experimental scoring and sync implementations; their presence does not establish validity or production readiness.

## Local development

React/TypeScript/Vite + MUI Joy; Express + Supabase; Yarn workspaces.
Use Node 24 for the native TypeScript regression tests. The repository includes its Yarn executable.

```sh
node .yarn/releases/yarn-4.1.0.cjs install --immutable
node .yarn/releases/yarn-4.1.0.cjs workspace @polity/shared build
node .yarn/releases/yarn-4.1.0.cjs workspace @polity/frontend dev
```

For an existing backend, set `VITE_API_URL=http://localhost:3001` in `packages/frontend/.env`. The frontend alone renders the framework and home page; directory/profile access needs the API. Do not add real secrets to source control. Backend setup uses `PORT`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` and `CONGRESS_API_KEY`; see its existing services before running any data-changing command.

```sh
node .yarn/releases/yarn-4.1.0.cjs workspace @polity/shared build
node .yarn/releases/yarn-4.1.0.cjs workspace @polity/frontend build
node .yarn/releases/yarn-4.1.0.cjs test
```

## Known blockers before a public release

- Existing aggregate backend build fails because `syncAllPoliticians.ts` imports the absent `services/enhancedSync` module.
- Existing lint command has no ESLint configuration. Frontend typecheck/build and focused tests are separate checks, not a full-repo quality pass.
- Sync mutation routes lack authentication in inspected code; a migration grants broad anonymous access. Actual deployed policies have not been verified. Removing public sync buttons is **not** server-side protection.
- The vote API currently does not provide the reviewed provenance fields required by the frontend gate. The empty state is intentional until the ingestion contract is implemented.
- Some backend logging may include credentials; audit and redact before use.
- Live database, API and deployment have not been verified in this iteration.

See [the evidence-first roadmap](docs/EVIDENCE_FIRST_ROADMAP.md) for the data contract and next steps.

## Disconnected preview

Build with `VITE_DEMO_MODE=true` for hash-based static hosting with dated, sourced Voteview congressional records and score/trend visualizations. Profile API helpers short-circuit locally; sync attempts throw instead of contacting a backend. House roll calls separately read the official public-trial Congress.gov feed. No private credentials, accounts, or database are connected. Normal builds remain API-backed. See docs/RESEARCH-PROFILES.md for coverage, methodology and refresh instructions.

```sh
VITE_DEMO_MODE=true node .yarn/releases/yarn-4.1.0.cjs workspace @polity/frontend build
```
