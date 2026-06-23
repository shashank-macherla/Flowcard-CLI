export type Presence = "online" | "away" | "focus" | "offline";

export type WorkspaceRoleRank = 0 | 1 | 2 | 3;

export const workspaceRoleCategories = [
  {
    id: "core",
    label: "Core workspace roles",
    description: "Default Flowcard roles used by existing workspaces.",
  },
  {
    id: "read-only",
    label: "Guest and read-only",
    description: "Can enter or inspect workspace content without changing saved data.",
  },
  {
    id: "standard",
    label: "Standard users and content",
    description: "Can contribute to workspace chats, docs, data, SQL, and code.",
  },
  {
    id: "staff",
    label: "Staff roles",
    description: "General employee and operational staff roles with contributor access.",
  },
  {
    id: "software",
    label: "Software and infrastructure",
    description: "Engineering, infrastructure, cloud, platform, database, and QA roles.",
  },
  {
    id: "security",
    label: "Security and compliance",
    description: "Security, audit, compliance, and review roles.",
  },
  {
    id: "management",
    label: "Management and executive",
    description: "Team, department, regional, operations, executive, and founder roles.",
  },
  {
    id: "enterprise",
    label: "Advanced enterprise RBAC",
    description: "Tenant, domain, organization, project, environment, and privileged roles.",
  },
  {
    id: "network-governance",
    label: "Network governance",
    description: "Workspace roles for creating, supervising, auditing, and delegating Networks and Sub-networks.",
  },
] as const;

export type WorkspaceRoleCategoryId = (typeof workspaceRoleCategories)[number]["id"];

export const workspaceRoleCatalog = [
  { role: "Owner", category: "core", rank: 3 },
  { role: "Admin", category: "core", rank: 2 },
  { role: "Member", category: "core", rank: 1 },
  { role: "Viewer", category: "core", rank: 0 },
  { role: "NetworkOnly", category: "read-only", rank: 0 },
  { role: "Guest", category: "read-only", rank: 0 },
  { role: "Visitor", category: "read-only", rank: 0 },
  { role: "Anonymous", category: "read-only", rank: 0 },
  { role: "Anonymous User", category: "read-only", rank: 0 },
  { role: "ReadOnly", category: "read-only", rank: 0 },
  { role: "Read-Only User", category: "read-only", rank: 0 },
  { role: "Observer", category: "read-only", rank: 0 },
  { role: "Permission Viewer", category: "read-only", rank: 0 },
  { role: "User", category: "standard", rank: 1 },
  { role: "Basic User", category: "standard", rank: 1 },
  { role: "Verified User", category: "standard", rank: 1 },
  { role: "VerifiedUser", category: "standard", rank: 1 },
  { role: "TrustedMember", category: "standard", rank: 1 },
  { role: "Contributor", category: "standard", rank: 1 },
  { role: "Creator", category: "standard", rank: 1 },
  { role: "Editor", category: "standard", rank: 1 },
  { role: "Author", category: "standard", rank: 1 },
  { role: "Writer", category: "standard", rank: 1 },
  { role: "Blogger", category: "standard", rank: 1 },
  { role: "Publisher", category: "standard", rank: 1 },
  { role: "Reviewer", category: "standard", rank: 1 },
  { role: "Content Manager", category: "standard", rank: 1 },
  { role: "Employee", category: "staff", rank: 1 },
  { role: "Staff", category: "staff", rank: 1 },
  { role: "Associate", category: "staff", rank: 1 },
  { role: "Specialist", category: "staff", rank: 1 },
  { role: "Analyst", category: "staff", rank: 1 },
  { role: "Coordinator", category: "staff", rank: 1 },
  { role: "Intern", category: "staff", rank: 1 },
  { role: "Developer", category: "software", rank: 1 },
  { role: "Software Engineer", category: "software", rank: 1 },
  { role: "Backend Developer", category: "software", rank: 1 },
  { role: "Frontend Developer", category: "software", rank: 1 },
  { role: "Fullstack Developer", category: "software", rank: 1 },
  { role: "QA Engineer", category: "software", rank: 1 },
  { role: "Tester", category: "software", rank: 1 },
  { role: "DevOps Engineer", category: "software", rank: 2 },
  { role: "Dev Lead", category: "software", rank: 2 },
  { role: "Administrator", category: "software", rank: 2 },
  { role: "Super Administrator", category: "software", rank: 3 },
  { role: "SuperAdministrator", category: "software", rank: 3 },
  { role: "System Administrator", category: "software", rank: 3 },
  { role: "SystemAdministrator", category: "software", rank: 3 },
  { role: "System Admin", category: "software", rank: 2 },
  { role: "Network Admin", category: "software", rank: 2 },
  { role: "Database Admin", category: "software", rank: 2 },
  { role: "Security Admin", category: "software", rank: 2 },
  { role: "SecurityAdministrator", category: "software", rank: 2 },
  { role: "Cloud Administrator", category: "software", rank: 2 },
  { role: "Platform Admin", category: "software", rank: 2 },
  { role: "Infrastructure Admin", category: "software", rank: 2 },
  { role: "Environment Admin", category: "software", rank: 2 },
  { role: "API Admin", category: "software", rank: 2 },
  { role: "Data Admin", category: "software", rank: 2 },
  { role: "Backup Admin", category: "software", rank: 2 },
  { role: "Security Analyst", category: "security", rank: 1 },
  { role: "Security Engineer", category: "security", rank: 1 },
  { role: "SOC Analyst", category: "security", rank: 1 },
  { role: "Auditor", category: "security", rank: 0 },
  { role: "Compliance Officer", category: "security", rank: 2 },
  { role: "Audit Admin", category: "security", rank: 2 },
  { role: "Compliance Admin", category: "security", rank: 2 },
  { role: "Moderator", category: "management", rank: 2 },
  { role: "SeniorModerator", category: "management", rank: 2 },
  { role: "LeadModerator", category: "management", rank: 2 },
  { role: "Supervisor", category: "management", rank: 2 },
  { role: "Manager", category: "management", rank: 2 },
  { role: "Senior Manager", category: "management", rank: 2 },
  { role: "Team Lead", category: "management", rank: 2 },
  { role: "Department Head", category: "management", rank: 2 },
  { role: "DepartmentManager", category: "management", rank: 2 },
  { role: "Regional Manager", category: "management", rank: 2 },
  { role: "Operations Manager", category: "management", rank: 2 },
  { role: "Director", category: "management", rank: 2 },
  { role: "Executive", category: "management", rank: 3 },
  { role: "Vice President", category: "management", rank: 3 },
  { role: "President", category: "management", rank: 3 },
  { role: "CEO", category: "management", rank: 3 },
  { role: "COO", category: "management", rank: 3 },
  { role: "CTO", category: "management", rank: 3 },
  { role: "CFO", category: "management", rank: 3 },
  { role: "CMO", category: "management", rank: 3 },
  { role: "CIO", category: "management", rank: 3 },
  { role: "CHRO", category: "management", rank: 3 },
  { role: "Founder", category: "management", rank: 3 },
  { role: "Root", category: "management", rank: 3 },
  { role: "Access Manager", category: "enterprise", rank: 2 },
  { role: "Identity Manager", category: "enterprise", rank: 2 },
  { role: "Security Operator", category: "enterprise", rank: 2 },
  { role: "Privileged User", category: "enterprise", rank: 2 },
  { role: "Privileged Administrator", category: "enterprise", rank: 3 },
  { role: "Tenant Admin", category: "enterprise", rank: 3 },
  { role: "Domain Admin", category: "enterprise", rank: 3 },
  { role: "Organization Admin", category: "enterprise", rank: 3 },
  { role: "OrganizationAdministrator", category: "enterprise", rank: 3 },
  { role: "SeniorAdministrator", category: "enterprise", rank: 2 },
  { role: "Resource Owner", category: "enterprise", rank: 3 },
  { role: "Global Admin", category: "enterprise", rank: 3 },
  { role: "Tenant Owner", category: "enterprise", rank: 3 },
  { role: "Org Owner", category: "enterprise", rank: 3 },
  { role: "Workspace Owner", category: "enterprise", rank: 3 },
  { role: "Project Owner", category: "enterprise", rank: 3 },
  { role: "Project Admin", category: "enterprise", rank: 2 },
  { role: "Project Manager", category: "enterprise", rank: 2 },
  { role: "Team Admin", category: "enterprise", rank: 2 },
  { role: "Workspace Admin", category: "network-governance", rank: 2 },
  { role: "Workspace Manager", category: "network-governance", rank: 2 },
  { role: "Workspace Network Owner", category: "network-governance", rank: 3 },
  { role: "Workspace Network Admin", category: "network-governance", rank: 2 },
  { role: "Workspace Network Manager", category: "network-governance", rank: 2 },
  { role: "Network Portfolio Owner", category: "network-governance", rank: 3 },
  { role: "Network Governance Admin", category: "network-governance", rank: 2 },
  { role: "Network Operations Manager", category: "network-governance", rank: 2 },
  { role: "Network Program Manager", category: "network-governance", rank: 2 },
  { role: "Network Access Manager", category: "network-governance", rank: 2 },
  { role: "Network Role Manager", category: "network-governance", rank: 2 },
  { role: "Network Head", category: "network-governance", rank: 2 },
  { role: "Network Manager", category: "network-governance", rank: 2 },
  { role: "Network Lead", category: "network-governance", rank: 1 },
  { role: "Network Member", category: "network-governance", rank: 1 },
  { role: "Network Member Coordinator", category: "network-governance", rank: 2 },
  { role: "Client Network Lead", category: "network-governance", rank: 2 },
  { role: "Client Delivery Manager", category: "network-governance", rank: 2 },
  { role: "Client Portfolio Manager", category: "network-governance", rank: 2 },
  { role: "Client Access Reviewer", category: "network-governance", rank: 0 },
  { role: "External Network Partner", category: "network-governance", rank: 0 },
  { role: "Subnetwork Head", category: "network-governance", rank: 2 },
  { role: "Subnetwork Manager", category: "network-governance", rank: 2 },
  { role: "Subnetwork Coordinator", category: "network-governance", rank: 1 },
  { role: "Subnetwork Lead", category: "network-governance", rank: 1 },
  { role: "Subnetwork Operations Lead", category: "network-governance", rank: 1 },
  { role: "Subnetwork Services Lead", category: "network-governance", rank: 1 },
  { role: "Subnetwork Member", category: "network-governance", rank: 1 },
  { role: "Subnetwork Viewer", category: "network-governance", rank: 0 },
  { role: "Service Catalog Manager", category: "network-governance", rank: 2 },
  { role: "Network Services Head", category: "network-governance", rank: 2 },
  { role: "Network Service Owner", category: "network-governance", rank: 2 },
  { role: "Network Service Manager", category: "network-governance", rank: 2 },
  { role: "Network Package Manager", category: "network-governance", rank: 2 },
  { role: "Network Data Manager", category: "network-governance", rank: 2 },
  { role: "Network SQL Manager", category: "network-governance", rank: 2 },
  { role: "Network Shared Assets Manager", category: "network-governance", rank: 2 },
  { role: "Fetch Request Approver", category: "network-governance", rank: 2 },
  { role: "Network Fetch Manager", category: "network-governance", rank: 2 },
  { role: "Network Dependency Auditor", category: "network-governance", rank: 0 },
  { role: "Network Compliance Reviewer", category: "network-governance", rank: 0 },
  { role: "Network Auditor", category: "network-governance", rank: 0 },
  { role: "Network Viewer", category: "network-governance", rank: 0 },
] as const satisfies readonly {
  role: string;
  category: WorkspaceRoleCategoryId;
  rank: WorkspaceRoleRank;
}[];

