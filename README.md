# Winter TA Applications Dashboard

A modern web application for managing Teaching Assistant (TA) applications. This dashboard allows professors and administrators to view, review, and manage TA applications with an intuitive interface.

## Features

- 🔐 **Authentication** - Secure login system using NextAuth
- 📋 **Application Management** - View and manage all TA applications
- ✅ **Selection System** - Select and shortlist applications by subject
- 👥 **User Management** - Admin panel for managing professors and users
- 📊 **Dashboard** - Overview of applications and statistics
- 📥 **CSV Export** - Download application data as CSV
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 📱 **Responsive Design** - Works seamlessly on all devices

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Authentication**: NextAuth.js
- **Theme**: next-themes

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager
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
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
view-applications/
├── app/
│   ├── (auth)/          # Authentication routes
│   ├── (dashboard)/     # Dashboard routes
│   ├── actions/         # Server actions
│   ├── api/             # API routes
│   └── layout.tsx       # Root layout
├── components/
│   ├── auth/            # Authentication components
│   ├── dashboard/       # Dashboard components
│   └── ThemeToggle.tsx  # Theme switcher
├── lib/
│   ├── supabase.ts      # Supabase client
│   └── types/           # TypeScript type definitions
└── public/              # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

Make sure to set up the following environment variables in your `.env.local` file:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `NEXTAUTH_URL` - Your application URL (e.g., http://localhost:3000)
- `NEXTAUTH_SECRET` - Secret key for NextAuth session encryption

## Database Schema

The application uses Supabase with the following main tables:
- `applications` - Stores TA applications
- `selections` - Tracks user selections of applications
- `professors` - User/professor information

## Deployment

The easiest way to deploy this Next.js app is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add your environment variables
4. Deploy!

For more details, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## License

This project is private and proprietary.
