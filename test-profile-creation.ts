import { createClient } from '@supabase/supabase-js';
import type { Database } from './src/integrations/supabase/types';

// Use service role key for testing
const supabase = createClient<Database>(
  "https://dzkaukcjeunqxqpzsswc.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

async function testProfileCreation() {
  // Generate a valid UUID for testing
  const testProfile = {
    id: crypto.randomUUID(),
    full_name: 'Test Student',
    school_name: 'Test University',
    major: 'Computer Science',
    graduation_year: 2025
  };

  console.log('Attempting to create test profile:', testProfile);

  try {
    // First try to create the profile
    const { data: insertData, error: insertError } = await supabase
      .from('profiles')
      .insert([testProfile])
      .select();

    if (insertError) {
      console.error('Error creating profile:', insertError);
      return;
    }

    console.log('Profile created successfully:', insertData);

    // Verify we can fetch the profile
    const { data: fetchData, error: fetchError } = await supabase
      .from('profiles')
      .select()
      .eq('id', testProfile.id)
      .single();

    if (fetchError) {
      console.error('Error fetching profile:', fetchError);
      return;
    }

    console.log('Profile fetched successfully:', fetchData);

    // Clean up the test data
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', testProfile.id);

    if (deleteError) {
      console.error('Error cleaning up test data:', deleteError);
    } else {
      console.log('Test data cleaned up successfully');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testProfileCreation().catch(console.error);
