"use client";

import { Header } from "@/components/layout/Header";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  inventory: number;
  category?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const cart = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        // Ensure price is a number
        setProduct({
          ...data,
          price: Number(data.price),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    cart.addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity,
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-red-500">{error || "Product not found"}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
              {/* Product Image */}
              <div className="aspect-w-1 aspect-h-1">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>
                <p className="text-2xl font-semibold text-indigo-600 mb-4">
                  ${Number(product.price).toFixed(2)}
                </p>
                <p className="text-gray-600 mb-6">{product.description}</p>

                {/* Stock Status */}
                <div className="mb-6">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      product.inventory > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.inventory > 0
                      ? `${product.inventory} in stock`
                      : "Out of stock"}
                  </span>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center space-x-4 mb-6">
                  <label
                    htmlFor="quantity"
                    className="text-sm font-medium text-gray-700"
                  >
                    Quantity:
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 text-gray-600 hover:text-gray-900"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      max={product.inventory}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(
                          Math.max(
                            1,
                            Math.min(
                              product.inventory,
                              parseInt(e.target.value) || 1
                            )
                          )
                        )
                      }
                      className="w-16 text-center border-x border-gray-300 py-1 text-gray-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.inventory, quantity + 1))
                      }
                      className="px-3 py-1 text-gray-600 hover:text-gray-900"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={product.inventory === 0}
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
