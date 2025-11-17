import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirects the user immediately to the login page
  redirect('/login');
}