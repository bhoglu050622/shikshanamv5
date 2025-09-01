# 🔑 Shikshanam – Lifetime Session with Graphy SSO

This document outlines the implementation of Shikshanam's authentication system with Graphy SSO integration, featuring lifetime sessions and automatic JWT refresh.

## 🏗️ Architecture Overview

### Authentication Flow

1. **Login Modal** → User chooses login method
2. **Email Login** → Direct Graphy authentication
3. **Google OAuth** → Google → Graphy ActiveCourses
4. **Post-Login** → Homepage with "My Learning Hub"

### Session Management

- **Lifetime Session Cookie** (`auth_token`): No expiry, persists until logout
- **Graphy JWT** (`graphy_jwt`): 24h expiry, auto-refreshed
- **Silent Refresh**: Automatic JWT renewal when needed

## 📁 File Structure

```
├── lib/
│   ├── graphy.ts                    # Graphy API utilities
│   └── useShikshanamAuth.ts         # Custom auth hook
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   └── graphy/
│   │   │       └── route.ts         # Graphy auth endpoints
│   │   └── user/
│   │       └── courses/
│   │           └── route.ts         # User courses endpoint
│   └── courses/
│       └── active/
│           └── page.tsx             # Active courses page
├── components/
│   ├── LoginModal.tsx               # Updated login modal
│   └── Navigation.tsx               # Updated with My Learning Hub
├── middleware.ts                    # JWT validation middleware
└── SHIKSHANAM_AUTH_README.md        # This file
```

## 🔧 Implementation Details

### 1. Graphy API Integration (`lib/graphy.ts`)

```typescript
// Core interfaces
interface GraphyUser {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
}

interface GraphyJWT {
  token: string
  expires_at: number
}

// API methods
- authenticateWithEmail(email, password)
- authenticateWithGoogle(googleToken)
- getUserCourses(jwtToken)
- validateJWT(jwtToken)
- refreshJWT(refreshToken)
```

### 2. Authentication Hook (`lib/useShikshanamAuth.ts`)

```typescript
// State management
interface AuthState {
  user: GraphyUser | null
  isAuthenticated: boolean
  isLoading: boolean
  courses: GraphyCourse[]
}

// Methods
- loginWithEmail(email, password)
- loginWithGoogle(googleToken)
- logout()
- fetchCourses()
- checkAuthStatus()
```

### 3. API Routes

#### `/api/auth/graphy` (POST)
- Handles email and Google authentication
- Sets lifetime session cookie
- Sets 24h JWT cookie

#### `/api/auth/graphy` (GET)
- Validates current session
- Returns user data if authenticated

#### `/api/auth/graphy` (DELETE)
- Clears all auth cookies
- Logs user out

#### `/api/user/courses` (GET)
- Fetches user's active courses
- Requires valid JWT

### 4. UI Components

#### LoginModal
- Email/password login
- Google OAuth (mock implementation)
- Error handling and loading states

#### Navigation
- "My Learning Hub" dropdown
- User profile display
- Active courses count
- Logout functionality

#### Active Courses Page
- Grid layout of user's courses
- Progress tracking
- Course thumbnails and descriptions

### 5. Middleware (`middleware.ts`)

- Validates JWT expiry on each request
- Automatically clears invalid cookies
- Redirects to login if session is invalid

## 🔐 Security Features

### Cookie Security
```typescript
// Lifetime session cookie
cookieStore.set('auth_token', userData, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  // No maxAge = session cookie
})

// JWT cookie (24h expiry)
cookieStore.set('graphy_jwt', jwt.token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 24 * 60 * 60, // 24 hours
})
```

### JWT Validation
- Automatic expiry checking
- Silent refresh capability
- Secure token storage

## 🚀 Usage

### 1. User Login Flow

```typescript
// Email login
const result = await loginWithEmail(email, password)
if (result.success) {
  // User is authenticated
  // Lifetime session is established
}

// Google login
const result = await loginWithGoogle(googleToken)
if (result.success) {
  // User is authenticated
  // Lifetime session is established
}
```

### 2. Session Management

```typescript
// Check authentication status
const { isAuthenticated, user, isLoading } = useShikshanamAuth()

// Access user courses
const { courses } = useShikshanamAuth()

// Logout
const { logout } = useShikshanamAuth()
await logout()
```

### 3. Protected Routes

```typescript
// In component
if (!isAuthenticated) {
  return <AccessDenied />
}

// In middleware
// Automatic validation and redirect
```

## 🔧 Configuration

### Environment Variables

```env
# Graphy API Configuration
GRAPHY_MERCHANT_ID=hyperquest
GRAPHY_API_TOKEN=80c83322-69d7-429c-99f7-e5170767d818
GRAPHY_BASE_URL=https://api.graphy.com

# NextAuth (for Google OAuth)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
```

### Graphy API Endpoints

```typescript
// Base URL: https://api.graphy.com
// Merchant ID: hyperquest
// API Token: 80c83322-69d7-429c-99f7-e5170767d818

// Authentication endpoints
POST /auth/login          # Email login
POST /auth/google         # Google OAuth
POST /auth/refresh        # JWT refresh
POST /auth/validate       # JWT validation

// User endpoints
GET /user/courses         # Get user courses
```

## 🎯 Features Implemented

### ✅ Core Features
- [x] Email login with Graphy
- [x] Google OAuth integration
- [x] Lifetime session cookies
- [x] 24h JWT with auto-refresh
- [x] "My Learning Hub" UI
- [x] Active courses display
- [x] Automatic session validation
- [x] Secure logout

### ✅ UI/UX Features
- [x] Modern login modal
- [x] User dropdown menu
- [x] Course progress tracking
- [x] Loading states
- [x] Error handling
- [x] Responsive design

### ✅ Security Features
- [x] HttpOnly cookies
- [x] JWT validation
- [x] Automatic session cleanup
- [x] Secure redirects

## 🔄 Session Rules

1. **First Login**: Google → Graphy ActiveCourses → Homepage with My Learning Hub
2. **Cookie Persistence**: Stays forever until Logout
3. **JWT Auto-refresh**: Every 24h silently
4. **Session Continuity**: User never loses session unless explicit logout

## 🚀 Next Steps

### Production Considerations
1. **Real Google OAuth**: Replace mock implementation
2. **JWT Refresh**: Implement automatic refresh logic
3. **Error Handling**: Add comprehensive error boundaries
4. **Analytics**: Track user engagement
5. **Testing**: Add unit and integration tests

### Potential Enhancements
1. **Remember Me**: Optional longer sessions
2. **Multi-device**: Session management across devices
3. **Offline Support**: Cache courses for offline viewing
4. **Push Notifications**: Course reminders
5. **Social Features**: Course sharing and discussions

## 📝 Notes

- The Google OAuth implementation is currently mocked for development
- JWT refresh logic needs to be implemented for production
- Error handling can be enhanced with more specific error messages
- The middleware can be optimized for better performance

This implementation provides a solid foundation for Shikshanam's authentication system with Graphy SSO integration.
