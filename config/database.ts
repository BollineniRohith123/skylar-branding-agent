export interface DatabaseConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  connectionLimit?: number;
  acquireTimeout?: number;
  timeout?: number;
}

export const dbConfig: DatabaseConfig = {
  host: (process.env.DB_HOST as string) || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  user: (process.env.DB_USER as string) || 'root',
  password: (process.env.DB_PASSWORD as string) || '', // Default XAMPP MySQL password is empty
  database: (process.env.DB_NAME as string) || 'skylar_branding',
  connectionLimit: process.env.DB_CONNECTION_LIMIT ? parseInt(process.env.DB_CONNECTION_LIMIT, 10) : 10,
  acquireTimeout: process.env.DB_ACQUIRE_TIMEOUT ? parseInt(process.env.DB_ACQUIRE_TIMEOUT, 10) : 60000,
  timeout: process.env.DB_TIMEOUT ? parseInt(process.env.DB_TIMEOUT, 10) : 60000,
};

// Database connection status
export let isDatabaseConnected = false;
export let lastDatabaseError: string | null = null;
