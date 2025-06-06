"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { CMSUser } from "@/types/cms";
import CMSLayout from "@/components/cms/CMSLayout";

interface Customer {
  id: number;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
}

export default function CustomersPage() {
  const router = useRouter();
  const [user, setUser] = useState<CMSUser | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [messageContent, setMessageContent] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("cms_user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/cms/customers");
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (customerId: number) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
      const response = await fetch(`/api/cms/customers?id=${customerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.code === "23503") {
          alert(
            "Cannot delete this customer because they have associated orders. Please delete their orders first or contact support."
          );
        } else {
          alert(
            `Failed to delete customer: ${errorData.error || "Unknown error"}`
          );
        }
        return;
      }

      setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert(
        "An unexpected error occurred while trying to delete the customer. Please try again later."
      );
    }
  };

  const handleLogout = () => {
    Cookies.remove("cms_token");
    localStorage.removeItem("cms_user");
    router.push("/cms/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-gray-900">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <CMSLayout user={user} onLogout={handleLogout}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {customers.map((customer) => (
            <li key={customer.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-600 truncate">
                      {customer.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {customer.email}
                    </p>
                    <div className="mt-2 flex">
                      <div className="flex items-center text-sm text-gray-500">
                        <p>
                          Joined:{" "}
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </p>
                        <span className="mx-2">•</span>
                        <p>
                          Status:{" "}
                          {customer.emailVerified ? "Verified" : "Unverified"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </CMSLayout>
  );
}
