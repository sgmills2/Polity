# Official House votes connection

`/#/votes` in the private preview (or `/votes` in the normal frontend) reads Congress.gov directly. No database writes, background synchronization, private credentials, or ideology scoring are performed. The existing backend is not deployed by this change.

The browser uses the publicly documented `DEMO_KEY`, never a user API key. This is a restricted trial, not a production credential. On 2026-11-13 a live response exposed `Access-Control-Allow-Origin: *` and a request limit of 10. Errors/429 are shown instead of fictional fallback records. Query caching avoids focus-driven refreshes; member data is fetched only on selection. IP-based shared trial limits can affect multiple users.

The official beta currently covers legislation-associated House roll calls from the 118th and 119th Congresses. Non-legislation votes and Senate votes are absent. The API's returned list order is preserved, not characterized as newest-first or comprehensive. Every result includes vote/source-update dates and a Clerk link; retrieval time is not the vote date. Procedural motions must be interpreted separately from underlying policy. Missing/Not Voting is not opposition or a neutral ideological score.

Member results use `bioguideID` (uppercase ID), and the live response uses `No` as well as `Aye`; original wording is retained. The member endpoint returned all 432 entries without pagination in the tested response. If pagination appears, the UI refuses to silently present an incomplete list.

Production next step: a dedicated server-side Congress.gov key, a bounded cached read-only gateway or scheduled ingestion, provenance-preserving storage, monitored refreshes and a separately authorized/admin-only ingestion path. Do not add a private key as VITE_* or enable the existing unguarded sync endpoint.

Source: https://github.com/LibraryOfCongress/api.congress.gov/blob/main/Documentation/HouseRollCallVoteEndpoint.md
