import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const PermissionsTester = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, message]);
    console.log(message); // Also log to console for debugging
  };

  const testProjects = async () => {
    try {
      // Test project creation
      const { data: newProject, error: createError } = await supabase
        .from('projects')
        .insert({
          title: 'Test Project',
          description: 'Testing permissions',
          category: 'Development',
          deadline: new Date().toISOString().split('T')[0],
          skills: ['testing'],
          owner_id: user?.id
        })
        .select()
        .single();

      if (createError) throw createError;
      addResult('✅ Successfully created a project');

      // Test project reading
      const { data: projects, error: readError } = await supabase
        .from('projects')
        .select('*');

      if (readError) throw readError;
      addResult(`✅ Successfully read ${projects?.length} projects`);

      // Test project update (own project)
      if (newProject) {
        const { error: updateError } = await supabase
          .from('projects')
          .update({ title: 'Updated Test Project' })
          .eq('id', newProject.id);

        if (updateError) throw updateError;
        addResult('✅ Successfully updated own project');

        // Test project deletion (own project)
        const { error: deleteError } = await supabase
          .from('projects')
          .delete()
          .eq('id', newProject.id);

        if (deleteError) throw deleteError;
        addResult('✅ Successfully deleted own project');
      }
    } catch (error: any) {
      addResult(`❌ Project test failed: ${error.message}`);
    }
  };

  const testProfiles = async () => {
    try {
      // Test profile reading (all profiles)
      const { data: profiles, error: readError } = await supabase
        .from('profiles')
        .select('*');

      if (readError) throw readError;
      addResult(`✅ Successfully read ${profiles?.length} profiles`);

      // Test profile update (own profile)
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ full_name: 'Test Name Update' })
        .eq('id', user?.id);

      if (updateError) throw updateError;
      addResult('✅ Successfully updated own profile');

    } catch (error: any) {
      addResult(`❌ Profile test failed: ${error.message}`);
    }
  };

  const testNewsletter = async () => {
    try {
      // Test newsletter subscription
      const testEmail = `test_${Date.now()}@example.com`;
      const { error: subscribeError } = await supabase
        .from('newsletter_subscriptions')
        .insert({ email: testEmail });

      if (subscribeError) throw subscribeError;
      addResult('✅ Successfully subscribed to newsletter');

      // Test reading subscriptions
      const { data: subscriptions, error: readError } = await supabase
        .from('newsletter_subscriptions')
        .select('*');

      if (readError) throw readError;
      addResult(`✅ Successfully read ${subscriptions?.length} subscriptions`);

    } catch (error: any) {
      addResult(`❌ Newsletter test failed: ${error.message}`);
    }
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900">Permissions Tester</h2>
      
      <div className="flex flex-wrap gap-4">
        <Button onClick={testProjects}>
          Test Project Permissions
        </Button>
        <Button onClick={testProfiles}>
          Test Profile Permissions
        </Button>
        <Button onClick={testNewsletter}>
          Test Newsletter Permissions
        </Button>
        <Button variant="outline" onClick={clearResults}>
          Clear Results
        </Button>
      </div>

      <div className="mt-4 space-y-2">
        <h3 className="font-semibold text-gray-700">Test Results:</h3>
        <div className="bg-gray-50 p-4 rounded-md space-y-2">
          {results.length === 0 ? (
            <p className="text-gray-500">No tests run yet</p>
          ) : (
            results.map((result, index) => (
              <div key={index} className="font-mono text-sm">
                {result}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};