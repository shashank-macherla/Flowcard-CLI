type TaskStatus = "Todo" | "In Progress" | "Blocked" | "Review" | "Done";
type Priority = "Low" | "Medium" | "High" | "Urgent";

export type WorkspacePanelTaskRecord = {
  id: string;
  title: string;
  details: string;
  status: TaskStatus;
  assigneeId: string;
  priority: Priority;
  dueDate: string;
  source: string;
  linkedPageId?: string;
  linkedFileId?: string;
};

export type WorkspaceTaskApiRow = {
  id: string;
  workspaceId: string;
  projectId?: string | null;
  boardId?: string | null;
  parentTaskId?: string | null;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assigneeUserId?: string | null;
  createdByUserId?: string;
  completedAt?: string | null;
  dueAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

const workspaceTaskStatusToApi: Record<TaskStatus, string> = {
  Todo: "todo",
  "In Progress": "in-progress",
  Blocked: "blocked",
  Review: "review",
  Done: "done",
};

const workspaceTaskStatusFromApi: Record<string, TaskStatus> = {
  todo: "Todo",
  "in-progress": "In Progress",
  "in progress": "In Progress",
  blocked: "Blocked",
  review: "Review",
  done: "Done",
  completed: "Done",
  complete: "Done",
  shipped: "Done",
};

const workspaceTaskPriorityToApi: Record<Priority, string> = {
  Low: "low",
  Medium: "medium",
  High: "high",
  Urgent: "urgent",
};

const workspaceTaskPriorityFromApi: Record<string, Priority> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export function normalizeWorkspaceTaskApiStatus(value: unknown, fallback: TaskStatus = "Todo"): TaskStatus {
  const normalized = String(value ?? "").trim().toLowerCase();
  return workspaceTaskStatusFromApi[normalized] ?? fallback;
}

export function normalizeWorkspaceTaskApiPriority(value: unknown, fallback: Priority = "Medium"): Priority {
  const normalized = String(value ?? "").trim().toLowerCase();
  return workspaceTaskPriorityFromApi[normalized] ?? fallback;
}

export function workspaceTaskStatusToApiValue(status: TaskStatus): string {
  return workspaceTaskStatusToApi[status] ?? "todo";
}

export function workspaceTaskPriorityToApiValue(priority: Priority): string {
  return workspaceTaskPriorityToApi[priority] ?? "medium";
}

export function workspaceTaskRowToRecord(row: WorkspaceTaskApiRow): WorkspacePanelTaskRecord {
  return {
    id: row.id,
    title: row.title,
    details: row.description ?? "",
    status: normalizeWorkspaceTaskApiStatus(row.status),
    assigneeId: row.assigneeUserId ?? "",
    priority: normalizeWorkspaceTaskApiPriority(row.priority),
    dueDate: row.dueAt ? String(row.dueAt).slice(0, 10) : "",
    source: "Workspace API",
    linkedPageId: undefined,
    linkedFileId: undefined,
  };
}

export function workspaceTaskRecordToApiInput(
  record: Partial<WorkspacePanelTaskRecord> & { title?: string },
  options: { includeUnset?: boolean } = {},
): Record<string, unknown> {
  const input: Record<string, unknown> = {};
  if (record.title !== undefined || options.includeUnset) {
    input.title = record.title ?? "";
  }
  if (record.details !== undefined) {
    input.description = record.details;
  }
  if (record.status !== undefined) {
    input.status = workspaceTaskStatusToApiValue(record.status);
  }
  if (record.priority !== undefined) {
    input.priority = workspaceTaskPriorityToApiValue(record.priority);
  }
  if (record.assigneeId !== undefined) {
    input.assigneeUserId = record.assigneeId || null;
  }
  if (record.dueDate !== undefined) {
    input.dueAt = record.dueDate || null;
  }
  return input;
}

export function workspaceStateTaskToInsertRow(
  workspaceId: string,
  task: Partial<WorkspacePanelTaskRecord> & { id?: string; title?: string },
  createdByUserId: string,
  now = new Date().toISOString(),
): Record<string, unknown> {
  const title = String(task.title ?? "Untitled task").trim() || "Untitled task";
  const status = workspaceTaskStatusToApiValue(normalizeWorkspaceTaskApiStatus(task.status));
  return {
    id: task.id || `task-${slugifyWorkspaceTask(title)}-${Date.now()}`,
    workspace_id: workspaceId,
    project_id: null,
    board_id: null,
    parent_task_id: null,
    title,
    description: task.details ?? "",
    status,
    priority: workspaceTaskPriorityToApiValue(normalizeWorkspaceTaskApiPriority(task.priority)),
    assignee_user_id: task.assigneeId || null,
    created_by_user_id: createdByUserId,
    completed_at: ["done", "completed", "complete", "shipped"].includes(status) ? now : null,
    due_at: task.dueDate ? String(task.dueDate).slice(0, 10) : null,
    created_at: now,
    updated_at: now,
  };
}

function slugifyWorkspaceTask(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}
