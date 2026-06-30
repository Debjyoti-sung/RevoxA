import { env } from '@/src/config/env';

export class SupabaseClient {
  private static instance: SupabaseClient;
  private supabaseUrl: string;
  private anonKey: string;

  private constructor() {
    this.supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || '';
    this.anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  }

  public static getInstance(): SupabaseClient {
    if (!SupabaseClient.instance) {
      SupabaseClient.instance = new SupabaseClient();
    }
    return SupabaseClient.instance;
  }

  public getUrl() {
    return this.supabaseUrl;
  }

  public getAnonKey() {
    return this.anonKey;
  }
}

export const supabase = SupabaseClient.getInstance();
