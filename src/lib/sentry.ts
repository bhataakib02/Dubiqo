// Sentry error monitoring setup
// Install: npm install @sentry/react
// This is optional - the app works without it

/**
 * Initialize Sentry for error tracking
 * Call this in main.tsx before rendering the app
 */
export function initSentry() {
  // Set up a no-op Sentry object first so ErrorBoundary doesn't break
  if (typeof window !== 'undefined') {
    window.Sentry = {
      captureException: () => {
        // No-op when Sentry is not configured
      },
    };
  }

  // Only initialize in production or if DSN is provided
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (!dsn) {
    if (import.meta.env.DEV) {
      console.log('Sentry DSN not configured. Error tracking disabled.');
    }
    return;
  }

  // Try to load Sentry - use a function to delay evaluation
  // This prevents Vite from trying to resolve it at build time if not installed
  const loadSentry = () => {
    // Dynamic import with @vite-ignore to skip static analysis
    // This allows the app to work even if @sentry/react is not installed
    return import(/* @vite-ignore */ '@sentry/react')
      .then((Sentry) => {
        Sentry.init({
          dsn,
          environment: import.meta.env.MODE,
          integrations: [
            Sentry.browserTracingIntegration(),
            Sentry.replayIntegration({
              maskAllText: true,
              blockAllMedia: true,
            }),
          ],
          tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
          replaysSessionSampleRate: 0.1,
          replaysOnErrorSampleRate: 1.0,
        });

        // Make Sentry available globally for ErrorBoundary
        if (typeof window !== 'undefined') {
          window.Sentry = {
            captureException: (error: Error, context?: Record<string, unknown>) => {
              Sentry.captureException(error, context);
            },
          };
        }
      })
      .catch((err) => {
        // Sentry package not installed or failed to load
        console.warn('Sentry not available. Install with: npm install @sentry/react', err);
      });
  };

  // Load asynchronously
  loadSentry();
}

/**
 * Log an error to Sentry
 */
export function logError(error: Error, context?: Record<string, unknown>) {
  if (window.Sentry) {
    window.Sentry.captureException(error, { extra: context });
  } else {
    console.error('Error:', error, context);
  }
}
