type TaskStatus = "Todo" | "In Progress" | "Blocked" | "Review" | "Done";

export type WorkspacePanelBugRecord = {
  id: string;
  title: string;
  details: string;
  status: TaskStatus;
  severity: "S1" | "S2" | "S3";
  assigneeId: string;
  dueDate: string;
};

export type WorkspaceBugApiRow = {
  id: string;
  workspaceId: string;
  title: string;
  description?: string;
  status: string;
  severity: string;
  assigneeUserId?: string | null;
  createdByUserId?: string;
  dueAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

const workspaceBugStatusToApi: Record<TaskStatus, string> = {
  Todo: "todo",
  "In Progress": "in-progress",
  Blocked: "blocked",
  Review: "review",
  Done: "done",
};

const workspaceBugStatusFromApi: Record<string, TaskStatus> = {
  todo: "Todo",
  "in-progress": "In Progress",
  "in progress": "In Progress",
  blocked: "Blocked",
  review: "Review",
  done: "Done",
};

const workspaceBugSeverityToApi: Record<WorkspacePanelBugRecord["severity"], string> = {
  S1: "s1",
  S2: "s2",
  S3: "s3",
};

const workspaceBugSeverityFromApi: Record<string, WorkspacePanelBugRecord["severity"]> = {
  s1: "S1",
  s2: "S2",
  s3: "S3",
};

export function normalizeWorkspaceBugApiStatus(value: unknown, fallback: TaskStatus = "Todo"): TaskStatus {
  const normalized = String(value ?? "").trim().toLowerCase();
  return workspaceBugStatusFromApi[normalized] ?? fallback;
}

export function normalizeWorkspaceBugApiSeverity(
  value: unknown,
  fallback: WorkspacePanelBugRecord["severity"] = "S3",
): WorkspacePanelBugRecord["severity"] {
  const normalized = String(value ?? "").trim().toLowerCase();
  return workspaceBugSeverityFromApi[normalized] ?? fallback;
}

export function workspaceBugRowToRecord(row: WorkspaceBugApiRow): WorkspacePanelBugRecord {
  return {
    id: row.id,
    title: row.title,
    details: row.description ?? "",
    status: normalizeWorkspaceBugApiStatus(row.status),
    severity: normalizeWorkspaceBugApiSeverity(row.severity),
    assigneeId: row.assigneeUserId ?? "",
    dueDate: row.dueAt ? String(row.dueAt).slice(0, 10) : "",
  };
}

export function workspaceBugRecordToApiInput(
  record: Partial<WorkspacePanelBugRecord> & { title?: string },
): Record<string, unknown> {
  const input: Record<string, unknown> = {};
  if (record.title !== undefined) input.title = record.title ?? "";
  if (record.details !== undefined) input.description = record.details;
  if (record.status !== undefined) {
    input.status = workspaceBugStatusToApi[record.status] ?? "todo";
  }
  if (record.severity !== undefined) {
    input.severity = workspaceBugSeverityToApi[record.severity] ?? "s3";
  }
  if (record.assigneeId !== undefined) {
    input.assigneeUserId = record.assigneeId || null;
  }
  if (record.dueDate !== undefined) {
    input.dueAt = record.dueDate || null;
  }
  return input;
}
