-- Create service_images table to manage service images
CREATE TABLE IF NOT EXISTS service_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_slug TEXT NOT NULL UNIQUE,
  service_title TEXT NOT NULL,
  image_url TEXT,
  image_path TEXT, -- Path in storage bucket
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE service_images ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read service images (for public display)
CREATE POLICY "Service images are viewable by everyone" ON service_images
  FOR SELECT USING (true);

-- Policy: Only admins and staff can insert/update/delete
CREATE POLICY "Service images are manageable by admins and staff" ON service_images
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin', 'staff')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin', 'staff')
    )
  );

-- Create storage bucket for service images if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for service-images bucket
CREATE POLICY "Service images are viewable by everyone" ON storage.objects
  FOR SELECT USING (bucket_id = 'service-images');

CREATE POLICY "Service images are uploadable by admins and staff" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'service-images' AND
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Service images are updatable by admins and staff" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'service-images' AND
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin', 'staff')
    )
  );

CREATE POLICY "Service images are deletable by admins and staff" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'service-images' AND
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin', 'staff')
    )
  );

-- Insert default service slugs (will be updated via admin)
INSERT INTO service_images (service_slug, service_title, alt_text)
VALUES
  ('websites', 'Custom Websites', 'Custom website illustration'),
  ('web-apps', 'Web Applications', 'Web application illustration'),
  ('dashboards', 'Dashboards', 'Dashboard illustration'),
  ('ecommerce', 'E-Commerce', 'E-commerce illustration'),
  ('portfolios', 'Portfolio Making', 'Portfolio illustration'),
  ('repair', 'Site Repair', 'Site repair illustration'),
  ('maintenance', 'Maintenance', 'Maintenance illustration')
ON CONFLICT (service_slug) DO NOTHING;

