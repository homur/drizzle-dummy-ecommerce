import { NextResponse } from 'next/server';
import { SupabaseAuthService } from '@/lib/services/supabase-auth-service';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const authService = new SupabaseAuthService();
    const { session } = await authService.signIn(email, password);
    
    if (!session) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    return NextResponse.json({ token: session.access_token });
  } catch (error) {
    console.error('Error getting Supabase token:', error);
    return NextResponse.json(
      { error: 'Failed to get Supabase token' },
      { status: 500 }
    );
  }
}