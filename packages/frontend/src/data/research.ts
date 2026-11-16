import dataset from "./research-politicians.json";
export type ResearchPerson = (typeof dataset.politicians)[number];
export const metadata = dataset.metadata;
export const people = dataset.politicians;
export const researchPerson = (id: string) => people.find((p) => p.id === id);
export const position = (score: number) =>
  Math.max(0, Math.min(100, (score + 1) * 50));
export const researchDirectory = people.map((p) => ({
  id: p.id,
  name: p.name,
  party: p.party,
  state: p.state,
  chamber: p.chamber as "house" | "senate",
  photoUrl: "",
  description: "Voteview congressional record",
  currentRole: "119th Congress record",
  servingSince: "",
}));
export function histogram(rows: ResearchPerson[]) {
  const bins = Array.from({ length: 20 }, (_, i) => ({
    start: -1 + i / 10,
    count: 0,
  }));
  for (const p of rows)
    if (p.nominate !== null)
      bins[Math.min(19, Math.floor((p.nominate + 1) * 10))].count++;
  return bins;
}
