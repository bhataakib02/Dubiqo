-- Update all services with high-quality, professional images
-- Using Unsplash URLs for high-resolution, professional stock images

-- Custom Websites - Modern web development
UPDATE services
SET 
  image_url = 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1920&q=80&auto=format&fit=crop',
  alt_text = 'Professional custom website development and design',
  updated_at = NOW()
WHERE slug = 'websites';

-- Web Applications - Full-stack development
UPDATE services
SET 
  image_url = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&q=80&auto=format&fit=crop',
  alt_text = 'Modern web application development and architecture',
  updated_at = NOW()
WHERE slug = 'web-apps';

-- Dashboards & Analytics - Data visualization
UPDATE services
SET 
  image_url = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80&auto=format&fit=crop',
  alt_text = 'Business analytics dashboard and data visualization',
  updated_at = NOW()
WHERE slug = 'dashboards';

-- E-Commerce - Online shopping platform
UPDATE services
SET 
  image_url = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80&auto=format&fit=crop',
  alt_text = 'E-commerce platform and online store development',
  updated_at = NOW()
WHERE slug = 'ecommerce';

-- Portfolio Making - Professional portfolio websites
UPDATE services
SET 
  image_url = 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1920&q=80&auto=format&fit=crop',
  alt_text = 'Professional portfolio website design and development',
  updated_at = NOW()
WHERE slug = 'portfolios';

-- Site Repair & Recovery - Technical support
UPDATE services
SET 
  image_url = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80&auto=format&fit=crop',
  alt_text = 'Website repair, bug fixing, and technical recovery services',
  updated_at = NOW()
WHERE slug = 'repair';

-- Ongoing Maintenance - Support and maintenance
UPDATE services
SET 
  image_url = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80&auto=format&fit=crop',
  alt_text = 'Website maintenance, updates, and ongoing support services',
  updated_at = NOW()
WHERE slug = 'maintenance';

-- Also update service_images table to match
INSERT INTO service_images (service_slug, service_title, image_url, alt_text, updated_at)
VALUES
  ('websites', 'Custom Websites', 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1920&q=80&auto=format&fit=crop', 'Professional custom website development and design', NOW()),
  ('web-apps', 'Web Applications', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&q=80&auto=format&fit=crop', 'Modern web application development and architecture', NOW()),
  ('dashboards', 'Dashboards & Analytics', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80&auto=format&fit=crop', 'Business analytics dashboard and data visualization', NOW()),
  ('ecommerce', 'E-Commerce Solutions', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80&auto=format&fit=crop', 'E-commerce platform and online store development', NOW()),
  ('portfolios', 'Portfolio Making', 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1920&q=80&auto=format&fit=crop', 'Professional portfolio website design and development', NOW()),
  ('repair', 'Site Repair & Recovery', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80&auto=format&fit=crop', 'Website repair, bug fixing, and technical recovery services', NOW()),
  ('maintenance', 'Ongoing Maintenance', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80&auto=format&fit=crop', 'Website maintenance, updates, and ongoing support services', NOW())
ON CONFLICT (service_slug) 
DO UPDATE SET
  image_url = EXCLUDED.image_url,
  alt_text = EXCLUDED.alt_text,
  updated_at = EXCLUDED.updated_at;

