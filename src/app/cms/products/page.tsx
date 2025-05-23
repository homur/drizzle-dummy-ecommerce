"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { CMSUser } from "@/types/cms";
import { Product } from "@/types/product";
import CMSLayout from "@/components/cms/CMSLayout";
import { ImageUpload } from "@/components/forms/ImageUpload";
import { ImageUploadResult } from "@/lib/services/image-service";

export default function ProductsPage() {
  const router = useRouter();
  const [user, setUser] = useState<CMSUser | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    inventory: "",
    imageUrl: "",
    imageKey: "",
    imageWidth: 0,
    imageHeight: 0,
    imageFormat: "",
    isHighlighted: false,
  });

  useEffect(() => {
    const userData = localStorage.getItem("cms_user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      const productsWithNumberPrices = data.items.map((product: Product) => ({
        ...product,
        price: Number(product.price),
        inventory: Number(product.inventory),
      }));
      setProducts(productsWithNumberPrices);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUploaded = (result: ImageUploadResult) => {
    setNewProduct(prev => ({
      ...prev,
      imageUrl: result.url,
      imageKey: result.key,
      imageWidth: result.width,
      imageHeight: result.height,
      imageFormat: result.format,
    }));
  };

  const handleImageDeleted = () => {
    setNewProduct(prev => ({
      ...prev,
      imageUrl: "",
      imageKey: "",
      imageWidth: 0,
      imageHeight: 0,
      imageFormat: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get('cms_token')}`
        },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          inventory: parseInt(newProduct.inventory),
          isHighlighted: newProduct.isHighlighted,
        }),
      });

      if (response.ok) {
        setShowAddForm(false);
        setNewProduct({
          name: "",
          description: "",
          price: "",
          inventory: "",
          imageUrl: "",
          imageKey: "",
          imageWidth: 0,
          imageHeight: 0,
          imageFormat: "",
          isHighlighted: false,
        });
        fetchProducts();
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleEditImageUploaded = (result: ImageUploadResult) => {
    if (!editingProduct) return;
    setEditingProduct(prev => ({
      ...prev!,
      imageUrl: result.url,
      imageKey: result.key,
      imageWidth: result.width,
      imageHeight: result.height,
      imageFormat: result.format,
    }));
  };

  const handleEditImageDeleted = () => {
    if (!editingProduct) return;
    setEditingProduct(prev => ({
      ...prev!,
      imageUrl: "",
      imageKey: "",
      imageWidth: 0,
      imageHeight: 0,
      imageFormat: "",
    }));
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editingProduct,
          price: parseFloat(editingProduct.price.toString()),
          inventory: parseInt(editingProduct.inventory.toString()),
          isHighlighted: editingProduct.isHighlighted,
        }),
      });

      if (response.ok) {
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleLogout = () => {
    Cookies.remove("cms_token");
    localStorage.removeItem("cms_user");
    router.push("/cms/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-gray-900">Loading...</div>
      </div>
    );
  }

  return (
    <CMSLayout user={user} onLogout={handleLogout}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New Product
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Add New Product
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 px-3 py-2 bg-white text-gray-900"
                required
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    description: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-24 px-3 py-2 bg-white text-gray-900"
                required
              />
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 px-3 py-2 bg-white text-gray-900"
                required
              />
            </div>
            <div>
              <label
                htmlFor="inventory"
                className="block text-sm font-medium text-gray-700"
              >
                Inventory
              </label>
              <input
                type="number"
                id="inventory"
                value={newProduct.inventory}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    inventory: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 px-3 py-2 bg-white text-gray-900"
                required
              />
            </div>
            <ImageUpload
              onImageUploaded={handleImageUploaded}
              onImageDeleted={handleImageDeleted}
              productId="new"
              existingImages={newProduct.imageUrl ? [{ url: newProduct.imageUrl, key: newProduct.imageKey }] : []}
              supabaseToken={Cookies.get('cms_token')}
            />
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isHighlighted"
                checked={newProduct.isHighlighted}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    isHighlighted: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label
                htmlFor="isHighlighted"
                className="ml-2 block text-sm text-gray-900"
              >
                Highlight this product
              </label>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {products.map((product) => (
            <li key={product.id}>
              {editingProduct?.id === product.id ? (
                <div className="p-4">
                  <form onSubmit={handleEdit} className="space-y-4">
                    <div>
                      <label
                        htmlFor={`name-${product.id}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id={`name-${product.id}`}
                        value={editingProduct.name}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            name: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 px-3 py-2 bg-white text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`description-${product.id}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        id={`description-${product.id}`}
                        value={editingProduct.description}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            description: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-24 px-3 py-2 bg-white text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`price-${product.id}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Price
                      </label>
                      <input
                        type="number"
                        id={`price-${product.id}`}
                        value={editingProduct.price}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            price: Number(e.target.value),
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 px-3 py-2 bg-white text-gray-900"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`inventory-${product.id}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Inventory
                      </label>
                      <input
                        type="number"
                        id={`inventory-${product.id}`}
                        value={editingProduct.inventory}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            inventory: Number(e.target.value),
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 px-3 py-2 bg-white text-gray-900"
                        required
                      />
                    </div>
                    <ImageUpload
                      onImageUploaded={handleEditImageUploaded}
                      onImageDeleted={handleEditImageDeleted}
                      productId={editingProduct.id.toString()}
                      existingImages={editingProduct.imageUrl && editingProduct.imageKey ? [{ url: editingProduct.imageUrl, key: editingProduct.imageKey }] : []}
                      supabaseToken={Cookies.get('cms_token')}
                    />
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`isHighlighted-${product.id}`}
                        checked={editingProduct.isHighlighted}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            isHighlighted: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                      />
                      <label
                        htmlFor={`isHighlighted-${product.id}`}
                        className="ml-2 block text-sm text-gray-900"
                      >
                        Highlight this product
                      </label>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {product.name}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {product.description}
                      </p>
                      <div className="mt-2 flex">
                        <div className="flex items-center text-sm text-gray-500">
                          <p>Price: ${product.price.toFixed(2)}</p>
                        </div>
                        <div className="ml-4 flex items-center text-sm text-gray-500">
                          <p>Inventory: {product.inventory}</p>
                        </div>
                        <div className="ml-4 flex items-center text-sm text-gray-500">
                          <p>
                            Highlighted: {product.isHighlighted ? "Yes" : "No"}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex space-x-2">
                      <button
                        onClick={() =>
                          setEditingProduct({
                            ...product,
                            price: Number(product.price),
                            inventory: Number(product.inventory),
                          })
                        }
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </CMSLayout>
  );
}
