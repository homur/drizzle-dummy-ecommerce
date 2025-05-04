"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { RootLayout } from "@/components/layout/RootLayout";

// Re-use or import password validation function and requirements list
function isPasswordSecure(password: string): boolean {
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return (
        password.length >= minLength &&
        hasUppercase &&
        hasLowercase &&
        hasNumber
    );
}
const passwordRequirements = [
    "At least 8 characters long",
    "At least one uppercase letter (A-Z)",
    "At least one lowercase letter (a-z)",
    "At least one number (0-9)",
];

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null); // Track token presence

  useEffect(() => {
    if (token) {
        setIsTokenValid(true);
    } else {
        setIsTokenValid(false);
        setError("Password reset token is missing or invalid.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPasswordError("");
    setMessage("");

    if (!token) {
        setError("Password reset token is missing or invalid.");
        return;
    }

    // Frontend validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!isPasswordSecure(formData.password)) {
      setPasswordError("Password does not meet security requirements.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
            token: token, 
            password: formData.password,
            confirmPassword: formData.confirmPassword 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setMessage(data.message || "Password has been reset successfully.");
       // Optionally clear form or redirect to login after a delay
       // router.push('/login');

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setPasswordError(""); // Clear specific error if API error occurs
    } finally {
      setIsLoading(false);
    }
  };

  if (isTokenValid === null) {
      return <div className="flex justify-center items-center min-h-screen">Loading...</div>; // Or a spinner
  }
  
  if (!isTokenValid) {
     return (
         <RootLayout>
             <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                 <div className="max-w-md w-full space-y-4 text-center">
                     <h2 className="text-2xl font-bold text-red-600">Invalid Token</h2>
                     <p className="text-gray-600">{error}</p>
                     <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                         Request a new password reset link
                     </Link>
                 </div>
             </div>
         </RootLayout>
     );
  }

  // Render form only if token is valid
  return (
    <RootLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Reset Your Password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your new password below.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {message && (
               <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm text-center">
                  <p>{message}</p>
                  <p className="mt-1">
                    <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Proceed to Login
                    </Link>
                  </p>
               </div>
            )}
            {/* Hide form if success message exists */}
            {!message && (
                <>
                 <div className="rounded-md shadow-sm -space-y-px">
                   <div>
                     <label htmlFor="password" className="sr-only">
                       New Password
                     </label>
                     <input
                       id="password"
                       name="password"
                       type="password"
                       autoComplete="new-password"
                       required
                       className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                       placeholder="New Password"
                       value={formData.password}
                       onChange={(e) => {
                         setFormData({ ...formData, password: e.target.value });
                         if (passwordError) setPasswordError("");
                       }}
                     />
                   </div>
                   <div>
                     <label htmlFor="confirmPassword" className="sr-only">
                       Confirm New Password
                     </label>
                     <input
                       id="confirmPassword"
                       name="confirmPassword"
                       type="password"
                       autoComplete="new-password"
                       required
                       className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${error === 'Passwords do not match' ? 'border-red-500' : ''}`}
                       placeholder="Confirm New Password"
                       value={formData.confirmPassword}
                       onChange={(e) => {
                         setFormData({ ...formData, confirmPassword: e.target.value });
                         if (error === 'Passwords do not match') setError("");
                       }}
                     />
                   </div>
                 </div>

                 {/* Display Password Requirements */}
                 <div className="text-xs text-gray-600 space-y-1">
                   <p className="font-medium">Password must contain:</p>
                   <ul className="list-disc list-inside pl-2">
                     {passwordRequirements.map((req, index) => (
                       <li key={index}>{req}</li>
                     ))}
                   </ul>
                 </div>

                 {/* Display Specific Password Error */}
                 {passwordError && (
                   <div className="text-red-500 text-sm text-center">{passwordError}</div>
                 )}

                 {/* Display General Errors (match, API) */}
                 {error && (
                   <div className="text-red-500 text-sm text-center">{error}</div>
                 )}

                 <div>
                   <button
                     type="submit"
                     disabled={isLoading}
                     className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                   >
                     {isLoading ? "Resetting..." : "Reset Password"}
                   </button>
                 </div>
               </>
             )}
          </form>
        </div>
      </div>
    </RootLayout>
  );
}

// Wrap with Suspense for useSearchParams
export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}> 
            <ResetPasswordContent />
        </Suspense>
    );
} 