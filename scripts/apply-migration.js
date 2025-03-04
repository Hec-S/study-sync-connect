import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read environment variables from .env file
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = envContent.split('\n').reduce((acc, line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      acc[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
    }
    return acc;
  }, {});
  
  Object.entries(envVars).forEach(([key, value]) => {
    process.env[key] = value;
  });
}

// Get Supabase credentials
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase credentials. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY are set in your .env file.');
  process.exit(1);
}

// Initialize Supabase client with service role key for admin privileges
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Read the migration file
const migrationPath = path.resolve(__dirname, '../supabase/migrations/20250303_create_professor_ratings.sql');
const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

// Apply the migration
async function applyMigration() {
  console.log('Applying migration...');
  
  try {
    // Execute the SQL directly
    const { error } = await supabase.rpc('pgmigrate', { query: migrationSQL });
    
    if (error) {
      // If pgmigrate function doesn't exist, try another approach
      console.log('pgmigrate function not available, trying direct SQL execution...');
      
      // Split the SQL into separate statements
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);
      
      // Execute each statement
      for (const stmt of statements) {
        const { error } = await supabase.rpc('pg_execute', { query: stmt + ';' });
        if (error) {
          console.error('Error executing statement:', error);
          console.error('Statement:', stmt);
          
          // If pg_execute also doesn't exist, we can't apply the migration directly
          console.error('Cannot apply migration directly. Please apply it manually through the Supabase dashboard.');
          process.exit(1);
        }
      }
      
      console.log('Migration applied successfully!');
    } else {
      console.log('Migration applied successfully!');
    }
  } catch (error) {
    console.error('Error applying migration:', error);
    console.error('Please apply the migration manually through the Supabase dashboard.');
    process.exit(1);
  }
}

applyMigration();
