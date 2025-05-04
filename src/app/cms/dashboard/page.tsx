"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { CMSUser } from "@/types/cms";
import CMSLayout from "@/components/cms/CMSLayout";
import { RootLayout } from "@/components/layout/RootLayout";
import { FormTitle } from "@/components/forms/FormElements";

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
    <CMSLayout user={user} onLogout={handleLogout}>
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
    </CMSLayout>
  );
}