export type WorkspaceRole = (typeof workspaceRoleCatalog)[number]["role"];

export const workspaceRoles = workspaceRoleCatalog.map((item) => item.role) as WorkspaceRole[];

export const workspaceRoleGroups = workspaceRoleCategories.map((category) => ({
  ...category,
  roles: workspaceRoleCatalog
    .filter((item) => item.category === category.id)
    .map((item) => item.role) as WorkspaceRole[],
}));

export const workspaceRoleRank = Object.fromEntries(
  workspaceRoleCatalog.map((item) => [item.role, item.rank]),
) as Record<WorkspaceRole, WorkspaceRoleRank>;

export const workspaceRoleCategory = Object.fromEntries(
  workspaceRoleCatalog.map((item) => [item.role, item.category]),
) as Record<WorkspaceRole, WorkspaceRoleCategoryId>;

export function isWorkspaceRole(role: unknown): role is WorkspaceRole {
  return typeof role === "string" && workspaceRoles.includes(role as WorkspaceRole);
}

export function normalizeWorkspaceRoleList(
  roles: unknown,
  fallbackRole: WorkspaceRole = "Viewer",
): WorkspaceRole[] {
  const rawRoles = Array.isArray(roles) ? roles : roles == null || roles === "" ? [] : [roles];
  const normalized: WorkspaceRole[] = [];
  for (const rawRole of rawRoles) {
    const value = String(rawRole ?? "").trim();
    if (isWorkspaceRole(value) && !normalized.includes(value)) {
      normalized.push(value);
    }
  }
  return normalized.length ? normalized : [fallbackRole];
}

export function getPrimaryWorkspaceRole(roles: unknown, fallbackRole: WorkspaceRole = "Viewer"): WorkspaceRole {
  return [...normalizeWorkspaceRoleList(roles, fallbackRole)].sort((left, right) => {
    const rankDelta = getWorkspaceRoleRank(right) - getWorkspaceRoleRank(left);
    if (rankDelta !== 0) return rankDelta;
    return workspaceRoles.indexOf(left) - workspaceRoles.indexOf(right);
  })[0];
}

export function getWorkspaceRoleListRank(roles: unknown): WorkspaceRoleRank | -1 {
  const normalizedRoles = normalizeWorkspaceRoleList(roles, "Viewer");
  return Math.max(...normalizedRoles.map((role) => getWorkspaceRoleRank(role))) as WorkspaceRoleRank;
}

export function isWorkspaceOwnerRoleSet(roles: unknown) {
  return normalizeWorkspaceRoleList(roles, "Viewer").some(isWorkspaceOwnerRole);
}

export function isNetworkOnlyWorkspaceRoleSet(roles: unknown) {
  const normalizedRoles = normalizeWorkspaceRoleList(roles, "Viewer");
  return normalizedRoles.length > 0 && normalizedRoles.every((role) => role === "NetworkOnly");
}

export function roleCan(actualRole: string | null | undefined, requiredRole: WorkspaceRole) {
  return getWorkspaceRoleRank(actualRole) >= getWorkspaceRoleRank(requiredRole);
}

export function canManageWorkspaceRole(
  actorRole: string | null | undefined,
  targetRole: string | null | undefined,
  nextRole?: string | null,
) {
  const actorRank = getWorkspaceRoleRank(actorRole);
  const targetRank = getWorkspaceRoleRank(targetRole);
  const nextRank = nextRole == null ? targetRank : getWorkspaceRoleRank(nextRole);
  if (actorRank >= 3) return true;
  return actorRank >= 2 && targetRank <= 1 && nextRank <= 1;
}

export function isWorkspaceOwnerRole(role: string | null | undefined) {
  return getWorkspaceRoleRank(role) >= 3;
}

export function getWorkspaceRoleRank(role: string | null | undefined): WorkspaceRoleRank | -1 {
  if (!isWorkspaceRole(role)) return -1;
  return workspaceRoleRank[role];
}

export function workspaceRoleSummary(role: string | null | undefined) {
  const rank = getWorkspaceRoleRank(role);
  if (role === "NetworkOnly") {
    return "Can see workspace identity only and enter assigned Networks or Sub-networks directly.";
  }
  if (isWorkspaceRole(role) && workspaceRoleCategory[role] === "network-governance") {
    if (rank >= 3) return "Owns Workspace-level Network governance across all Networks, Sub-networks, members, roles, and audits.";
    if (rank === 2) return "Can govern assigned or workspace-wide Networks, Sub-networks, services, roles, and access reviews.";
    if (rank === 1) return "Can coordinate Network or Sub-network work without workspace administration.";
    return "Can inspect Network and Sub-network state without changing saved data.";
  }
  if (rank >= 3) return "Full workspace control, including ownership, settings, invites, data, and every role.";
  if (rank === 2) return "Can manage workspace content and lower-access roles, but cannot take ownership.";
  if (rank === 1) return "Can create and edit chat, docs, data, SQL, and code.";
  return "Can read workspace content without changing saved data.";
}

