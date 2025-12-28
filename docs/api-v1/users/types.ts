// ============================================
// Users & Profiles API Types
// ============================================

// --------------------------------------------
// Enums
// --------------------------------------------

export enum ProfileVisibility {
  PUBLIC = 'PUBLIC',
  CHAPTER_ONLY = 'CHAPTER_ONLY',
  CONNECTIONS_ONLY = 'CONNECTIONS_ONLY',
  PRIVATE = 'PRIVATE'
}

export enum AvailabilityStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  NOT_LOOKING = 'NOT_LOOKING'
}

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

export interface CheckUsernameRequest {
  username: string; // Query param
}

export interface UpdatePrivacyRequest {
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

// User & Profile Data Interface
export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  emailVerified: boolean;
  accountType: string;
  membershipStatus: string;
  onboardingComplete: boolean;
  onboardingStep: number;
  chapter?: {
    id: string;
    name: string;
    code: string;
    country: string;
  };
  memberType: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface ProfileData {
  roles?: string[];
  primaryRole?: string;
  isMultihyphenate?: boolean;
  writerSpecialization?: string;
  crewSpecializations?: string[];
  businessSpecializations?: string[];
  headline?: string;
  bio?: string;
  location?: string;
  availabilityStatus?: AvailabilityStatus;
  website?: string;
  imdbUrl?: string;
  linkedinUrl?: string;
  instagramHandle?: string;
  twitterHandle?: string;
  completeness?: {
    completionPercentage: number;
    missingFields: string[];
    isComplete: boolean;
  };
}

export interface GetCurrentUserResponse {
  user: UserData;
}

export interface GetUserProfileResponse {
  user: Partial<UserData>;
  profile: ProfileData;
}

export interface UpdateProfileResponse {
  message: string;
  profile: Partial<ProfileData>;
}

export interface UploadPhotoResponse {
  message: string;
  photoUrl: string;
}

export interface UpdateUsernameResponse {
  message: string;
  username: string;
  changesRemaining: number;
}

export interface CheckUsernameResponse {
  available: boolean;
  username: string;
  error?: string;
}

export interface GetPrivacyResponse {
  privacySettings: {
    profileVisibility: ProfileVisibility;
    showEmail: boolean;
    showPhone: boolean;
    showSocialLinks: boolean;
    showChapter: boolean;
    showRoles: boolean;
  };
}

export interface UpdatePrivacyResponse {
  message: string;
  privacySettings: GetPrivacyResponse['privacySettings'];
}

export interface ShareLinkResponse {
  url: string;
  username?: string;
  profileSlug?: string;
}

export interface UploadCVResponse {
  message: string;
  cvFileName: string;
  cvUploadedAt: string;
}

export interface GetPublicProfileResponse {
  profile: Partial<ProfileData> & Partial<UserData> & {
    username?: string;
    profileSlug?: string;
  };
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
