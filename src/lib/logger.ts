type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private formatMessage(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry;
    let formatted = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (context && Object.keys(context).length > 0) {
      formatted += `\nContext: ${JSON.stringify(context, null, 2)}`;
    }

    if (error) {
      formatted += `\nError: ${error.message}\nStack: ${error.stack}`;
    }

    return formatted;
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    const formatted = this.formatMessage(entry);

    // Console output
    switch (level) {
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formatted);
        }
        break;
      case 'info':
        console.info(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'error':
        console.error(formatted);
        // Send to error monitoring in production
        if (!this.isDevelopment && window.Sentry) {
          window.Sentry.captureException(error || new Error(message), { extra: context });
        }
        break;
    }

    // In production, you might want to send logs to a logging service
    // e.g., LogRocket, Datadog, CloudWatch, etc.
    if (!this.isDevelopment && level === 'error') {
      // Example: Send to telemetry endpoint
      this.sendToTelemetry(entry);
    }
  }

  private async sendToTelemetry(entry: LogEntry) {
    try {
      // Send to your telemetry endpoint
      const { supabase } = await import('@/integrations/supabase/client');
      await supabase.functions.invoke('telemetry-ingest', {
        body: {
          event_type: 'error_log',
          event_data: {
            level: entry.level,
            message: entry.message,
            context: entry.context,
            error: entry.error?.message,
          },
        },
      });
    } catch (err) {
      // Silently fail - don't break the app if logging fails
      console.error('Failed to send log to telemetry:', err);
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, context);
  }

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.log('error', message, context, error);
  }
}

export const logger = new Logger();
