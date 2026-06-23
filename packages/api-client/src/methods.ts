import type {
  Channel,
  CodeFile,
  DatabaseRecord,
  FlowcardSnapshot,
  Message,
  WorkspaceBugApiRow,
  WorkspaceCustomerApiRow,
  WorkspacePermissionSet,
  WorkspacePage,
  WorkspaceRole as SharedWorkspaceRole,
  WorkspaceTaskApiRow,
} from "@flowcard/shared";
import {
  workspaceBugRecordToApiInput,
  workspaceBugRowToRecord,
  workspaceCustomerRecordToApiInput,
  workspaceCustomerRowToRecord,
  workspaceTaskRecordToApiInput,
  workspaceTaskRowToRecord,
} from "@flowcard/shared";
import type { FlowcardClientContext } from "./context.js";
import { request, uploadRawCloudStorageBlob, withQuery } from "./transport.js";

export type DataStatus = "connecting" | "live" | "saving" | "offline";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export type AuthSession = {
  token: string;
  expiresAt: string;
  user: AuthUser;
  authMethod?: "bearer" | "cookie";
};

export type AuthConfig = {
  provider: string;
  localAuthEnabled: boolean;
  clankite: {
    enabled: boolean;
    label: string;
    startUrl: string;
    issuer: string;
    clientId: string;
    scope: string;
    callbackUrl: string;
  };
};

export type RuntimeReadinessSummary = {
  ok: boolean;
  status: string;
  generatedAt: string;
  blockingChecks: number;
  warningChecks: number;
  httpStatus: number;
  environment: {
    production: boolean;
    publicBaseUrl: string;
    enterprise: {
      deploymentProfile: string;
      database: { engine: string };
      objectStorage: { provider: string };
      queue: { backend: string };
      cache: { backend: string };
      search: { provider: string };
      limits: {
        rateLimitEnabled: boolean;
        strictPagination: boolean;
        requestTimeoutMs: number;
      };
      quotas: { enabled: boolean };
    };
  };
};

export type WorkspaceMembership = {
  id: string;
  name: string;
  role: WorkspaceRoleId;
  roles: WorkspaceRoleId[];
  inviteCode?: string;
  createdAt: string;
};

export type WorkspaceRole = SharedWorkspaceRole;
export type WorkspaceRoleId = SharedWorkspaceRole | (string & {});

export type WorkspaceMember = {
  id: string;
  name: string;
  email: string;
  role: WorkspaceRoleId;
  roles: WorkspaceRoleId[];
  createdAt: string;
};

export type WorkspaceInvitation = {
  workspace: WorkspaceMembership;
  inviteCode: string;
  rotatedAt?: string;
};

export type WelcomeCardScope = "workspace" | "network";

export type WelcomeCard = {
  id: string;
  scopeType: WelcomeCardScope;
  workspaceId: string;
  networkId: string | null;
  title: string;
  message: string;
  buttonLabel: string;
  accent: string;
  checklist: string[];
  enabled: boolean;
  createdBy: string | null;
  createdByName: string;
  updatedBy: string | null;
  updatedByName: string;
  createdAt: string;
  updatedAt: string;
  isDefault: boolean;
};

export type WelcomeCardInput = Pick<WelcomeCard, "title" | "message" | "buttonLabel" | "accent" | "checklist" | "enabled">;

export type WorkspaceRolePermission = {
  role: WorkspaceRoleId;
  rank: number;
  description?: string;
  baseRole?: SharedWorkspaceRole;
  permissions: WorkspacePermissionSet;
  customized: boolean;
  isCustom?: boolean;
  updatedAt: string | null;
  updatedBy: string | null;
};

export type WorkspaceRoleSettings = {
  workspace: WorkspaceMembership;
  currentUserPermissions: WorkspacePermissionSet;
  roles: WorkspaceRolePermission[];
};

