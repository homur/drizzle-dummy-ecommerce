import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET_NAME = "product-images";

export type ImageMetadata = {
  width: number;
  height: number;
  format: string;
};

export async function uploadProductImage(
  file: File,
  productId: number
): Promise<{ url: string; key: string; metadata: ImageMetadata }> {
  try {
    // Convert File to Buffer
    const buffer = await file.arrayBuffer();

    // Process image with sharp
    const image = sharp(Buffer.from(buffer));
    const metadata = await image.metadata();

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${productId}-${timestamp}.${metadata.format}`;
    const key = `${BUCKET_NAME}/${filename}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filename);

    return {
      url: publicUrl,
      key: key,
      metadata: {
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || "unknown",
      },
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export async function deleteProductImage(key: string): Promise<void> {
  try {
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([key]);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}

export function getImageUrl(key: string): string {
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(key);
  return publicUrl;
}
