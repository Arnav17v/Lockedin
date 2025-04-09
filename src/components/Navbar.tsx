'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="bg-blue-600 dark:bg-blue-800 shadow-md z-10" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-white text-lg font-semibold">
              StudyLens
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className={`text-white px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/dashboard' ? 'bg-blue-700 dark:bg-blue-900' : 'hover:bg-blue-700 dark:hover:bg-blue-900'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/sessions"
                  className={`text-white px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/sessions' ? 'bg-blue-700 dark:bg-blue-900' : 'hover:bg-blue-700 dark:hover:bg-blue-900'
                  }`}
                >
                  Session Logs
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-900"
                >
                  Logout
                </button>
                <span className="ml-4 text-white text-sm">
                  Welcome, {session.user.name}
                </span>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`text-white px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/login' ? 'bg-blue-700 dark:bg-blue-900' : 'hover:bg-blue-700 dark:hover:bg-blue-900'
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={`text-white px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/signup' ? 'bg-blue-700 dark:bg-blue-900' : 'hover:bg-blue-700 dark:hover:bg-blue-900'
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
} 