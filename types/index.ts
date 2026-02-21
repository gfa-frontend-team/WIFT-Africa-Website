// Core types matching backend models

// ============================================
// USER & AUTH TYPES
// ============================================

export enum AccountType {
  CHAPTER_MEMBER = 'CHAPTER_MEMBER',
  HQ_MEMBER = 'HQ_MEMBER',
  CHAPTER_ADMIN = 'CHAPTER_ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum MembershipStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
  LINKEDIN = 'LINKEDIN',
}

export enum MemberType {
  NEW = 'NEW',
  EXISTING = 'EXISTING',
}

export interface User {
  _id: string | undefined
  id: string
  email: string
  firstName: string
  lastName: string
  profilePhoto?: string
  bannerUrl?: string


  // CV/Resume fields
  cvFileName?: string
  cvFileUrl?: string
  cvUploadedAt?: Date
  chapter?: {
    _id: string | undefined;
    code: string;
    country: string;
    name: string
  }

  username?: string
  profileSlug: string
  authProvider: AuthProvider
  emailVerified: boolean
  accountType: AccountType
  membershipStatus: MembershipStatus
  onboardingComplete: boolean
  onboardingStep: number
  termsAccepted: boolean
  termsAcceptedAt?: Date
  chapterId?: string
  memberType?: MemberType
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

// ============================================
// PROFILE & ROLES
// ============================================

export enum Role {
  PRODUCER = 'PRODUCER',
  DIRECTOR = 'DIRECTOR',
  WRITER = 'WRITER',
  ACTRESS = 'ACTRESS',
  CREW = 'CREW',
  BUSINESS = 'BUSINESS',
}

export enum WriterSpecialization {
  TV = 'TV',
  FILM = 'FILM',
  BOTH = 'BOTH',
}

export enum CrewSpecialization {
  CINEMATOGRAPHER = 'CINEMATOGRAPHER',
  EDITOR = 'EDITOR',
  COMPOSER = 'COMPOSER',
  SOUND_DESIGNER = 'SOUND_DESIGNER',
  PRODUCTION_DESIGNER = 'PRODUCTION_DESIGNER',
  COSTUME_DESIGNER = 'COSTUME_DESIGNER',
  MAKEUP_ARTIST = 'MAKEUP_ARTIST',
  GAFFER = 'GAFFER',
}

export enum BusinessSpecialization {
  ENTERTAINMENT_LAW = 'ENTERTAINMENT_LAW',
  DISTRIBUTION = 'DISTRIBUTION',
  FINANCE = 'FINANCE',
  MARKETING = 'MARKETING',
  REPRESENTATION = 'REPRESENTATION',
  PUBLIC_RELATIONS = 'PUBLIC_RELATIONS',
}

export enum AvailabilityStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  NOT_LOOKING = 'NOT_LOOKING',
}

export interface Profile {
  id: string
  userId: string
  roles: Role[]
  primaryRole: Role
  isMultihyphenate: boolean
  writerSpecialization?: WriterSpecialization  // Singular - only one writer specialization
  crewSpecializations?: CrewSpecialization[]  // Array - multiple crew specializations allowed
  businessSpecializations?: BusinessSpecialization[]  // Array - multiple business specializations allowed
  headline?: string
  bio?: string
  skills: string[]
  location?: string
  availabilityStatus: AvailabilityStatus
  portfolioLinks: string[]
  website?: string
  imdbUrl?: string
  linkedinUrl?: string
  instagramHandle?: string
  twitterHandle?: string
  bannerUrl?: string; // Added field
  createdAt: Date
  updatedAt: Date
  completeness?: {
    completionPercentage: number
    missingFields: string[]
    isComplete: boolean
  }
}

export interface ProfileCompleteness {
  completionPercentage: number
  missingFields: string[]
  isComplete: boolean
}

