
export enum ReportReason {
  SPAM = 'SPAM',
  HARASSMENT = 'HARASSMENT',
  HATE_SPEECH = 'HATE_SPEECH',
  INAPPROPRIATE_CONTENT = 'INAPPROPRIATE_CONTENT',
  IMPERSONATION = 'IMPERSONATION',
  MISINFORMATION = 'MISINFORMATION',
  OTHER = 'OTHER'
}

export enum ReportStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED'
}

export interface ReportInput {
  targetId: string;
  targetType: 'POST' | 'COMMENT' | 'USER' | 'JOB' | 'EVENT';
  reason: ReportReason;
  description?: string;
}

export interface Report {
  id: string;
  reporterId: string;
  targetId: string;
  targetType: 'POST' | 'COMMENT' | 'USER' | 'JOB' | 'EVENT';
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  adminNotes?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
  updatedAt: string;
}
