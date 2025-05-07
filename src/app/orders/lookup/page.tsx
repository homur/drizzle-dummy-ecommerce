"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FormInput,
  FormTitle,
  FormButton,
} from "@/components/forms/FormElements";
import { RootLayout } from "@/components/layout/RootLayout";

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

export default function OrderLookupPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setOrder(null);

    try {
      const response = await fetch(`/api/orders/lookup?orderId=${orderId}&email=${email}`);
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error || "Failed to look up order.");
        setOrder(null);
        throw new Error(errorData.error || "Failed to look up order");
      }
      const data = await response.json();
      setOrder(data);
    } catch (err) {
      console.error("Order lookup failed:", err);
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RootLayout>
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <FormTitle>Order Lookup</FormTitle>

          <form onSubmit={handleLookup} className="max-w-md mx-auto space-y-4">
            <FormInput
              id="orderId"
              label="Order ID"
              required
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Enter your order ID"
            />

            <FormInput
              id="email"
              type="email"
              label="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
            />

            <FormButton type="submit" isLoading={isLoading} className="w-full">
              Look Up Order
            </FormButton>
          </form>

          {order && (
            <div className="mt-8 max-w-2xl mx-auto bg-white rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">
                  Order Details
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-medium text-gray-900">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {order.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="font-medium text-gray-900">
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2 text-gray-900">
                    Shipping Details
                  </h3>
                  <div className="text-sm text-gray-600">
                    <p>{order.shippingName}</p>
                    <p>{order.shippingAddress}</p>
                    <p>
                      {order.shippingCity}, {order.shippingPostalCode}
                    </p>
                    <p>{order.shippingCountry}</p>
                    <p className="mt-2">{order.shippingEmail}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-900">
                    Order Items
                  </h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-4 border-b pb-4 last:border-b-0"
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
                          <h4 className="font-medium text-gray-900">
                            {item.product.name}
                          </h4>
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
          )}
        </div>
      </div>
    </RootLayout>
  );
}
