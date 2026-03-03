/**
 * SEGMENT MANAGER - v1.0
 * Handles user segment detection and persistence.
 */

export const SegmentManager = {

    /**
     * Detects the current segment based on:
     * 1. URL Parameter (?segment=pro)
     * 2. LocalStorage (last used role)
     * 3. Default (student)
     */
    detectSegment: () => {
        const params = new URLSearchParams(window.location.search);
        let segment = params.get('segment') || params.get('view');

        if (segment) {
            segment = segment.toLowerCase();
            // Validate segment
            if (['student', 'pro', 'enterprise', 'institutional'].includes(segment)) {
                if (segment === 'institutional') segment = 'enterprise'; // normalize
                localStorage.setItem('dcm_active_role', segment);
                return segment;
            }
        }

        // Fallback to localStorage or default
        const saved = localStorage.getItem('dcm_active_role') || 'student';
        return saved.toLowerCase();
    },

    /**
     * Gets the current segment name.
     */
    getSegment: () => {
        return SegmentManager.detectSegment();
    }
};
