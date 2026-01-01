-- Create testimonials table for managing client testimonials
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote TEXT NOT NULL,
    author TEXT NOT NULL,
    role TEXT NOT NULL,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for active testimonials and ordering
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON testimonials(active);
CREATE INDEX IF NOT EXISTS idx_testimonials_display_order ON testimonials(display_order);

-- Enable RLS (Row Level Security)
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist, then create them
DROP POLICY IF EXISTS "Allow public read access to active testimonials" ON testimonials;
CREATE POLICY "Allow public read access to active testimonials"
ON testimonials
FOR SELECT
TO public
USING (active = true);

DROP POLICY IF EXISTS "Allow authenticated users to read all testimonials" ON testimonials;
CREATE POLICY "Allow authenticated users to read all testimonials"
ON testimonials
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Allow admins to manage testimonials" ON testimonials;
CREATE POLICY "Allow admins to manage testimonials"
ON testimonials
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid()
        AND ur.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_roles ur
        WHERE ur.user_id = auth.uid()
        AND ur.role = 'admin'
    )
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_testimonials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
CREATE TRIGGER update_testimonials_updated_at
    BEFORE UPDATE ON testimonials
    FOR EACH ROW
    EXECUTE FUNCTION update_testimonials_updated_at();

-- Insert default testimonials (migrate from hardcoded)
-- Only insert if table is empty (to avoid duplicates on re-runs)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM testimonials LIMIT 1) THEN
        INSERT INTO testimonials (quote, author, role, rating, active, display_order) VALUES
        ('Dubiqo transformed our online presence completely. Our website traffic increased by 60% and conversions went up by 45% within the first month. The team really understands what businesses need!', 'Sahil Singh', 'CEO, Digital Solutions India', 5, true, 1),
        ('Excellent service and outstanding results! Dubiqo built our e-commerce platform exactly as we envisioned. They were professional, responsive, and delivered ahead of schedule. Couldn''t be happier!', 'Archit Keshaw', 'Founder, TechVenture Solutions', 5, true, 2),
        ('The best investment we''ve made! Our custom dashboard saves us hours every week and provides insights we never had before. The Dubiqo team is amazing and really cares about our success.', 'Priya Sharma', 'Operations Director, TechGrowth Solutions', 5, true, 3),
        ('Working with Dubiqo was a game-changer for our business. They created a beautiful, fast, and user-friendly website that perfectly represents our brand. Our customers love it!', 'Ananya Patel', 'Founder, Creative Studio Mumbai', 5, true, 4),
        ('Dubiqo helped us modernize our entire digital infrastructure. The new system is intuitive, efficient, and has improved our productivity significantly. Highly professional team!', 'Rahul Verma', 'CTO, Innovation Labs', 5, true, 5);
    END IF;
END $$;

