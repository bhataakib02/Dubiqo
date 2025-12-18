import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProjectRequest {
  title: string;
  description?: string;
  project_type: string;
  template_id?: string;
  client_id: string;
  budget?: number; // in paise
}

const PORTFOLIO_TEMPLATES = [
  {
    id: 'minimal-developer',
    title: 'Minimal Developer Portfolio',
    description: 'Clean, minimal design perfect for developers and engineers',
    project_type: 'portfolio',
    budget: 499900, // ₹4,999 in paise
  },
  {
    id: 'creative-designer',
    title: 'Creative Designer Portfolio',
    description: 'Bold, visual-focused design for designers and creatives',
    project_type: 'portfolio',
    budget: 599900, // ₹5,999 in paise
  },
  {
    id: 'professional-resume',
    title: 'Professional Resume Site',
    description: 'Corporate style perfect for job seekers and professionals',
    project_type: 'portfolio',
    budget: 399900, // ₹3,999 in paise
  },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: ProjectRequest = await req.json();
    console.log('Project create request:', body);

    // Get template details if template_id provided
    let projectData = {
      title: body.title,
      description: body.description || '',
      project_type: body.project_type,
      client_id: body.client_id,
      budget: body.budget || null,
      status: 'discovery',
      start_date: new Date().toISOString().split('T')[0],
    };

    if (body.template_id) {
      const template = PORTFOLIO_TEMPLATES.find(t => t.id === body.template_id);
      if (template) {
        projectData = {
          ...projectData,
          title: `${template.title} - Custom`,
          description: template.description,
          project_type: template.project_type,
          budget: template.budget,
        };
      }
    }

    // Create project record
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single();

    if (projectError) {
      console.error('Error creating project:', projectError);
      throw projectError;
    }

    console.log('Project created:', project);

    // Log audit entry
    await supabase.from('audit_logs').insert({
      user_id: body.client_id,
      entity_type: 'project',
      entity_id: project.id,
      action: 'created',
      changes: { template_id: body.template_id },
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        project,
        redirect_url: `/client-portal?tab=projects`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in projects-create:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
