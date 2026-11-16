import { researchDirectory } from "../data/research";
import axios from "axios";
import type { Politician } from "@polity/shared";
import { normalizePolitician } from "../data/politicians";

import { DEMO_MODE } from "../data/mode";
import { demoPolitician } from "../data/demo";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export async function getPoliticians() {
  if (DEMO_MODE) return researchDirectory.map((person) => ({ ...person }));
  const response = await api.get<Politician[]>("/api/politicians");
  if (!Array.isArray(response.data))
    throw new Error("Invalid directory response");
  return response.data.map(normalizePolitician);
}

export async function getPolitician(id: string) {
  if (DEMO_MODE)
    return (
      researchDirectory.find((person) => person.id === id) ?? demoPolitician(id)
    );
  const response = await api.get<Politician>(`/api/politicians/${id}`);
  return normalizePolitician(response.data);
}

export async function getPoliticianVotingHistory(id: string) {
  if (DEMO_MODE) return [];
  const response = await api.get(`/api/politicians/${id}/voting-history`);
  return response.data;
}

export async function getPoliticianScores(id: string) {
  if (DEMO_MODE) return [];
  const response = await api.get(`/api/politicians/${id}/scores`);
  return response.data;
}

export async function syncPoliticians() {
  if (DEMO_MODE) throw new Error("Sync is disabled in the static preview");
  const response = await api.post("/api/sync/politicians");
  return response.data;
}

// Real data endpoints
export async function getRealDataStatus() {
  if (DEMO_MODE) return { hasData: false, billCount: 0, voteCount: 0 };
  const response = await api.get("/api/politicians/data/status");
  return response.data;
}

export async function syncRealVotingData(
  options: {
    billLimit?: number;
    voteLimit?: number;
    calculateScores?: boolean;
  } = {},
) {
  if (DEMO_MODE) throw new Error("Sync is disabled in the static preview");
  const response = await api.post("/api/sync/voting-data", options);
  return response.data;
}
