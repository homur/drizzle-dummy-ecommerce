"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { RootLayout } from "@/components/layout/RootLayout";
import { FormTitle } from "@/components/forms/FormElements";
import Link from "next/link";

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    name: string;
    imageUrl: string;
  };
}

interface Order {
  id: number;
  total: number;
  status: string;
  shippingName: string;
  shippingEmail: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/orders/user");
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <RootLayout>
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <FormTitle>My Orders</FormTitle>
            <div className="text-center py-8">Loading orders...</div>
          </div>
        </div>
      </RootLayout>
    );
  }

  if (orders.length === 0) {
    return (
      <RootLayout>
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <FormTitle>My Orders</FormTitle>
            <div className="text-center py-8">
              No orders found.
            </div>
            <Link
              href="/"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Let&apos;s find something amazing!
            </Link>
          </div>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <FormTitle>My Orders</FormTitle>
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : order.status === "processing"
                              ? "bg-blue-100 text-blue-800"
                              : order.status === "shipped"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="font-medium text-gray-900">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Shipping</p>
                      <p className="font-medium text-gray-900">
                        {order.shippingName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.shippingAddress}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.shippingCity}, {order.shippingPostalCode}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.shippingCountry}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Order Items
                    </h4>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4"
                        >
                          <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden relative">
                            <Image
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">
                              {item.product.name}
                            </h5>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-sm text-gray-600">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
