# Polity congressional records snapshot

Downloaded from Voteview's official public CSV exports on 2026-11-15 UTC. `research-politicians.json` was generated with `scripts/build_voteview_dataset.py`; raw CSVs were retained in the research workspace, not committed. SHA-256 hashes are recorded in JSON metadata.

- 556 House/Senate member records (555 Bioguide identities) from the 119th Congress; includes 19 Illinois records.
- Not a verified currently-serving roster: includes people who served for only part of this Congress, and source dataset may change.
- Kevin Kiley appears under separate Republican and Independent ICPSR records. IDs are Bioguide + ICPSR. Do not silently collapse or average them. The party label is for the individual source record, not an independently verified present affiliation.
- Aisha Wahab's row has missing score/vote count. These remain null, never zero.
- Display names reverse source surname/given-name order and title-case the source's uppercase surname; `sourceName` preserves original spelling. Avoid treating display capitalization as identity matching evidence.
- Historical rows are matched by Bioguide ID; retain chamber, party and ICPSR changes. Each current record includes all matching history, so do not sum histories across directory records without deduplicating identities.
- Validated that every 119th Congress record's NOMINATE, Nokken-Poole and vote-count fields exactly match its unique 119th row in the all-Congress file. IDs unique, scores bounded [-1,1], counts nonnegative or null.

## Interpretation

Voteview documents NOMINATE as a career-static estimate. Nokken-Poole is independently estimated for each Congress and is appropriate for a Congress-by-Congress trend visualization. Shifts can reflect changing agendas, coalitions or model estimation, not a demonstrated change of belief. Different chambers have different agendas. Do not label a trend as a causal explanation.

The first dimension is relative U.S. congressional roll-call voting alignment, often interpreted as economic left/right. It is not a global communist-to-fascist scale; neither dimension is a validated civil-liberties, authoritarianism, Israel, or issue-specific rating. Do not relabel the second dimension as such.

`nominate_number_of_votes` is the source-reported number cast in that Congress. It is not a reviewed bill count, attendance percentage, confidence interval, or lifetime total. The API feed and this static snapshot have different coverage. The 119th Congress is ongoing and counts/estimates will change.

## Sources

- https://voteview.com/data
- https://voteview.com/articles/data_help_members
- https://voteview.com/articles/data_help_parties
- https://voteview.com/about
- https://voteview.com/static/data/out/members/HS119_members.csv
- https://voteview.com/static/data/out/members/HSall_members.csv

Citation: Lewis, Jeffrey B., Keith Poole, Howard Rosenthal, Adam Boche, Aaron Rudkin, and Luke Sonnet (2026). Voteview: Congressional Roll-Call Votes Database. https://voteview.com/

Individual source URL shape was verified with Bernard Sanders and Delia Ramirez pages. Their source biography/chamber/district supported record identity; no copied biographies were incorporated.

## Reuse and timestamps

Voteview's Data page explicitly publishes exports for public use, requests the citation above, and offers its complete database specifically to people building websites. No separate formal dataset license was identified on the Data/About/documentation pages or targeted official-domain searches. Do not claim a specific CC license or unrestricted commercial rights; preserve attribution and source links. This is sufficient published reuse intent for the requested attributed research prototype, not a legal opinion about later commercial use.

HTTP Last-Modified headers checked 2026-11-15: HS119_members.csv 2026-11-14 07:24:41 UTC; HSall_members.csv 2026-11-14 07:31:34 UTC. These describe file modification, not the latest included roll-call date. JSON records both values.

Integer-like historical party/ICPSR codes normalize safely (e.g. 100.0 → 100). Conditional flags normalize integer-like 1.0/0.0; all observed values in these exports were blank, retained null.

## Implementation

The static preview directory now uses a bundled, dated Voteview snapshot, with no
private API credentials or backend/database access. The existing fictional fixtures
remain solely for regression tests and old explicit demo URLs. Real profile routes
render a separate component and never attach invented events or allegations.

The left/right bar is DW-NOMINATE dimension 1, not a global ideology classification.
The broader economic/power/rights/foreign-policy framework is retained separately.
The timeline uses per-Congress Nokken–Poole dimension 1; separate chambers and
party-record ICPSR identities are not joined. Raw numbers are available in a table.
One-Congress coverage and missing scores do not generate synthetic trend lines.

Search, party/state/chamber filters, keyboard-accessible range slider, sorting,
pagination and a score-distribution histogram are available. Histogram bins count
source records; the party-switch duplicate is explicitly retained, not a second person.
No rate of attendance/effectiveness, issue positions, or confidence metric is inferred.

To regenerate, download the two public CSV source URLs in snapshot metadata to
scripts/ as HS119_members.csv and HSall_members.csv, run build_voteview_dataset.py,
then validate/review the generated JSON and copy it into frontend data. Raw CSVs
are not committed. The checked-in generator is an explicit manual refresh, not a
scheduled or secretly live feed. HTTP Last-Modified is provenance, not a latest-vote date.

When refreshing, set VOTEVIEW_CURRENT_LAST_MODIFIED and VOTEVIEW_HISTORY_LAST_MODIFIED from verified download headers. Unprovided timestamps become “Not recorded”, never a stale timestamp.
