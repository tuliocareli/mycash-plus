import { supabase } from './supabase';

export interface AnalyticsEvent {
    category: 'CLICK' | 'PERFORMANCE' | 'FUNNEL' | 'DISCOVERY' | 'ERROR' | 'FINANCE';
    name: string;
    metadata?: Record<string, any>;
}

class AnalyticsService {
    private eventQueue: any[] = [];
    private sessionId: string;
    private userId: string | null = null;
    private flushThreshold = 10;
    private flushInterval = 10000; // 10 seconds
    private timer: any = null;

    constructor() {
        this.sessionId = crypto.randomUUID();
        if (typeof window !== 'undefined') {
            window.addEventListener('beforeunload', () => this.flush());
            window.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden') {
                    this.flush();
                }
            });
        }
    }

    setUserId(id: string) {
        this.userId = id;
    }

    async track(event: AnalyticsEvent) {
        if (!this.userId || import.meta.env.DEV) {
            if (import.meta.env.DEV) {
                console.log('[Analytics Skip - DEV]', event);
            }
            return;
        }

        const payload = {
            user_id: this.userId,
            session_id: this.sessionId,
            event_category: event.category,
            event_name: event.name,
            metadata: event.metadata || {},
            created_at: new Date().toISOString()
        };

        this.eventQueue.push(payload);

        if (this.eventQueue.length >= this.flushThreshold) {
            this.flush();
        } else {
            this.resetTimer();
        }
    }

    private resetTimer() {
        if (this.timer) clearTimeout(this.timer);
        this.timer = setTimeout(() => this.flush(), this.flushInterval);
    }

    async flush() {
        if (this.eventQueue.length === 0 || !this.userId) return;

        const eventsToFlush = [...this.eventQueue];
        this.eventQueue = [];
        if (this.timer) clearTimeout(this.timer);

        try {
            // Use Supabase to insert multiple rows
            const { error } = await supabase
                .from('user_events')
                .insert(eventsToFlush);

            if (error) {
                console.error('Failed to flush analytics events:', error);
                // Put them back if we want to retry, but for analytics sometimes it's better to just drop to avoid loops
            }
        } catch (err) {
            console.error('Error in analytics flush:', err);
        }
    }
}

export const analytics = new AnalyticsService();
