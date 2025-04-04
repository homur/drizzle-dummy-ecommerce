"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import {
  FormInput,
  FormTitle,
  FormSection,
  FormButton,
} from "@/components/forms/FormElements";
import { RootLayout } from "@/components/layout/RootLayout";

interface User {
  name: string;
  email: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    // Fetch user data if logged in
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          // Pre-fill form with user data
          setFormData((prev) => ({
            ...prev,
            name: userData.name || "",
            email: userData.email || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = 5.99;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          shippingDetails: formData,
          total,
        }),
      });

      if (response.ok) {
        clearCart();
        router.push("/checkout/success");
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <RootLayout>
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <FormTitle>Your cart is empty</FormTitle>
            <FormButton onClick={() => router.push("/products")}>
              Continue Shopping
            </FormButton>
          </div>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <FormTitle>Checkout</FormTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <FormTitle>Shipping Details</FormTitle>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormInput
                  id="name"
                  label="Full Name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!!user}
                />

                <FormInput
                  id="email"
                  type="email"
                  label="Email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={!!user}
                />

                <FormInput
                  id="address"
                  label="Address"
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    id="city"
                    label="City"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  />

                  <FormInput
                    id="postalCode"
                    label="Postal Code"
                    required
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                  />
                </div>

                <FormInput
                  id="country"
                  label="Country"
                  required
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                />

                <FormButton
                  type="submit"
                  isLoading={isLoading}
                  className="w-full"
                >
                  Place Order
                </FormButton>
              </form>
            </div>

            <div>
              <FormTitle>Order Summary</FormTitle>
              <FormSection>
                <div className="space-y-4">
                  <div className="flex justify-between text-gray-900">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-900">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold text-gray-900">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </FormSection>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
