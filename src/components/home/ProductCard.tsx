import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={400}
          height={300}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
          quality={85}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-700">
        <Link href={`/products/${product.slug}`}>
          <span aria-hidden="true" className="absolute inset-0" />
          {product.name}
        </Link>
      </h3>
      <p className="mt-1 text-lg font-medium text-gray-900">${product.price}</p>
      <p className="mt-1 text-sm text-gray-500">{product.description}</p>
    </div>
  );
};
