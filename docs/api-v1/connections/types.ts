// ============================================
// Connections API Types
// ============================================

// --------------------------------------------
// Enums
// --------------------------------------------

export enum ConnectionRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  CANCELLED = 'CANCELLED'
}

export type RequestType = 'incoming' | 'outgoing' | 'all';

// --------------------------------------------
// Request Types
// --------------------------------------------

export interface SendConnectionRequest {
  receiverId: string;
  message?: string; // Max 300 chars
}

export interface DeclineConnectionRequest {
  reason?: string; // Max 200 chars
}

export interface BlockUserRequest {
  userId: string;
  reason?: string; // Max 200 chars
}

// --------------------------------------------
// Response Types
// --------------------------------------------

export interface UserSummary {
  id: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
}

export interface Connection {
  id: string;
  user: UserSummary; // The "other" user
  connectedAt: string;
}

export interface ConnectionRequest {
  id: string;
  sender: UserSummary | string;
  receiver: UserSummary | string;
  status: ConnectionRequestStatus;
  message?: string;
  declineReason?: string;
  createdAt: string;
  expiresAt: string;
  respondedAt?: string;
}

export interface BlockedUserItem {
  user: UserSummary;
  blockedAt: string;
  reason?: string;
}

export interface GetConnectionsResponse {
  connections: Connection[];
  total: number;
  pages: number;
}

export interface GetRequestsResponse {
  requests: ConnectionRequest[];
  total: number;
  pages: number;
}

export interface ConnectionRequestResponse {
  request: ConnectionRequest;
  message?: string;
}

export interface AcceptRequestResponse {
  connection: {
    id: string;
    user1: UserSummary;
    user2: UserSummary;
  };
  request: ConnectionRequest;
  message: string;
}

export interface ConnectionStatsResponse {
  connectionsCount: number;
  pendingIncoming: number;
  pendingOutgoing: number;
}

export interface CheckConnectionResponse {
  connected: boolean;
}

export interface GetBlockedUsersResponse {
  blocked: BlockedUserItem[];
}

// --------------------------------------------
// Error Types
// --------------------------------------------

export interface APIError {
  success: false;
  error: {
    code: string;
    message: string;
  };
}
