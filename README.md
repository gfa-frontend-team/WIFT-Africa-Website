# WIFT Africa - Member Frontend

Member-facing platform for WIFT Africa community members.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 with OKLCH color space
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **API Client:** Axios
- **Icons:** Lucide React
- **UI Components:** shadcn/ui compatible

## Project Structure

```
app/
├── (public)/          # Public pages (landing, login, register)
├── (auth)/            # Auth flow (verify-email, onboarding)
├── (member)/          # Protected member pages
├── api/               # API routes (BFF pattern)
└── layout.tsx         # Root layout

components/
├── ui/                # Reusable UI components
├── layout/            # Layout components (Navbar, Sidebar, Footer)
├── auth/              # Auth-specific components
└── shared/            # Shared business components

lib/
├── api/               # API client and endpoints
├── utils/             # Utility functions
├── hooks/             # Custom React hooks
└── stores/            # Zustand stores

types/                 # TypeScript type definitions
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Backend Integration

This frontend connects to the WIFT Africa backend API:
- **Backend Repo:** `wift-africa-backend`
- **API Base URL:** `http://localhost:3001/api/v1`
- **Documentation:** See backend Swagger docs at `http://localhost:3001/api-docs`

## Key Features

### Public Pages
- Landing page
- Login / Register
- Email verification

### Member Dashboard
- Home feed
- Profile management
- Member directory
- Opportunities (jobs, mentorship, grants)
- Messages
- Events
- Resources
- Chapter pages

### Authentication
- JWT-based auth with httpOnly cookies
- Email verification required
- 5-step onboarding flow
- Role-based access control

## Theme & Styling

The project uses a custom theme matching the WIFT Africa brand:
- **Primary Color:** Orange/Coral (`oklch(0.645 0.246 16.439)`)
- **Color System:** OKLCH for perceptually uniform colors
- **Dark Mode:** Supported with `.dark` class
- **Documentation:** See `THEME.md` and `docs/THEME_COLORS.md`

### Using Theme Colors
```tsx
<button className="bg-primary text-primary-foreground">
  Primary Button
</button>

<div className="bg-muted text-muted-foreground">
  Muted Section
</div>
```

## Development

### Adding New Pages
```typescript
// app/(member)/in/new-page/page.tsx
export default function NewPage() {
  return <div>New Page</div>
}
```

### Adding API Endpoints
```typescript
// app/api/example/route.ts
export async function GET() {
  return Response.json({ message: 'Hello' })
}
```

### Adding Components
```typescript
// components/ui/Button.tsx
export function Button({ children, ...props }) {
  return <button {...props}>{children}</button>
}
```

## Deployment

- **Platform:** Vercel
- **Domain:** wiftafrica.org
- **Preview:** Automatic for PRs

## License

Private - WIFT Africa