export interface Experience {
  id: string
  _id?: string
  organizationName?: string
  roleTitle: string
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP' | string
  startDate: string
  endDate?: string
  isPresent: boolean
  description?: string
}

// ============================================
// ONBOARDING
// ============================================

export interface OnboardingProgress {
  currentStep: number
  isComplete: boolean
  emailVerified: boolean
  steps: {
    roleSelection: boolean
    specialization: boolean
    chapterSelection: boolean
    profileSetup: boolean
    termsAccepted: boolean
  }
  data: {
    roles: Role[]
    primaryRole?: Role
    specializations: {
      writer?: WriterSpecialization  // Singular - matches backend
      crew?: CrewSpecialization[]  // Array - matches backend
      business?: BusinessSpecialization[]  // Array - matches backend
    }
    chapterId?: string
    membershipStatus: MembershipStatus
  }
}

// ============================================
// CHAPTER
// ============================================

export interface Chapter {
  _id: string
  id: string // keeping id for compatibility if needed, or mapping _id to id
  name: string
  code: string
  country: string

  // Optional Location & Details
  city?: string
  description?: string
  missionStatement?: string

  // Counts & Status
  memberCount: number
  fixedMemberCount: number
  isActive: boolean

  // Populated Admin Data
  adminIds: Array<{
    _id: string
    firstName: string
    lastName: string
    email?: string
  }>

  // Leadership & Contact (Optional)
  currentPresident?: string
  presidentName?: string
  presidentEmail?: string
  presidentPhone?: string
  email?: string
  phone?: string
  address?: string;
  website?: string

  // Social Media (Optional)
  facebookUrl?: string
  twitterHandle?: string
  instagramHandle?: string
  linkedinUrl?: string

  // Metadata
  foundedDate?: string
  createdAt: string | Date // Keeping flexible
  updatedAt: string | Date

  // Computed Field
  adminName: string
}

// ============================================
// EVENTS
// ============================================

export enum EventType {
  WORKSHOP = 'WORKSHOP',
  SCREENING = 'SCREENING',
  NETWORKING = 'NETWORKING',
  MEETUP = 'MEETUP',
  CONFERENCE = 'CONFERENCE',
  OTHER = 'OTHER'
}

export enum LocationType {
  PHYSICAL = 'PHYSICAL',
  VIRTUAL = 'VIRTUAL',
  HYBRID = 'HYBRID'
}

export enum RSVPStatus {
  GOING = 'GOING',
  INTERESTED = 'INTERESTED',
  NOT_GOING = 'NOT_GOING'
}

export interface EventLocation {
  type: LocationType
  address?: string
  city?: string
  country?: string
  virtualUrl?: string  // Changed from virtualLink to match API
  instructions?: string
}

export interface Event {
  _id?: string  // MongoDB uses _id
  id: string  // Primary identifier
  title: string
  description: string
  type: EventType
  chapterId?: {  // API returns chapterId as object
    _id?: string
    id?: string
    name: string
    code: string
  }
  chapter?: {  // Normalized field
    id: string
    name: string
  }
  startDate: string
  endDate: string
  timezone?: string
  location: EventLocation
  organizer?: {
    _id?: string
    id?: string
    firstName: string
    lastName: string
    profilePhoto?: string
  }
  coverImage?: string
  capacity?: number
  currentAttendees?: number
  tags?: string[]
  myRSVP?: RSVPStatus | null
  status?: string
  isPublished?: boolean
  isCancelled?: boolean
  createdAt: string
  updatedAt: string
  __v?: number  // MongoDB version field
}

export interface EventRSVP {
  eventId: string
  userId: string
  status: RSVPStatus
}

export interface EventsListResponse {
  events: Event[]
  total: number
  pages: number
}

export interface EventAttendee {
  user: {
    id: string
    firstName: string
    lastName: string
    profilePhoto?: string
  }
  status: RSVPStatus
  rsvpDate: string
}

