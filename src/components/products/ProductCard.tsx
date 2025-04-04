import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number | string;
  imageUrl: string;
  inventory: number;
  slug: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const price =
    typeof product.price === "string"
      ? parseFloat(product.price)
      : product.price;

  return (
    <Link href={`/products/${product.slug}`} className="block h-full">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full flex flex-col">
        <div className="relative w-full aspect-square bg-gray-100">
          {product.imageUrl && !imageError ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              priority
              onError={(e) => {
                console.error("Image load error:", e);
                setImageError(true);
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2 flex-grow">
            {product.description}
          </p>
          <div className="flex justify-between items-center mt-auto">
            <span className="text-lg font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            <span
              className={`text-sm ${
                product.inventory > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.inventory > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
