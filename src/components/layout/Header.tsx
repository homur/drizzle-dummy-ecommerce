"use client";

import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const cart = useCart();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        setIsAuthenticated(response.ok);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (response.ok) {
        setIsAuthenticated(false);
        setIsDropdownOpen(false);
        router.push("/login");
      } else {
        console.error("Logout failed:", await response.text());
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getDropdownItems = () => {
    if (isAuthenticated) {
      return [
        {
          label: "Profile",
          href: "/profile",
          onClick: () => setIsDropdownOpen(false),
        },
        {
          label: "Messages",
          href: "/messages",
          onClick: () => setIsDropdownOpen(false),
        },
        {
          label: "Orders",
          href: "/orders",
          onClick: () => setIsDropdownOpen(false),
        },
        {
          label: "Logout",
          onClick: handleLogout,
        },
      ];
    }
    return [
      {
        label: "Login",
        href: "/login",
        onClick: () => setIsDropdownOpen(false),
      },
      {
        label: "Register",
        href: "/register",
        onClick: () => setIsDropdownOpen(false),
      },
    ];
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Drizzle Dummy
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {!isLoading && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
                  title={isAuthenticated ? "Profile" : "Account"}
                >
                  <User className="h-6 w-6" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    {getDropdownItems().map((item, index) =>
                      item.href ? (
                        <Link
                          key={index}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={item.onClick}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <button
                          key={index}
                          onClick={item.onClick}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {item.label}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            )}
            <Link
              href="/cart"
              className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 relative"
              title="Cart"
            >
              <ShoppingBag className="h-6 w-6" />
              {cart.items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.items.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
