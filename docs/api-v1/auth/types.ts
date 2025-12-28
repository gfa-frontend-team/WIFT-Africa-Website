// ============================================
// Auth API Types
// ============================================

// --------------------------------------------
// Request Types
// --------------------------------------------

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GoogleAuthRequest {
  idToken: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface CheckEmailRequest {
  email: string; // From query param
}

export interface LogoutRequest {
  refreshToken: string;
}

// --------------------------------------------
// Response Types
// --------------------------------------------

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  onboardingComplete: boolean;
  onboardingStep: number;
  profilePhoto?: string;
  googleId?: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface LoginResponse {
  message: string;
  user: AuthUser;
  tokens: AuthTokens;
}

export interface GoogleAuthResponse {
  message: string;
  user: AuthUser;
  tokens: AuthTokens;
}

export interface VerifyEmailResponse {
  message: string;
  user: {
    id: string;
    email: string;
    emailVerified: boolean;
  };
}

export interface RefreshTokensResponse {
  message: string;
  tokens: AuthTokens;
}

export interface StandardMessageResponse {
  message: string;
}

export interface CheckEmailResponse {
  exists: boolean;
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
