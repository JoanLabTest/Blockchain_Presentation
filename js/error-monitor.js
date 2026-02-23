/**
 * DCM ERROR MONITOR — Phase 82
 * Institutional monitoring for error tracking and uptime verification.
 */

import { supabase } from './supabase-client.js';

export const ErrorMonitor = {
    init: () => {
        window.addEventListener('error', (event) => {
            ErrorMonitor.logError('RUNTIME_ERROR', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            ErrorMonitor.logError('PROMISE_REJECTION', {
                reason: event.reason?.message || event.reason
            });
        });

        console.log("📊 Institutional Monitoring Active.");
    },

    logError: async (type, details) => {
        const { data: { session } } = await supabase.auth.getSession();

        const logEntry = {
            action: `SYSTEM_ERROR_${type}`,
            user_id: session?.user?.id || null,
            metadata: {
                ...details,
                url: window.location.href,
                agent: navigator.userAgent
            },
            severity: 'CRITICAL'
        };

        // Persist to Audit Logs (Critical for CISO dashboard)
        await supabase.from('audit_logs').insert([logEntry]);

        console.error(`🚨 [DCM Monitor] ${type}:`, details);
    }
};

// Auto-init
ErrorMonitor.init();
