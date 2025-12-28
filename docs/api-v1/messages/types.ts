// ============================================
// Messages API Types
// ============================================

// --------------------------------------------
// Enums
// --------------------------------------------

export enum ConversationType {
  DIRECT = 'DIRECT',
  BROADCAST = 'BROADCAST'
}

export type MessageMediaType = 'image' | 'video' | 'document';

export type RecipientType = 'ALL' | 'CHAPTER' | 'CUSTOM';

// --------------------------------------------
// Request Types
// --------------------------------------------

export interface SendMessageRequest {
  receiverId: string;
  content: string;
  media?: Array<{
    type: MessageMediaType;
    url: string;
    filename?: string;
  }>;
}

export interface BroadcastMessageRequest {
  content: string;
  recipientType: RecipientType;
  chapterId?: string;
  recipientIds?: string[];
  title?: string;
  description?: string;
  media?: Array<{
    type: MessageMediaType;
    url: string;
    filename?: string;
  }>;
}

// --------------------------------------------
// Response Types
// --------------------------------------------

export interface MessageMedia {
  type: MessageMediaType;
  url: string;
  filename?: string;
}

export interface ParticipantSummary {
  id: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
}

export interface Message {
  id: string;
  conversation: string;
  sender: ParticipantSummary | string;
  receiver?: ParticipantSummary | string; // Optional (not in broadcast)
  content: string;
  media: MessageMedia[];
  
  isBroadcast: boolean;
  isRead?: boolean; // For direct
  readBy?: string[]; // For broadcast
  recipientCount?: number;
  
  // Computed fields (often added by service for the viewer)
  isReadByMe?: boolean;
  
  createdAt: string;
}

export interface ConversationSummary {
  id: string;
  type: ConversationType;
  
  // Direct fields
  otherParticipant?: ParticipantSummary;
  
  // Broadcast fields
  title?: string;
  description?: string;
  creator?: ParticipantSummary;
  participantCount?: number;
  
  lastMessage?: Message | string;
  lastMessageAt: string;
}

export interface GetConversationsResponse {
  conversations: ConversationSummary[];
  total: number;
}

export interface GetMessagesResponse {
  conversation: {
    type: ConversationType;
    isBroadcast: boolean;
  };
  messages: Message[];
  total: number;
}

export interface SendMessageResponse {
  message: Message;
  conversation: ConversationSummary; // Or simplified object
}

export interface BroadcastResponse {
  message: string;
  data: {
    message: Message;
    conversation: ConversationSummary;
    recipientCount: number;
  };
}

export interface UnreadCountResponse {
  direct: number;
  broadcast: number;
  total: number;
}

export interface BroadcastStats {
  conversation: {
    id: string;
    title?: string;
    participantCount: number;
    createdAt: string;
  };
  stats: Array<{
    messageId: string;
    content: string;
    recipientCount: number;
    readCount: number;
    readPercentage: string;
    sentAt: string;
  }>;
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
