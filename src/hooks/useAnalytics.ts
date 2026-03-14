import { useEffect, useRef, useCallback } from 'react';
import { analytics, AnalyticsEvent } from '../services/analytics';
import { useAuth } from '../contexts/AuthContext';

export const useAnalytics = () => {
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            analytics.setUserId(user.id);
        }
    }, [user]);

    const trackEvent = useCallback((event: AnalyticsEvent) => {
        analytics.track(event);
    }, []);

    return { trackEvent };
};

/**
 * Hook to track form funnels (starts, submissions, and abandons)
 */
export const useFormFunnel = (formName: string) => {
    const { trackEvent } = useAnalytics();
    const hasStarted = useRef(false);
    const hasSubmitted = useRef(false);

    const startForm = useCallback(() => {
        if (!hasStarted.current) {
            trackEvent({
                category: 'FUNNEL',
                name: `${formName}_start`,
            });
            hasStarted.current = true;
        }
    }, [formName, trackEvent]);

    const submitForm = useCallback((metadata?: Record<string, any>) => {
        trackEvent({
            category: 'FUNNEL',
            name: `${formName}_submit`,
            metadata,
        });
        hasSubmitted.current = true;
    }, [formName, trackEvent]);

    useEffect(() => {
        return () => {
            if (hasStarted.current && !hasSubmitted.current) {
                trackEvent({
                    category: 'FUNNEL',
                    name: `${formName}_abandon`,
                });
            }
        };
    }, [formName, trackEvent]);

    return { startForm, submitForm };
};

/**
 * Hook to measure performance of specific actions
 */
export const usePerformanceMarker = () => {
    const { trackEvent } = useAnalytics();

    const measureAction = useCallback(async (actionName: string, action: () => Promise<any>) => {
        const startTime = performance.now();
        try {
            const result = await action();
            const duration = performance.now() - startTime;
            trackEvent({
                category: 'PERFORMANCE',
                name: actionName,
                metadata: { duration_ms: Math.round(duration), status: 'success' }
            });
            return result;
        } catch (error) {
            const duration = performance.now() - startTime;
            trackEvent({
                category: 'PERFORMANCE',
                name: actionName,
                metadata: { duration_ms: Math.round(duration), status: 'error' }
            });
            throw error;
        }
    }, [trackEvent]);

    return { measureAction };
};

/**
 * Hook to track interactions on a specific element
 */
export const useInteractionTracker = (elementName: string) => {
    const { trackEvent } = useAnalytics();

    const trackClick = useCallback((metadata?: Record<string, any>) => {
        trackEvent({
            category: 'CLICK',
            name: `click_${elementName}`,
            metadata
        });
    }, [elementName, trackEvent]);

    return { trackClick };
};