export function workspaceRoleListSummary(roles: unknown) {
  const normalizedRoles = normalizeWorkspaceRoleList(roles, "Viewer");
  if (isNetworkOnlyWorkspaceRoleSet(normalizedRoles)) {
    return "Network-only access: workspace identity is visible, workspace content stays closed.";
  }
  if (normalizedRoles.some(isWorkspaceOwnerRole)) {
    return "Owner-level access from one or more assigned roles.";
  }
  if (normalizedRoles.some((role) => workspaceRoleCategory[role] === "network-governance")) {
    return "Network governance access combined from workspace and Network-scoped roles.";
  }
  if (normalizedRoles.some((role) => getWorkspaceRoleRank(role) >= 2)) {
    return "Management access combined from assigned admin and specialist roles.";
  }
  if (normalizedRoles.length > 1) {
    return `Combined access from ${normalizedRoles.length} assigned roles.`;
  }
  return workspaceRoleSummary(normalizedRoles[0]);
}

export const workspacePermissionCategories = [
  {
    id: "workspace",
    label: "Workspace",
    description: "Workspace visibility, profile, storage, and saved state.",
  },
  {
    id: "networks",
    label: "Networks And Sub-networks",
    description: "Workspace-level Network visibility, creation, governance, delegation, and audit controls.",
  },
  {
    id: "communication",
    label: "Communication",
    description: "Messages, threads, attachments, and channel collaboration.",
  },
  {
    id: "knowledge",
    label: "Docs And Files",
    description: "Documents, folders, file uploads, comments, and cloud-linked content.",
  },
  {
    id: "data",
    label: "Data And SQL",
    description: "Workspace databases, records, SQL reads, and SQL writes.",
  },
  {
    id: "developer",
    label: "Code Workspace",
    description: "Code files, imports, exports, terminal actions, and review state.",
  },
  {
    id: "members",
    label: "Members",
    description: "Member visibility, invitations, removal, and role assignment.",
  },
  {
    id: "security",
    label: "Security And Audit",
    description: "Role permission templates, audit visibility, and destructive operations.",
  },
] as const;

export type WorkspacePermissionCategoryId = (typeof workspacePermissionCategories)[number]["id"];

export const workspacePermissionCatalog = [
  {
    key: "workspace.view",
    category: "workspace",
    label: "View workspace",
    description: "Open the workspace and read saved workspace content.",
    minRank: 0,
  },
  {
    key: "workspace.export",
    category: "workspace",
    label: "Export workspace",
    description: "Export workspace content, settings summaries, and portable archives.",
    minRank: 2,
  },
  {
    key: "workspace.delete",
    category: "workspace",
    label: "Delete workspace",
    description: "Delete or permanently archive the workspace.",
    minRank: 3,
  },
  {
    key: "workspace.write",
    category: "workspace",
    label: "Save workspace data",
    description: "Persist workspace changes from chat, docs, data, SQL, and code.",
    minRank: 1,
  },
  {
    key: "workspace.update",
    category: "workspace",
    label: "Update workspace profile",
    description: "Rename the workspace and edit workspace-level identity settings.",
    minRank: 2,
  },
  {
    key: "cloud.view",
    category: "workspace",
    label: "View cloud storage",
    description: "View linked cloud storage provider, account, and folder metadata.",
    minRank: 0,
  },
  {
    key: "cloud.manage",
    category: "workspace",
    label: "Manage cloud storage",
    description: "Connect, reconnect, or disconnect workspace cloud storage.",
    minRank: 2,
  },
  {
    key: "networks.view",
    category: "networks",
    label: "View all Networks",
    description: "See workspace Networks, Sub-networks, hierarchy, and high-level Network details.",
    minRank: 0,
  },
  {
    key: "networks.create",
    category: "networks",
    label: "Create Networks",
    description: "Create top-level Networks for clients, departments, products, or programs.",
    minRank: 2,
  },
  {
    key: "networks.manage",
    category: "networks",
    label: "Manage all Networks",
    description: "Override scoped Network access to update Network records, resources, services, and Sub-networks.",
    minRank: 2,
  },
  {
    key: "networks.assignRoles",
    category: "networks",
    label: "Assign Network roles",
    description: "Override scoped access to manage Network and Sub-network members, roles, and permission boundaries.",
    minRank: 2,
  },
  {
    key: "networks.audit",
    category: "networks",
    label: "Audit Networks",
    description: "Review Network activity, fetch requests, hierarchy risk, and delegated access state.",
    minRank: 2,
  },
  {
    key: "chat.read",
    category: "communication",
    label: "Read conversations",
    description: "Read channels, workspace DMs, and searchable message history.",
    minRank: 0,
  },
  {
    key: "chat.send",
    category: "communication",
    label: "Send messages",
    description: "Send channel messages, direct workspace messages, and attachments.",
    minRank: 1,
  },
  {
    key: "chat.attachFiles",
    category: "communication",
    label: "Attach chat files",
    description: "Attach files, docs, tasks, code, and workspace references to messages.",
    minRank: 1,
  },
  {
    key: "chat.manageChannels",
    category: "communication",
    label: "Manage channels",
    description: "Create, rename, archive, and organize workspace channels.",
    minRank: 1,
  },
  {
    key: "chat.moderate",
    category: "communication",
    label: "Moderate conversations",
    description: "Moderate messages, resolve reports, and manage conversation hygiene.",
    minRank: 2,
  },
  {
    key: "threads.reply",
    category: "communication",
    label: "Reply in threads",
    description: "Create thread replies and mention teammates in conversation threads.",
    minRank: 1,
  },
  {
    key: "threads.manage",
    category: "communication",
    label: "Manage threads",
    description: "Close, reopen, pin, and moderate conversation threads.",
    minRank: 2,
  },
  {
    key: "dm.send",
    category: "communication",
    label: "Send global DMs",
    description: "Start and send direct messages across Flowcard.",
    minRank: 1,
  },
  {
    key: "calls.start",
    category: "communication",
    label: "Start calls",
    description: "Start WebRTC voice, video, and screen-share sessions.",
    minRank: 1,
  },
  {
    key: "docs.read",
    category: "knowledge",
    label: "Read docs and files",
    description: "Read workspace pages, folders, document assets, and previews.",
    minRank: 0,
  },
  {
    key: "docs.write",
    category: "knowledge",
    label: "Edit docs and files",
    description: "Create folders, write documents, import files, and update document metadata.",
    minRank: 1,
  },
  {
    key: "docs.comment",
    category: "knowledge",
    label: "Comment on docs",
    description: "Add comments, review notes, and lightweight feedback on documents.",
    minRank: 1,
  },
  {
    key: "docs.manageFolders",
    category: "knowledge",
    label: "Manage doc folders",
    description: "Create, rename, move, and organize workspace document folders.",
    minRank: 1,
  },
  {
    key: "docs.delete",
    category: "knowledge",
    label: "Delete docs",
    description: "Delete pages, folders, and document assets.",
    minRank: 2,
  },
  {
    key: "files.upload",
    category: "knowledge",
    label: "Upload files",
    description: "Import local documents, folders, code files, and external assets.",
    minRank: 1,
  },
  {
    key: "files.download",
    category: "knowledge",
    label: "Download files",
    description: "Download document assets, generated exports, and workspace files.",
    minRank: 0,
  },
  {
    key: "files.delete",
    category: "knowledge",
    label: "Delete files",
    description: "Delete uploaded document and workspace file assets.",
    minRank: 2,
  },
  {
    key: "data.read",
    category: "data",
    label: "Read database records",
    description: "Read tasks, bugs, customers, and other workspace database records.",
    minRank: 0,
  },
  {
    key: "data.write",
    category: "data",
    label: "Write database records",
    description: "Create, edit, delete, filter, and manage workspace records.",
    minRank: 1,
  },
  {
    key: "data.delete",
    category: "data",
    label: "Delete database records",
    description: "Delete tasks, bugs, customers, and custom database records.",
    minRank: 2,
  },
  {
    key: "data.schemaManage",
    category: "data",
    label: "Manage database schema",
    description: "Create custom tables, change fields, forms, views, and database structure.",
    minRank: 2,
  },
  {
    key: "data.import",
    category: "data",
    label: "Import data",
    description: "Import CSV, spreadsheet, SQL, SQLite, parquet, and external data files.",
    minRank: 1,
  },
  {
    key: "data.export",
    category: "data",
    label: "Export data",
    description: "Export records, tables, query results, and database snapshots.",
    minRank: 1,
  },
  {
    key: "sql.read",
    category: "data",
    label: "Run read-only SQL",
    description: "Run SELECT queries against workspace tables.",
    minRank: 0,
  },
  {
    key: "sql.write",
    category: "data",
    label: "Run write SQL",
    description: "Run INSERT, UPDATE, and DELETE SQL against workspace tables.",
    minRank: 1,
  },
  {
    key: "sql.import",
    category: "data",
    label: "Import SQL",
    description: "Import local SQL scripts and database dumps into the SQL workspace.",
    minRank: 1,
  },
  {
    key: "sql.export",
    category: "data",
    label: "Extract SQL",
    description: "Extract workspace databases as SQL scripts or query result exports.",
    minRank: 1,
  },
  {
    key: "sql.manageConnections",
    category: "data",
    label: "Manage DB connections",
    description: "Add, edit, test, or remove external database connections.",
    minRank: 2,
  },
  {
    key: "code.read",
    category: "developer",
    label: "Read code",
    description: "Browse project folders and read code files in the workspace.",
    minRank: 0,
  },
  {
    key: "code.write",
    category: "developer",
    label: "Write code",
    description: "Create, edit, rename, import, and save code workspace files.",
    minRank: 1,
  },
  {
    key: "code.review",
    category: "developer",
    label: "Review code",
    description: "Add review comments, resolve findings, and inspect change history.",
    minRank: 1,
  },
  {
    key: "code.delete",
    category: "developer",
    label: "Delete code",
    description: "Delete code files and folders from the workspace project.",
    minRank: 2,
  },
  {
    key: "code.import",
    category: "developer",
    label: "Import code",
    description: "Drag, drop, and import code files or complete project folders.",
    minRank: 1,
  },
  {
    key: "code.export",
    category: "developer",
    label: "Export code",
    description: "Download code folders and project archives.",
    minRank: 1,
  },
  {
    key: "terminal.use",
    category: "developer",
    label: "Use workspace terminal",
    description: "Run supported integrated terminal commands inside the code workspace.",
    minRank: 1,
  },
  {
    key: "terminal.write",
    category: "developer",
    label: "Terminal write commands",
    description: "Run terminal commands that create, modify, or delete workspace files.",
    minRank: 1,
  },
  {
    key: "members.view",
    category: "members",
    label: "View members",
    description: "View workspace members, their roles, and join dates.",
    minRank: 0,
  },
  {
    key: "members.update",
    category: "members",
    label: "Update members",
    description: "Edit member labels, metadata, and non-role workspace member details.",
    minRank: 2,
  },
  {
    key: "members.invite",
    category: "members",
    label: "Manage invites",
    description: "View, copy, and rotate workspace invitation codes.",
    minRank: 2,
  },
  {
    key: "members.remove",
    category: "members",
    label: "Remove members",
    description: "Remove lower-access members from the workspace.",
    minRank: 2,
  },
  {
    key: "roles.assign",
    category: "members",
    label: "Assign roles",
    description: "Assign non-owner-level roles to workspace members.",
    minRank: 2,
  },
  {
    key: "roles.assignMultiple",
    category: "members",
    label: "Assign multiple roles",
    description: "Assign or remove multiple roles on the same workspace member.",
    minRank: 2,
  },
  {
    key: "roles.viewPermissions",
    category: "security",
    label: "View role permissions",
    description: "View complete role templates and effective permission sets.",
    minRank: 0,
  },
  {
    key: "roles.managePermissions",
    category: "security",
    label: "Manage role permissions",
    description: "Edit permission templates for every role in the workspace.",
    minRank: 3,
  },
  {
    key: "audit.view",
    category: "security",
    label: "View audit status",
    description: "View access status, permission summaries, and security-sensitive state.",
    minRank: 2,
  },
  {
    key: "audit.export",
    category: "security",
    label: "Export audit data",
    description: "Export audit status, member access reports, and security evidence.",
    minRank: 2,
  },
  {
    key: "security.manage",
    category: "security",
    label: "Manage security",
    description: "Manage high-risk security, compliance, identity, and policy settings.",
    minRank: 2,
  },
  {
    key: "danger.delete",
    category: "security",
    label: "Delete protected content",
    description: "Perform destructive operations across records, files, and members when allowed.",
    minRank: 2,
  },
] as const satisfies readonly {
  key: string;
  category: WorkspacePermissionCategoryId;
  label: string;
  description: string;
  minRank: WorkspaceRoleRank;
}[];