export type WorkspaceActivityRecord = {
  id: string;
  workspaceId: string;
  actorUserId: string;
  actorName: string;
  actorEmail: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type WorkspaceActivityResponse = {
  workspace: WorkspaceMembership;
  activity: WorkspaceActivityRecord[];
  page: PageInfo;
};

export type SearchResult = {
  id: string;
  workspaceId: string;
  networkId: string | null;
  networkName: string;
  sourceType: string;
  sourceId: string;
  title: string;
  snippet: string;
  acl: Record<string, unknown>;
  metadata: Record<string, unknown>;
  updatedAt: string;
  createdAt: string;
};

export type SearchResponse = {
  workspace?: WorkspaceMembership;
  network?: NetworkRecord;
  results: SearchResult[];
  page: PageInfo;
};

export type NetworkPermissionKey =
  | "network.view"
  | "network.manage"
  | "network.createSubnetwork"
  | "network.assignRoles"
  | "network.manageMembers"
  | "network.manageChannels"
  | "network.manageProjects"
  | "network.manageBoards"
  | "network.manageTasks"
  | "network.manageCodeSpaces"
  | "network.manageStorage"
  | "network.manageDocuments"
  | "network.manageServices"
  | "network.managePackages"
  | "network.manageSharedAssets"
  | "network.requestFetch"
  | "network.manageFetchRequests"
  | "network.manageDatabase"
  | "network.manageSql"
  | "network.manageCalendar"
  | "network.manageAnalytics"
  | "network.viewActivity";

export type NetworkPermissionSet = Record<NetworkPermissionKey, boolean>;

export type NetworkStats = {
  subnetworks: number;
  members: number;
  channels: number;
  documents: number;
  projects: number;
  boards: number;
  tasks: number;
  storage: number;
  services: number;
  codeSpaces: number;
  activity: number;
};

export type NetworkRecord = {
  id: string;
  workspaceId: string;
  parentNetworkId: string | null;
  type: "network" | "subnetwork";
  name: string;
  slug: string;
  description: string;
  icon: string;
  banner: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
  permissions: NetworkPermissionSet;
  overrideAccess: boolean;
  stats: NetworkStats;
};

export type NetworkRole = {
  id: string;
  networkId: string;
  name: string;
  description: string;
  permissions: NetworkPermissionSet;
  isSystemRole: boolean;
  createdAt: string;
};

export type NetworkMember = {
  id: string;
  networkId: string;
  userId: string;
  name: string;
  email: string;
  joinedAt: string;
  role: NetworkRole;
};

export type NetworkResourceKind = "channels" | "documents" | "projects" | "boards" | "tasks" | "storage" | "services";

export type NetworkChannel = {
  id: string;
  networkId: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

export type NetworkChannelMessage = {
  id: string;
  networkId: string;
  channelId: string;
  authorUserId: string;
  body: string;
  threadParentId: string | null;
  mentions: string[];
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

export type NetworkPublicationStatus = "draft" | "published";

export type NetworkDocument = {
  id: string;
  networkId: string;
  title: string;
  kind: string;
  body: Record<string, unknown>;
  status: NetworkPublicationStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

export type NetworkProject = {
  id: string;
  networkId: string;
  name: string;
  description: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

export type NetworkBoard = {
  id: string;
  networkId: string;
  projectId: string | null;
  name: string;
  type: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

export type NetworkTask = {
  id: string;
  networkId: string;
  projectId: string | null;
  boardId: string | null;
  parentTaskId: string | null;
  title: string;
  description: string;
  status: string;
  publicationStatus: NetworkPublicationStatus;
  priority: string;
  assigneeUserId: string | null;
  createdBy: string;
  dueAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

export type NetworkStorageItem = {
  id: string;
  networkId: string;
  provider: CloudStorageProvider;
  path: string;
  metadata: Record<string, unknown>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

export type NetworkService = {
  id: string;
  networkId: string;
  name: string;
  description: string;
  ownerTeam: string;
  managerUserId: string | null;
  docsUrl: string;
  repositoryUrl: string;
  apiUrl: string;
  dependencies: string[];
  data: Record<string, unknown>;
  accessScopes: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

export type NetworkResourceRecord =
  | NetworkChannel
  | NetworkDocument
  | NetworkProject
  | NetworkBoard
  | NetworkTask
  | NetworkStorageItem
  | NetworkService;

export type NetworkCodeSpace = {
  id: string;
  networkId: string;
  name: string;
  description: string;
  repositoryUrl: string;
  branch: string;
  editorState: Record<string, unknown>;
  metadata: Record<string, unknown>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

export type NetworkFetchRequestStatus = "pending" | "approved" | "rejected";
export type NetworkFetchRequestService = "service" | "repository" | "document" | "storage" | "database" | "project" | "task" | "expertise";

export type NetworkFetchRequestRecord = {
  id: string;
  parentNetworkId: string;
  parentNetworkName?: string;
  subnetworkId: string;
  subnetworkName: string;
  service: NetworkFetchRequestService;
  serviceId?: string | null;
  serviceName?: string | null;
  reason: string;
  permission: string;
  accessLevel: "partial" | "full";
  dataScopes: string[];
  grantedData: Record<string, unknown>;
  durationDays: number;
  status: NetworkFetchRequestStatus;
  requestedBy: string;
  requestedByName: string;
  resolvedBy: string | null;
  resolvedByName?: string | null;
  requestedAt: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  resolvedAt: string | null;
};

export type NetworkActivity = {
  id: string;
  networkId: string;
  actorUserId: string;
  actorName: string;
  actorEmail: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type NetworkSqlCell = string | number | boolean | null;

export type NetworkSqlResult = {
  status: "success" | "error";
  message: string;
  columns: string[];
  rows: NetworkSqlCell[][];
  scannedRows?: number;
  affectedRows?: number;
  statementCount?: number;
};

export type NetworkSqlColumn = {
  name: string;
  type: "text" | "number" | "boolean";
};

export type NetworkSqlTableSummary = {
  label: string;
  columns: NetworkSqlColumn[];
  rowCount: number;
};

export type NetworkSqlQueryResponse = {
  network: NetworkRecord;
  readOnly: boolean;
  durationMs: number;
  result: NetworkSqlResult;
  tables: Record<string, NetworkSqlTableSummary>;
};

export type WorkspaceSqlQueryResponse = {
  workspace: WorkspaceMembership;
  readOnly: boolean;
  durationMs: number;
  result: NetworkSqlResult;
  tables: Record<string, NetworkSqlTableSummary>;
};

export type PageInfo = {
  limit: number;
  offset: number;
  total: number;
  nextOffset: number | null;
};

export type NetworkListResponse = {
  workspace: WorkspaceMembership | null;
  overrideAccess: boolean;
  networks: NetworkRecord[];
  page: PageInfo;
};

export type NetworkDashboardResponse = {
  workspace: WorkspaceMembership | null;
  network: NetworkRecord;
  permissions: NetworkPermissionSet;
  overrideAccess: boolean;
  members: NetworkMember[];
  roles: NetworkRole[];
  channels: NetworkChannel[];
  documents: NetworkDocument[];
  projects: NetworkProject[];
  boards: NetworkBoard[];
  tasks: NetworkTask[];
  storage: NetworkStorageItem[];
  services: NetworkService[];
  parentServices?: NetworkService[];
  codeSpaces: NetworkCodeSpace[];
  fetchRequests: NetworkFetchRequestRecord[];
  activity: NetworkActivity[];
  resourcePages?: {
    members: PageInfo;
    channels: PageInfo;
    documents: PageInfo;
    projects: PageInfo;
    boards: PageInfo;
    tasks: PageInfo;
    storage: PageInfo;
    services: PageInfo;
    parentServices: PageInfo;
    codeSpaces: PageInfo;
    fetchRequests: PageInfo;
    activity: PageInfo;
  };
};

export type AccountSecurity = {
  twoFactorEnabled: boolean;
  twoFactorEnabledAt: string | null;
  twoFactorSetupPending: boolean;
};

export type TwoFactorSetup = {
  secret: string;
  otpauthUrl: string;
  twoFactorEnabled: boolean;
};

export type FlowcardUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type DirectMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
};

export type DirectMessageConversation = {
  id: string;
  otherUser: FlowcardUser;
  lastMessage: DirectMessage | null;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
};

export type DirectMessageSignal = {
  id: string;
  conversationId: string;
  senderId: string;
  kind: "offer" | "answer" | "ice" | "call-start" | "call-end";
  payload: Record<string, unknown>;
  createdAt: string;
};

export type CloudStorageProvider = "clankite-cloud" | "google-drive" | "dropbox";

export type CloudStorageConnection = {
  id: string;
  provider: CloudStorageProvider;
  providerLabel: string;
  accountLabel: string;
  folderName: string;
  selectedFolderName: string;
  access: "selected-folder-readwrite";
  status: "connected" | "needs-reconnect";
  connectedAt: string;
  lastSyncedAt?: string;
  mirroredFiles: number;
};

export type CloudStorageFile = {
  provider: CloudStorageProvider;
  providerLabel: string;
  folderName: string;
  path: string;
  relativePath?: string;
  providerFileId?: string | null;
  name?: string;
  mimeType?: string | null;
  isFolder?: boolean;
  sizeBytes?: number;
  modifiedAt?: string | null;
  webUrl?: string | null;
  status: "synced" | "pending" | "failed";
  syncedAt?: string;
  error?: string;
};

export type CloudStorageStatus = {
  providers: Record<CloudStorageProvider, boolean>;
  connection: CloudStorageConnection | null;
};

export type CloudStorageOAuthStart = {
  provider: CloudStorageProvider;
  providerLabel: string;
  authUrl: string;
  expiresAt: string;
  connection?: CloudStorageConnection;
  message?: string;
};

export type ChannelCallSignal = {
  id: string;
  workspaceId: string;
  conversationId: string;
  senderId: string;
  kind: DirectMessageSignal["kind"];
  payload: Record<string, unknown>;
  createdAt: string;
};

export type GitRepositoryFile = {
  name: string;
  path: string;
  language: string;
  content: string;
};

export type GitFetchResult = {
  ok: true;
  repo: {
    url: string;
    branch: string;
    commit: string;
    pathPrefix: string;
    importedFiles: number;
    skippedFiles: number;
    totalBytes: number;
    limits: {
      maxFiles: number;
      maxFileBytes: number;
      maxTotalBytes: number;
    };
  };
  files: GitRepositoryFile[];
};

export type EmailProvider = "gmail" | "outlook" | "yahoo" | "imap";
export type EmailFolder = "inbox" | "sent" | "starred" | "archive" | "trash";

export type LinkedEmailAccount = {
  id: string;
  provider: EmailProvider;
  email: string;
  label: string;
  connectedAt: string;
  status: "linked" | "needs-provider-api";
  imapHost?: string;
  imapPort?: number;
  imapSecure?: boolean;
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
  lastSyncedAt?: string | null;
  lastVerifiedAt?: string | null;
};

export type EmailMessage = {
  id: string;
  accountId: string;
  folder: Exclude<EmailFolder, "starred">;
  from: string;
  to: string;
  subject: string;
  body: string;
  receivedAt: string;
  read: boolean;
  starred: boolean;
};

export type EmailMailbox = {
  account: LinkedEmailAccount | null;
  messages: EmailMessage[];
  emailLinkingEnabled?: boolean;
};

export async function fetchAuthConfig(ctx: FlowcardClientContext, ): Promise<AuthConfig> {
  return request<AuthConfig>(ctx,"/api/auth/clankite/config", {}, { auth: false, timeoutMs: 10000 });
}

export async function signUp(ctx: FlowcardClientContext, input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthSession> {
  const session = await request<AuthSession>(ctx, 
    "/api/auth/signup",
    {
      method: "POST",
      body: JSON.stringify(input)
    },
    { auth: false }
  );
  return session;
}

export async function signIn(ctx: FlowcardClientContext, input: {
  email: string;
  password: string;
  otp?: string;
}): Promise<AuthSession> {
  const session = await request<AuthSession>(ctx, 
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify(input)
    },
    { auth: false }
  );
  return session;
}

export type ForgotPasswordResult = {
  ok: true;
  message: string;
  delivery: "firebase" | "email" | "not-configured";
  resetUrl?: string;
};

export async function requestPasswordReset(ctx: FlowcardClientContext, input: { email: string }): Promise<ForgotPasswordResult> {
  return request<ForgotPasswordResult>(ctx,
    "/api/auth/password/forgot",
    {
      method: "POST",
      body: JSON.stringify(input)
    },
    { auth: false, timeoutMs: 10000 }
  );
}

export async function resetPassword(ctx: FlowcardClientContext, input: { token: string; newPassword: string }): Promise<{ ok: true; changedAt: string }> {
  const result = await request<{ ok: true; changedAt: string }>(ctx, 
    "/api/auth/password/reset",
    {
      method: "POST",
      body: JSON.stringify(input)
    },
    { auth: false, timeoutMs: 10000 }
  );
  return result;
}

export async function fetchCurrentUser(ctx: FlowcardClientContext, ): Promise<AuthUser | null> {
  const response = await request<{ user: AuthUser | null }>(ctx, "/api/auth/me");
  return response.user;
}

export async function signOut(ctx: FlowcardClientContext, ) {
  try {
    await request<{ ok: true }>(ctx, "/api/auth/logout", { method: "POST" });
  } finally {
  }
}

export async function fetchAccountSecurity(ctx: FlowcardClientContext, ): Promise<AccountSecurity> {
  return request<AccountSecurity>(ctx,"/api/account/security");
}

export async function fetchEmailMailbox(ctx: FlowcardClientContext, ): Promise<EmailMailbox> {
  return request<EmailMailbox>(ctx,"/api/account/email");
}

export async function linkEmailAccountApi(ctx: FlowcardClientContext, input: {
  provider: EmailProvider;
  email: string;
  label: string;
  password: string;
  imapHost?: string;
  imapPort?: number;
  imapSecure?: boolean;
  smtpHost?: string;
  smtpPort?: number;
  smtpSecure?: boolean;
}): Promise<EmailMailbox> {
  return request<EmailMailbox>(ctx,"/api/account/email/account", {
    method: "POST",
    body: JSON.stringify(input)
  }, { timeoutMs: 60000 });
}

export async function syncEmailMailboxApi(ctx: FlowcardClientContext, input: { limit?: number } = {}): Promise<EmailMailbox & { synced: number }> {
  return request<EmailMailbox & { synced: number }>(ctx,"/api/account/email/sync", {
    method: "POST",
    body: JSON.stringify(input)
  }, { timeoutMs: 60000 });
}

export async function disconnectEmailAccountApi(ctx: FlowcardClientContext, ): Promise<EmailMailbox> {
  return request<EmailMailbox>(ctx,"/api/account/email/account", { method: "DELETE" });
}

export async function sendEmailMessageApi(ctx: FlowcardClientContext, input: {
  to: string;
  subject: string;
  body: string;
}): Promise<EmailMailbox & { message: EmailMessage }> {
  return request<EmailMailbox & { message: EmailMessage }>(ctx,"/api/account/email/messages", {
    method: "POST",
    body: JSON.stringify(input)
  }, { timeoutMs: 60000 });
}

export async function updateEmailMessageApi(ctx: FlowcardClientContext, 
  messageId: string,
  patch: Partial<Pick<EmailMessage, "folder" | "read" | "starred" | "subject" | "body">>
): Promise<EmailMailbox & { message: EmailMessage }> {
  return request<EmailMailbox & { message: EmailMessage }>(ctx,`/api/account/email/messages/${encodeURIComponent(messageId)}`, {
    method: "PATCH",
    body: JSON.stringify(patch)
  });
}

export async function deleteEmailMessageApi(ctx: FlowcardClientContext, messageId: string): Promise<EmailMailbox & { ok: true }> {
  return request<EmailMailbox & { ok: true }>(ctx,`/api/account/email/messages/${encodeURIComponent(messageId)}`, { method: "DELETE" });
}

export async function changeAccountPassword(ctx: FlowcardClientContext, input: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ ok: true; changedAt: string }> {
  return request<{ ok: true; changedAt: string }>(ctx,"/api/account/password", {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export async function setupTwoFactor(ctx: FlowcardClientContext, ): Promise<TwoFactorSetup> {
  return request<TwoFactorSetup>(ctx,"/api/account/2fa/setup", { method: "POST" });
}

export async function enableTwoFactor(ctx: FlowcardClientContext, input: { code: string }): Promise<{
  ok: true;
  twoFactorEnabled: true;
  twoFactorEnabledAt: string;
}> {
  return request<{ ok: true; twoFactorEnabled: true; twoFactorEnabledAt: string }>(ctx,"/api/account/2fa/enable", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function disableTwoFactor(ctx: FlowcardClientContext, input: {
  currentPassword: string;
  code?: string;
}): Promise<{ ok: true; twoFactorEnabled: false }> {
  return request<{ ok: true; twoFactorEnabled: false }>(ctx,"/api/account/2fa/disable", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function fetchSnapshot(ctx: FlowcardClientContext, ): Promise<FlowcardSnapshot> {
  return request<FlowcardSnapshot>(ctx,"/api/snapshot");
}

export async function listWorkspaces(ctx: FlowcardClientContext, ): Promise<WorkspaceMembership[]> {
  const response = await request<{ workspaces: WorkspaceMembership[] }>(ctx, "/api/workspaces");
  return response.workspaces;
}

export async function createWorkspace(ctx: FlowcardClientContext, input: { name: string }): Promise<WorkspaceMembership> {
  return request<WorkspaceMembership>(ctx,"/api/workspaces", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function joinWorkspace(ctx: FlowcardClientContext, input: {
  inviteCode: string;
  name?: string;
}): Promise<WorkspaceMembership> {
  return request<WorkspaceMembership>(ctx,"/api/workspaces/join", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function updateWorkspaceDetails(ctx: FlowcardClientContext, workspaceId: string, input: {
  name: string;
}): Promise<WorkspaceMembership> {
  return request<WorkspaceMembership>(ctx,`/api/workspaces/${encodeURIComponent(workspaceId)}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export async function fetchWorkspaceInvitation(ctx: FlowcardClientContext, workspaceId: string): Promise<WorkspaceInvitation> {
  return request<WorkspaceInvitation>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/invitations`
  );
}

export async function rotateWorkspaceInviteCode(ctx: FlowcardClientContext, workspaceId: string): Promise<WorkspaceInvitation> {
  return request<WorkspaceInvitation>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/invitations/rotate`,
    { method: "POST" }
  );
}

export async function fetchWorkspaceWelcomeCard(ctx: FlowcardClientContext, workspaceId: string): Promise<{
  workspace: WorkspaceMembership;
  welcomeCard: WelcomeCard;
  canEdit: boolean;
}> {
  return request<{
    workspace: WorkspaceMembership;
    welcomeCard: WelcomeCard;
    canEdit: boolean;
  }>(ctx,`/api/workspaces/${encodeURIComponent(workspaceId)}/welcome-card`);
}

export async function updateWorkspaceWelcomeCard(ctx: FlowcardClientContext, 
  workspaceId: string,
  input: WelcomeCardInput
): Promise<{
  workspace: WorkspaceMembership;
  welcomeCard: WelcomeCard;
  canEdit: boolean;
}> {
  return request<{
    workspace: WorkspaceMembership;
    welcomeCard: WelcomeCard;
    canEdit: boolean;
  }>(ctx,`/api/workspaces/${encodeURIComponent(workspaceId)}/welcome-card`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export async function fetchWorkspaceActivity(ctx: FlowcardClientContext, 
  workspaceId: string,
  params: { limit?: number; offset?: number; q?: string; action?: string; entityType?: string; actorUserId?: string } = {}
): Promise<WorkspaceActivityResponse> {
  return request<WorkspaceActivityResponse>(ctx,
    withQuery(`/api/workspaces/${encodeURIComponent(workspaceId)}/activity`, params)
  );
}

export async function searchWorkspace(ctx: FlowcardClientContext, 
  workspaceId: string,
  params: { q?: string; sourceType?: string; limit?: number; offset?: number } = {}
): Promise<SearchResponse> {
  return request<SearchResponse>(ctx,
    withQuery(`/api/workspaces/${encodeURIComponent(workspaceId)}/search`, params),
    {},
    { timeoutMs: 10000 }
  );
}

export async function searchNetwork(ctx: FlowcardClientContext, 
  networkId: string,
  params: { q?: string; sourceType?: string; limit?: number; offset?: number } = {}
): Promise<SearchResponse> {
  return request<SearchResponse>(ctx,
    withQuery(`/api/networks/${encodeURIComponent(networkId)}/search`, params),
    {},
    { timeoutMs: 10000 }
  );
}

export async function fetchWorkspaceRoleSettings(ctx: FlowcardClientContext, workspaceId: string): Promise<WorkspaceRoleSettings> {
  return request<WorkspaceRoleSettings>(ctx,`/api/workspaces/${encodeURIComponent(workspaceId)}/roles`);
}

export async function updateWorkspaceRolePermissions(ctx: FlowcardClientContext, 
  workspaceId: string,
  role: WorkspaceRoleId,
  permissions: WorkspacePermissionSet
): Promise<{
  workspace: WorkspaceMembership;
  currentUserPermissions: WorkspacePermissionSet;
  role: WorkspaceRolePermission;
}> {
  return request<{
    workspace: WorkspaceMembership;
    currentUserPermissions: WorkspacePermissionSet;
    role: WorkspaceRolePermission;
  }>(ctx,`/api/workspaces/${encodeURIComponent(workspaceId)}/roles/${encodeURIComponent(role)}/permissions`, {
    method: "PATCH",
    body: JSON.stringify({ permissions })
  });
}

export async function resetWorkspaceRolePermissions(ctx: FlowcardClientContext, 
  workspaceId: string,
  role: WorkspaceRoleId
): Promise<{
  workspace: WorkspaceMembership;
  currentUserPermissions: WorkspacePermissionSet;
  role: WorkspaceRolePermission;
}> {
  return request<{
    workspace: WorkspaceMembership;
    currentUserPermissions: WorkspacePermissionSet;
    role: WorkspaceRolePermission;
  }>(ctx,`/api/workspaces/${encodeURIComponent(workspaceId)}/roles/${encodeURIComponent(role)}/permissions`, {
    method: "DELETE"
  });
}

export async function createWorkspaceCustomRole(ctx: FlowcardClientContext, 
  workspaceId: string,
  input: {
    name: string;
    description?: string;
    baseRole?: WorkspaceRole;
    permissions?: WorkspacePermissionSet;
  }
): Promise<{
  workspace: WorkspaceMembership;
  currentUserPermissions: WorkspacePermissionSet;
  role: WorkspaceRolePermission;
  roles: WorkspaceRolePermission[];
}> {
  return request<{
    workspace: WorkspaceMembership;
    currentUserPermissions: WorkspacePermissionSet;
    role: WorkspaceRolePermission;
    roles: WorkspaceRolePermission[];
  }>(ctx,`/api/workspaces/${encodeURIComponent(workspaceId)}/roles`, {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function updateWorkspaceCustomRole(ctx: FlowcardClientContext, 
  workspaceId: string,
  role: WorkspaceRoleId,
  input: {
    description?: string;
    baseRole?: WorkspaceRole;
    permissions?: WorkspacePermissionSet;
  }
): Promise<{
  workspace: WorkspaceMembership;
  currentUserPermissions: WorkspacePermissionSet;
  role: WorkspaceRolePermission;
  roles: WorkspaceRolePermission[];
}> {
  return request<{
    workspace: WorkspaceMembership;
    currentUserPermissions: WorkspacePermissionSet;
    role: WorkspaceRolePermission;
    roles: WorkspaceRolePermission[];
  }>(ctx,`/api/workspaces/${encodeURIComponent(workspaceId)}/roles/${encodeURIComponent(role)}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export async function deleteWorkspaceCustomRole(ctx: FlowcardClientContext, 
  workspaceId: string,
  role: WorkspaceRoleId
): Promise<{
  ok: true;
  workspace: WorkspaceMembership;
  members: WorkspaceMember[];
  roles: WorkspaceRolePermission[];
}> {
  return request<{
    ok: true;
    workspace: WorkspaceMembership;
    members: WorkspaceMember[];
    roles: WorkspaceRolePermission[];
  }>(ctx,`/api/workspaces/${encodeURIComponent(workspaceId)}/roles/${encodeURIComponent(role)}`, {
    method: "DELETE"
  });
}

// --- RBAC governance: audit, time-bound grants, access requests, resource ACLs ---

export type AccessUserRef = { id: string | null; name: string; email: string };

export type AccessAuditEntry = {
  id: string;
  action: string;
  actor: AccessUserRef;
  target: AccessUserRef | null;
  targetRole: string | null;
  summary: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  createdAt: string;
};

export type RoleGrantEntry = {
  id: string;
  user: AccessUserRef;
  role: string;
  grantedBy: AccessUserRef;
  reason: string;
  expiresAt: string;
  revokedAt: string | null;
  status: "active" | "expired" | "revoked";
  active: boolean;
  createdAt: string;
};

export type AccessRequestEntry = {
  id: string;
  requester: AccessUserRef;
  requestedRole: string;
  reason: string;
  status: "pending" | "approved" | "denied" | "cancelled";
  decidedBy: AccessUserRef | null;
  decisionNote: string;
  decidedAt: string | null;
  createdAt: string;
};

export type ResourceAclEntry = {
  id: string;
  resourceType: string;
  resourceId: string;
  subjectType: "user" | "role";
  subjectId: string;
  subject: AccessUserRef;
  accessLevel: "view" | "edit" | "manage";
  grantedBy: AccessUserRef;
  note: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkspaceAccessGovernance = {
  workspace: WorkspaceMembership;
  canManage: boolean;
  canViewAudit: boolean;
  grants: RoleGrantEntry[];
  requests: AccessRequestEntry[];
  resourceAcls: ResourceAclEntry[];
  members: WorkspaceMember[];
};

export async function getWorkspaceAccessGovernance(ctx: FlowcardClientContext, workspaceId: string): Promise<WorkspaceAccessGovernance> {
  return request<WorkspaceAccessGovernance>(ctx,`/api/workspaces/${encodeURIComponent(workspaceId)}/access/governance`);
}

export async function listWorkspaceAccessAudit(ctx: FlowcardClientContext, 
  workspaceId: string,
  params: { action?: string; limit?: number; offset?: number } = {}
): Promise<{ workspace: WorkspaceMembership; entries: AccessAuditEntry[]; page: PageInfo }> {
  return request<{ workspace: WorkspaceMembership; entries: AccessAuditEntry[]; page: PageInfo }>(ctx,
    withQuery(`/api/workspaces/${encodeURIComponent(workspaceId)}/access/audit`, params)
  );
}

export async function grantTimeBoundRole(ctx: FlowcardClientContext, 
  workspaceId: string,
  input: { userId: string; role: WorkspaceRoleId; reason?: string; expiresAt?: string; durationHours?: number }
): Promise<WorkspaceAccessGovernance> {
  return request<WorkspaceAccessGovernance>(ctx,`/api/workspaces/${encodeURIComponent(workspaceId)}/access/grants`, {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function revokeTimeBoundRole(ctx: FlowcardClientContext, workspaceId: string, grantId: string): Promise<WorkspaceAccessGovernance> {
  return request<WorkspaceAccessGovernance>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/access/grants/${encodeURIComponent(grantId)}`,
    { method: "DELETE" }
  );
}

export async function createAccessRequest(ctx: FlowcardClientContext, 
  workspaceId: string,
  input: { role: WorkspaceRoleId; reason?: string }
): Promise<{ workspace: WorkspaceMembership; request: AccessRequestEntry }> {
  return request<{ workspace: WorkspaceMembership; request: AccessRequestEntry }>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/access/requests`,
    { method: "POST", body: JSON.stringify(input) }
  );
}

export async function decideAccessRequest(ctx: FlowcardClientContext, 
  workspaceId: string,
  requestId: string,
  input: { decision: "approve" | "deny"; note?: string }
): Promise<WorkspaceAccessGovernance> {
  return request<WorkspaceAccessGovernance>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/access/requests/${encodeURIComponent(requestId)}/decision`,
    { method: "POST", body: JSON.stringify(input) }
  );
}

export async function cancelAccessRequest(ctx: FlowcardClientContext, workspaceId: string, requestId: string): Promise<WorkspaceAccessGovernance> {
  return request<WorkspaceAccessGovernance>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/access/requests/${encodeURIComponent(requestId)}`,
    { method: "DELETE" }
  );
}

export async function grantResourceAcl(ctx: FlowcardClientContext, 
  workspaceId: string,
  input: {
    resourceType: string;
    resourceId: string;
    subjectType: "user" | "role";
    subjectId: string;
    accessLevel: "view" | "edit" | "manage";
    note?: string;
  }
): Promise<WorkspaceAccessGovernance> {
  return request<WorkspaceAccessGovernance>(ctx,`/api/workspaces/${encodeURIComponent(workspaceId)}/access/resource-acls`, {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function revokeResourceAcl(ctx: FlowcardClientContext, workspaceId: string, aclId: string): Promise<WorkspaceAccessGovernance> {
  return request<WorkspaceAccessGovernance>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/access/resource-acls/${encodeURIComponent(aclId)}`,
    { method: "DELETE" }
  );
}

export async function listWorkspaceNetworks(ctx: FlowcardClientContext, 
  workspaceId: string,
  params: { limit?: number; offset?: number; parentNetworkId?: string; q?: string; includeSubnetworks?: boolean } = {}
): Promise<NetworkListResponse> {
  return request<NetworkListResponse>(ctx,
    withQuery(`/api/workspaces/${encodeURIComponent(workspaceId)}/networks`, params)
  );
}

export async function createWorkspaceNetwork(ctx: FlowcardClientContext, 
  workspaceId: string,
  input: { name: string; description?: string; icon?: string; banner?: string; slug?: string }
): Promise<{ workspace: WorkspaceMembership; network: NetworkRecord; roles: NetworkRole[] }> {
  return request<{ workspace: WorkspaceMembership; network: NetworkRecord; roles: NetworkRole[] }>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/networks`,
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export async function fetchNetwork(ctx: FlowcardClientContext, networkId: string): Promise<NetworkDashboardResponse> {
  return request<NetworkDashboardResponse>(ctx,`/api/networks/${encodeURIComponent(networkId)}`);
}

export async function fetchNetworkWelcomeCard(ctx: FlowcardClientContext, networkId: string): Promise<{
  network: NetworkRecord;
  welcomeCard: WelcomeCard;
  canEdit: boolean;
}> {
  return request<{
    network: NetworkRecord;
    welcomeCard: WelcomeCard;
    canEdit: boolean;
  }>(ctx,`/api/networks/${encodeURIComponent(networkId)}/welcome-card`);
}

export async function updateNetworkWelcomeCard(ctx: FlowcardClientContext, 
  networkId: string,
  input: WelcomeCardInput
): Promise<{
  network: NetworkRecord;
  welcomeCard: WelcomeCard;
  canEdit: boolean;
}> {
  return request<{
    network: NetworkRecord;
    welcomeCard: WelcomeCard;
    canEdit: boolean;
  }>(ctx,`/api/networks/${encodeURIComponent(networkId)}/welcome-card`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export async function updateNetwork(ctx: FlowcardClientContext, 
  networkId: string,
  input: Partial<Pick<NetworkRecord, "name" | "description" | "icon" | "banner" | "slug">>
): Promise<{ network: NetworkRecord }> {
  return request<{ network: NetworkRecord }>(ctx,`/api/networks/${encodeURIComponent(networkId)}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export async function archiveNetwork(ctx: FlowcardClientContext, networkId: string): Promise<{ ok: true; network: NetworkRecord }> {
  return request<{ ok: true; network: NetworkRecord }>(ctx,
    `/api/networks/${encodeURIComponent(networkId)}`,
    { method: "DELETE" }
  );
}

export async function listSubnetworks(ctx: FlowcardClientContext, 
  networkId: string,
  params: { limit?: number; offset?: number; q?: string } = {}
): Promise<NetworkListResponse> {
  return request<NetworkListResponse>(ctx,withQuery(`/api/networks/${encodeURIComponent(networkId)}/subnetworks`, params));
}

export async function createSubnetwork(ctx: FlowcardClientContext, 
  networkId: string,
  input: { name: string; description?: string; icon?: string; banner?: string; slug?: string }
): Promise<{ parentNetwork: NetworkRecord; network: NetworkRecord; roles: NetworkRole[] }> {
  return request<{ parentNetwork: NetworkRecord; network: NetworkRecord; roles: NetworkRole[] }>(ctx,
    `/api/networks/${encodeURIComponent(networkId)}/subnetworks`,
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export async function listNetworkMembers(ctx: FlowcardClientContext, 
  networkId: string,
  params: { limit?: number; offset?: number } = {}
): Promise<{ network: NetworkRecord; members: NetworkMember[]; page: PageInfo }> {
  return request<{ network: NetworkRecord; members: NetworkMember[]; page: PageInfo }>(ctx,
    withQuery(`/api/networks/${encodeURIComponent(networkId)}/members`, params)
  );
}

export async function addNetworkMember(ctx: FlowcardClientContext, 
  networkId: string,
  input: { userId?: string; email?: string; roleId?: string; roleName?: string }
): Promise<{ network: NetworkRecord; member: NetworkMember; members: NetworkMember[] }> {
  return request<{ network: NetworkRecord; member: NetworkMember; members: NetworkMember[] }>(ctx,
    `/api/networks/${encodeURIComponent(networkId)}/members`,
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export async function updateNetworkMember(ctx: FlowcardClientContext, 
  networkId: string,
  memberId: string,
  input: { roleId?: string; roleName?: string }
): Promise<{ network: NetworkRecord; member: NetworkMember; members: NetworkMember[] }> {
  return request<{ network: NetworkRecord; member: NetworkMember; members: NetworkMember[] }>(ctx,
    `/api/networks/${encodeURIComponent(networkId)}/members/${encodeURIComponent(memberId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(input)
    }
  );
}

export async function removeNetworkMember(ctx: FlowcardClientContext, 
  networkId: string,
  memberId: string
): Promise<{ ok: true; network: NetworkRecord; members: NetworkMember[] }> {
  return request<{ ok: true; network: NetworkRecord; members: NetworkMember[] }>(ctx,
    `/api/networks/${encodeURIComponent(networkId)}/members/${encodeURIComponent(memberId)}`,
    { method: "DELETE" }
  );
}

export async function listNetworkRoles(ctx: FlowcardClientContext, 
  networkId: string,
  params: { limit?: number; offset?: number } = {}
): Promise<{ network: NetworkRecord; roles: NetworkRole[]; page: PageInfo }> {
  return request<{ network: NetworkRecord; roles: NetworkRole[]; page: PageInfo }>(ctx,
    withQuery(`/api/networks/${encodeURIComponent(networkId)}/roles`, params)
  );
}

export async function createNetworkRole(ctx: FlowcardClientContext, 
  networkId: string,
  input: { name: string; description?: string; permissions: Partial<NetworkPermissionSet> }
): Promise<{ network: NetworkRecord; role: NetworkRole; roles: NetworkRole[] }> {
  return request<{ network: NetworkRecord; role: NetworkRole; roles: NetworkRole[] }>(ctx,
    `/api/networks/${encodeURIComponent(networkId)}/roles`,
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export async function updateNetworkRole(ctx: FlowcardClientContext, 
  networkId: string,
  roleId: string,
  input: { name?: string; description?: string; permissions?: Partial<NetworkPermissionSet> }
): Promise<{ network: NetworkRecord; role: NetworkRole; roles: NetworkRole[] }> {
  return request<{ network: NetworkRecord; role: NetworkRole; roles: NetworkRole[] }>(ctx,
    `/api/networks/${encodeURIComponent(networkId)}/roles/${encodeURIComponent(roleId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(input)
    }
  );
}

export async function deleteNetworkRole(ctx: FlowcardClientContext, 
  networkId: string,
  roleId: string
): Promise<{ ok: true; network: NetworkRecord; roles: NetworkRole[] }> {
  return request<{ ok: true; network: NetworkRecord; roles: NetworkRole[] }>(ctx,
    `/api/networks/${encodeURIComponent(networkId)}/roles/${encodeURIComponent(roleId)}`,
    { method: "DELETE" }
  );
}

export async function createNetworkCodeSpace(ctx: FlowcardClientContext, 
  networkId: string,
  input: {
    name: string;
    description?: string;
    repositoryUrl?: string;
    branch?: string;
    editorState?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  }
): Promise<{ network: NetworkRecord; codeSpace: NetworkCodeSpace }> {
  return request<{ network: NetworkRecord; codeSpace: NetworkCodeSpace }>(ctx,
    `/api/networks/${encodeURIComponent(networkId)}/code-spaces`,
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export async function listNetworkCodeSpaces(ctx: FlowcardClientContext, 
  networkId: string,
  params: { limit?: number; offset?: number; archived?: boolean | "only" | "all" } = {}
): Promise<{ network: NetworkRecord; codeSpaces: NetworkCodeSpace[]; page: PageInfo }> {
  return request<{ network: NetworkRecord; codeSpaces: NetworkCodeSpace[]; page: PageInfo }>(ctx,
    withQuery(`/api/networks/${encodeURIComponent(networkId)}/code-spaces`, params)
  );
}

export async function updateNetworkCodeSpace(ctx: FlowcardClientContext, 
  codeSpaceId: string,
  input: {
    name?: string;
    description?: string;
    repositoryUrl?: string;
    branch?: string;
    editorState?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
  }
): Promise<{ network: NetworkRecord; codeSpace: NetworkCodeSpace }> {
  return request<{ network: NetworkRecord; codeSpace: NetworkCodeSpace }>(ctx,
    `/api/code-spaces/${encodeURIComponent(codeSpaceId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(input)
    }
  );
}

export async function deleteNetworkCodeSpace(ctx: FlowcardClientContext, 
  codeSpaceId: string,
): Promise<{ ok: boolean; network: NetworkRecord; codeSpace: NetworkCodeSpace }> {
  return request<{ ok: boolean; network: NetworkRecord; codeSpace: NetworkCodeSpace }>(ctx,
    `/api/code-spaces/${encodeURIComponent(codeSpaceId)}`,
    { method: "DELETE" },
  );
}

export async function restoreNetworkCodeSpace(ctx: FlowcardClientContext, 
  codeSpaceId: string,
): Promise<{ ok: boolean; network: NetworkRecord; codeSpace: NetworkCodeSpace }> {
  return request<{ ok: boolean; network: NetworkRecord; codeSpace: NetworkCodeSpace }>(ctx,
    `/api/code-spaces/${encodeURIComponent(codeSpaceId)}/restore`,
    { method: "POST" },
  );
}

export async function fetchNetworkGitRepository(ctx: FlowcardClientContext, 
  networkId: string,
  input: {
    url: string;
    branch?: string;
    accessToken?: string;
    pathPrefix?: string;
  }
): Promise<GitFetchResult> {
  return request<GitFetchResult>(ctx,
    `/api/networks/${encodeURIComponent(networkId)}/code/git/fetch`,
    {
      method: "POST",
      body: JSON.stringify(input)
    },
    { timeoutMs: 120000 }
  );
}

export async function createNetworkResource(ctx: FlowcardClientContext, 
  networkId: string,
  kind: NetworkResourceKind,
  input: Record<string, unknown>
): Promise<{ network: NetworkRecord; collection: NetworkResourceKind; resource: NetworkResourceRecord }> {
  return request<{ network: NetworkRecord; collection: NetworkResourceKind; resource: NetworkResourceRecord }>(ctx,
    `/api/networks/${encodeURIComponent(networkId)}/${encodeURIComponent(kind)}`,
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export async function listNetworkResources(ctx: FlowcardClientContext, 
  networkId: string,
  kind: NetworkResourceKind,
  params: {
    limit?: number;
    offset?: number;
    q?: string;
    search?: string;
    status?: string;
    projectId?: string;
    boardId?: string;
    assigneeUserId?: string;
    managerUserId?: string;
    ownerTeam?: string;
    archived?: boolean | "only" | "all";
  } = {}
): Promise<{
  network: NetworkRecord;
  channels?: NetworkChannel[];
  documents?: NetworkDocument[];
  projects?: NetworkProject[];
  boards?: NetworkBoard[];
  tasks?: NetworkTask[];
  storage?: NetworkStorageItem[];
  services?: NetworkService[];
  page: PageInfo;
}> {
  return request<{
    network: NetworkRecord;
    channels?: NetworkChannel[];
    documents?: NetworkDocument[];
    projects?: NetworkProject[];
    boards?: NetworkBoard[];
    tasks?: NetworkTask[];
    storage?: NetworkStorageItem[];
    services?: NetworkService[];
    page: PageInfo;
  }>(ctx,withQuery(`/api/networks/${encodeURIComponent(networkId)}/${encodeURIComponent(kind)}`, params));
}

export async function updateNetworkResource(ctx: FlowcardClientContext, 
  networkId: string,
  kind: NetworkResourceKind,
  resourceId: string,
  input: Record<string, unknown>
): Promise<{ network: NetworkRecord; collection: NetworkResourceKind; resource: NetworkResourceRecord }> {
  return request<{ network: NetworkRecord; collection: NetworkResourceKind; resource: NetworkResourceRecord }>(ctx,
    `/api/networks/${encodeURIComponent(networkId)}/${encodeURIComponent(kind)}/${encodeURIComponent(resourceId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(input)
    }
  );
}

export async function archiveNetworkResource(ctx: FlowcardClientContext, 
  networkId: string,
  kind: NetworkResourceKind,
  resourceId: string
): Promise<{ ok: true; network: NetworkRecord; collection: NetworkResourceKind; resource: NetworkResourceRecord }> {
  return request<{ ok: true; network: NetworkRecord; collection: NetworkResourceKind; resource: NetworkResourceRecord }>(ctx,
    `/api/networks/${encodeURIComponent(networkId)}/${encodeURIComponent(kind)}/${encodeURIComponent(resourceId)}`,
    { method: "DELETE" }
  );
}

export async function restoreNetworkResource(ctx: FlowcardClientContext, 
  networkId: string,
  kind: NetworkResourceKind,
  resourceId: string
): Promise<{ ok: true; network: NetworkRecord; collection: NetworkResourceKind; resource: NetworkResourceRecord }> {
  return request<{ ok: true; network: NetworkRecord; collection: NetworkResourceKind; resource: NetworkResourceRecord }>(ctx,
    `/api/networks/${encodeURIComponent(networkId)}/${encodeURIComponent(kind)}/${encodeURIComponent(resourceId)}/restore`,
    { method: "POST" }
  );
}

export async function listNetworkChannelMessages(ctx: FlowcardClientContext, 
  networkId: string,
  channelId: string,
  params: { limit?: number; offset?: number } = {}
): Promise<{ networkId: string; channelId: string; messages: NetworkChannelMessage[]; page: PageInfo }> {
  return request<{ networkId: string; channelId: string; messages: NetworkChannelMessage[]; page: PageInfo }>(ctx,
    withQuery(
      `/api/networks/${encodeURIComponent(networkId)}/channels/${encodeURIComponent(channelId)}/messages`,
      params
    )
  );
}

export async function createNetworkChannelMessage(ctx: FlowcardClientContext, 
  networkId: string,
  channelId: string,
  input: { body: string; threadParentId?: string | null; mentions?: string[] }
): Promise<{ networkId: string; channelId: string; message: NetworkChannelMessage }> {
  return request<{ networkId: string; channelId: string; message: NetworkChannelMessage }>(ctx,
    `/api/networks/${encodeURIComponent(networkId)}/channels/${encodeURIComponent(channelId)}/messages`,
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export async function updateNetworkChannelMessage(ctx: FlowcardClientContext, 
  networkId: string,
  channelId: string,
  messageId: string,
  input: { body?: string; threadParentId?: string | null; mentions?: string[] }
): Promise<{ networkId: string; channelId: string; message: NetworkChannelMessage }> {
  return request<{ networkId: string; channelId: string; message: NetworkChannelMessage }>(ctx,
    `/api/networks/${encodeURIComponent(networkId)}/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(messageId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(input)
    }
  );
}

export async function deleteNetworkChannelMessage(ctx: FlowcardClientContext, 
  networkId: string,
  channelId: string,
  messageId: string
): Promise<{ ok: true; networkId: string; channelId: string; messageId: string }> {
  return request<{ ok: true; networkId: string; channelId: string; messageId: string }>(ctx,
    `/api/networks/${encodeURIComponent(networkId)}/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(messageId)}`,
    { method: "DELETE" }
  );
}

export async function executeNetworkSqlQuery(ctx: FlowcardClientContext, 
  networkId: string,
  input: { query: string; codeSpaceId?: string }
): Promise<NetworkSqlQueryResponse> {
  return request<NetworkSqlQueryResponse>(ctx,
    `/api/networks/${encodeURIComponent(networkId)}/sql/query`,
    {
      method: "POST",
      body: JSON.stringify(input)
    },
    { timeoutMs: 30000 }
  );
}

export async function createNetworkFetchRequest(ctx: FlowcardClientContext, 
  networkId: string,
  input: {
    service: NetworkFetchRequestService;
    serviceId?: string | null;
    reason?: string;
    permission?: string;
    accessLevel?: "partial" | "full";
    dataScopes?: string[];
    durationDays?: number;
  }
): Promise<{
  network: NetworkRecord;
  parentNetwork: NetworkRecord;
  fetchRequest: NetworkFetchRequestRecord;
  fetchRequests: NetworkFetchRequestRecord[];
}> {
  return request<{
    network: NetworkRecord;
    parentNetwork: NetworkRecord;
    fetchRequest: NetworkFetchRequestRecord;
    fetchRequests: NetworkFetchRequestRecord[];
  }>(ctx,`/api/networks/${encodeURIComponent(networkId)}/fetch-requests`, {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function resolveNetworkFetchRequest(ctx: FlowcardClientContext, 
  networkId: string,
  requestId: string,
  status: "approved" | "rejected",
  input: {
    permission?: string;
    accessLevel?: "partial" | "full";
    dataScopes?: string[];
  } = {}
): Promise<{
  network: NetworkRecord;
  fetchRequest: NetworkFetchRequestRecord;
  fetchRequests: NetworkFetchRequestRecord[];
}> {
  return request<{
    network: NetworkRecord;
    fetchRequest: NetworkFetchRequestRecord;
    fetchRequests: NetworkFetchRequestRecord[];
  }>(ctx,`/api/networks/${encodeURIComponent(networkId)}/fetch-requests/${encodeURIComponent(requestId)}`, {
    method: "PATCH",
    body: JSON.stringify({ status, ...input })
  });
}

export async function listWorkspaceMembers(ctx: FlowcardClientContext, workspaceId: string): Promise<{
  workspace: WorkspaceMembership;
  members: WorkspaceMember[];
}> {
  return request<{ workspace: WorkspaceMembership; members: WorkspaceMember[] }>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/members`
  );
}

export async function updateWorkspaceMemberRole(ctx: FlowcardClientContext, 
  workspaceId: string,
  userId: string,
  roles: WorkspaceRoleId | WorkspaceRoleId[]
): Promise<{
  workspace: WorkspaceMembership;
  member: WorkspaceMember;
  members: WorkspaceMember[];
}> {
  return request<{ workspace: WorkspaceMembership; member: WorkspaceMember; members: WorkspaceMember[] }>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/members/${encodeURIComponent(userId)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ roles: Array.isArray(roles) ? roles : [roles] })
    }
  );
}

export async function removeWorkspaceMember(ctx: FlowcardClientContext, workspaceId: string, userId: string): Promise<{
  ok: true;
  workspace: WorkspaceMembership;
  members: WorkspaceMember[];
}> {
  return request<{ ok: true; workspace: WorkspaceMembership; members: WorkspaceMember[] }>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/members/${encodeURIComponent(userId)}`,
    { method: "DELETE" }
  );
}

export async function fetchWorkspaceState<T>(ctx: FlowcardClientContext, workspaceId: string): Promise<{
  workspace: WorkspaceMembership;
  state: T | null;
  updatedAt: string | null;
}> {
  return request<{ workspace: WorkspaceMembership; state: T | null; updatedAt: string | null }>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/state`
  );
}

export async function saveWorkspaceState<T>(ctx: FlowcardClientContext, workspaceId: string, state: T): Promise<{
  ok: true;
  workspace: WorkspaceMembership;
  updatedAt: string;
}> {
  return request<{ ok: true; workspace: WorkspaceMembership; updatedAt: string }>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/state`,
    {
      method: "PUT",
      body: JSON.stringify({ state })
    }
  );
}

function isWorkspaceDomainApiEnabled(flagName: string) {
  const envKey = flagName.replace(/^VITE_/, "FLOWCARD_");
  const value = process.env[envKey] ?? process.env[flagName];
  if (value === "false" || value === "0") return false;
  return true;
}

export function isWorkspaceTasksApiEnabled() {
  return isWorkspaceDomainApiEnabled("VITE_FLOWCARD_WORKSPACE_TASKS_API");
}

export function isWorkspaceBugsApiEnabled() {
  return isWorkspaceDomainApiEnabled("VITE_FLOWCARD_WORKSPACE_BUGS_API");
}

export function isWorkspaceCustomersApiEnabled() {
  return isWorkspaceDomainApiEnabled("VITE_FLOWCARD_WORKSPACE_CUSTOMERS_API");
}

export function isWorkspaceDocumentsApiEnabled() {
  return isWorkspaceDomainApiEnabled("VITE_FLOWCARD_WORKSPACE_DOCUMENTS_API");
}

export function isWorkspaceChannelsApiEnabled() {
  return isWorkspaceDomainApiEnabled("VITE_FLOWCARD_WORKSPACE_CHANNELS_API");
}

export function isWorkspaceCodeFilesApiEnabled() {
  return isWorkspaceDomainApiEnabled("VITE_FLOWCARD_WORKSPACE_CODE_FILES_API");
}

export function isWorkspaceMessagesApiEnabled() {
  return isWorkspaceDomainApiEnabled("VITE_FLOWCARD_WORKSPACE_MESSAGES_API");
}

export function isWorkspaceSqlApiEnabled() {
  return isWorkspaceDomainApiEnabled("VITE_FLOWCARD_WORKSPACE_SQL_API");
}

export type WorkspaceTaskApiRecord = WorkspaceTaskApiRow;
export type WorkspaceBugApiRecord = WorkspaceBugApiRow;
export type WorkspaceCustomerApiRecord = WorkspaceCustomerApiRow;

export async function listWorkspaceTasks(ctx: FlowcardClientContext, workspaceId: string): Promise<{
  workspace: WorkspaceMembership;
  tasks: WorkspaceTaskApiRecord[];
}> {
  const response = await request<{
    workspace: WorkspaceMembership;
    tasks: WorkspaceTaskApiRecord[];
  }>(ctx, `/api/workspaces/${encodeURIComponent(workspaceId)}/tasks`);
  return response;
}

export async function createWorkspaceTask(ctx: FlowcardClientContext, 
  workspaceId: string,
  input: Record<string, unknown>
): Promise<{ task: WorkspaceTaskApiRecord }> {
  return request<{ task: WorkspaceTaskApiRecord }>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/tasks`,
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export async function updateWorkspaceTask(ctx: FlowcardClientContext, 
  workspaceId: string,
  taskId: string,
  input: Record<string, unknown>
): Promise<{ task: WorkspaceTaskApiRecord }> {
  return request<{ task: WorkspaceTaskApiRecord }>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/tasks/${encodeURIComponent(taskId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(input)
    }
  );
}

export async function deleteWorkspaceTask(ctx: FlowcardClientContext, 
  workspaceId: string,
  taskId: string
): Promise<{ ok: true }> {
  return request<{ ok: true }>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/tasks/${encodeURIComponent(taskId)}`,
    { method: "DELETE" }
  );
}

export async function listWorkspaceBugs(ctx: FlowcardClientContext, workspaceId: string): Promise<{
  workspace: WorkspaceMembership;
  bugs: WorkspaceBugApiRecord[];
}> {
  return request<{
    workspace: WorkspaceMembership;
    bugs: WorkspaceBugApiRecord[];
  }>(ctx,`/api/workspaces/${encodeURIComponent(workspaceId)}/bugs`);
}

export async function createWorkspaceBug(ctx: FlowcardClientContext, 
  workspaceId: string,
  input: Record<string, unknown>
): Promise<{ bug: WorkspaceBugApiRecord }> {
  return request<{ bug: WorkspaceBugApiRecord }>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/bugs`,
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export async function updateWorkspaceBug(ctx: FlowcardClientContext, 
  workspaceId: string,
  bugId: string,
  input: Record<string, unknown>
): Promise<{ bug: WorkspaceBugApiRecord }> {
  return request<{ bug: WorkspaceBugApiRecord }>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/bugs/${encodeURIComponent(bugId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(input)
    }
  );
}

export async function deleteWorkspaceBug(ctx: FlowcardClientContext, 
  workspaceId: string,
  bugId: string
): Promise<{ ok: true }> {
  return request<{ ok: true }>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/bugs/${encodeURIComponent(bugId)}`,
    { method: "DELETE" }
  );
}

export async function listWorkspaceCustomers(ctx: FlowcardClientContext, workspaceId: string): Promise<{
  workspace: WorkspaceMembership;
  customers: WorkspaceCustomerApiRecord[];
}> {
  return request<{
    workspace: WorkspaceMembership;
    customers: WorkspaceCustomerApiRecord[];
  }>(ctx,`/api/workspaces/${encodeURIComponent(workspaceId)}/customers`);
}

export async function createWorkspaceCustomer(ctx: FlowcardClientContext, 
  workspaceId: string,
  input: Record<string, unknown>
): Promise<{ customer: WorkspaceCustomerApiRecord }> {
  return request<{ customer: WorkspaceCustomerApiRecord }>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/customers`,
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export async function updateWorkspaceCustomer(ctx: FlowcardClientContext, 
  workspaceId: string,
  customerId: string,
  input: Record<string, unknown>
): Promise<{ customer: WorkspaceCustomerApiRecord }> {
  return request<{ customer: WorkspaceCustomerApiRecord }>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/customers/${encodeURIComponent(customerId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(input)
    }
  );
}

export async function deleteWorkspaceCustomer(ctx: FlowcardClientContext, 
  workspaceId: string,
  customerId: string
): Promise<{ ok: true }> {
  return request<{ ok: true }>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/customers/${encodeURIComponent(customerId)}`,
    { method: "DELETE" }
  );
}

export type WorkspaceDocumentApiRecord = {
  id: string;
  workspaceId: string;
  projectId: string | null;
  title: string;
  kind: string;
  bodyJson: Record<string, unknown>;
  folderId: string | null;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkspaceChannelApiRecord = {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  topic: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

export type WorkspaceChannelMessageApiRecord = {
  id: string;
  workspaceId: string;
  channelId: string;
  authorUserId: string;
  body: string;
  threadParentId: string | null;
  mentions: string[];
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

export type WorkspaceCodeFileApiRecord = {
  id: string;
  workspaceId: string;
  name: string;
  path: string;
  language: string;
  status: string;
  content: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
};

export async function listWorkspaceDocuments(ctx: FlowcardClientContext, workspaceId: string): Promise<{
  workspace: WorkspaceMembership;
  documents: WorkspaceDocumentApiRecord[];
}> {
  return request(ctx, `/api/workspaces/${encodeURIComponent(workspaceId)}/documents`);
}

export async function createWorkspaceDocument(ctx: FlowcardClientContext, 
  workspaceId: string,
  input: Record<string, unknown>
): Promise<{ document: WorkspaceDocumentApiRecord }> {
  return request(ctx, `/api/workspaces/${encodeURIComponent(workspaceId)}/documents`, {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function updateWorkspaceDocument(ctx: FlowcardClientContext, 
  workspaceId: string,
  documentId: string,
  input: Record<string, unknown>
): Promise<{ document: WorkspaceDocumentApiRecord }> {
  return request(ctx, 
    `/api/workspaces/${encodeURIComponent(workspaceId)}/documents/${encodeURIComponent(documentId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(input)
    }
  );
}

export async function deleteWorkspaceDocument(ctx: FlowcardClientContext, 
  workspaceId: string,
  documentId: string
): Promise<{ ok: true }> {
  return request(ctx, 
    `/api/workspaces/${encodeURIComponent(workspaceId)}/documents/${encodeURIComponent(documentId)}`,
    { method: "DELETE" }
  );
}

export async function listWorkspaceChannels(ctx: FlowcardClientContext, workspaceId: string): Promise<{
  workspace: WorkspaceMembership;
  channels: WorkspaceChannelApiRecord[];
}> {
  return request(ctx, `/api/workspaces/${encodeURIComponent(workspaceId)}/channels`);
}

export async function createWorkspaceChannelRecord(ctx: FlowcardClientContext, 
  workspaceId: string,
  input: Record<string, unknown>
): Promise<{ channel: WorkspaceChannelApiRecord }> {
  return request(ctx, `/api/workspaces/${encodeURIComponent(workspaceId)}/channels`, {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function updateWorkspaceChannelRecord(ctx: FlowcardClientContext, 
  workspaceId: string,
  channelId: string,
  input: Record<string, unknown>
): Promise<{ channel: WorkspaceChannelApiRecord }> {
  return request(ctx, 
    `/api/workspaces/${encodeURIComponent(workspaceId)}/channels/${encodeURIComponent(channelId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(input)
    }
  );
}

export async function deleteWorkspaceChannelRecord(ctx: FlowcardClientContext, 
  workspaceId: string,
  channelId: string
): Promise<{ ok: true }> {
  return request(ctx, 
    `/api/workspaces/${encodeURIComponent(workspaceId)}/channels/${encodeURIComponent(channelId)}`,
    { method: "DELETE" }
  );
}

export async function listWorkspaceChannelMessages(ctx: FlowcardClientContext, 
  workspaceId: string,
  channelId: string
): Promise<{
  workspace: WorkspaceMembership;
  channel: WorkspaceChannelApiRecord;
  messages: WorkspaceChannelMessageApiRecord[];
}> {
  return request(ctx, 
    `/api/workspaces/${encodeURIComponent(workspaceId)}/channels/${encodeURIComponent(channelId)}/messages`
  );
}

export async function createWorkspaceChannelMessage(ctx: FlowcardClientContext, 
  workspaceId: string,
  channelId: string,
  input: { body: string; threadParentId?: string; mentions?: string[] }
): Promise<{
  workspace: WorkspaceMembership;
  channel: WorkspaceChannelApiRecord;
  message: WorkspaceChannelMessageApiRecord;
}> {
  return request(ctx, 
    `/api/workspaces/${encodeURIComponent(workspaceId)}/channels/${encodeURIComponent(channelId)}/messages`,
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export async function updateWorkspaceChannelMessage(ctx: FlowcardClientContext, 
  workspaceId: string,
  channelId: string,
  messageId: string,
  input: { body?: string; mentions?: string[] }
): Promise<{
  workspace: WorkspaceMembership;
  channel: WorkspaceChannelApiRecord;
  message: WorkspaceChannelMessageApiRecord;
}> {
  return request(ctx, 
    `/api/workspaces/${encodeURIComponent(workspaceId)}/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(messageId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(input)
    }
  );
}

export async function deleteWorkspaceChannelMessage(ctx: FlowcardClientContext, 
  workspaceId: string,
  channelId: string,
  messageId: string
): Promise<{ ok: true }> {
  return request(ctx, 
    `/api/workspaces/${encodeURIComponent(workspaceId)}/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(messageId)}`,
    { method: "DELETE" }
  );
}

export async function listWorkspaceCodeFiles(ctx: FlowcardClientContext, workspaceId: string): Promise<{
  workspace: WorkspaceMembership;
  "code-files": WorkspaceCodeFileApiRecord[];
}> {
  return request(ctx, `/api/workspaces/${encodeURIComponent(workspaceId)}/code-files`);
}

export async function createWorkspaceCodeFileRecord(ctx: FlowcardClientContext, 
  workspaceId: string,
  input: Record<string, unknown>
): Promise<{ codeFile: WorkspaceCodeFileApiRecord }> {
  return request(ctx, `/api/workspaces/${encodeURIComponent(workspaceId)}/code-files`, {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function updateWorkspaceCodeFileRecord(ctx: FlowcardClientContext, 
  workspaceId: string,
  codeFileId: string,
  input: Record<string, unknown>
): Promise<{ codeFile: WorkspaceCodeFileApiRecord }> {
  return request(ctx, 
    `/api/workspaces/${encodeURIComponent(workspaceId)}/code-files/${encodeURIComponent(codeFileId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(input)
    }
  );
}

export async function deleteWorkspaceCodeFileRecord(ctx: FlowcardClientContext, 
  workspaceId: string,
  codeFileId: string
): Promise<{ ok: true }> {
  return request(ctx, 
    `/api/workspaces/${encodeURIComponent(workspaceId)}/code-files/${encodeURIComponent(codeFileId)}`,
    { method: "DELETE" }
  );
}

export async function executeWorkspaceSqlQuery(ctx: FlowcardClientContext, 
  workspaceId: string,
  input: { query: string }
): Promise<WorkspaceSqlQueryResponse> {
  return request<WorkspaceSqlQueryResponse>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/sql/query`,
    {
      method: "POST",
      body: JSON.stringify(input)
    },
    { timeoutMs: 30000 }
  );
}

export {
  workspaceBugRecordToApiInput,
  workspaceBugRowToRecord,
  workspaceCustomerRecordToApiInput,
  workspaceCustomerRowToRecord,
  workspaceTaskRecordToApiInput,
  workspaceTaskRowToRecord,
};

export type WorkspaceAutomationRecord = {
  id: string;
  workspaceId: string;
  name: string;
  trigger: Record<string, unknown>;
  action: Record<string, unknown>;
  enabled: boolean;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
};

export type WorkspaceCalendarEventRecord = {
  id: string;
  workspaceId: string;
  calendarId: string | null;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string | null;
  allDay: boolean;
  status: string;
  assigneeUserId: string | null;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
};

export async function listWorkspaceAutomations(ctx: FlowcardClientContext, workspaceId: string): Promise<{
  workspace: WorkspaceMembership;
  automations: WorkspaceAutomationRecord[];
}> {
  return request(ctx, `/api/workspaces/${encodeURIComponent(workspaceId)}/automations`);
}

export async function createWorkspaceAutomation(ctx: FlowcardClientContext, 
  workspaceId: string,
  input: Record<string, unknown>
): Promise<{ automation: WorkspaceAutomationRecord }> {
  return request(ctx, `/api/workspaces/${encodeURIComponent(workspaceId)}/automations`, {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function updateWorkspaceAutomation(ctx: FlowcardClientContext, 
  workspaceId: string,
  automationId: string,
  input: Record<string, unknown>
): Promise<{ automation: WorkspaceAutomationRecord }> {
  return request(ctx, `/api/workspaces/${encodeURIComponent(workspaceId)}/automations/${encodeURIComponent(automationId)}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export async function deleteWorkspaceAutomation(ctx: FlowcardClientContext, workspaceId: string, automationId: string): Promise<{ ok: true }> {
  return request(ctx, `/api/workspaces/${encodeURIComponent(workspaceId)}/automations/${encodeURIComponent(automationId)}`, {
    method: "DELETE"
  });
}

export async function listWorkspaceCalendarEvents(ctx: FlowcardClientContext, workspaceId: string): Promise<{
  workspace: WorkspaceMembership;
  calendarEvents: WorkspaceCalendarEventRecord[];
  page: { total: number; limit: number; offset: number; nextOffset: number | null };
}> {
  return request(ctx, `/api/workspaces/${encodeURIComponent(workspaceId)}/calendar-events`);
}

export async function createWorkspaceCalendarEvent(ctx: FlowcardClientContext, 
  workspaceId: string,
  input: Record<string, unknown>
): Promise<{ calendarEvent: WorkspaceCalendarEventRecord }> {
  return request(ctx, `/api/workspaces/${encodeURIComponent(workspaceId)}/calendar-events`, {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function updateWorkspaceCalendarEvent(ctx: FlowcardClientContext, 
  workspaceId: string,
  eventId: string,
  input: Record<string, unknown>
): Promise<{ calendarEvent: WorkspaceCalendarEventRecord }> {
  return request(ctx, `/api/workspaces/${encodeURIComponent(workspaceId)}/calendar-events/${encodeURIComponent(eventId)}`, {
    method: "PATCH",
    body: JSON.stringify(input)
  });
}

export async function deleteWorkspaceCalendarEvent(ctx: FlowcardClientContext, workspaceId: string, eventId: string): Promise<{ ok: true }> {
  return request(ctx, `/api/workspaces/${encodeURIComponent(workspaceId)}/calendar-events/${encodeURIComponent(eventId)}`, {
    method: "DELETE"
  });
}

export async function fetchCloudStorageStatus(ctx: FlowcardClientContext, workspaceId: string): Promise<CloudStorageStatus> {
  return request<CloudStorageStatus>(ctx,`/api/workspaces/${encodeURIComponent(workspaceId)}/storage`);
}

export async function fetchUserCloudStorageStatus(ctx: FlowcardClientContext, ): Promise<CloudStorageStatus> {
  return request<CloudStorageStatus>(ctx,"/api/account/storage");
}

export async function startCloudStorageOAuth(ctx: FlowcardClientContext, 
  workspaceId: string,
  provider: CloudStorageProvider,
  input: { folderName: string }
): Promise<CloudStorageOAuthStart> {
  return request<CloudStorageOAuthStart>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/storage/oauth/${encodeURIComponent(provider)}/start`,
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export async function startUserCloudStorageOAuth(ctx: FlowcardClientContext, 
  provider: CloudStorageProvider,
  input: { folderName: string }
): Promise<CloudStorageOAuthStart> {
  return request<CloudStorageOAuthStart>(ctx,
    `/api/account/storage/oauth/${encodeURIComponent(provider)}/start`,
    {
      method: "POST",
      body: JSON.stringify(input)
    }
  );
}

export async function disconnectCloudStorageApi(ctx: FlowcardClientContext, workspaceId: string): Promise<{ ok: true; connection: null }> {
  return request<{ ok: true; connection: null }>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/storage`,
    { method: "DELETE" }
  );
}

export async function disconnectUserCloudStorageApi(ctx: FlowcardClientContext, ): Promise<{ ok: true; connection: null }> {
  return request<{ ok: true; connection: null }>(ctx,"/api/account/storage", { method: "DELETE" });
}

export async function testCloudStorageApi(ctx: FlowcardClientContext, workspaceId: string): Promise<{
  ok: true;
  file: CloudStorageFile;
  connection: CloudStorageConnection;
}> {
  return request<{ ok: true; file: CloudStorageFile; connection: CloudStorageConnection }>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/storage/test`,
    { method: "POST" },
    { timeoutMs: 30000 }
  );
}

export async function testUserCloudStorageApi(ctx: FlowcardClientContext, ): Promise<{
  ok: true;
  file: CloudStorageFile;
  connection: CloudStorageConnection;
}> {
  return request<{ ok: true; file: CloudStorageFile; connection: CloudStorageConnection }>(ctx,
    "/api/account/storage/test",
    { method: "POST" },
    { timeoutMs: 30000 }
  );
}

export async function uploadCloudStorageFile(ctx: FlowcardClientContext, 
  workspaceId: string,
  input: {
    path: string;
    mimeType?: string;
    content?: string;
    contentBase64?: string;
    dataUrl?: string;
  }
): Promise<{
  ok: true;
  file: CloudStorageFile;
  connection: CloudStorageConnection;
}> {
  return request<{ ok: true; file: CloudStorageFile; connection: CloudStorageConnection }>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/storage/files`,
    {
      method: "POST",
      body: JSON.stringify(input)
    },
    { timeoutMs: 60000 }
  );
}

export async function uploadCloudStorageBlob(ctx: FlowcardClientContext, 
  workspaceId: string,
  input: {
    path: string;
    blob: Blob;
    mimeType?: string;
    timeoutMs?: number;
  }
): Promise<{
  ok: true;
  file: CloudStorageFile;
  connection: CloudStorageConnection;
}> {
  const params = new URLSearchParams({
    path: input.path,
    mimeType: input.mimeType || input.blob.type || "application/octet-stream"
  });
  return uploadRawCloudStorageBlob(ctx, 
    `/api/workspaces/${encodeURIComponent(workspaceId)}/storage/files/raw?${params}`,
    input.blob,
    input.mimeType || input.blob.type || "application/octet-stream",
    input.timeoutMs
  );
}

export async function uploadUserCloudStorageFile(ctx: FlowcardClientContext, input: {
  path: string;
  mimeType?: string;
  content?: string;
  contentBase64?: string;
  dataUrl?: string;
}): Promise<{
  ok: true;
  file: CloudStorageFile;
  connection: CloudStorageConnection;
}> {
  return request<{ ok: true; file: CloudStorageFile; connection: CloudStorageConnection }>(ctx,
    "/api/account/storage/files",
    {
      method: "POST",
      body: JSON.stringify(input)
    },
    { timeoutMs: 60000 }
  );
}

export async function uploadUserCloudStorageBlob(ctx: FlowcardClientContext, input: {
  path: string;
  blob: Blob;
  mimeType?: string;
  timeoutMs?: number;
}): Promise<{
  ok: true;
  file: CloudStorageFile;
  connection: CloudStorageConnection;
}> {
  const params = new URLSearchParams({
    path: input.path,
    mimeType: input.mimeType || input.blob.type || "application/octet-stream"
  });
  return uploadRawCloudStorageBlob(ctx, 
    `/api/account/storage/files/raw?${params}`,
    input.blob,
    input.mimeType || input.blob.type || "application/octet-stream",
    input.timeoutMs
  );
}

export async function listCloudStorageFiles(ctx: FlowcardClientContext, workspaceId: string, path = ""): Promise<{
  files: CloudStorageFile[];
  connection: CloudStorageConnection;
}> {
  const params = path ? `?path=${encodeURIComponent(path)}` : "";
  return request<{ files: CloudStorageFile[]; connection: CloudStorageConnection }>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/storage/files${params}`,
    {},
    { timeoutMs: 30000 }
  );
}

export async function deleteCloudStorageFile(ctx: FlowcardClientContext, workspaceId: string, path: string): Promise<{
  ok: true;
  file: CloudStorageFile;
}> {
  return request<{ ok: true; file: CloudStorageFile }>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/storage/files`,
    {
      method: "DELETE",
      body: JSON.stringify({ path })
    },
    { timeoutMs: 30000 }
  );
}

export async function searchFlowcardUsers(ctx: FlowcardClientContext, query = ""): Promise<FlowcardUser[]> {
  const params = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : "";
  const response = await request<{ users: FlowcardUser[] }>(ctx, `/api/users${params}`);
  return response.users;
}

export async function listDirectMessageConversations(ctx: FlowcardClientContext, ): Promise<DirectMessageConversation[]> {
  const response = await request<{ conversations: DirectMessageConversation[] }>(ctx, "/api/direct-messages");
  return response.conversations;
}

export async function startDirectMessage(ctx: FlowcardClientContext, recipientId: string): Promise<{
  conversation: DirectMessageConversation;
  messages: DirectMessage[];
}> {
  return request<{ conversation: DirectMessageConversation; messages: DirectMessage[] }>(ctx,"/api/direct-messages", {
    method: "POST",
    body: JSON.stringify({ recipientId })
  });
}

export async function fetchDirectMessageConversation(ctx: FlowcardClientContext, conversationId: string): Promise<{
  conversation: DirectMessageConversation;
  messages: DirectMessage[];
}> {
  return request<{ conversation: DirectMessageConversation; messages: DirectMessage[] }>(ctx,
    `/api/direct-messages/${encodeURIComponent(conversationId)}`
  );
}

export async function sendDirectMessage(ctx: FlowcardClientContext, conversationId: string, body: string): Promise<DirectMessage> {
  return request<DirectMessage>(ctx,`/api/direct-messages/${encodeURIComponent(conversationId)}/messages`, {
    method: "POST",
    body: JSON.stringify({ body })
  });
}

export async function fetchDirectMessageSignals(ctx: FlowcardClientContext, conversationId: string, since = ""): Promise<DirectMessageSignal[]> {
  const params = since ? `?since=${encodeURIComponent(since)}` : "";
  const response = await request<{ signals: DirectMessageSignal[] }>(ctx, 
    `/api/direct-messages/${encodeURIComponent(conversationId)}/signals${params}`
  );
  return response.signals;
}

export async function sendDirectMessageSignal(ctx: FlowcardClientContext, 
  conversationId: string,
  signal: { kind: DirectMessageSignal["kind"]; payload: Record<string, unknown> }
): Promise<DirectMessageSignal> {
  return request<DirectMessageSignal>(ctx,`/api/direct-messages/${encodeURIComponent(conversationId)}/signals`, {
    method: "POST",
    body: JSON.stringify(signal)
  });
}

export async function fetchChannelCallSignals(ctx: FlowcardClientContext, 
  workspaceId: string,
  conversationId: string,
  since = ""
): Promise<ChannelCallSignal[]> {
  const params = since ? `?since=${encodeURIComponent(since)}` : "";
  const response = await request<{ signals: ChannelCallSignal[] }>(ctx, 
    `/api/workspaces/${encodeURIComponent(workspaceId)}/channels/${encodeURIComponent(conversationId)}/signals${params}`
  );
  return response.signals;
}

export async function sendChannelCallSignal(ctx: FlowcardClientContext, 
  workspaceId: string,
  conversationId: string,
  signal: { kind: ChannelCallSignal["kind"]; payload: Record<string, unknown> }
): Promise<ChannelCallSignal> {
  return request<ChannelCallSignal>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/channels/${encodeURIComponent(conversationId)}/signals`,
    {
      method: "POST",
      body: JSON.stringify(signal)
    }
  );
}

export async function createMessage(ctx: FlowcardClientContext, input: {
  channelId: string;
  body: string;
  author?: string;
  role?: string;
}): Promise<Message> {
  return request<Message>(ctx,"/api/messages", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function createChannel(ctx: FlowcardClientContext, input: { name: string; topic?: string }): Promise<Channel> {
  return request<Channel>(ctx,"/api/channels", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function createPage(ctx: FlowcardClientContext, input: {
  title: string;
  body?: string;
  icon?: string;
}): Promise<WorkspacePage> {
  return request<WorkspacePage>(ctx,"/api/pages", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function createRecord(ctx: FlowcardClientContext, input: {
  id?: string;
  task: string;
  owner: string;
  status?: DatabaseRecord["status"];
  priority?: DatabaseRecord["priority"];
  linkedChannel?: string;
}): Promise<DatabaseRecord> {
  return request<DatabaseRecord>(ctx,"/api/records", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function createCodeFile(ctx: FlowcardClientContext, input: {
  path: string;
  language?: CodeFile["language"];
  contents?: string;
}): Promise<CodeFile> {
  return request<CodeFile>(ctx,"/api/code-files", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export async function patchRecord(ctx: FlowcardClientContext, 
  id: string,
  patch: Partial<DatabaseRecord>
): Promise<DatabaseRecord> {
  return request<DatabaseRecord>(ctx,`/api/records/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch)
  });
}

export async function patchPage(ctx: FlowcardClientContext, 
  id: string,
  patch: Partial<WorkspacePage>
): Promise<WorkspacePage> {
  return request<WorkspacePage>(ctx,`/api/pages/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch)
  });
}

export async function patchCodeFile(ctx: FlowcardClientContext, id: string, patch: Partial<CodeFile>): Promise<CodeFile> {
  return request<CodeFile>(ctx,`/api/code-files/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch)
  });
}

export async function fetchGitRepository(ctx: FlowcardClientContext, 
  workspaceId: string,
  input: {
    url: string;
    branch?: string;
    accessToken?: string;
    pathPrefix?: string;
  }
): Promise<GitFetchResult> {
  return request<GitFetchResult>(ctx,
    `/api/workspaces/${encodeURIComponent(workspaceId)}/code/git/fetch`,
    {
      method: "POST",
      body: JSON.stringify(input)
    },
    { timeoutMs: 120000 }
  );
}


export async function fetchRuntimeReadiness(ctx: FlowcardClientContext): Promise<RuntimeReadinessSummary> {
  return request<RuntimeReadinessSummary>(ctx, "/ready", {}, { auth: false, timeoutMs: 10000 });
}
