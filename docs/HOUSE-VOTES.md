# Official House votes connection

`/#/votes` in the private preview (or `/votes` in the normal frontend) reads Congress.gov directly. No database writes, background synchronization, private credentials, or ideology scoring are performed. The existing backend is not deployed by this change.

The browser uses the publicly documented `DEMO_KEY`, never a user API key. This is a restricted trial, not a production credential. On 2026-11-13 a live response exposed `Access-Control-Allow-Origin: *` and a request limit of 10. Errors/429 are shown instead of fictional fallback records. Query caching avoids focus-driven refreshes; member data is fetched only on selection. IP-based shared trial limits can affect multiple users.

The official beta currently covers legislation-associated House roll calls from the 118th and 119th Congresses. Non-legislation votes and Senate votes are absent. The API list is not chronological. Load the entire selected session in bounded 250-record pages (maximum 8), verify the count and uniqueness, then sort by actual vote date descending. Pagination in the UI is local and does not spend more requests. An incomplete or changing source response fails visibly rather than presenting a partial list as current. Every result includes vote/source-update dates and a Clerk link; retrieval time is not the vote date. Procedural motions must be interpreted separately from underlying policy. Missing/Not Voting is not opposition or a neutral ideological score.

Member results use `bioguideID` (uppercase ID), and the live response uses `No` as well as `Aye`; original wording is retained. The member endpoint returned all 432 entries without pagination in the tested response. If pagination appears, the UI refuses to silently present an incomplete list.

Production next step: a dedicated server-side Congress.gov key, a bounded cached read-only gateway or scheduled ingestion, provenance-preserving storage, monitored refreshes and a separately authorized/admin-only ingestion path. Do not add a private key as VITE_* or enable the existing unguarded sync endpoint.

Source: https://github.com/LibraryOfCongress/api.congress.gov/blob/main/Documentation/HouseRollCallVoteEndpoint.md


## Freshness verification, 2026-11-13

Congress.gov `/house-vote/119/2/323` matches House Clerk roll 323, H.R. 2102, On Passage, held November 12 2026 and updated November 13. Default API page 1 starts with February votes but contains a mixed nonchronological order. Fetching 250 + 73 records returned all 323 unique rolls; sorting puts roll 323 first. No unsupported sort parameter is sent. Amendment records use amendmentType/amendmentNumber; motions without bill metadata display their roll number rather than invented legislation.

Exact member query with limit=20 returned all 432 members for roll 74. All IDs and original casts matched the Clerk XML, including members beyond 20 (208 Aye, 187 No, 37 Not Voting). Pagination is not presently used by that endpoint; the guard remains fail-closed if its contract changes.
