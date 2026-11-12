# Evidence-first iteration · 2026-11-12

## Product direction

An accessible, useful voter guide with the same source standards for all parties. Critique documented actions and provisions, not invented measurements. Separate a fact, an allegation and editorial interpretation. The U.S. party midpoint is not a universal historical center.

The current framework uses four dimensions instead of compressing everything onto a liberal–conservative scale: economic power; democracy and authority; rights and belonging; foreign policy. Traditions including communism, socialism, anarchism and fascism are explained, not automatically assigned. Issue/time-specific evidence, counterevidence and uncertainty must precede a named-person placement.

## Implemented

- Removed synthetic votes and scores attached to real people, including partial-data fallback.
- No invented confidence percentages, party-based scores or inferred centrist defaults.
- Directory filters normalize party names; API models normalize snake/camel case metadata.
- A failed voting request does not erase an otherwise available profile.
- Removed public sync buttons (backend authorization is still a separate, unresolved requirement).
- Educational framework, clearly labeled future research modules and mobile navigation.
- Regression tests and a frontend-only CI workflow; not a claim that the full backend passes.

## Vote publication contract

`src/data/evidence.ts` accepts only a matched `politician_id`, stable `id`, valid `vote`, `vote_date`, nonempty `bill_title`, specific HTTPS official `source_url`, `verification_status: verified` and a `reviewed_at` date. Duplicate IDs are withheld. A URL whitelist is only a rendering safety check, **not** a verification process: a trusted ingestion/review process must establish that the source supports the particular vote and identity. The current backend omits these provenance fields; therefore legacy rows intentionally do not appear.

Next backend increment: store primary-source URLs, chamber/session/roll-call identifiers, retrieval timestamps, source version/hash, and review state. Return a typed read-only DTO. Distinguish unavailable, empty, partial and complete coverage. Never call a count of bill actions a count of individual votes.

Congress.gov's official House roll-call endpoint is `/v3/house-vote/{congress}/{session}/{rollCallNumber}` with `/members` for member positions. The official beta documentation describes legislation-associated House votes in the 118th and 119th Congresses; confirm current coverage when implementing. Do not use the legacy guessed `/vote/{congress}/{chamber}` route.

Sources:

- https://github.com/LibraryOfCongress/api.congress.gov/blob/main/Documentation/HouseRollCallVoteEndpoint.md
- Senate roll-call XML: https://www.senate.gov/general/XML.htm

## Planned modules, not implemented findings

### Legislative fine print

Link exact bill text/version and sections. Distinguish introduction, amendment, passage and enactment. Explain implementation dates, exceptions, affected groups, funding, likely trade-offs and uncertainty. Identify who voted for the actual version. Editorial judgments should have explicit criteria and evidence, with corrections and dissent visible. Start with one deeply sourced bill rather than broad unverified coverage.

### Rhetoric and idea frequency

Use authorized/publicly available sources. Show corpus date range, completeness, denominator, quotations, retweets versus original statements and changes over time. Topic mentions must not be labeled endorsement or blame without contextual review. A word heatmap is descriptive, not a prejudice or truth classifier. Preserve links, dates and context; do not invent or silently paraphrase quotations.

### Public legal record

Identity matching, jurisdiction, source, event date, case identifier and latest disposition are mandatory. Distinguish allegations, arrest, charge, dismissal/acquittal, conviction, civil finding and settlement. Do not imply an arrest establishes guilt or settlement admits liability. Track corrections and later developments, avoid publishing victims' identifying information, and never portray missing data as a clean record. No real-person allegations are part of this iteration.

### Find and contact my officials

Census geocoding can identify congressional and state legislative districts, not provide a complete officeholder roster. Local offices need separate authoritative jurisdiction/district sources. Google's Representatives API retired April 30, 2025; do not base implementation on it.

Prefer ephemeral address lookup with clear destination disclosure, no default storage or public address field. Accounts are optional, with minimal retention. Present official contact methods and reviewable drafts; sending always requires the user's authorization. Do not silently subscribe or mass-email offices.

Sources:

- https://geocoding.geo.census.gov/geocoder/Geocoding_Services_API.html
- https://groups.google.com/g/google-civicinfo-api/c/lR8kT7Uc0sE

## Next engineering sequence

1. Fix existing build/configuration debt; verify actual authentication and database boundaries before any public backend release.
2. Implement one official House vote ingestion path with fixtures, provenance, pagination and source comparison. Integrate the profile DTO.
3. Add a source/versioned bill explainer and coverage panel.
4. Develop explicit, reviewable assessment methodology with issue dimensions and time windows.
5. Add rhetoric/legal sources only when acquisition, identity matching and update/correction paths are sound.
6. Add local office lookup and opt-in account/contact workflows after privacy design.

## Historical timeline prototype and source audit · 2026-11-12

Purple is now the application accent in both color schemes, not a party/ideology encoding. The fictional Alex Example preview has a dated, filterable timeline with separate vote and statement labels, four dimensions, disclosure details and visible evidence gaps. All events are invented. No numeric ideology trend is computed; no synthetic events appear on real API profiles. Other profiles show an honest empty state. A narrower vote after a broader statement is explicitly not automatically treated as a reversal.

### Existing voting connection, inspected rather than assumed

- Hosted preview: all seven API helpers are disconnected by `DEMO_MODE`. No live Congress, Clerk or Supabase requests.
- Normal frontend: `GET /api/politicians/:id/voting-history` → `realDataApi.ts` → Supabase `voting_records` joined to bills/topics. Returned records lack `source_url`, `verification_status`, `reviewed_at` and are intentionally withheld by the publication gate. The backend may turn DB errors into empty arrays, which must be corrected before claiming complete coverage.
- `votingRecords.ts`: counts bill vote-related actions; individual-vote extraction remains TODO.
- `realVotingDataSync.ts`: assumes `/v3/vote/{congress}/{chamber}` and response shapes not matching the documented House API.
- `houseClerkIntegration.ts`: exploratory, not routed into sync. `https://clerk.house.gov/evs/2024/index.xml` returned 404; `https://clerk.house.gov/evs/2024/roll001.xml` returned 200. The actual XML uses hyphenated/nested `rollcall-vote`, `vote-metadata`, `vote-data`, `recorded-vote` and `name-id`; the current parser expects different fields. It also confuses member IDs and names and defaults unknown votes to Not Voting.
- Separate Supabase function assumes `/v3/congress/118/{SENATE|HOUSE}/votes`; deployment/runtime is not verified.
- Services largely default to Congress 118; Clerk year-to-Congress mapping is wrong for later years. No sync was run during this review.
- No statement, tweet or speech ingestion exists.

Next: one tested official House path using stable Bioguide identity, Congress/session/roll-call IDs, exact question, bill version and primary-source provenance. Statements need a separate dated pipeline, not inference from votes. Show observation dates, publication dates and gaps; do not interpolate beliefs through missing years.
