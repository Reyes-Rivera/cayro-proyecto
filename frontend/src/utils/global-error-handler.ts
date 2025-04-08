export function setupGlobalErrorHandlers() {
    // Captura errores JS no controlados
    window.onerror = (message, source, lineno, colno, error) => {
      console.error('[Global Error]', { message, source, lineno, colno, error });
  
      fetch('http://localhost:5000/logs/frontend-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: (message as string) || 'Error desconocido',
          stack: error?.stack || '',
          path: source,
          timestamp: new Date().toISOString(),
          context: 'window.onerror',
        }),
      });
    };
  
    // Captura errores en promesas no manejadas
    window.onunhandledrejection = (event) => {
      console.error('[Unhandled Promise Rejection]', event.reason);
  
      fetch('http://localhost:5000/logs/frontend-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: event.reason?.message || 'Unhandled rejection',
          stack: event.reason?.stack,
          timestamp: new Date().toISOString(),
          context: 'window.onunhandledrejection',
        }),
      });
    };
  }
  