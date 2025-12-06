#!/usr/bin/env node
/*
  Migration runner (ESM)
  - Looks for .sql files in the migrations directory
  - Executes them in filename sort order
  - Uses environment variables for DB connection, with sensible defaults

  Usage:
    npm run migrate

  Environment variables:
    DB_HOST (default: localhost)
    DB_PORT (default: 3306)
    DB_USER (default: root)
    DB_PASSWORD (default: empty)
    DB_NAME (default: skylar_branding)

*/

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

// Load environment variables from project root .env (if present)
dotenv.config({ path: path.join(process.cwd(), '.env') });

async function loadSqlFiles(dir) {
  const files = await fs.promises.readdir(dir);
  const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();
  return sqlFiles.map(f => ({ name: f, path: path.join(dir, f) }));
}

async function run() {
  try {
    const migrationsDir = path.join(new URL(import.meta.url).pathname, '..');
    const files = await loadSqlFiles(migrationsDir);

    if (files.length === 0) {
      console.log('No migration files found in', migrationsDir);
      process.exit(0);
    }

    const dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'skylar_branding',
      // Allow executing multiple statements from a .sql file
      multipleStatements: true,
    };

    console.log('Connecting to database', `${dbConfig.user}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);

    const start = Date.now();
    const connection = await mysql.createConnection(dbConfig);

    for (const file of files) {
      const sql = await fs.promises.readFile(file.path, 'utf8');
      console.log(`\n--- Running migration: ${file.name} ---`);
      try {
        await connection.query(sql);
        console.log(`✔ Applied ${file.name}`);
      } catch (err) {
        console.error(`✖ Failed to apply ${file.name}:`, err && err.message ? err.message : err);
        await connection.end();
        process.exit(1);
      }
    }

    await connection.end();
    const ms = Date.now() - start;
    console.log(`\nAll migrations applied successfully in ${ms}ms`);
    process.exit(0);
  } catch (err) {
    console.error('Migration runner failed:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

run();
