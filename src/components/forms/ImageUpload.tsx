'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { ImageService, ImageUploadResult } from '@/lib/services/image-service';
import { X, Upload, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  onImageUploaded: (result: ImageUploadResult) => void;
  onImageDeleted?: (key: string) => void;
  existingImages?: { url: string; key: string }[];
  productId: string;
  maxImages?: number;
  supabaseToken?: string;
}

export function ImageUpload({
  onImageUploaded,
  onImageDeleted,
  existingImages = [],
  productId,
  maxImages = 5,
  supabaseToken
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const imageService = new ImageService(supabaseToken);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setError(null);
    setPreviewUrl(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      const result = await imageService.uploadImage(file, productId);
      onImageUploaded(result);
      setPreviewUrl(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  }, [productId, onImageUploaded]);

  const handleDelete = useCallback(async (key: string) => {
    try {
      await imageService.deleteImage(key);
      onImageDeleted?.(key);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
    }
  }, [onImageDeleted]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Product Images
        </label>
        {existingImages.length < maxImages && (
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </label>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {previewUrl && (
        <div className="relative w-32 h-32">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {existingImages.map((image) => (
            <div key={image.key} className="relative group">
              <div className="relative w-full aspect-square">
                <Image
                  src={image.url}
                  alt="Product"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <button
                onClick={() => handleDelete(image.key)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Image Limit Message */}
      {existingImages.length >= maxImages && (
        <p className="text-sm text-gray-500">
          Maximum number of images reached ({maxImages})
        </p>
      )}
    </div>
  );
} 