import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://dzkaukcjeunqxqpzsswc.supabase.co";

// Use service role key for admin access
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkUsers() {
  console.log("Checking registered users...");
  
  try {
    // Get auth users with emails
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) {
      console.error("Error fetching auth users:", authError.message);
      return;
    }

    // Get profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    if (profilesError) {
      console.error("Error fetching profiles:", profilesError.message);
      return;
    }

    // Get user roles
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*');
    if (rolesError) {
      console.error("Error fetching roles:", rolesError.message);
      return;
    }

    // Combine data
    const combinedData = authUsers.users.map(user => {
      const profile = profiles.find(p => p.id === user.id);
      const role = roles?.find(r => r.user_id === user.id);
      
      return {
        id: user.id,
        email: user.email,
        emailConfirmed: user.email_confirmed_at !== null,
        created_at: user.created_at,
        profile: {
          full_name: profile?.full_name,
          school_name: profile?.school_name,
          major: profile?.major,
          graduation_year: profile?.graduation_year
        },
        role: role?.role || 'user'
      };
    });

    console.log("\nUser Information:");
    console.log(JSON.stringify(combinedData, null, 2));
    
    console.log("\nSummary:");
    console.log(`Total Users: ${combinedData.length}`);
    console.log(`Confirmed Emails: ${combinedData.filter(u => u.emailConfirmed).length}`);
    console.log(`Profiles Created: ${profiles.length}`);

  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

checkUsers().catch(console.error);
