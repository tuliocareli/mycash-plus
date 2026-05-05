import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const DEMO2_EMAIL = 'demo2@purso.app';
const DEMO2_PASSWORD = 'PursoDemo2026!';

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 1. Find or create the Demo 2 user
    let userId;
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) throw listError;
    
    const demoUser = existingUsers.users.find(u => u.email === DEMO2_EMAIL);
    
    if (demoUser) {
      userId = demoUser.id;
    } else {
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: DEMO2_EMAIL,
        password: DEMO2_PASSWORD,
        email_confirm: true,
        user_metadata: { name: 'Demo 2 (Legacy)' },
      });

      if (createError) throw createError;
      userId = newUser.user.id;
    }

    // 2. Clean existing demo data (no accounts, no transactions)
    await supabase.from('notification_preferences').delete().eq('user_id', userId);
    await supabase.from('transactions').delete().eq('user_id', userId);
    await supabase.from('goals').delete().eq('user_id', userId);
    await supabase.from('accounts').delete().eq('user_id', userId);
    await supabase.from('categories').delete().eq('user_id', userId);
    await supabase.from('family_members').delete().eq('user_id', userId);
    await supabase.from('users').delete().eq('id', userId);

    // 3. Seed basic profile (set has_seen_onboarding to true so it doesn't auto-create accounts)
    await supabase.from('users').insert({
      id: userId,
      email: DEMO2_EMAIL,
      name: 'Demo 2 (Legacy)',
      has_seen_onboarding: true,
      closing_day: 1,
    });

    return new Response(JSON.stringify({ success: true, userId }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
