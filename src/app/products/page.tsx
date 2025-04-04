"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { ProductCard } from "@/components/products/ProductCard";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  inventory: number;
  slug: string;
  isHighlighted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductsResponse {
  items: Product[];
  totalPages: number;
  currentPage: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    setCurrentPage(page);
    fetchProducts(page);
  }, [searchParams]);

  const fetchProducts = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/products?page=${page}`);
      if (!response.ok) throw new Error("Failed to fetch products");

      const data: ProductsResponse = await response.json();
      setProducts(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    router.push(`/products?page=${page}`);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            All Products
          </h1>

          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          currentPage === page
                            ? "bg-indigo-600 text-white"
                            : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
