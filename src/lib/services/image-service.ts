import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Types
export interface ImageUploadResult {
  url: string;
  key: string;
  width: number;
  height: number;
  format: string;
}

export interface ImageUploadError {
  message: string;
  code?: string;
}

// Constants
const MAX_FILE_SIZE = 1024 * 1024; // 1MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL and anon key are required");
}

// We can safely assert these as string since we've checked they exist
const supabase = createClient(supabaseUrl as string, supabaseKey as string);

export class ImageService {
  private supabase: SupabaseClient;

  constructor(supabaseToken?: string) {
    // If we have a Supabase token, create an authenticated client
    if (supabaseToken) {
      this.supabase = createClient(supabaseUrl as string, supabaseKey as string, {
        auth: {
          autoRefreshToken: true,
          persistSession: false,
          detectSessionInUrl: false
        }
      });

      // Set the session with the provided token
      this.supabase.auth.setSession({
        access_token: supabaseToken,
        refresh_token: ''
      });
    } else {
      this.supabase = supabase;
    }
  }

  /**
   * Validates an image file before upload
   */
  private validateImage(file: File): ImageUploadError | null {
    if (!file) {
      return { message: 'No file provided' };
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return { 
        message: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed',
        code: 'INVALID_FILE_TYPE'
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { 
        message: 'File size exceeds 1MB limit',
        code: 'FILE_TOO_LARGE'
      };
    }

    return null;
  }

  /**
   * Gets image dimensions
   */
  private getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Uploads an image to Supabase Storage
   */
  async uploadImage(file: File, productId: string): Promise<ImageUploadResult> {
    // Validate the image
    const validationError = this.validateImage(file);
    if (validationError) {
      throw new Error(validationError.message);
    }

    try {
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${productId}/${Date.now()}.${fileExt}`;

      // Upload to Supabase
      const { data, error } = await this.supabase.storage
        .from('products')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(error.message);
      }

      // Get the public URL
      const { data: { publicUrl } } = this.supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      // Get image dimensions
      const dimensions = await this.getImageDimensions(file);

      return {
        url: publicUrl,
        key: fileName,
        width: dimensions.width,
        height: dimensions.height,
        format: fileExt || ''
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to upload image');
    }
  }

  /**
   * Deletes an image from Supabase Storage
   */
  async deleteImage(key: string): Promise<void> {
    try {
      const { error } = await this.supabase.storage
        .from('products')
        .remove([key]);

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete image');
    }
  }
} 