-- Create services table to manage all service details
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  pricing_text TEXT,
  pricing_amount NUMERIC,
  icon_name TEXT, -- Store icon name (e.g., 'Globe', 'Layers', etc.)
  features TEXT[], -- Array of features
  benefits TEXT[], -- Array of benefits
  process_steps JSONB, -- Array of process steps {step, title, description}
  image_url TEXT,
  image_path TEXT, -- Path in storage bucket
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published services
CREATE POLICY "Services are viewable by everyone" ON services
  FOR SELECT USING (published = true);

-- Policy: Only admins and staff can insert/update/delete
CREATE POLICY "Services are manageable by admins and staff" ON services
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

-- Insert default services
INSERT INTO services (slug, title, description, short_description, pricing_text, pricing_amount, icon_name, features, benefits, process_steps, display_order, published)
VALUES
  (
    'websites',
    'Custom Websites',
    'Beautiful, responsive websites that convert visitors into customers. Built with modern technologies for speed, security, and SEO.',
    'Beautiful, responsive websites that convert visitors into customers.',
    'From ₹1,99,900',
    199900,
    'Globe',
    ARRAY[
      'Responsive design for all devices',
      'SEO optimization included',
      'Fast loading speeds',
      'Content management system',
      'Analytics integration',
      'Security best practices'
    ],
    ARRAY[
      'Increase brand credibility',
      'Generate more leads',
      'Improve user experience',
      'Rank higher on Google'
    ],
    '[
      {"step": "01", "title": "Discovery", "description": "We learn about your business, goals, and target audience."},
      {"step": "02", "title": "Design", "description": "Create wireframes and visual designs for your approval."},
      {"step": "03", "title": "Development", "description": "Build your website with clean, maintainable code."},
      {"step": "04", "title": "Launch", "description": "Deploy, test, and optimize for performance."}
    ]'::jsonb,
    1,
    true
  ),
  (
    'web-apps',
    'Web Applications',
    'Full-stack applications with modern architecture and seamless UX.',
    'Full-stack applications with modern architecture and seamless UX.',
    'From ₹6,49,900',
    649900,
    'Layers',
    ARRAY[
      'Custom functionality',
      'User authentication',
      'Database integration',
      'API development',
      'Real-time features',
      'Scalable architecture'
    ],
    ARRAY[
      'Automate business processes',
      'Scale with your growth',
      'Reduce operational costs',
      'Improve team productivity'
    ],
    '[
      {"step": "01", "title": "Requirements", "description": "Define features, user flows, and technical requirements."},
      {"step": "02", "title": "Architecture", "description": "Design system architecture and database schema."},
      {"step": "03", "title": "Development", "description": "Agile development with regular demos and feedback."},
      {"step": "04", "title": "Deployment", "description": "Launch, monitor, and iterate based on usage."}
    ]'::jsonb,
    2,
    true
  ),
  (
    'dashboards',
    'Dashboards',
    'Data visualization and admin panels that drive decisions.',
    'Data visualization and admin panels that drive decisions.',
    'From ₹3,99,900',
    399900,
    'LineChart',
    ARRAY[
      'Interactive charts & graphs',
      'Real-time data updates',
      'Custom KPI tracking',
      'Export capabilities',
      'Role-based access',
      'Mobile responsive'
    ],
    ARRAY[
      'Visualize key metrics',
      'Make data-driven decisions',
      'Monitor performance',
      'Share insights easily'
    ],
    '[
      {"step": "01", "title": "Data Audit", "description": "Understand your data sources and KPIs."},
      {"step": "02", "title": "Design", "description": "Create dashboard layouts and visualization types."},
      {"step": "03", "title": "Integration", "description": "Connect data sources and build the dashboard."},
      {"step": "04", "title": "Training", "description": "Train your team and provide documentation."}
    ]'::jsonb,
    3,
    true
  ),
  (
    'ecommerce',
    'E-Commerce',
    'Online stores optimized for conversions and growth.',
    'Online stores optimized for conversions and growth.',
    'From ₹4,99,900',
    499900,
    'ShoppingCart',
    ARRAY[
      'Product management',
      'Secure checkout',
      'Payment integration',
      'Inventory tracking',
      'Order management',
      'Marketing tools'
    ],
    ARRAY[
      'Sell products online',
      'Manage inventory efficiently',
      'Track orders and customers',
      'Scale your business'
    ],
    '[
      {"step": "01", "title": "Planning", "description": "Plan your product catalog and sales strategy."},
      {"step": "02", "title": "Setup", "description": "Configure payment gateways and shipping options."},
      {"step": "03", "title": "Development", "description": "Build your online store with all features."},
      {"step": "04", "title": "Launch", "description": "Go live and start selling to customers."}
    ]'::jsonb,
    4,
    true
  ),
  (
    'portfolios',
    'Portfolio Making',
    'Professional portfolios for showcasing your work and attracting clients.',
    'Professional portfolios for showcasing your work and attracting clients.',
    'From ₹99,900',
    99900,
    'Briefcase',
    ARRAY[
      'Showcase your projects',
      'Client testimonials',
      'Contact forms',
      'Social media integration',
      'Resume/CV display',
      'Customizable templates'
    ],
    ARRAY[
      'Attract more clients',
      'Showcase your best work',
      'Build professional presence',
      'Increase your credibility'
    ],
    '[
      {"step": "01", "title": "Content", "description": "Gather your best projects and testimonials."},
      {"step": "02", "title": "Design", "description": "Choose a design that reflects your brand."},
      {"step": "03", "title": "Build", "description": "Create your portfolio with all your work."},
      {"step": "04", "title": "Launch", "description": "Publish and share with potential clients."}
    ]'::jsonb,
    5,
    true
  ),
  (
    'repair',
    'Site Repair',
    'Fix broken sites, improve performance, resolve issues.',
    'Fix broken sites, improve performance, resolve issues.',
    'From ₹39,900',
    39900,
    'Wrench',
    ARRAY[
      'Bug fixing',
      'Performance optimization',
      'Security patches',
      'Mobile responsiveness',
      'Browser compatibility',
      'Code cleanup'
    ],
    ARRAY[
      'Fix broken functionality',
      'Improve site speed',
      'Enhance security',
      'Better user experience'
    ],
    '[
      {"step": "01", "title": "Diagnosis", "description": "Identify issues and performance problems."},
      {"step": "02", "title": "Planning", "description": "Create a repair plan and timeline."},
      {"step": "03", "title": "Fix", "description": "Fix issues and optimize performance."},
      {"step": "04", "title": "Test", "description": "Test and verify all fixes work correctly."}
    ]'::jsonb,
    6,
    true
  ),
  (
    'maintenance',
    'Maintenance',
    'Ongoing support, updates, and peace of mind.',
    'Ongoing support, updates, and peace of mind.',
    'From ₹14,900/mo',
    14900,
    'Headphones',
    ARRAY[
      'Regular updates',
      'Security monitoring',
      'Performance checks',
      'Content updates',
      'Technical support',
      'Backup management'
    ],
    ARRAY[
      'Keep site secure',
      'Maintain performance',
      'Get quick support',
      'Focus on your business'
    ],
    '[
      {"step": "01", "title": "Assessment", "description": "Review your site and maintenance needs."},
      {"step": "02", "title": "Plan", "description": "Create a customized maintenance plan."},
      {"step": "03", "title": "Execute", "description": "Regular maintenance and updates."},
      {"step": "04", "title": "Report", "description": "Monthly reports on site health and work done."}
    ]'::jsonb,
    7,
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_published ON services(published);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_services_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_services_updated_at();