export type WorkspacePermissionKey = (typeof workspacePermissionCatalog)[number]["key"];
export type WorkspacePermissionSet = Record<WorkspacePermissionKey, boolean>;

export const workspacePermissionKeys = workspacePermissionCatalog.map((permission) => permission.key) as WorkspacePermissionKey[];

export const workspacePermissionGroups = workspacePermissionCategories.map((category) => ({
  ...category,
  permissions: workspacePermissionCatalog.filter((permission) => permission.category === category.id),
}));

export function getDefaultWorkspacePermissions(role: unknown): WorkspacePermissionSet {
  return getDefaultWorkspacePermissionsForRoles(normalizeWorkspaceRoleList(role, "Viewer"));
}

export function getDefaultWorkspacePermissionsForRoles(roles: unknown): WorkspacePermissionSet {
  const normalizedRoles = normalizeWorkspaceRoleList(roles, "Viewer");
  if (isNetworkOnlyWorkspaceRoleSet(normalizedRoles)) {
    return createWorkspacePermissionSet();
  }
  const permissions = createWorkspacePermissionSet([
    "workspace.view",
    "cloud.view",
    "chat.read",
    "docs.read",
    "files.download",
    "data.read",
    "sql.read",
    "code.read",
    "members.view",
    "roles.viewPermissions",
  ]);

  for (const role of normalizedRoles) {
    const rank = getWorkspaceRoleRank(role);
    for (const key of getRoleDefaultPermissionKeys(role)) {
      permissions[key] = true;
    }
    if (rank >= 1) {
      permissions["workspace.write"] = true;
    }
    if (rank >= 3) {
      for (const key of workspacePermissionKeys) {
        permissions[key] = true;
      }
    }
  }

  return enforceWorkspacePermissionInvariants(permissions, normalizedRoles);
}

export function normalizeWorkspacePermissionSet(
  permissions: unknown,
  role: string | null | undefined,
): WorkspacePermissionSet {
  const defaults = getDefaultWorkspacePermissions(role);
  if (!permissions || typeof permissions !== "object" || Array.isArray(permissions)) {
    return enforceWorkspacePermissionInvariants(defaults, role);
  }

  const input = permissions as Partial<Record<WorkspacePermissionKey, unknown>>;
  const normalized = { ...defaults };
  for (const key of workspacePermissionKeys) {
    if (typeof input[key] === "boolean") {
      normalized[key] = input[key];
    }
  }
  return enforceWorkspacePermissionInvariants(normalized, role);
}

export function permissionSetHas(permissions: WorkspacePermissionSet | null | undefined, key: WorkspacePermissionKey) {
  return Boolean(permissions?.[key]);
}

function enforceWorkspacePermissionInvariants(
  permissions: WorkspacePermissionSet,
  role: string | readonly string[] | null | undefined,
) {
  if (isNetworkOnlyWorkspaceRoleSet(role)) {
    return createWorkspacePermissionSet();
  }
  const normalized = { ...permissions };
  normalized["workspace.view"] = true;
  normalized["members.view"] = true;
  normalized["roles.viewPermissions"] = true;
  if (isWorkspaceOwnerRoleSet(role)) {
    for (const key of workspacePermissionKeys) {
      normalized[key] = true;
    }
  }
  return normalized;
}

function createWorkspacePermissionSet(enabledKeys: readonly WorkspacePermissionKey[] = []): WorkspacePermissionSet {
  const permissions = Object.fromEntries(
    workspacePermissionKeys.map((key) => [key, false]),
  ) as WorkspacePermissionSet;
  for (const key of enabledKeys) {
    permissions[key] = true;
  }
  return permissions;
}

const generalContributorPermissions = [
  "chat.send",
  "chat.attachFiles",
  "chat.manageChannels",
  "threads.reply",
  "dm.send",
  "calls.start",
  "docs.write",
  "docs.comment",
  "docs.manageFolders",
  "files.upload",
  "data.write",
  "data.import",
  "data.export",
  "sql.export",
] as const satisfies readonly WorkspacePermissionKey[];

