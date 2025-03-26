"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { CMSUser } from "@/types/cms";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<CMSUser | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("cms_user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    // Remove token and user data
    Cookies.remove("cms_token");
    localStorage.removeItem("cms_user");
    router.push("/cms/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                CMS Dashboard
              </h1>
              <div className="flex space-x-4">
                <Link
                  href="/cms/dashboard"
                  className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium bg-white"
                >
                  Dashboard
                </Link>
                <Link
                  href="/cms/products"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Products
                </Link>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  View Homepage
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              {user && (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Welcome to your Dashboard
            </h2>
            <p className="text-gray-600">
              This is your CMS dashboard. You can manage your content from here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
