/**
 * Script to add high-quality professional images to all services
 * Run this script in your Supabase SQL editor or via the admin panel
 * 
 * Alternative: You can run the SQL file: supabase/update_service_images_high_quality.sql
 */

const serviceImages = [
  {
    slug: 'websites',
    title: 'Custom Websites',
    imageUrl: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1920&q=80&auto=format&fit=crop',
    altText: 'Professional custom website development and design'
  },
  {
    slug: 'web-apps',
    title: 'Web Applications',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&q=80&auto=format&fit=crop',
    altText: 'Modern web application development and architecture'
  },
  {
    slug: 'dashboards',
    title: 'Dashboards & Analytics',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80&auto=format&fit=crop',
    altText: 'Business analytics dashboard and data visualization'
  },
  {
    slug: 'ecommerce',
    title: 'E-Commerce Solutions',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80&auto=format&fit=crop',
    altText: 'E-commerce platform and online store development'
  },
  {
    slug: 'portfolios',
    title: 'Portfolio Making',
    imageUrl: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1920&q=80&auto=format&fit=crop',
    altText: 'Professional portfolio website design and development'
  },
  {
    slug: 'repair',
    title: 'Site Repair & Recovery',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80&auto=format&fit=crop',
    altText: 'Website repair, bug fixing, and technical recovery services'
  },
  {
    slug: 'maintenance',
    title: 'Ongoing Maintenance',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80&auto=format&fit=crop',
    altText: 'Website maintenance, updates, and ongoing support services'
  }
];

// Instructions:
// 1. Copy the SQL from supabase/update_service_images_high_quality.sql
// 2. Run it in your Supabase SQL editor
// OR
// 3. Use the admin panel to manually update each service with these image URLs

console.log('Service Images Configuration:');
console.log(JSON.stringify(serviceImages, null, 2));

