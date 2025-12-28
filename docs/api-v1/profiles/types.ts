// ============================================
// Profiles API Types
// ============================================

// --------------------------------------------
// Request Types
// --------------------------------------------

export interface GetPublicProfileRequest {
  identifier: string; // Path parameter: username or userID
}

// --------------------------------------------
// Response Types
// --------------------------------------------

export interface PublicProfile {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  profileSlug: string;
  profilePhoto?: string;
  headline?: string;
  bio?: string;
  primaryRole?: string;
  location?: string;
  availabilityStatus?: 'AVAILABLE' | 'BUSY' | 'NOT_LOOKING';
  
  // Conditionally visible fields
  roles?: string[];
  isMultihyphenate?: boolean;
  writerSpecialization?: string;
  crewSpecializations?: string[];
  businessSpecializations?: string[];
  
  chapter?: {
    id: string;
    name: string;
    code?: string;
    country?: string;
  };

  website?: string;
  imdbUrl?: string;
  linkedinUrl?: string;
  instagramHandle?: string;
  twitterHandle?: string;

  email?: string;
  // Phone is rarely shared publicly, but logic exists
}

export interface GetPublicProfileResponse {
  profile: PublicProfile;
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
