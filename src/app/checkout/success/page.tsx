"use client";

import { useRouter } from "next/navigation";
import { FormTitle, FormButton } from "@/components/forms/FormElements";
import { RootLayout } from "@/components/layout/RootLayout";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const router = useRouter();

  return (
    <RootLayout>
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
        <div className="container mx-auto px-4 py-16 text-center">
          <FormTitle>Thank you for your order!</FormTitle>
          <p className="text-gray-600 mb-8">
            We'll send you a confirmation email with your order details shortly.
          </p>
          <div className="space-y-4">
            <FormButton onClick={() => router.push("/products")}>
              Continue Shopping
            </FormButton>
            <p className="text-sm text-gray-600">
              Want to check your order status?{" "}
              <Link
                href="/orders/lookup"
                className="text-indigo-600 hover:text-indigo-500"
              >
                Look up your order
              </Link>
            </p>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
