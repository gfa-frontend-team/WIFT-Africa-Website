// ============================================
// Users API Types
// ============================================

// --------------------------------------------
// Request Types
// --------------------------------------------

export interface UpdateProfileRequest {
  bio?: string;
  headline?: string;
  location?: string;
  website?: string;
  imdbUrl?: string;
  linkedinUrl?: string;
  instagramHandle?: string;
  twitterHandle?: string;
  availabilityStatus?: AvailabilityStatus;
}

export interface UpdateUsernameRequest {
  username: string;
}

export interface CheckUsernameAvailabilityRequest {
  username: string;
}

export interface UpdatePrivacySettingsRequest {
  profileVisibility?: ProfileVisibility;
  showEmail?: boolean;
  showPhone?: boolean;
  showSocialLinks?: boolean;
  showChapter?: boolean;
  showRoles?: boolean;
}

// --------------------------------------------
// Response Types
// --------------------------------------------

export interface UserResponse {
  user: UserData;
}

export interface UserProfileResponse {
  user: UserData;
  profile: ProfileData;
}

export interface ProfileUpdateResponse extends ProfileData {
  updatedAt: string;
}

export interface PhotoUploadResponse {
  message: string;
  photoUrl: string;
}

export interface UsernameUpdateResponse {
  message: string;
  username: string;
}

export interface UsernameCheckResponse {
  available: boolean;
  username: string;
  error?: string;
}

export interface UsernameSuggestionsResponse {
  suggestions: string[];
}

export interface PrivacySettingsResponse {
  privacySettings: PrivacySettingsData;
}

export interface ShareLinkResponse {
  url: string;
  username: string;
  profileSlug: string;
}

export interface CVUploadResponse {
  message: string;
  cvFileName: string;
  cvUploadedAt: string;
}

// --------------------------------------------
// Data Models
// --------------------------------------------

export interface UserData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  role: string;
  profilePhotoUrl?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface ProfileData {
  id: string;
  bio?: string;
  headline?: string;
  location?: string;
  website?: string;
  imdbUrl?: string;
  linkedinUrl?: string;
  instagramHandle?: string;
  twitterHandle?: string;
  availabilityStatus: AvailabilityStatus;
  profileVisibility: ProfileVisibility;
  cvUrl?: string;
}

export interface PrivacySettingsData {
  profileVisibility: ProfileVisibility;
  showEmail: boolean;
  showPhone: boolean;
  showSocialLinks: boolean;
  showChapter: boolean;
  showRoles: boolean;
}

// --------------------------------------------
// Enums
// --------------------------------------------

export enum AvailabilityStatus {
  AVAILABLE = "AVAILABLE",
  BUSY = "BUSY",
  NOT_LOOKING = "NOT_LOOKING",
}

export enum ProfileVisibility {
  PUBLIC = "PUBLIC",
  CHAPTER_ONLY = "CHAPTER_ONLY",
  CONNECTIONS_ONLY = "CONNECTIONS_ONLY",
  PRIVATE = "PRIVATE",
}

// --------------------------------------------
// Error Types
// --------------------------------------------

export interface APIError {
  error: string;
  message?: string;
}
