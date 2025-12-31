import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // All users to create
    const users = [
      // Missing clients (4-10)
      { email: 'client4@example.com', password: 'Client123!', role: 'client', name: 'Client Four', company: 'Client Four Company', phone: '+1234567893', code: 'CLI004' },
      { email: 'client5@example.com', password: 'Client123!', role: 'client', name: 'Client Five', company: 'Client Five Company', phone: '+1234567894', code: 'CLI005' },
      { email: 'client6@example.com', password: 'Client123!', role: 'client', name: 'Client Six', company: 'Client Six Company', phone: '+1234567895', code: 'CLI006' },
      { email: 'client7@example.com', password: 'Client123!', role: 'client', name: 'Client Seven', company: 'Client Seven Company', phone: '+1234567896', code: 'CLI007' },
      { email: 'client8@example.com', password: 'Client123!', role: 'client', name: 'Client Eight', company: 'Client Eight Company', phone: '+1234567897', code: 'CLI008' },
      { email: 'client9@example.com', password: 'Client123!', role: 'client', name: 'Client Nine', company: 'Client Nine Company', phone: '+1234567898', code: 'CLI009' },
      { email: 'client10@example.com', password: 'Client123!', role: 'client', name: 'Client Ten', company: 'Client Ten Company', phone: '+1234567899', code: 'CLI010' },
      // All staff (1-10)
      { email: 'staff1@example.com', password: 'Staff123!', role: 'staff', name: 'Staff One', company: 'Dubiqo', phone: '+1234567800' },
      { email: 'staff2@example.com', password: 'Staff123!', role: 'staff', name: 'Staff Two', company: 'Dubiqo', phone: '+1234567801' },
      { email: 'staff3@example.com', password: 'Staff123!', role: 'staff', name: 'Staff Three', company: 'Dubiqo', phone: '+1234567802' },
      { email: 'staff4@example.com', password: 'Staff123!', role: 'staff', name: 'Staff Four', company: 'Dubiqo', phone: '+1234567803' },
      { email: 'staff5@example.com', password: 'Staff123!', role: 'staff', name: 'Staff Five', company: 'Dubiqo', phone: '+1234567804' },
      { email: 'staff6@example.com', password: 'Staff123!', role: 'staff', name: 'Staff Six', company: 'Dubiqo', phone: '+1234567805' },
      { email: 'staff7@example.com', password: 'Staff123!', role: 'staff', name: 'Staff Seven', company: 'Dubiqo', phone: '+1234567806' },
      { email: 'staff8@example.com', password: 'Staff123!', role: 'staff', name: 'Staff Eight', company: 'Dubiqo', phone: '+1234567807' },
      { email: 'staff9@example.com', password: 'Staff123!', role: 'staff', name: 'Staff Nine', company: 'Dubiqo', phone: '+1234567808' },
      { email: 'staff10@example.com', password: 'Staff123!', role: 'staff', name: 'Staff Ten', company: 'Dubiqo', phone: '+1234567809' },
    ]

    const results = []
    
    for (const user of users) {
      try {
        // Check if user already exists
        const { data: existing } = await supabase.auth.admin.getUserByEmail(user.email)
        
        if (existing?.user) {
          console.log(`User ${user.email} already exists, skipping...`)
          results.push({ 
            email: user.email, 
            status: 'exists', 
            user_id: existing.user.id 
          })
          
          // Still create/update profile and role
          await createProfileAndRole(supabase, existing.user.id, user)
          continue
        }

        // Create user
        const { data, error } = await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
        })

        if (error) {
          console.error(`Error creating ${user.email}:`, error)
          results.push({ 
            email: user.email, 
            status: 'error', 
            error: error.message 
          })
        } else {
          console.log(`Created user ${user.email}`)
          results.push({ 
            email: user.email, 
            status: 'created', 
            user_id: data.user.id 
          })
          
          // Create profile and assign role
          await createProfileAndRole(supabase, data.user.id, user)
        }
      } catch (err: any) {
        console.error(`Exception creating ${user.email}:`, err)
        results.push({ 
          email: user.email, 
          status: 'error', 
          error: err.message 
        })
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        created: results.filter(r => r.status === 'created').length,
        existing: results.filter(r => r.status === 'exists').length,
        errors: results.filter(r => r.status === 'error').length,
        results 
      }, null, 2),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: any) {
    console.error('Fatal error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function createProfileAndRole(supabase: any, userId: string, user: any) {
  try {
    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: user.email,
        full_name: user.name,
        company_name: user.company,
        phone: user.phone,
        client_code: user.code || null,
      })

    if (profileError) {
      console.error(`Error creating profile for ${user.email}:`, profileError)
    }

    // Assign role
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: user.role,
      }, {
        onConflict: 'user_id,role'
      })

    if (roleError) {
      console.error(`Error assigning role for ${user.email}:`, roleError)
    }
  } catch (err) {
    console.error(`Error in createProfileAndRole for ${user.email}:`, err)
  }
}

