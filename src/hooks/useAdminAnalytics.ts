import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface EventSummary {
    total_events: number;
    sessions: number;
    top_clicks: { name: string; count: number }[];
    funnel_stats: { name: string; starts: number; submits: number; rate: number }[];
    avg_performance: { name: string; avg_duration: number; count: number }[];
}

export interface AdminKPIs {
    dau: number;
    wau: number;
    d7_eligible_users: number;
    d7_retained_users: number;
    avg_tx_first_week: number;
}

const REQUIRED_FUNNELS = [
    'add_account_modal',
    'new_transaction',
    'login',
    'support_message_sent',
    'new_goal',
    'update_profile',
    'export_data'
];

export const useAdminAnalytics = () => {
    const { user } = useAuth();
    const [summary, setSummary] = useState<EventSummary | null>(null);
    const [kpis, setKpis] = useState<AdminKPIs | null>(null);
    const [loading, setLoading] = useState(true);

    const ADMIN_EMAILS = ['admin@teste.com', 'tctulio2009@gmail.com'];
    const isAdmin = !!user?.email && ADMIN_EMAILS.some(email => email.toLowerCase() === user.email?.toLowerCase());

    const fetchAnalytics = async () => {
        if (!isAdmin) return;
        setLoading(true);

        try {
            // Promessas paralelas para maximizar performance no painel admin
            const [eventsRes, kpisRes] = await Promise.all([
                supabase.from('user_events').select('*').order('created_at', { ascending: false }),
                supabase.rpc('get_admin_kpis')
            ]);

            if (eventsRes.error) throw eventsRes.error;
            
            if (kpisRes.data && !kpisRes.error) {
                setKpis(kpisRes.data);
            }

            const data = eventsRes.data;

            if (data) {
                // Processamento Básico
                const sessions = new Set(data.map(e => e.session_id)).size;
                
                // Top Clicks
                const clickMap: Record<string, number> = {};
                data.filter(e => e.event_category === 'CLICK').forEach(e => {
                    clickMap[e.event_name] = (clickMap[e.event_name] || 0) + 1;
                });
                const top_clicks = Object.entries(clickMap)
                    .map(([name, count]) => ({ name, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5);

                // Performance
                const perfMap: Record<string, { total: number; count: number }> = {};
                data.filter(e => e.event_category === 'PERFORMANCE').forEach(e => {
                    const duration = e.metadata?.duration_ms || 0;
                    if (!perfMap[e.event_name]) perfMap[e.event_name] = { total: 0, count: 0 };
                    perfMap[e.event_name].total += duration;
                    perfMap[e.event_name].count += 1;
                });
                const avg_performance = Object.entries(perfMap).map(([name, stats]) => ({
                    name,
                    avg_duration: Math.round(stats.total / stats.count),
                    count: stats.count
                }));

                // Funnels
                const funnelMap: Record<string, { starts: number; submits: number }> = {};
                
                // Initialize required funnels
                REQUIRED_FUNNELS.forEach(name => {
                    funnelMap[name] = { starts: 0, submits: 0 };
                });

                data.filter(e => e.event_category === 'FUNNEL').forEach(e => {
                    const baseName = e.event_name.replace('_start', '').replace('_submit', '').replace('_abandon', '');
                    if (!funnelMap[baseName]) funnelMap[baseName] = { starts: 0, submits: 0 };
                    
                    if (e.event_name.endsWith('_start')) {
                        funnelMap[baseName].starts++;
                    } else if (e.event_name.endsWith('_submit')) {
                        funnelMap[baseName].submits++;
                        if (funnelMap[baseName].starts === 0) funnelMap[baseName].starts = 1;
                    } else if (!e.event_name.endsWith('_abandon')) {
                        funnelMap[baseName].starts++;
                        funnelMap[baseName].submits++;
                    }
                });

                const funnel_stats = Object.entries(funnelMap).map(([name, stats]) => ({
                    name,
                    starts: stats.starts,
                    submits: stats.submits,
                    rate: stats.starts > 0 ? Math.round((stats.submits / stats.starts) * 100) : 0
                })).sort((a, b) => b.starts - a.starts);

                setSummary({
                    total_events: data.length,
                    sessions,
                    top_clicks,
                    avg_performance,
                    funnel_stats
                });
            }
        } catch (err) {
            console.error('Error fetching analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, [isAdmin]);

    return { summary, kpis, loading, isAdmin, refresh: fetchAnalytics };
};
