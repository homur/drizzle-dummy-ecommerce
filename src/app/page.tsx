"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { RootLayout } from "@/components/layout/RootLayout";

export default function Home() {
  const [highlightedProducts, setHighlightedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [allProductsResponse, highlightedResponse] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/products?highlighted=true"),
        ]);

        const highlighted = await highlightedResponse.json();

        setHighlightedProducts(highlighted);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <RootLayout>
      <HeroSection products={highlightedProducts} />
      <FeaturedProducts products={highlightedProducts} />
      <NewsletterSection />
    </RootLayout>
  );
}
