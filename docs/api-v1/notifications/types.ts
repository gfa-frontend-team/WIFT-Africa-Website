// ============================================
// Notifications API Types
// ============================================

// --------------------------------------------
// Enums
// --------------------------------------------

export enum NotificationType {
  CONNECTION_REQUEST = 'CONNECTION_REQUEST',
  CONNECTION_ACCEPTED = 'CONNECTION_ACCEPTED',
  POST_LIKE = 'POST_LIKE',
  POST_COMMENT = 'POST_COMMENT',
  POST_SHARE = 'POST_SHARE',
  COMMENT_REPLY = 'COMMENT_REPLY',
  NEW_MESSAGE = 'NEW_MESSAGE',
  NEW_BROADCAST = 'NEW_BROADCAST',
  MEMBERSHIP_APPROVED = 'MEMBERSHIP_APPROVED',
  MEMBERSHIP_REJECTED = 'MEMBERSHIP_REJECTED',
  MEMBERSHIP_DELAYED = 'MEMBERSHIP_DELAYED',
  ADMIN_ANNOUNCEMENT = 'ADMIN_ANNOUNCEMENT',
  CHAPTER_EVENT = 'CHAPTER_EVENT'
}

export type DeviceType = 'ios' | 'android' | 'web';

export type DigestFrequency = 'instant' | 'daily' | 'weekly' | 'never';

// --------------------------------------------
// Request Types
// --------------------------------------------

export interface UpdatePreferencesRequest {
  emailEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  connectionNotifications?: boolean;
  postNotifications?: boolean;
  messageNotifications?: boolean;
  membershipNotifications?: boolean;
  adminNotifications?: boolean;
  emailDigestFrequency?: DigestFrequency;
  quietHoursEnabled?: boolean;
  quietHoursStart?: string; // "HH:mm"
  quietHoursEnd?: string;   // "HH:mm"
}

export interface RegisterPushTokenRequest {
  token: string;
  deviceType: DeviceType;
  deviceId?: string;
}

// --------------------------------------------
// Response Types
// --------------------------------------------

export interface NotificationSender {
  id: string;
  firstName: string;
  lastName: string;
  username?: string;
  profilePhoto?: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  sender?: NotificationSender;
  
  entityType?: string;
  entityId?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
  
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  pages: number;
}

export interface UnreadCountResponse {
  count: number;
}

export interface NotificationPreferences {
  emailEnabled: boolean;
  pushEnabled: boolean;
  inAppEnabled: boolean;
  
  connectionNotifications: boolean;
  postNotifications: boolean;
  messageNotifications: boolean;
  membershipNotifications: boolean;
  adminNotifications: boolean;
  
  emailDigestFrequency: DigestFrequency;
  
  quietHoursEnabled?: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
}

export interface PreferencesResponse {
  preferences: NotificationPreferences;
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
