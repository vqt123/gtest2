import { pool } from './pool';
import fs from 'fs/promises';
import path from 'path';

export async function initDatabase() {
  try {
    console.log('Initializing database...');
    
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf-8');
    
    await pool.query(schema);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}