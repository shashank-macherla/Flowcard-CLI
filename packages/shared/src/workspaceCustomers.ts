export type WorkspacePanelCustomerRecord = {
  id: string;
  company: string;
  notes: string;
  tier: "Starter" | "Growth" | "Enterprise";
  ownerId: string;
  health: "Healthy" | "Watching" | "At risk";
  renewal: string;
};

export type WorkspaceCustomerApiRow = {
  id: string;
  workspaceId: string;
  company: string;
  notes?: string;
  tier: string;
  ownerUserId?: string | null;
  health: string;
  renewalAt?: string | null;
  createdByUserId?: string;
  createdAt?: string;
  updatedAt?: string;
};

const workspaceCustomerTierToApi: Record<WorkspacePanelCustomerRecord["tier"], string> = {
  Starter: "starter",
  Growth: "growth",
  Enterprise: "enterprise",
};

const workspaceCustomerTierFromApi: Record<string, WorkspacePanelCustomerRecord["tier"]> = {
  starter: "Starter",
  growth: "Growth",
  enterprise: "Enterprise",
};

const workspaceCustomerHealthToApi: Record<WorkspacePanelCustomerRecord["health"], string> = {
  Healthy: "healthy",
  Watching: "watching",
  "At risk": "at-risk",
};

const workspaceCustomerHealthFromApi: Record<string, WorkspacePanelCustomerRecord["health"]> = {
  healthy: "Healthy",
  watching: "Watching",
  "at-risk": "At risk",
  "at risk": "At risk",
};

export function normalizeWorkspaceCustomerApiTier(
  value: unknown,
  fallback: WorkspacePanelCustomerRecord["tier"] = "Starter",
): WorkspacePanelCustomerRecord["tier"] {
  const normalized = String(value ?? "").trim().toLowerCase();
  return workspaceCustomerTierFromApi[normalized] ?? fallback;
}

export function normalizeWorkspaceCustomerApiHealth(
  value: unknown,
  fallback: WorkspacePanelCustomerRecord["health"] = "Healthy",
): WorkspacePanelCustomerRecord["health"] {
  const normalized = String(value ?? "").trim().toLowerCase();
  return workspaceCustomerHealthFromApi[normalized] ?? fallback;
}

export function workspaceCustomerRowToRecord(row: WorkspaceCustomerApiRow): WorkspacePanelCustomerRecord {
  return {
    id: row.id,
    company: row.company,
    notes: row.notes ?? "",
    tier: normalizeWorkspaceCustomerApiTier(row.tier),
    ownerId: row.ownerUserId ?? "",
    health: normalizeWorkspaceCustomerApiHealth(row.health),
    renewal: row.renewalAt ?? "",
  };
}

export function workspaceCustomerRecordToApiInput(
  record: Partial<WorkspacePanelCustomerRecord> & { company?: string },
): Record<string, unknown> {
  const input: Record<string, unknown> = {};
  if (record.company !== undefined) input.company = record.company ?? "";
  if (record.notes !== undefined) input.notes = record.notes;
  if (record.tier !== undefined) {
    input.tier = workspaceCustomerTierToApi[record.tier] ?? "starter";
  }
  if (record.ownerId !== undefined) {
    input.ownerUserId = record.ownerId || null;
  }
  if (record.health !== undefined) {
    input.health = workspaceCustomerHealthToApi[record.health] ?? "healthy";
  }
  if (record.renewal !== undefined) {
    input.renewalAt = record.renewal || null;
  }
  return input;
}