const contentPermissions = [
  "chat.send",
  "chat.attachFiles",
  "threads.reply",
  "dm.send",
  "docs.write",
  "docs.comment",
  "docs.manageFolders",
  "files.upload",
  "files.download",
] as const satisfies readonly WorkspacePermissionKey[];

const developerPermissions = [
  "chat.send",
  "chat.attachFiles",
  "threads.reply",
  "dm.send",
  "calls.start",
  "docs.comment",
  "files.upload",
  "files.download",
  "data.read",
  "data.export",
  "sql.read",
  "sql.write",
  "sql.import",
  "sql.export",
  "code.read",
  "code.write",
  "code.review",
  "code.delete",
  "code.import",
  "code.export",
  "terminal.use",
  "terminal.write",
] as const satisfies readonly WorkspacePermissionKey[];

const managementPermissions = [
  "networks.view",
  "networks.create",
  "networks.manage",
  "networks.assignRoles",
  "networks.audit",
  "workspace.update",
  "workspace.export",
  "chat.send",
  "chat.attachFiles",
  "chat.manageChannels",
  "chat.moderate",
  "threads.reply",
  "threads.manage",
  "dm.send",
  "calls.start",
  "docs.write",
  "docs.comment",
  "docs.manageFolders",
  "docs.delete",
  "files.upload",
  "files.download",
  "data.write",
  "data.import",
  "data.export",
  "members.invite",
  "members.update",
  "members.remove",
  "roles.assign",
  "roles.assignMultiple",
  "audit.view",
] as const satisfies readonly WorkspacePermissionKey[];

const securityPermissions = [
  "chat.read",
  "docs.read",
  "files.download",
  "data.read",
  "sql.read",
  "code.read",
  "code.review",
  "members.view",
  "roles.viewPermissions",
  "audit.view",
  "audit.export",
] as const satisfies readonly WorkspacePermissionKey[];

const networkViewerPermissions = [
  "networks.view",
  "networks.audit",
  "audit.view",
] as const satisfies readonly WorkspacePermissionKey[];

const networkCreatorPermissions = [
  "networks.view",
  "networks.create",
  "networks.audit",
  "audit.view",
] as const satisfies readonly WorkspacePermissionKey[];

const networkGovernancePermissions = [
  "networks.view",
  "networks.create",
  "networks.manage",
  "networks.assignRoles",
  "networks.audit",
  "members.view",
  "members.invite",
  "members.update",
  "roles.assign",
  "roles.assignMultiple",
  "roles.viewPermissions",
  "audit.view",
  "audit.export",
] as const satisfies readonly WorkspacePermissionKey[];

const networkOperationsPermissions = [
  "networks.view",
  "networks.create",
  "networks.manage",
  "networks.audit",
  "chat.send",
  "chat.attachFiles",
  "threads.reply",
  "docs.comment",
  "data.read",
  "code.read",
  "audit.view",
] as const satisfies readonly WorkspacePermissionKey[];

const networkMemberCoordinatorPermissions = [
  "networks.view",
  "networks.assignRoles",
  "networks.audit",
  "members.view",
  "members.invite",
  "members.update",
  "roles.assign",
  "roles.assignMultiple",
  "roles.viewPermissions",
  "audit.view",
] as const satisfies readonly WorkspacePermissionKey[];

const networkServiceGovernancePermissions = [
  ...networkOperationsPermissions,
  "docs.write",
  "files.upload",
  "data.read",
  "data.export",
  "sql.read",
  "code.read",
  "code.review",
  "audit.export",
] as const satisfies readonly WorkspacePermissionKey[];

const networkDataGovernancePermissions = [
  ...networkOperationsPermissions,
  "data.read",
  "data.write",
  "data.import",
  "data.export",
  "sql.read",
  "sql.write",
  "sql.import",
  "sql.export",
  "sql.manageConnections",
  "audit.export",
] as const satisfies readonly WorkspacePermissionKey[];

const networkAssetGovernancePermissions = [
  ...networkOperationsPermissions,
  "docs.write",
  "docs.manageFolders",
  "files.upload",
  "files.download",
  "code.read",
  "code.export",
] as const satisfies readonly WorkspacePermissionKey[];

const roleCategoryDefaultPermissions = {
  core: [] as WorkspacePermissionKey[],
  "read-only": [] as WorkspacePermissionKey[],
  standard: generalContributorPermissions,
  staff: generalContributorPermissions,
  software: developerPermissions,
  security: securityPermissions,
  management: managementPermissions,
  enterprise: managementPermissions,
  "network-governance": networkOperationsPermissions,
} satisfies Record<WorkspaceRoleCategoryId, readonly WorkspacePermissionKey[]>;

