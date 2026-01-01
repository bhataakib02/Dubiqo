-- Quick fix: Publish all existing active pricing plans
-- Run this if your plans are not showing on the pricing page

-- First, ensure the published column exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public'
        AND table_name = 'pricing_plans' 
        AND column_name = 'published'
    ) THEN
        ALTER TABLE pricing_plans 
        ADD COLUMN published BOOLEAN DEFAULT true;
    END IF;
END $$;

-- Update all active plans to be published
UPDATE pricing_plans 
SET published = true 
WHERE active = true AND (published IS NULL OR published = false);

-- Also publish any plans that don't have published set
UPDATE pricing_plans 
SET published = true 
WHERE published IS NULL;

