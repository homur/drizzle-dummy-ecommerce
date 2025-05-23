import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export class SupabaseAuthService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  /**
   * Sign out the current user
   */
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  /**
   * Get the current session
   */
  async getSession() {
    const { data: { session }, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

  /**
   * Get the current user
   */
  async getUser() {
    const { data: { user }, error } = await this.supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  /**
   * Helper to create a Supabase client with a custom Authorization token.
   * Used for operations that require a specific access token (e.g., password recovery).
   */
  createClientWithToken(token: string): SupabaseClient {
    return createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
  }

  async resetPassword(accessToken: string, newPassword: string) {
    // Use a client with the recovery token for password reset
    const recoveryClient = this.createClientWithToken(accessToken);
    const { error } = await recoveryClient.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  }

  async signUp(email: string, password: string, name?: string) {
    // Determine the base URL for redirect
    let baseUrl = "http://localhost:3000";
    if (typeof window !== "undefined" && window.location.origin) {
      baseUrl = window.location.origin;
    }
    return this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${baseUrl}/verify-email`,
      },
    });
  }

  async getUserByAccessToken(accessToken: string) {
    const client = this.createClientWithToken(accessToken);
    const { data, error } = await client.auth.getUser();
    if (error || !data.user) return null;
    return data.user;
  }

  async requestPasswordReset(email: string, redirectTo?: string) {
    return this.supabase.auth.resetPasswordForEmail(email, redirectTo ? { redirectTo } : undefined);
  }
} 


