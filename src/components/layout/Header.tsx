"use client";

import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Designs", href: "/products" },
  { name: "Categories", href: "/categories" },
  { name: "About", href: "/about" },
];

export function Header() {
  const cart = useCart();

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
            <Link
              href="/profile"
              className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
              title="Profile"
            >
              <User className="h-6 w-6" />
            </Link>
            <Link
              href="/cart"
              className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 relative"
              title="Cart"
            >
              <ShoppingCart className="h-6 w-6" />
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
