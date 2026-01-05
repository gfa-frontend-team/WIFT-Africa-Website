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
  id: string
  email: string
  firstName: string
  lastName: string
  profilePhoto?: string
  
  // CV/Resume fields
  cvFileName?: string
  cvFileUrl?: string
  cvUploadedAt?: Date
  
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
  id: string
  name: string
  code: string
  country: string
  city?: string
  description?: string
  missionStatement?: string
  email?: string
  phone?: string
  website?: string
  memberCount: number
  isActive: boolean
  adminIds: string[]
  createdAt: Date
  updatedAt: Date
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
export * from './jobs'
export * from './reports'
export * from './application'

