import { createClient } from '@/lib/supabase-server'

export type LogLevel = 'info' | 'warning' | 'error' | 'critical' | 'audit'

interface LogEntry {
    level: LogLevel
    category: string
    action: string
    message: string
    userId?: string
    metadata?: Record<string, any>
}

/**
 * Standardized system logger compatible with the robust 'system_logs' SQL schema.
 * Usage: await logSystemEvent({ level: 'info', category: 'payment', action: 'pix.created', message: '...' })
 */
export async function logSystemEvent(entry: LogEntry) {
    try {
        const supabase = await createClient()

        // Fire and forget - we log, but we don't block the execution flow if logging fails
        const { error } = await supabase.from('system_logs').insert({
            level: entry.level,
            category: entry.category,
            action: entry.action,
            message: entry.message,
            user_id: entry.userId,
            metadata: entry.metadata || {},
            created_at: new Date().toISOString()
        })

        if (error) {
            console.error("FAILED TO WRITE SYSTEM LOG:", error)
            // Fallback to console so we don't lose the info
            console.log(`[FALLBACK LOG] [${entry.level}] ${entry.message}`, entry)
        }
    } catch (e) {
        console.error("logger internal error:", e)
    }
}
