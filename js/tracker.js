/**
 * DCM Research Intelligence Tracker
 * V6.0 - SaaS Edition
 * 
 * Tracks:
 * - Time on Page (Active)
 * - Scroll Depth (Max %)
 * - Section Coverage (Topic Heatmap)
 */

const CAMPAIGN_ID = 'v6_launch';

class ResearchTracker {
    constructor() {
        this.startTime = Date.now();
        this.pageId = window.location.pathname.split('/').pop() || 'index.html';
        this.maxScroll = 0;
        this.interactions = 0;
        this.sectionsViewed = new Set();

        this.init();
    }

    init() {
        console.log(`📡 Tracker Active: ${this.pageId}`);

        // 1. Scroll Tracking
        window.addEventListener('scroll', () => this.trackScroll());

        // 2. Section Observer (Heatmap)
        this.observeSections();

        // 3. Save on Exit
        window.addEventListener('beforeunload', () => this.saveSession());

        // 4. Periodic Save (every 10s)
        setInterval(() => this.saveSession(), 10000);
    }

    trackScroll() {
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollTop = document.documentElement.scrollTop;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);

        if (scrollPercent > this.maxScroll) {
            this.maxScroll = scrollPercent;
        }
    }

    observeSections() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id || entry.target.tagName;
                    this.sectionsViewed.add(sectionId);
                    // console.log(`👁 Section Viewed: ${sectionId}`);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('section, h2, .section-box').forEach(el => observer.observe(el));
    }

    saveSession() {
        const timeSpent = Math.round((Date.now() - this.startTime) / 1000); // seconds

        // Get existing data
        const history = JSON.parse(localStorage.getItem('dcm_research_data')) || {};

        // Update current page stats
        history[this.pageId] = {
            last_visit: new Date().toISOString(),
            time_spent: (history[this.pageId]?.time_spent || 0) + 10, // Increment by interval (approx)
            max_scroll: Math.max(this.maxScroll, history[this.pageId]?.max_scroll || 0),
            sections: Array.from(this.sectionsViewed)
        };

        // Recalculate Global Score
        const totalTime = Object.values(history).reduce((acc, val) => acc + val.time_spent, 0);
        const pagesVisited = Object.keys(history).length;

        // Simple Scoring Algo (Demo)
        let maturityScore = Math.min(100, (pagesVisited * 10) + (totalTime / 60));
        localStorage.setItem('dcm_research_score', Math.round(maturityScore));
        localStorage.setItem('dcm_research_data', JSON.stringify(history));
    }
}

// Auto-start
const tracker = new ResearchTracker();
