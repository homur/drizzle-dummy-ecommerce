"use client";

import { Header } from "@/components/layout/Header";
import { useCart } from "@/hooks/use-cart";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const cart = useCart();
  const router = useRouter();

  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      cart.removeItem(id);
    } else {
      cart.updateQuantity(id, newQuantity);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Shopping Cart
            </h1>
            {cart.items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">Your cart is empty</p>
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b border-gray-200 py-4 last:border-b-0"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-gray-500">
                          ${item.price.toFixed(2)} each
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 rounded-md hover:bg-gray-100"
                          >
                            <Minus className="h-4 w-4 text-gray-500" />
                          </button>
                          <span className="text-gray-900 w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 rounded-md hover:bg-gray-100"
                          >
                            <Plus className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                        <button
                          onClick={() => cart.removeItem(item.id)}
                          className="p-1 rounded-md hover:bg-gray-100 text-red-500"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <div className="w-24 text-right">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <div className="flex justify-between text-lg font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="mt-6 flex justify-end space-x-4">
                    <Link
                      href="/"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Continue Shopping
                    </Link>
                    <button
                      onClick={() => router.push("/checkout")}
                      disabled={cart.items.length === 0}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
