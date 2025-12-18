import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PresignRequest {
  bucket: string;
  path: string;
  file_type?: string;
  file_size?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: PresignRequest = await req.json();
    console.log('Presign request:', body);

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (body.file_size && body.file_size > maxSize) {
      return new Response(
        JSON.stringify({ error: 'File size exceeds maximum allowed size (10MB)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate presigned URL
    const { data, error } = await supabase.storage
      .from(body.bucket)
      .createSignedUploadUrl(body.path, {
        upsert: false,
      });

    if (error) {
      console.error('Error creating presigned URL:', error);
      throw error;
    }

    return new Response(
      JSON.stringify({
        success: true,
        url: data.signedUrl,
        path: data.path,
        token: data.token,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in presign-upload:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
