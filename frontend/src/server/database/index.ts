import { env } from '@/src/config/env';

export class DatabaseService {
  private static instance: DatabaseService;
  private connectionString: string;

  private constructor() {
    this.connectionString = env.DATABASE_URL || '';
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async query(sql: string, params: any[] = []) {
    console.log(`[Database Query] executing SQL on ${this.connectionString.split('@')[1] || 'local'}: ${sql}`);
    // Simulate database lookup
    return { rows: [] };
  }
}

export const db = DatabaseService.getInstance();
