"use client"; // No client-side logic needed yet, but good practice for simple message pages

import Link from "next/link";
import { RootLayout } from "@/components/layout/RootLayout";

export default function CheckEmailPage() {
  return (
    <RootLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Check Your Email
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We've sent a verification link to your email address. Please click the link to activate your account.
            </p>
            <p className="mt-4 text-center text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or{' '}
              {/* Add link/button to resend verification later if needed */}
              <span className="font-medium text-indigo-600 hover:text-indigo-500 cursor-not-allowed">
                request a new link
              </span>
              .
            </p>
            <p className="mt-6">
              <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Go back to homepage
              </Link>
            </p>
          </div>
        </div>
      </div>
    </RootLayout>
  );
} 