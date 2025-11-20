# Winter TA Applications Dashboard

A web application for managing Teaching Assistant applications. Professors and administrators can view, review, and manage TA applications through an intuitive dashboard interface.

## Features

- Secure authentication using NextAuth
- Application management and viewing
- Subject-based selection and shortlisting system
- User management for professors and administrators
- Dashboard with application statistics and overview
- **Dual CSV export functionality:**
  - Shortlisted CSV: Simplified format with one row per student (Name, Roll Number, Email, Subjects as comma-separated list)
  - Full CSV: Complete application details with all fields
- Breadcrumb navigation with clickable links
- Settings page with preferences, password management, and feature requests
- Reference guide integrated in settings
- Dark mode support with theme persistence
- Fully responsive design optimized for mobile and desktop
- Smart caching for improved performance
- Security-first architecture with protected routes

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- NextAuth.js
- next-themes

## Core Architecture

### Caching System

The application uses a multi-layer caching approach to optimize performance and reduce server load.

**Client-Side Caching**
Applications data is cached in React Context after the initial load. This allows instant navigation between pages without additional database queries. The cache persists for the duration of the user session.

**Auto-Refresh**
Data automatically refreshes every 30 minutes in the background to ensure users see the latest applications without manual intervention. This keeps the cache current while maintaining fast page loads. Users can also manually refresh using the refresh button in the header.

**Manual Refresh**
Users can trigger a manual refresh using the refresh button in the header. This immediately fetches the latest data from the server and updates the cache.

**Server-Side Caching**
React's `cache()` function prevents duplicate database queries within the same request cycle, reducing unnecessary database calls.

**Optimistic Updates**
When users toggle selections, the UI updates immediately while the server request processes in the background. If the request fails, the UI reverts to the previous state.

**Benefits**
- Instant page navigation with no loading delays
- Reduced database query load
- Real-time data synchronization
- Better overall user experience

### Security Features

**Authentication**
NextAuth.js handles all authentication with secure session management. Users must authenticate before accessing any dashboard routes.

**Protected Routes**
All dashboard routes require a valid session. Unauthenticated users are redirected to the login page.

**Server-Side Validation**
Every API route and server action validates the user session before processing requests. This ensures only authenticated users can access or modify data.

**Service Role Access**
Database operations use the Supabase service role key, which is never exposed to the client. All database queries execute server-side only.

**User Isolation**
Data is filtered by user ID to ensure users only see and modify their own selections. The selections table includes user_id to enforce data isolation.

**Secure API Endpoints**
All API routes check authentication status before processing. Unauthorized requests return 401 errors.

**Environment Variables**
Sensitive keys are stored in environment variables and never committed to version control. The `.env.local` file is excluded from git.

**Session Management**
JWT-based sessions with automatic token refresh. Sessions are encrypted and stored securely.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, pnpm, or bun
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd view-applications
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

Important: Never commit `.env.local` to version control. The `SUPABASE_SERVICE_ROLE_KEY` and `NEXTAUTH_SECRET` are sensitive credentials.

4. Run the development server:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser.

## Project Structure

```
view-applications/
├── app/
│   ├── (auth)/              # Authentication routes
│   ├── (dashboard)/         # Protected dashboard routes
│   ├── actions/             # Server actions
│   ├── api/                 # API routes
│   └── layout.tsx           # Root layout
├── components/
│   ├── auth/                # Authentication components
│   ├── dashboard/           # Dashboard components
│   └── ThemeToggle.tsx      # Theme switcher
├── lib/
│   ├── cache/               # Server-side caching utilities
│   ├── context/             # React Context providers
│   ├── supabase.ts          # Supabase client
│   └── types/               # TypeScript definitions
└── public/                  # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Required environment variables in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (keep secret)
- `NEXTAUTH_URL` - Application URL (e.g., http://localhost:3000)
- `NEXTAUTH_SECRET` - NextAuth session encryption secret (keep secret)

## Database Schema

Main Supabase tables:

- `applications` - TA application records
- `selections` - User selections of applications (includes user_id for isolation)
- `professors` - Professor/user accounts

## Key Features

### CSV Export

**Shortlisted CSV Export:**
- Available on the Shortlisted page
- Format: Name, Roll Number, Email, Subjects (comma-separated)
- One row per student with all shortlisted subjects in a single cell
- Optimized for sharing with faculty members

**Full CSV Export:**
- Available on the Applications page
- Includes all application details: Student Name, Roll Number, Email, Subjects, Reason, Internship, Submitted Date
- Complete data export for comprehensive analysis

### Navigation

- Breadcrumb navigation showing current page path
- Clickable breadcrumbs for quick navigation
- Mobile-optimized breadcrumbs with responsive text sizing
- Sidebar navigation with active page highlighting

### Settings

- Theme preferences (Light/Dark mode)
- Password change functionality
- Feature request button (opens Microsoft Teams chat)
- Reference guide with essential tips and CSV format information

## Performance Optimizations

- Data caching in React Context after initial load
- Background auto-refresh every 30 minutes
- Optimistic UI updates for immediate feedback
- Server-side rendering for critical data
- Automatic code splitting by Next.js
- Optimized image handling
- Mobile-first responsive design

## Deployment

Deploy to Vercel:

1. Push code to GitHub
2. Import repository on Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

Production checklist:
- All environment variables configured
- `NEXTAUTH_URL` set to production domain
- `NEXTAUTH_SECRET` is a strong random string
- Database connection strings verified
- CORS settings configured if needed

See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

This project is private and proprietary.
