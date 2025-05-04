// import { Product } from "@/types/product";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { RootLayout } from "@/components/layout/RootLayout";
import { headers } from "next/headers";

async function getHighlightedProducts() {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const response = await fetch(
    `${protocol}://${host}/api/products?highlighted=true`,
    {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();
  return data.items || [];
}

export default async function Home() {
  const highlightedProducts = await getHighlightedProducts();

  return (
    <RootLayout>
      <HeroSection products={highlightedProducts} />
      <FeaturedProducts products={highlightedProducts} />
      <NewsletterSection />
    </RootLayout>
  );
}
