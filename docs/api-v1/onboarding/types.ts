// ============================================
// Onboarding API Types
// ============================================

// --------------------------------------------
// Enums
// --------------------------------------------

export enum Role {
  PRODUCER = 'PRODUCER',
  DIRECTOR = 'DIRECTOR',
  WRITER = 'WRITER',
  ACTRESS = 'ACTRESS',
  CREW = 'CREW',
  BUSINESS = 'BUSINESS'
}

export enum WriterSpecialization {
  TV = 'TV',
  FILM = 'FILM',
  BOTH = 'BOTH'
}

export enum CrewSpecialization {
  CINEMATOGRAPHER = 'CINEMATOGRAPHER',
  EDITOR = 'EDITOR',
  COMPOSER = 'COMPOSER',
  SOUND_DESIGNER = 'SOUND_DESIGNER',
  PRODUCTION_DESIGNER = 'PRODUCTION_DESIGNER',
  COSTUME_DESIGNER = 'COSTUME_DESIGNER',
  MAKEUP_ARTIST = 'MAKEUP_ARTIST',
  GAFFER = 'GAFFER'
}

export enum BusinessSpecialization {
  ENTERTAINMENT_LAW = 'ENTERTAINMENT_LAW',
  DISTRIBUTION = 'DISTRIBUTION',
  FINANCE = 'FINANCE',
  MARKETING = 'MARKETING',
  REPRESENTATION = 'REPRESENTATION',
  PUBLIC_RELATIONS = 'PUBLIC_RELATIONS'
}

export enum AvailabilityStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  NOT_LOOKING = 'NOT_LOOKING'
}

export enum MemberType {
  NEW = 'NEW',
  EXISTING = 'EXISTING'
}

export enum MembershipStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

// --------------------------------------------
// Request Types
// --------------------------------------------

export interface RoleSelectionRequest {
  roles: Role[];
  primaryRole: Role;
}

export interface SpecializationRequest {
  writerSpecialization?: WriterSpecialization;
  crewSpecializations?: CrewSpecialization[];
  businessSpecializations?: BusinessSpecialization[];
}

export interface ChapterSelectionRequest {
  chapterId: string;
  memberType: MemberType;
  membershipId?: string;
  phoneNumber?: string;
  additionalInfo?: string;
}

export interface ProfileSetupRequest {
  displayName?: string;
  bio?: string;
  headline?: string;
  location?: string;
  website?: string;
  imdbUrl?: string;
  linkedinUrl?: string;
  instagramHandle?: string;
  twitterHandle?: string;
  availabilityStatus?: AvailabilityStatus;
  // File is handled separately via multipart/form-data
}

// --------------------------------------------
// Response Types
// --------------------------------------------

export interface OnboardingProgressResponse {
  currentStep: number;
  isComplete: boolean;
  emailVerified: boolean;
  steps: {
    roleSelection: boolean;
    specialization: boolean;
    chapterSelection: boolean;
    profileSetup: boolean;
    termsAccepted: boolean;
  };
  data: {
    roles: Role[];
    primaryRole?: Role;
    specializations?: {
      writer?: WriterSpecialization;
      crew?: CrewSpecialization[];
      business?: BusinessSpecialization[];
    };
    chapterId?: string;
    membershipStatus?: MembershipStatus;
  };
}

export interface RoleSelectionResponse {
  message: string;
  nextStep: number;
  needsSpecialization: boolean;
}

export interface SpecializationResponse {
  message: string;
  nextStep: number;
}

export interface Chapter {
  id: string;
  name: string;
  code: string;
  country: string;
  description: string;
  memberCount: number;
  requiresApproval: boolean;
}

export interface AvailableChaptersResponse {
  chapters: Chapter[];
}

export interface ChapterSelectionResponse {
  message: string;
  nextStep: number;
  requiresApproval: boolean;
  membershipStatus: MembershipStatus;
  expectedReviewDate?: string | Date;
}

export interface ProfileSetupResponse {
  message: string;
  nextStep: number;
  cvUploaded: boolean;
}

export interface AcceptTermsResponse {
  message: string;
  onboardingComplete: boolean;
  membershipStatus: MembershipStatus;
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