export interface EventAttendeesResponse {
  attendees: EventAttendee[]
  stats: {
    going: number
    interested: number
    notGoing: number
  }
}

// ============================================
// API REQUEST/RESPONSE TYPES
// ============================================

export interface ApiError {
  error: string
  message: string
  statusCode: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ============================================
// RESOURCES
// ============================================

export enum ResourceType {
  PDF = 'PDF',
  VIDEO = 'VIDEO',
}

export interface Resource {
  id?: string
  _id?: string
  title: string
  description: string
  resourceType: ResourceType
  fileUrl: string
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  thumbnailUrl?: string // Optional thumbnail for videos/PDFs
  createdAt: string
  updatedAt?: string
}

export interface ResourceListResponse {
  data: Resource[]
}

export interface ResourceDetailResponse {
  data: Resource
}

// ============================================
// MENTORSHIP
// ============================================

export enum MentorshipFormat {
  VIRTUAL = 'Virtual',
  PHYSICAL = 'Physical',
  HYBRID = 'Hybrid',
}

export enum MentorshipStatus {
  OPEN = 'Open',
  CLOSED = 'Closed',
}

export enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

export enum ApplicationStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Withdrawn = 'Withdrawn',
}

export interface Mentorship {
  id?: string
  _id?: string
  mentorName: string
  mentorRole: string
  areasOfExpertise: string[]
  mentorshipFormat: MentorshipFormat

  // Enhanced Schedule
  startPeriod: string              // ISO date string
  endPeriod: string                // ISO date string
  days: DayOfWeek[]                // Available days of week
  timeFrame: string                // e.g., "12:30pm - 3:00pm"

  // Optional Fields
  mentorshipLink?: string          // URL for virtual meetings
  description: string
  eligibility?: string

  // Metadata
  status: MentorshipStatus
  chapterId?: string | null
  createdBy?: string               // Admin who created it
  viewCount?: number               // Engagement tracking

  // Timestamps
  createdAt: string
  updatedAt?: string

  // User-specific (only when authenticated)
  isSaved?: boolean                // Has current user saved this?
  hasApplied?: boolean             // Has current user applied?
}

export interface MentorshipApplication {
  _id: string
  mentorshipId: string | Mentorship  // Can be populated with full mentorship
  applicantId: string | UserProfile  // Can be populated with user details
  status: ApplicationStatus
  message: string                    // Application message from user

  // Admin Review
  adminResponse?: string             // Optional response from admin
  reviewedBy?: string                // Admin who reviewed
  reviewedAt?: string                // ISO date string

  // Timestamps
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  _id: string
  firstName: string
  lastName: string
  email: string
  profilePhoto?: string
}

export interface SavedMentorship {
  _id: string
  userId: string
  mentorshipId: string | Mentorship  // Can be populated with full mentorship
  createdAt: string
}

export interface MentorshipListResponse {
  data: Mentorship[]
}

export interface MentorshipDetailResponse {
  data: Mentorship
}

export interface ApplicationListResponse {
  data: MentorshipApplication[]
}

export interface ApplicationDetailResponse {
  data: MentorshipApplication
}

export interface SavedMentorshipListResponse {
  data: SavedMentorship[]
}

// ============================================
// FUNDING & GRANTS
// ============================================

export interface FundingOpportunity {
  id?: string
  _id?: string
  name: string
  fundingType: string // e.g., 'Grant', 'Residency'
  applicationType: 'Direct' | 'Redirect'
  deadline: string
  description?: string
  amount?: string
  currency?: string
  applicationLink?: string
  eligibility?: string
  criteria?: string
  region?: string
  status: 'Open' | 'Closed' | 'Coming Soon'
  chapterId?: string
  createdAt: string
  updatedAt?: string
}

export interface FundingListResponse {
  data: FundingOpportunity[]
}

export interface FundingDetailResponse {
  data: FundingOpportunity
}

export * from './jobs'
export * from './reports'
export * from './application'

