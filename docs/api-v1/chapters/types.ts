// ============================================
// Chapters API Types
// ============================================

// --------------------------------------------
// Enums
// --------------------------------------------

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum MemberType {
  NEW = 'NEW',
  EXISTING = 'EXISTING'
}

// --------------------------------------------
// Request Types
// --------------------------------------------

export interface ApproveRequestInput {
  notes?: string;
}

export interface RejectRequestInput {
  reason: string;
  canReapply?: boolean;
}

// --------------------------------------------
// Response Types
// --------------------------------------------

export interface MembershipRequestDetails {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePhoto?: string;
  };
  chapter: {
    id: string;
    name: string;
    code?: string;
  };
  memberType: MemberType;
  membershipId?: string;
  phoneNumber?: string;
  additionalInfo?: string;
  expectedReviewDate?: string; // ISO Date
  isDelayed: boolean;
  daysWaiting: number;
  createdAt: string; // ISO Date
}

export interface GetPendingRequestsResponse {
  requests: MembershipRequestDetails[];
}

export interface ApproveRequestResponse {
  message: string;
  request: {
    id: string;
    status: RequestStatus;
    reviewedAt: string;
  };
}

export interface RejectRequestResponse {
  message: string;
  request: {
    id: string;
    status: RequestStatus;
    reviewedAt: string;
    canReapply: boolean;
    reapplicationAllowedAt?: string;
  };
}

export interface ChapterMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto?: string;
  accountType: string;
  createdAt: string;
}

export interface GetChapterMembersResponse {
  members: ChapterMember[];
}

// --------------------------------------------
// Error Types
// --------------------------------------------

export interface APIError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ErrorDetail[];
  };
}

export interface ErrorDetail {
  field: string;
  message: string;
}
