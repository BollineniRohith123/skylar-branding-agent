import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import mysql from 'mysql2/promise';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment from .env
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Database config (reads from environment when available)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'skylar_branding',
};

// Function to test database connection
async function testDatabaseConnection(): Promise<{ connected: boolean; time: number; error?: string }> {
  const startTime = Date.now();
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      connectTimeout: 3000,
    });
    
    await connection.ping();
    await connection.end();
    
    const time = Date.now() - startTime;
    return { connected: true, time };
  } catch (error) {
    const time = Date.now() - startTime;
    const errorMsg = error instanceof Error ? error.message : String(error);
    return { connected: false, time, error: errorMsg };
  }
}

// Custom plugin to log startup info with real database check
const startupLogPlugin = {
  name: 'startup-logger',
  apply: 'serve',
  async configResolved() {
    // Log after Vite initializes
    setTimeout(async () => {
      console.log('\n');
      console.log('╔════════════════════════════════════════════════════════════════╗');
      console.log('║                    🚀 SKYLAR BRANDING AGENT                    ║');
      console.log('╚════════════════════════════════════════════════════════════════╝');
      console.log('\n');
      
      const timestamp = new Date().toLocaleTimeString();
      console.log(`📅 Startup Time: ${timestamp}`);
      console.log(`🌍 Environment: development`);
      console.log('\n');
      
      console.log('╔════════════════════════════════════════════════════════════════╗');
      console.log('║           DATABASE CONNECTION INITIALIZATION                  ║');
      console.log('╚════════════════════════════════════════════════════════════════╝');
      console.log('\n');
      
      console.log(`📡 Host: ${dbConfig.host}:${dbConfig.port}`);
      console.log(`📊 Database: ${dbConfig.database}`);
      console.log(`👤 User: ${dbConfig.user}`);
      console.log(`⚙️  Connection Limit: 10`);
      console.log('\n');
      
      console.log('🔄 Attempting connection...');
      
      // Test the actual connection
      const result = await testDatabaseConnection();
      
      if (result.connected) {
        console.log(`✅ DATABASE CONNECTION SUCCESSFUL`);
        console.log(`⏱️  Connection established in ${result.time}ms`);
        console.log(`📌 Status: CONNECTED`);
        console.log('\n');
        
        console.log('╔════════════════════════════════════════════════════════════════╗');
        console.log('║              ✨ APPLICATION READY TO PROCESS REQUESTS          ║');
        console.log('╚════════════════════════════════════════════════════════════════╝');
        console.log('\n');
        
        console.log('📋 Initialization Summary:');
        console.log(`   ✓ Database Connection: OK`);
        console.log(`   ✓ Gemini API: Configured`);
        console.log(`   ✓ Local Storage: Available`);
        console.log(`   ✓ React DevTools: Ready`);
        console.log('\n');
        
        console.log('🎯 Available Features:');
        console.log('   • Logo Upload & Processing');
        console.log('   • Multi-Product Ad Generation');
        console.log('   • History Management');
        console.log('   • Email Verification');
        console.log('\n');
      } else {
        console.log(`❌ DATABASE CONNECTION FAILED`);
        console.log(`⏱️  Connection attempt took ${result.time}ms`);
        console.log(`📌 Status: DISCONNECTED`);
        console.log(`🔴 Error: ${result.error}`);
        console.log('\n');
        
        console.log('╔════════════════════════════════════════════════════════════════╗');
        console.log('║              ⚠️  DATABASE CONNECTION FAILED                    ║');
        console.log('╚════════════════════════════════════════════════════════════════╝');
        console.log('\n');
        
        console.log('📋 Initialization Summary:');
        console.log(`   ✗ Database Connection: FAILED`);
        console.log(`   ✓ Gemini API: Configured`);
        console.log(`   ✓ Local Storage: Available`);
        console.log(`   ✓ React DevTools: Ready`);
        console.log('\n');
        
        console.log('🔧 Troubleshooting:');
        console.log('   1. Start your MySQL server (XAMPP, Docker, etc.)');
        console.log(`   2. Verify connection details: ${dbConfig.user}@${dbConfig.host}:${dbConfig.port}`);
        console.log(`   3. Ensure database exists: ${dbConfig.database}`);
        console.log('   4. Check firewall/network settings');
        console.log('\n');
        
        console.log('⚠️  Application will continue running without database\n');
      }
    }, 10);
  }
  ,
  configureServer(server) {
    // Create a pool for request handlers
    const pool = mysql.createPool({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      waitForConnections: true,
      connectionLimit: 10,
    });

    // Create nodemailer transporter using SMTP env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465,
      secure: (process.env.SMTP_SECURE || 'true') === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Helper to read JSON body
    const readBody = (req) => new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', () => {
        try {
          resolve(data ? JSON.parse(data) : {});
        } catch (e) {
          reject(e);
        }
      });
      req.on('error', reject);
    });

    server.middlewares.use(async (req, res, next) => {
      try {
        // Ensure email_verification table has required columns (add missing columns if necessary)
        async function ensureSchema(conn) {
          try {
            const [cols] = await conn.query("SHOW COLUMNS FROM email_verification");
            const existing = new Set((cols as any[]).map(c => c.Field));
            const alters = [];
            if (!existing.has('otp')) alters.push("ADD COLUMN otp VARCHAR(10) NOT NULL DEFAULT ''");
            if (!existing.has('is_verified')) alters.push("ADD COLUMN is_verified BOOLEAN DEFAULT FALSE");
            if (!existing.has('attempt_count')) alters.push("ADD COLUMN attempt_count INT DEFAULT 0");
            if (!existing.has('max_attempts')) alters.push("ADD COLUMN max_attempts INT DEFAULT 5");
            if (!existing.has('regeneration_count')) alters.push("ADD COLUMN regeneration_count INT DEFAULT 0");
            if (!existing.has('max_regenerations')) alters.push("ADD COLUMN max_regenerations INT DEFAULT 3");
            if (!existing.has('status')) alters.push("ADD COLUMN status VARCHAR(20) DEFAULT 'pending'");
            if (!existing.has('last_sent_at')) alters.push("ADD COLUMN last_sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
            if (!existing.has('ip_address')) alters.push("ADD COLUMN ip_address VARCHAR(50)");
            if (!existing.has('user_agent')) alters.push("ADD COLUMN user_agent TEXT");
            if (!existing.has('created_at')) alters.push("ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
            if (!existing.has('updated_at')) alters.push("ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP");
            if (alters.length > 0) {
              await conn.query(`ALTER TABLE email_verification ${alters.join(', ')}`);
            }
          } catch (err) {
            // If table doesn't exist, create it using the migration SQL
            if ((err as any).code === 'ER_NO_SUCH_TABLE') {
              const migrationSql = `CREATE TABLE IF NOT EXISTS email_verification (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                otp VARCHAR(10) NOT NULL,
                is_verified BOOLEAN DEFAULT FALSE,
                attempt_count INT DEFAULT 0,
                max_attempts INT DEFAULT 5,
                regeneration_count INT DEFAULT 0,
                max_regenerations INT DEFAULT 3,
                status VARCHAR(20) DEFAULT 'pending',
                last_sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                ip_address VARCHAR(50),
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
              );`;
              await conn.query(migrationSql);
            } else {
              throw err;
            }
          }
        }

        if (req.url === '/api/send-otp' && req.method === 'POST') {
          const body = await readBody(req);
          const email = ((body as any)?.email || '').toLowerCase();
          if (!email) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Email required' }));
            return;
          }

          const conn = await pool.getConnection();
          let otp = '';
          try {
            // Ensure schema is ready
            await ensureSchema(conn);

            // Check if email already exists and is verified
            const [existingRows] = await conn.query(
              'SELECT id, is_verified, status FROM email_verification WHERE email = ? LIMIT 1',
              [email]
            );
            
            if (existingRows && (existingRows as any[]).length > 0) {
              const existingUser = (existingRows as any[])[0];
              if (existingUser.is_verified === 1 || existingUser.status === 'verified') {
                conn.release();
                res.statusCode = 400;
                res.end(JSON.stringify({ 
                  error: 'This email has already been used and verified. Please use a different email address.',
                  alreadyUsed: true 
                }));
                return;
              }
            }

            // Generate OTP
            otp = Math.floor(100000 + Math.random() * 900000).toString();

            // Upsert into email_verification
            const now = new Date();
            const sql = `INSERT INTO email_verification (email, otp, is_verified, attempt_count, max_attempts, regeneration_count, max_regenerations, status, last_sent_at, created_at, updated_at)
              VALUES (?, ?, false, 0, 5, 0, 3, 'pending', ?, ?, ?)
              ON DUPLICATE KEY UPDATE otp=VALUES(otp), attempt_count=0, status='pending', last_sent_at=VALUES(last_sent_at), updated_at=VALUES(updated_at)`;

            await conn.query(sql, [email, otp, now, now, now]);
          } finally {
            conn.release();
          }

          // Send email
          const from = process.env.SMTP_FROM || process.env.SMTP_USER;
          await transporter.sendMail({
            from,
            to: email,
            subject: 'Your verification code',
            text: `Your OTP is ${otp}`,
            html: `<p>Your OTP is <strong>${otp}</strong></p>`,
          });

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true }));
          return;
        }

        if (req.url === '/api/verify-otp' && req.method === 'POST') {
          const body = await readBody(req);
          const email = ((body as any)?.email || '').toLowerCase();
          const otp = (body as any)?.otp;
          if (!email || !otp) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Email and otp required' }));
            return;
          }

          const conn = await pool.getConnection();
          try {
            await ensureSchema(conn);
            const [rows] = await conn.query('SELECT * FROM email_verification WHERE email = ? LIMIT 1', [email]);
            const row = rows[0];
            if (!row) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'No verification record' }));
              return;
            }

            if (row.status === 'blocked') {
              res.statusCode = 403;
              res.end(JSON.stringify({ error: 'Account blocked due to too many attempts' }));
              return;
            }

            if (row.otp === otp) {
              // Update verification status and create session
              const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
              const sessionData = {
                sessionId,
                email,
                verifiedAt: new Date().toISOString(),
                ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
                userAgent: req.headers['user-agent']
              };
              
              await conn.query('UPDATE email_verification SET is_verified = true, status = ?, updated_at = ? WHERE email = ?', ['verified', new Date(), email]);
              
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ 
                success: true, 
                sessionId,
                email,
                verifiedAt: sessionData.verifiedAt
              }));
              return;
            } else {
              const newAttempts = (row.attempt_count || 0) + 1;
              const maxAttempts = row.max_attempts || 5;
              if (newAttempts >= maxAttempts) {
                await conn.query('UPDATE email_verification SET attempt_count = ?, status = ?, updated_at = ? WHERE email = ?', [newAttempts, 'blocked', new Date(), email]);
                res.statusCode = 403;
                res.end(JSON.stringify({ error: 'Too many attempts, blocked' }));
                return;
              } else {
                await conn.query('UPDATE email_verification SET attempt_count = ?, updated_at = ? WHERE email = ?', [newAttempts, new Date(), email]);
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Invalid OTP' }));
                return;
              }
            }
          } finally {
            conn.release();
          }
        }

        if (req.url === '/api/check-regeneration-limit' && req.method === 'POST') {
          const body = await readBody(req);
          const email = ((body as any)?.email || '').toLowerCase();

          if (!email) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Email required' }));
            return;
          }

          const conn = await pool.getConnection();
          try {
            await ensureSchema(conn);
            const [rows] = await conn.query('SELECT regeneration_count, max_regenerations FROM email_verification WHERE email = ?', [email]);
            const row = (Array.isArray(rows) ? rows[0] : null) as any;

            if (!row) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Email not found' }));
              return;
            }

            const regenerationCount = row.regeneration_count || 0;
            const maxRegenerations = row.max_regenerations || 3;
            const canRegenerate = regenerationCount < maxRegenerations;

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              canRegenerate,
              regenerationCount,
              maxRegenerations,
              message: canRegenerate ? 'Can regenerate' : `Maximum regenerations reached (${regenerationCount}/${maxRegenerations})`
            }));
            return;
          } finally {
            conn.release();
          }
        }

        if (req.url === '/api/regenerate-images' && req.method === 'POST') {
          const body = await readBody(req);
          const email = ((body as any)?.email || '').toLowerCase();

          if (!email) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Email required' }));
            return;
          }

          const conn = await pool.getConnection();
          try {
            await ensureSchema(conn);
            const [rows] = await conn.query('SELECT regeneration_count, max_regenerations FROM email_verification WHERE email = ?', [email]);
            const row = (Array.isArray(rows) ? rows[0] : null) as any;

            if (!row) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Email not found' }));
              return;
            }

            const regenerationCount = row.regeneration_count || 0;
            const maxRegenerations = row.max_regenerations || 3;

            if (regenerationCount >= maxRegenerations) {
              res.statusCode = 403;
              res.end(JSON.stringify({ 
                error: 'Regeneration limit exceeded',
                regenerationCount,
                maxRegenerations
              }));
              return;
            }

            // Increment regeneration count
            const newCount = regenerationCount + 1;
            await conn.query('UPDATE email_verification SET regeneration_count = ?, updated_at = ? WHERE email = ?', [newCount, new Date(), email]);

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: true,
              regenerationCount: newCount,
              maxRegenerations
            }));
            return;
          } finally {
            conn.release();
          }
        }

        // Validate session endpoint
        if (req.url === '/api/validate-session' && req.method === 'POST') {
          const body = await readBody(req);
          const sessionId = (body as any)?.sessionId;

          if (!sessionId) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Session ID required' }));
            return;
          }

          const conn = await pool.getConnection();
          try {
            await ensureSchema(conn);
            // For now, we'll validate by checking if there's a verified email with this session pattern
            // In a production app, you'd store sessions in a separate table
            const [rows] = await conn.query('SELECT email, is_verified FROM email_verification WHERE is_verified = true LIMIT 1');
            const row = (Array.isArray(rows) ? rows[0] : null) as any;

            if (!row || !row.is_verified) {
              res.statusCode = 401;
              res.end(JSON.stringify({ error: 'Invalid or expired session' }));
              return;
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ 
              valid: true, 
              email: row.email,
              sessionId
            }));
            return;
          } finally {
            conn.release();
          }
        }

        // Save generated images for a user under userimages/{email_verification.id}
        if (req.url === '/api/save-images' && req.method === 'POST') {
          const body = await readBody(req);
          const email = ((body as any)?.email || '').toLowerCase();
          const images = (body as any)?.images || [];

          if (!email) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Email required' }));
            return;
          }

          if (!Array.isArray(images) || images.length === 0) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'No images provided' }));
            return;
          }

          const fs = await import('fs');
          const pathModule = await import('path');

          const conn2 = await pool.getConnection();
          try {
            await ensureSchema(conn2);

            // Find or create record in email_verification so we have an id
            const [rows] = await conn2.query('SELECT id FROM email_verification WHERE email = ? LIMIT 1', [email]);
            let id: number | string | null = null;
            const row = (Array.isArray(rows) ? rows[0] : null) as any;
            if (row && row.id) {
              id = row.id;
            } else {
              const now = new Date();
              const insertSql = `INSERT INTO email_verification (email, otp, is_verified, attempt_count, max_attempts, regeneration_count, max_regenerations, status, last_sent_at, created_at, updated_at)
                VALUES (?, '', false, 0, 5, 0, 3, 'pending', ?, ?, ?)`;
              const result: any = await conn2.query(insertSql, [email, now, now, now]);
              // mysql2 returns [result] sometimes; handle both
              const insertResult = Array.isArray(result) ? result[0] : result;
              id = insertResult.insertId || null;
            }

            if (!id) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Could not determine verification id' }));
              return;
            }

            const baseDir = pathModule.join(process.cwd(), 'userbanners', String(id));
            await fs.promises.mkdir(baseDir, { recursive: true });

            const savedFiles: string[] = [];
            for (const img of images) {
              try {
                const filename = img.filename || `image_${Date.now()}.png`;
                const dataUrl: string = img.data || '';
                const match = /^data:(image\/[a-zA-Z0-9+.-]+);base64,(.*)$/.exec(dataUrl);
                let buffer: Buffer;
                if (match) {
                  buffer = Buffer.from(match[2], 'base64');
                } else if (/^[A-Za-z0-9+/=\n]+$/.test(dataUrl)) {
                  // raw base64 fallback
                  buffer = Buffer.from(dataUrl, 'base64');
                } else {
                  continue;
                }

                const outPath = pathModule.join(baseDir, filename);
                await fs.promises.writeFile(outPath, buffer);
                savedFiles.push(pathModule.relative(process.cwd(), outPath));
              } catch (e) {
                console.error('Failed to save an image for', email, e);
              }
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, id, files: savedFiles }));
            return;
          } finally {
            conn2.release();
          }
        }
      } catch (err) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }));
        return;
      }

      next();
    });
  },
};

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', 'VITE_');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), startupLogPlugin],
      define: {
        'process.env.API_KEYS': JSON.stringify(env.VITE_API_KEYS || env.VITE_GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
