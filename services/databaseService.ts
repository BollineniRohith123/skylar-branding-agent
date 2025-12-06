import mysql from 'mysql2/promise';
import { dbConfig, isDatabaseConnected as isConnectedFlag } from '../config/database';

// Global connection pool
let connectionPool: mysql.Pool | null = null;

/**
 * Initialize database connection pool with console logging
 */
export async function initializeDatabaseConnection(): Promise<boolean> {
  try {
    const startTime = Date.now();
    
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║   DATABASE CONNECTION INITIATING...    ║');
    console.log('╚════════════════════════════════════════╝\n');
    
    console.log(`📡 Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`📊 Database: ${dbConfig.database}`);
    console.log(`👤 User: ${dbConfig.user}`);
    console.log(`⚙️  Connection Limit: ${dbConfig.connectionLimit}`);
    console.log('');
    
    // Create connection pool
    connectionPool = mysql.createPool({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      connectionLimit: dbConfig.connectionLimit,
      waitForConnections: true,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });

    // Test the connection
    const connection = await connectionPool.getConnection();
    
    const connectionTime = Date.now() - startTime;
    
    console.log('✅ DATABASE CONNECTION SUCCESSFUL');
    console.log(`⏱️  Connection established in ${connectionTime}ms\n`);
    
    // Get server info
    const result = await connection.query('SELECT VERSION() as version');
    const version = (result[0] as any)[0]?.version || 'Unknown';
    
    console.log(`📌 MySQL Version: ${version}`);
    console.log(`✨ Status: CONNECTED\n`);
    
    console.log('╔════════════════════════════════════════╗');
    console.log('║    READY TO PROCESS REQUESTS           ║');
    console.log('╚════════════════════════════════════════╝\n');
    
    connection.release();
    return true;

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║  ❌ DATABASE CONNECTION FAILED          ║');
    console.log('╚════════════════════════════════════════╝\n');
    
    console.error('❌ Error Details:');
    console.error(`   ${errorMsg}\n`);
    
    console.log('📝 Troubleshooting Steps:');
    console.log('   1. Ensure MySQL is running');
    console.log(`   2. Verify host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`   3. Check credentials: user=${dbConfig.user}`);
    console.log(`   4. Confirm database exists: ${dbConfig.database}`);
    console.log('   5. Check firewall/network settings\n');
    
    return false;
  }
}

/**
 * Get database connection pool
 */
export function getConnectionPool(): mysql.Pool | null {
  return connectionPool;
}

/**
 * Close database connections
 */
export async function closeDatabaseConnection(): Promise<void> {
  if (connectionPool) {
    await connectionPool.end();
    console.log('🔌 Database connection pool closed');
  }
}

/**
 * Execute a database query
 */
export async function executeQuery<T = any>(
  query: string,
  values?: any[]
): Promise<T[]> {
  if (!connectionPool) {
    throw new Error('Database connection pool not initialized');
  }

  const connection = await connectionPool.getConnection();
  try {
    const [results] = await connection.execute(query, values);
    return results as T[];
  } finally {
    connection.release();
  }
}

/**
 * Check database connection status
 */
export async function checkDatabaseStatus(): Promise<{
  connected: boolean;
  host: string;
  port: number;
  database: string;
  version?: string;
  error?: string;
}> {
  const status = {
    connected: false,
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
  };

  try {
    if (!connectionPool) {
      return { ...status, error: 'Connection pool not initialized' };
    }

    const connection = await connectionPool.getConnection();
    const result = await connection.query('SELECT VERSION() as version');
    const version = (result[0] as any)[0]?.version || 'Unknown';
    
    connection.release();

    return {
      ...status,
      connected: true,
      version,
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    return { ...status, error: errorMsg };
  }
}
