"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { RootLayout } from "@/components/layout/RootLayout";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing or invalid.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to verify email.");
        }

        setStatus("success");
        setMessage(data.message || "Email verified successfully!");
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "An unexpected error occurred.");
      } 
    };

    verifyEmail();
  }, [token]); // Depend on token

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>

        <div className="mt-8 space-y-6">
          {status === "loading" && (
            <p className="text-gray-600">{message}</p>
            // Add a spinner maybe?
          )}
          {status === "success" && (
            <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              <p>{message}</p>
              <p className="mt-2">
                You can now{" "}
                <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  login to your account
                </Link>
                .
              </p>
            </div>
          )}
          {status === "error" && (
             <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p>{message}</p>
                {/* Optionally add a link to request a new verification email */}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Using Suspense to handle the initial rendering while searchParams are loading
export default function VerifyEmailPage() {
    return (
        <RootLayout>
            <Suspense fallback={<div>Loading...</div>}> 
                <VerifyEmailContent />
            </Suspense>
        </RootLayout>
    );
} 