import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

interface FeaturedProductsProps {
  products: Product[];
}

export const FeaturedProducts = ({ products }: FeaturedProductsProps) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Featured Designs
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Check out our most popular designs that are making waves
            </p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
