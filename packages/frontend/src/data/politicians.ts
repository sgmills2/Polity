import type { Politician } from "@polity/shared";

// Existing API services return both snake_case database rows and camelCase models.
export function normalizePolitician(value: unknown): Politician {
  if (!value || typeof value !== "object")
    throw new Error("Invalid profile response");
  const row = value as Record<string, unknown>;
  if (typeof row.id !== "string" || typeof row.name !== "string")
    throw new Error("Invalid profile identity");
  const text = (key: string, alternate = key): string =>
    typeof row[key] === "string"
      ? (row[key] as string)
      : typeof row[alternate] === "string"
        ? (row[alternate] as string)
        : "";
  return {
    id: row.id,
    name: row.name,
    state: text("state"),
    party: text("party"),
    chamber: text("chamber").toLowerCase() as Politician["chamber"],
    photoUrl: text("photoUrl", "photo_url"),
    description: text("description"),
    currentRole: text("currentRole", "current_role"),
    servingSince: text("servingSince", "serving_since"),
  };
}
