# TA Applications Dashboard

TA Admin portal is the dashboard used by the Amrita School of Computing to collect, review, and shortlist Teaching Assistant applicants. It provides authenticated faculty members with a secure, consistent view of every submission, subject preference, and supporting detail.

## Overview

- **Purpose**: streamline faculty review, avoid parallel spreadsheets, and retain a single source of truth for selections.
- **Audience**: Principal, faculty coordinators, and administrative staff who manage TA allocations.
- **Stack**: Next.js 16 (App Router), TypeScript, Tailwind CSS, Supabase, NextAuth.js, and `next-themes`.
- **Security**: All dashboard routes require an active NextAuth session; Supabase service-role operations execute only on the server.

## Core Capabilities

- Credential-based authentication with automatic redirects for active sessions.
- Comprehensive application table with subject preferences, grades, reasons, and internship history.
- Per-faculty shortlisting via optimistic toggles, with visual indicators when a subject is already taken.
- Full-data and shortlisted CSV exports that match internal reporting templates.
- Settings area for password updates, feature requests, and personal preferences (theme, tips, reference material).
- Responsive layout suitable for lecterns, desktops, and tablets.

## Architecture Notes

- Applications are fetched via Supabase using service-role credentials inside API routes and server actions.
- Client-side state (`ApplicationsContext`) caches application data for the active session and refreshes automatically every 30 minutes; users can request a manual refresh.
- All server-facing code calls `getServerSession` to enforce access control before returning data.
- CSV downloads reuse the cached data set, preventing duplicate database calls during export.

## Getting Started

### Prerequisites

- Node.js 18 or later with npm.
- Supabase project containing `applications`, `selections`, and `professors` tables.
- Valid Supabase anon key, service-role key, and a NextAuth secret.

### Local Setup

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/zappvik/ta-admin-portal.git
   cd ta-admin-portal
   npm install
   ```
2. Create `.env.local` (never commit this file):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` and sign in with a provisioned faculty account.

## Project Structure

```
ta-applications-dashboard/
├── app/            # App Router routes, layouts, API handlers, actions
├── components/     # Auth forms, dashboard tables, UI primitives
├── lib/            # Supabase helpers, caching utilities, context
├── public/         # Static assets
└── README.md
```

## Environment Variables

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL used by client modules |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key for read-only client interactions |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key for privileged actions (never expose) |
| `NEXTAUTH_URL` | Base URL for NextAuth callbacks |
| `NEXTAUTH_SECRET` | Secret for signing and encrypting sessions |

## Operations and Deployment

1. Push the repository to your institutional Git provider.
2. Deploy to Vercel (or another Next.js-compatible host) and configure the environment variables above.
3. Confirm the following in production:
   - Login succeeds for faculty accounts.
   - Applications load and refresh as expected.
   - Shortlisting actions propagate to the database.
   - CSV exports match academic reporting requirements.

## Support

- Feature requests and incident reports can be submitted through the dashboard’s built-in feedback link.
- For infrastructure or authentication issues, contact the School of Computing development team.

This codebase is an internal system of the School of Computing. Redistribution or external hosting requires approval from the Principal’s office.