const roleSpecificDefaultPermissions = {
  Admin: managementPermissions,
  Member: generalContributorPermissions,
  TrustedMember: [...generalContributorPermissions, "code.read", "code.review", "sql.read"] as const,
  Contributor: generalContributorPermissions,
  Creator: contentPermissions,
  Editor: contentPermissions,
  Author: contentPermissions,
  Writer: contentPermissions,
  Blogger: contentPermissions,
  Publisher: [...contentPermissions, "docs.delete", "files.delete"] as const,
  Reviewer: ["docs.comment", "code.review", "audit.view"] as const,
  "Content Manager": [...contentPermissions, "docs.delete", "files.delete", "chat.manageChannels"] as const,
  Analyst: ["chat.send", "threads.reply", "docs.comment", "data.read", "data.export", "sql.read", "sql.export"] as const,
  Intern: ["chat.send", "threads.reply", "docs.comment", "files.download"] as const,
  Developer: developerPermissions,
  "Software Engineer": developerPermissions,
  "Backend Developer": [...developerPermissions, "sql.manageConnections"] as const,
  "Frontend Developer": [...developerPermissions, "docs.write"] as const,
  "Fullstack Developer": [...developerPermissions, "docs.write", "data.write"] as const,
  "QA Engineer": [...developerPermissions, "data.write", "docs.comment"] as const,
  Tester: ["chat.send", "threads.reply", "docs.comment", "data.read", "code.read", "code.review"] as const,
  "DevOps Engineer": [...developerPermissions, "cloud.view", "cloud.manage", "workspace.export"] as const,
  "Dev Lead": [...developerPermissions, "members.invite", "roles.assign", "roles.assignMultiple", "audit.view"] as const,
  "Database Admin": ["data.read", "data.write", "data.delete", "data.schemaManage", "data.import", "data.export", "sql.read", "sql.write", "sql.import", "sql.export", "sql.manageConnections", "audit.view"] as const,
  "Security Admin": [...securityPermissions, "security.manage", "chat.moderate", "roles.assign", "roles.assignMultiple"] as const,
  SecurityAdministrator: [...securityPermissions, "security.manage", "chat.moderate", "roles.assign", "roles.assignMultiple"] as const,
  "Cloud Administrator": [...developerPermissions, "cloud.view", "cloud.manage", "workspace.export"] as const,
  "Platform Admin": [...developerPermissions, "cloud.manage", "security.manage", "audit.view"] as const,
  "Infrastructure Admin": [...developerPermissions, "cloud.manage", "security.manage", "audit.view"] as const,
  "Environment Admin": [...developerPermissions, "cloud.manage", "sql.manageConnections"] as const,
  "API Admin": [...developerPermissions, "sql.manageConnections", "audit.view"] as const,
  "Data Admin": ["data.read", "data.write", "data.delete", "data.schemaManage", "data.import", "data.export", "sql.read", "sql.write", "sql.import", "sql.export", "sql.manageConnections", "audit.view"] as const,
  "Backup Admin": ["workspace.export", "data.export", "sql.export", "code.export", "audit.export"] as const,
  "Security Analyst": securityPermissions,
  "Security Engineer": [...securityPermissions, "security.manage", "code.review"] as const,
  "SOC Analyst": securityPermissions,
  Auditor: ["audit.view", "audit.export", "members.view", "roles.viewPermissions", "docs.read", "data.read", "code.read"] as const,
  "Compliance Officer": [...securityPermissions, "security.manage"] as const,
  "Audit Admin": [...securityPermissions, "security.manage"] as const,
  "Compliance Admin": [...securityPermissions, "security.manage"] as const,
  Moderator: ["chat.read", "chat.send", "chat.moderate", "threads.manage", "members.view", "audit.view"] as const,
  SeniorModerator: ["chat.read", "chat.send", "chat.moderate", "threads.manage", "members.view", "audit.view"] as const,
  LeadModerator: ["chat.read", "chat.send", "chat.moderate", "threads.manage", "members.view", "audit.view"] as const,
  "Access Manager": ["members.view", "members.invite", "members.update", "members.remove", "roles.assign", "roles.assignMultiple", "roles.viewPermissions", "audit.view"] as const,
  "Identity Manager": ["members.view", "members.invite", "members.update", "roles.assign", "roles.assignMultiple", "roles.viewPermissions", "security.manage", "audit.view"] as const,
  "Security Operator": [...securityPermissions, "chat.moderate", "security.manage"] as const,
  "Network Admin": [...networkGovernancePermissions, "workspace.update"] as const,
  "Project Admin": [...managementPermissions, "data.schemaManage", "code.review"] as const,
  "Project Manager": managementPermissions,
  "Team Admin": [...managementPermissions, "roles.assign", "roles.assignMultiple"] as const,
  "Workspace Admin": [...networkGovernancePermissions, ...managementPermissions, "security.manage"] as const,
  "Workspace Manager": [...networkGovernancePermissions, ...managementPermissions] as const,
  "Workspace Network Owner": [...networkGovernancePermissions, ...managementPermissions, "workspace.delete", "security.manage", "danger.delete"] as const,
  "Workspace Network Admin": [...networkGovernancePermissions, ...managementPermissions, "security.manage"] as const,
  "Workspace Network Manager": [...networkGovernancePermissions, ...networkOperationsPermissions, "members.invite", "roles.assign", "roles.assignMultiple"] as const,
  "Network Portfolio Owner": [...networkGovernancePermissions, ...managementPermissions, "workspace.delete", "security.manage", "danger.delete"] as const,
  "Network Governance Admin": [...networkGovernancePermissions, "security.manage"] as const,
  "Network Operations Manager": networkOperationsPermissions,
  "Network Program Manager": [...networkOperationsPermissions, "members.invite", "roles.assign"] as const,
  "Network Access Manager": ["networks.view", "networks.assignRoles", "networks.audit", "members.view", "members.invite", "members.update", "roles.assign", "roles.assignMultiple", "roles.viewPermissions", "audit.view", "audit.export"] as const,
  "Network Role Manager": ["networks.view", "networks.assignRoles", "networks.audit", "members.view", "roles.assign", "roles.assignMultiple", "roles.viewPermissions", "audit.view", "audit.export"] as const,
  "Network Head": networkGovernancePermissions,
  "Network Manager": networkOperationsPermissions,
  "Network Lead": ["networks.view", "networks.create", "networks.audit", "chat.send", "threads.reply", "docs.write", "docs.comment", "data.read", "code.read", "audit.view"] as const,
  "Network Member": ["networks.view", "chat.send", "threads.reply", "docs.comment", "data.read", "code.read"] as const,
  "Network Member Coordinator": networkMemberCoordinatorPermissions,
  "Client Network Lead": [...networkOperationsPermissions, "docs.write", "data.write", "code.review"] as const,
  "Client Delivery Manager": [...networkOperationsPermissions, "docs.write", "data.write", "chat.manageChannels"] as const,
  "Client Portfolio Manager": [...networkGovernancePermissions, ...networkOperationsPermissions, "workspace.export"] as const,
  "Client Access Reviewer": ["networks.view", "networks.audit", "audit.view", "roles.viewPermissions", "docs.read", "data.read", "code.read"] as const,
  "External Network Partner": ["networks.view"] as const,
  "Subnetwork Head": networkGovernancePermissions,
  "Subnetwork Manager": networkOperationsPermissions,
  "Subnetwork Coordinator": networkCreatorPermissions,
  "Subnetwork Lead": ["networks.view", "networks.audit", "chat.send", "threads.reply", "docs.write", "docs.comment", "files.upload", "data.read", "code.read", "audit.view"] as const,
  "Subnetwork Operations Lead": ["networks.view", "networks.audit", "chat.send", "threads.reply", "docs.write", "docs.comment", "files.upload", "data.read", "code.read", "audit.view"] as const,
  "Subnetwork Services Lead": [...networkServiceGovernancePermissions, "networks.view", "networks.audit"] as const,
  "Subnetwork Member": ["networks.view", "chat.send", "threads.reply", "docs.comment", "data.read", "code.read"] as const,
  "Subnetwork Viewer": ["networks.view"] as const,
  "Service Catalog Manager": networkServiceGovernancePermissions,
  "Network Services Head": [...networkServiceGovernancePermissions, "security.manage"] as const,
  "Network Service Owner": networkServiceGovernancePermissions,
  "Network Service Manager": networkServiceGovernancePermissions,
  "Network Package Manager": [...networkServiceGovernancePermissions, "code.export"] as const,
  "Network Data Manager": networkDataGovernancePermissions,
  "Network SQL Manager": networkDataGovernancePermissions,
  "Network Shared Assets Manager": networkAssetGovernancePermissions,
  "Fetch Request Approver": [...networkMemberCoordinatorPermissions, "security.manage"] as const,
  "Network Fetch Manager": [...networkMemberCoordinatorPermissions, "security.manage", "audit.export"] as const,
  "Network Dependency Auditor": [...networkViewerPermissions, "docs.read", "data.read", "code.read", "audit.export"] as const,
  "Network Compliance Reviewer": ["networks.view", "networks.audit", "audit.view", "audit.export", "members.view", "roles.viewPermissions", "docs.read", "data.read", "code.read"] as const,
  "Network Auditor": networkViewerPermissions,
  "Network Viewer": ["networks.view"] as const,
} satisfies Partial<Record<WorkspaceRole, readonly WorkspacePermissionKey[]>>;

function getRoleDefaultPermissionKeys(role: WorkspaceRole): readonly WorkspacePermissionKey[] {
  const specificPermissions =
    (roleSpecificDefaultPermissions as Partial<Record<WorkspaceRole, readonly WorkspacePermissionKey[]>>)[role];
  if (specificPermissions) {
    return specificPermissions;
  }
  return roleCategoryDefaultPermissions[workspaceRoleCategory[role]];
}

export type Person = {
  id: string;
  name: string;
  role: string;
  initials: string;
  status: Presence;
  accent: string;
};

export type Channel = {
  id: string;
  name: string;
  unread: number;
  members: number;
  topic: string;
  code?: string;
};

export type Reaction = {
  emoji: string;
  count: number;
};

export type ChatMessage = {
  id: string;
  channelId: string;
  authorId: string;
  author?: string;
  role?: string;
  time: string;
  body: string;
  reactions?: Reaction[];
  attachment?: {
    kind: "page" | "task" | "code" | "file";
    label: string;
    meta: string;
  };
  threadCount?: number;
};

export type Message = ChatMessage & {
  author: string;
  role: string;
  threadCount: number;
};

export type PageBlock =
  | { type: "paragraph"; text: string }
  | { type: "checklist"; items: { label: string; done: boolean }[] }
  | { type: "table"; rows: { label: string; value: string }[] }
  | { type: "callout"; tone: "info" | "success" | "warning"; text: string };

export type WorkspacePage = {
  id: string;
  title: string;
  parentId?: string;
  icon: string;
  ownerId: string;
  status: "Draft" | "In review" | "Approved" | "In progress";
  updatedAt: string;
  summary: string;
  body: string;
  backlinks: { label: string; kind: "Chat" | "Task" | "PR" | "Database" }[];
  blocks: PageBlock[];
};

export type TaskStatus = "Todo" | "In Progress" | "Blocked" | "Review" | "Done";
export type Priority = "Low" | "Medium" | "High" | "Urgent";

export type TaskRecord = {
  id: string;
  title: string;
  status: TaskStatus;
  assigneeId: string;
  priority: Priority;
  dueDate: string;
  source: string;
  linkedPageId: string;
  linkedFileId?: string;
};

export type BugRecord = {
  id: string;
  title: string;
  status: TaskStatus;
  severity: "S1" | "S2" | "S3";
  assigneeId: string;
  dueDate: string;
};

export type CustomerRecord = {
  id: string;
  company: string;
  tier: "Starter" | "Growth" | "Enterprise";
  ownerId: string;
  health: "Healthy" | "Watching" | "At risk";
  renewal: string;
};

export type CodeFile = {
  id: string;
  name: string;
  path: string;
  language: string;
  status: "Clean" | "Modified" | "Review";
  content: string;
  contents: string;
};

export type ReviewComment = {
  id: string;
  authorId: string;
  fileId: string;
  line: number;
  time: string;
  body: string;
  resolved: boolean;
};

