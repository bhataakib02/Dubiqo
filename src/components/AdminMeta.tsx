import { useEffect } from 'react';

/**
 * Component to add noindex, nofollow meta tags to admin pages
 * Use this in admin page components
 */
export function AdminMeta() {
  useEffect(() => {
    // Remove existing robots meta tag if any
    const existingRobots = document.querySelector('meta[name="robots"]');
    if (existingRobots) {
      existingRobots.remove();
    }

    // Add noindex, nofollow meta tag
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);

    // Cleanup on unmount
    return () => {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta && robotsMeta.getAttribute('content') === 'noindex, nofollow') {
        robotsMeta.remove();
      }
    };
  }, []);

  return null;
}
