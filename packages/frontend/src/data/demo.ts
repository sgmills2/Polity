import type { Politician } from "@polity/shared";

/** Invented identities for layout testing only. Never merge into API responses. */
export const DEMO_POLITICIANS: Politician[] = [
  {
    id: "demo-alex",
    name: "Alex Example (fictional)",
    party: "Independent",
    state: "IL",
    chamber: "house",
    photoUrl: "",
    description: "Invented preview profile",
    currentRole: "Fictional House example",
    servingSince: "",
  },
  {
    id: "demo-jordan",
    name: "Jordan Sample (fictional)",
    party: "Democratic",
    state: "WI",
    chamber: "senate",
    photoUrl: "",
    description: "Invented preview profile",
    currentRole: "Fictional Senate example",
    servingSince: "",
  },
];
export function demoPolitician(id: string): Politician {
  const person = DEMO_POLITICIANS.find((item) => item.id === id);
  if (!person) throw new Error("Demo profile not found");
  return { ...person };
}