export const people: Person[] = [
  {
    id: "sarah",
    name: "Sarah Chen",
    role: "Product Lead",
    initials: "SC",
    status: "online",
    accent: "#e66d66",
  },
  {
    id: "alex",
    name: "Alex Rivera",
    role: "Engineer",
    initials: "AR",
    status: "focus",
    accent: "#3f7bdc",
  },
  {
    id: "priya",
    name: "Priya Shah",
    role: "Design",
    initials: "PS",
    status: "online",
    accent: "#0f9f8f",
  },
  {
    id: "marcus",
    name: "Marcus Lee",
    role: "Backend",
    initials: "ML",
    status: "away",
    accent: "#d27b2f",
  },
  {
    id: "mira",
    name: "Mira Patel",
    role: "Support",
    initials: "MP",
    status: "online",
    accent: "#8b69d6",
  },
];

export const channels: Channel[] = [
  {
    id: "general",
    name: "general",
    unread: 3,
    members: 24,
    topic: "Announcements, launches, and company-wide decisions",
  },
  {
    id: "engineering",
    name: "engineering",
    unread: 8,
    members: 8,
    topic: "Build discussion, implementation notes, and code reviews",
  },
  {
    id: "design",
    name: "design",
    unread: 0,
    members: 6,
    topic: "UX critique, research snippets, and design system work",
  },
  {
    id: "support",
    name: "support",
    unread: 2,
    members: 11,
    topic: "Customer issues, escalations, and help center feedback",
  },
];

export const messages: Message[] = [
  {
    id: "msg-1",
    channelId: "engineering",
    authorId: "sarah",
    author: "Sarah Chen",
    role: "Product Lead",
    time: "9:15 AM",
    body: "We've been hearing consistent feedback about easier data export. Let's scope a CSV export in v2.0.",
    reactions: [
      { emoji: "thumbs-up", count: 3 },
      { emoji: "raised-hands", count: 2 },
    ],
    threadCount: 4,
  },
  {
    id: "msg-2",
    channelId: "engineering",
    authorId: "alex",
    author: "Alex Rivera",
    role: "Engineer",
    time: "9:16 AM",
    body: "+1. I'll draft the spec and link the implementation tasks so QA can follow the work.",
    attachment: {
      kind: "page",
      label: "CSV Export Product Spec",
      meta: "Projects / Flowcard 2.0",
    },
    threadCount: 0,
  },
  {
    id: "msg-3",
    channelId: "engineering",
    authorId: "priya",
    author: "Priya Shah",
    role: "Design",
    time: "9:18 AM",
    body: "From a UX perspective, export should be surfaced from Data Views and remember visible columns.",
    attachment: {
      kind: "task",
      label: "TASK-1022 CSV export - UI",
      meta: "High priority, due Jun 4",
    },
    threadCount: 2,
  },
  {
    id: "msg-4",
    channelId: "engineering",
    authorId: "marcus",
    author: "Marcus Lee",
    role: "Backend",
    time: "9:21 AM",
    body: "I can take the backend piece. We can reuse the report service and add background jobs for large exports.",
    attachment: {
      kind: "code",
      label: "services/export/export.service.ts",
      meta: "Linked to PR #421",
    },
    threadCount: 0,
  },
  {
    id: "msg-5",
    channelId: "engineering",
    authorId: "mira",
    author: "Mira Patel",
    role: "Support",
    time: "9:24 AM",
    body: "Support has 17 recent tickets asking for Excel-friendly CSVs. I linked the customer examples to the task.",
    threadCount: 0,
  },
];

export const pages: WorkspacePage[] = [
  {
    id: "product",
    title: "Product",
    icon: "folder",
    ownerId: "sarah",
    status: "Approved",
    updatedAt: "May 28",
    summary: "Product wiki, planning rituals, and launch notes.",
    body: "## Product\nProduct wiki, planning rituals, and launch notes.\n- Keep roadmap decisions linked to channels\n- Review customer feedback before launch",
    backlinks: [],
    blocks: [],
  },
  {
    id: "flowcard-20",
    title: "Flowcard 2.0",
    parentId: "product",
    icon: "folder",
    ownerId: "sarah",
    status: "In progress",
    updatedAt: "May 29",
    summary: "Launch workspace for collaboration, data exports, and developer review.",
    body: "## Flowcard 2.0\nLaunch workspace for collaboration, data exports, and developer review.\n- Align chat, docs, databases, and code review\n- Prepare production authentication and persistence",
    backlinks: [],
    blocks: [],
  },
  {
    id: "csv-spec",
    title: "CSV Export",
    parentId: "flowcard-20",
    icon: "doc",
    ownerId: "alex",
    status: "In progress",
    updatedAt: "May 31",
    summary:
      "Allow teams to export current table views as CSV while preserving visible columns, filters, and audit history.",
    body:
      "## CSV Export\nAllow teams to export current table views as CSV while preserving visible columns, filters, and audit history.\n\n### Scope\n- Export current view or selected rows to CSV\n- Support all visible columns and filters\n- Handle large datasets with a background job\n- Track export history and permissions\n\nDecision: ship CSV first, then add scheduled exports after usage data lands.",
    backlinks: [
      { label: "#engineering", kind: "Chat" },
      { label: "TASK-1022", kind: "Task" },
      { label: "PR #421", kind: "PR" },
      { label: "Tasks", kind: "Database" },
    ],
    blocks: [
      {
        type: "table",
        rows: [
          { label: "Owner", value: "Alex Rivera" },
          { label: "Target release", value: "v2.0" },
          { label: "Status", value: "In Progress" },
          { label: "Last updated", value: "May 31, 2026" },
        ],
      },
      {
        type: "paragraph",
        text: "Teams need a simple way to export data from tables and saved views to CSV for analysis in Excel, Sheets, and downstream reporting tools.",
      },
      {
        type: "checklist",
        items: [
          { label: "Export current view or selected rows to CSV", done: true },
          { label: "Support all visible columns and filters", done: true },
          { label: "Handle large datasets with a background job", done: false },
          { label: "Track export history and permissions", done: false },
        ],
      },
      {
        type: "callout",
        tone: "info",
        text: "Decision: ship CSV first, then add scheduled exports after usage data lands.",
      },
    ],
  },
  {
    id: "meeting-notes",
    title: "Meeting Notes",
    parentId: "flowcard-20",
    icon: "doc",
    ownerId: "priya",
    status: "Draft",
    updatedAt: "May 30",
    summary: "Weekly product and engineering notes.",
    body: "## Meeting Notes\nWeekly product and engineering notes.\n- Review open launch blockers\n- Confirm owners for auth, database sync, and code review",
    backlinks: [],
    blocks: [],
  },
  {
    id: "roadmap",
    title: "Roadmap",
    parentId: "flowcard-20",
    icon: "board",
    ownerId: "sarah",
    status: "In review",
    updatedAt: "May 27",
    summary: "Quarterly themes and launch sequencing.",
    body: "## Roadmap\nQuarterly themes and launch sequencing.\n- Authenticated workspaces\n- Live databases\n- Code viewer and writer",
    backlinks: [],
    blocks: [],
  },
];

export const tasks: TaskRecord[] = [
  {
    id: "TASK-1021",
    title: "CSV export - backend",
    status: "In Progress",
    assigneeId: "marcus",
    priority: "High",
    dueDate: "Jun 3",
    source: "#engineering",
    linkedPageId: "csv-spec",
    linkedFileId: "export-service",
  },
  {
    id: "TASK-1022",
    title: "CSV export - UI",
    status: "In Progress",
    assigneeId: "priya",
    priority: "High",
    dueDate: "Jun 4",
    source: "CSV Export",
    linkedPageId: "csv-spec",
    linkedFileId: "data-view",
  },
  {
    id: "TASK-1023",
    title: "Export history and emails",
    status: "Todo",
    assigneeId: "sarah",
    priority: "Medium",
    dueDate: "Jun 7",
    source: "Support tickets",
    linkedPageId: "csv-spec",
  },
  {
    id: "TASK-1024",
    title: "Permission checks",
    status: "Todo",
    assigneeId: "marcus",
    priority: "Medium",
    dueDate: "Jun 6",
    source: "Security review",
    linkedPageId: "csv-spec",
  },
  {
    id: "TASK-1025",
    title: "Docs and help center",
    status: "Review",
    assigneeId: "mira",
    priority: "Low",
    dueDate: "Jun 8",
    source: "#support",
    linkedPageId: "csv-spec",
  },
];

