const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://dzkaukcjeunqxqpzsswc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6a2F1a2NqZXVucXhxcHpzc3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1ODI2MjUsImV4cCI6MjA1MzE1ODYyNX0.TxCRzsdp9SrSW33eTwF9caWx8ZOVut_tAKjfZlGXAXA"
);

async function testProfileCreation() {
  const testProfile = {
    id: 'test-user-id',
    full_name: 'Test User',
    school_name: 'Test University',
    major: 'Computer Science',
    graduation_year: 2025
  };

  console.log('Attempting to create test profile:', testProfile);

  const { data, error } = await supabase
    .from('profiles')
    .insert([testProfile])
    .select();

  if (error) {
    console.error('Error creating profile:', error);
    return;
  }

  console.log('Profile created successfully:', data);

  // Clean up the test data
  const { error: deleteError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', 'test-user-id');

  if (deleteError) {
    console.error('Error cleaning up test data:', deleteError);
  } else {
    console.log('Test data cleaned up successfully');
  }
}

testProfileCreation().catch(console.error);
