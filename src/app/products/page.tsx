import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import ProductsList from "./ProductsList";

export default function ProductsPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            All Products
          </h1>
          <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
            <ProductsList />
          </Suspense>
        </div>
      </div>
    </>
  );
}