export const statusOptions = ["Backlog", "In Progress", "Blocked", "Review", "Shipped"] as const;
export const priorityOptions = ["High", "Medium", "Low"] as const;

export type DatabaseRecord = {
  id: string;
  task: string;
  owner: string;
  status: (typeof statusOptions)[number];
  priority: (typeof priorityOptions)[number];
  linkedChannel: string;
  updatedAt: string;
};

const taskStatusMap: Record<TaskStatus, DatabaseRecord["status"]> = {
  Todo: "Backlog",
  "In Progress": "In Progress",
  Blocked: "Blocked",
  Review: "Review",
  Done: "Shipped",
};

const taskPriorityMap: Record<Priority, DatabaseRecord["priority"]> = {
  Urgent: "High",
  High: "High",
  Medium: "Medium",
  Low: "Low",
};

export function createDatabaseRecord(
  task: string,
  owner: string,
  overrides: Partial<Omit<DatabaseRecord, "id" | "task" | "owner">> = {}
): DatabaseRecord {
  const now = "Now";
  return {
    id: `rec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    task,
    owner,
    status: overrides.status ?? "Backlog",
    priority: overrides.priority ?? "Medium",
    linkedChannel: overrides.linkedChannel ?? "#general",
    updatedAt: overrides.updatedAt ?? now,
  };
}

export const databaseRecords: DatabaseRecord[] = tasks.map((task) => ({
  id: task.id,
  task: task.title,
  owner: (people.find((person) => person.id === task.assigneeId) ?? people[0]).name,
  status: taskStatusMap[task.status],
  priority: taskPriorityMap[task.priority],
  linkedChannel: task.source.startsWith("#") ? task.source : `#${task.source.toLowerCase().replace(/\s+/g, "-")}`,
  updatedAt: task.dueDate,
}));

export const bugs: BugRecord[] = [
  {
    id: "BUG-318",
    title: "Kanban drag loses assignee on refresh",
    status: "Review",
    severity: "S2",
    assigneeId: "alex",
    dueDate: "Jun 2",
  },
  {
    id: "BUG-319",
    title: "Mention popover clips in small windows",
    status: "In Progress",
    severity: "S3",
    assigneeId: "priya",
    dueDate: "Jun 5",
  },
  {
    id: "BUG-320",
    title: "SQL editor does not preserve query history",
    status: "Todo",
    severity: "S2",
    assigneeId: "marcus",
    dueDate: "Jun 6",
  },
];

export const customers: CustomerRecord[] = [
  {
    id: "CUS-141",
    company: "Northstar Labs",
    tier: "Enterprise",
    ownerId: "mira",
    health: "Healthy",
    renewal: "Aug 12",
  },
  {
    id: "CUS-142",
    company: "Aperture Finance",
    tier: "Growth",
    ownerId: "sarah",
    health: "Watching",
    renewal: "Jul 1",
  },
  {
    id: "CUS-143",
    company: "Helio Retail",
    tier: "Enterprise",
    ownerId: "alex",
    health: "At risk",
    renewal: "Jun 22",
  },
];

type CodeFileSeed = Omit<CodeFile, "contents" | "language"> & {
  language: CodeFile["language"];
};

const codeFileSeed: CodeFileSeed[] = [
  {
    id: "export-service",
    name: "export.service.ts",
    path: "api/services/export.service.ts",
    language: "ts",
    status: "Modified",
    content: `import { Injectable } from "@nestjs/common";
import { CsvService } from "./csv.service";
import { EmailService } from "../email/email.service";
import type { ExportJob, ExportStatus } from "../types/export.types";

@Injectable()
export class ExportService {
  constructor(
    private readonly jobRepo: Repository<ExportJob>,
    private readonly csv: CsvService,
    private readonly email: EmailService,
  ) {}

  async createExport(userId: string, viewId: string, filters: ViewFilters) {
    const job = this.jobRepo.create({
      userId,
      viewId,
      filters,
      status: ExportStatus.Queued,
    });

    await this.jobRepo.save(job);
    return this.queueLargeExport(job);
  }
}`,
  },
  {
    id: "data-view",
    name: "DataViewToolbar.tsx",
    path: "web/features/databases/DataViewToolbar.tsx",
    language: "tsx",
    status: "Review",
    content: `export function DataViewToolbar({ view, selection }: ToolbarProps) {
  const canExport = selection.length > 0 || view.records.length > 0;

  return (
    <Toolbar>
      <ViewSwitcher value={view.mode} />
      <Button disabled={!canExport} icon={<Download />}>
        Export CSV
      </Button>
      <Button icon={<History />}>History</Button>
    </Toolbar>
  );
}`,
  },
  {
    id: "readme",
    name: "README.md",
    path: "README.md",
    language: "md",
    status: "Clean",
    content: `# Flowcard 2.0

CSV export connects chat decisions, product specs, task records, and code review.

- Export current view
- Preserve filters and visible columns
- Track permissions and audit history`,
  },
  {
    id: "schema",
    name: "schema.sql",
    path: "db/schema.sql",
    language: "sql",
    status: "Modified",
    content: `create table export_jobs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  view_id uuid not null,
  requested_by uuid not null,
  filters jsonb not null default '{}',
  status text not null check (status in ('queued', 'running', 'done', 'failed')),
  created_at timestamptz not null default now()
);`,
  },
];

const normalizeCodeLanguage = (language: CodeFile["language"]): CodeFile["language"] => {
  const normalized = language.trim().toLowerCase();
  if (normalized === "ts" || normalized === "tsx") {
    return "typescript";
  }
  if (normalized === "js" || normalized === "jsx") {
    return "javascript";
  }
  if (normalized === "md") {
    return "markdown";
  }
  if (normalized === "py") {
    return "python";
  }
  return normalized || "text";
};

export const codeFiles: CodeFile[] = codeFileSeed.map((file) => ({
  ...file,
  language: normalizeCodeLanguage(file.language),
  contents: file.content,
}));

export const reviewComments: ReviewComment[] = [
  {
    id: "rev-1",
    authorId: "alex",
    fileId: "export-service",
    line: 18,
    time: "9:48 AM",
    body: "Consider streaming large exports so we avoid memory spikes.",
    resolved: false,
  },
  {
    id: "rev-2",
    authorId: "marcus",
    fileId: "export-service",
    line: 24,
    time: "10:12 AM",
    body: "Initial job creation is in place. Permission guard comes next.",
    resolved: false,
  },
  {
    id: "rev-3",
    authorId: "priya",
    fileId: "data-view",
    line: 7,
    time: "10:30 AM",
    body: "Button placement works. Let's add a confirmation toast after export starts.",
    resolved: true,
  },
];

export const statusOrder: TaskStatus[] = [
  "Todo",
  "In Progress",
  "Blocked",
  "Review",
  "Done",
];

export const findPerson = (id: string) =>
  people.find((person) => person.id === id) ?? people[0];

export type FlowcardSnapshot = {
  channels: Channel[];
  messages: Message[];
  pages: WorkspacePage[];
  databaseRecords: DatabaseRecord[];
  codeFiles: CodeFile[];
};

export const seedSnapshot: FlowcardSnapshot = {
  channels,
  messages,
  pages,
  databaseRecords,
  codeFiles,
};

export {
  normalizeWorkspaceTaskApiPriority,
  normalizeWorkspaceTaskApiStatus,
  workspaceStateTaskToInsertRow,
  workspaceTaskPriorityToApiValue,
  workspaceTaskRecordToApiInput,
  workspaceTaskRowToRecord,
  workspaceTaskStatusToApiValue,
} from "./workspaceTasks.js";
export type { WorkspacePanelTaskRecord, WorkspaceTaskApiRow } from "./workspaceTasks.js";
export {
  normalizeWorkspaceBugApiSeverity,
  normalizeWorkspaceBugApiStatus,
  workspaceBugRecordToApiInput,
  workspaceBugRowToRecord,
} from "./workspaceBugs.js";
export type { WorkspaceBugApiRow, WorkspacePanelBugRecord } from "./workspaceBugs.js";
export {
  normalizeWorkspaceCustomerApiHealth,
  normalizeWorkspaceCustomerApiTier,
  workspaceCustomerRecordToApiInput,
  workspaceCustomerRowToRecord,
} from "./workspaceCustomers.js";
export type { WorkspaceCustomerApiRow, WorkspacePanelCustomerRecord } from "./workspaceCustomers.js";
