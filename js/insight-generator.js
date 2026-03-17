/**
 * DCM Core - Atomic Insight Generator
 * Extracts high-impact statistics for the "Data Domination Loop"
 */

class InsightGenerator {
    constructor(db) {
        this.db = db || window.GTSR_DATABASE || [];
    }

    generateTopInsights() {
        if (!this.db.length) return ["Not enough data to generate insights."];

        const insights = [];
        
        // 1. Infrastructure Dominance
        const infraCounts = {};
        this.db.forEach(a => infraCounts[a.infrastructure] = (infraCounts[a.infrastructure] || 0) + 1);
        const topInfra = Object.entries(infraCounts).sort((a,b) => b[1] - a[1])[0];
        const infraPercent = Math.round((topInfra[1] / this.db.length) * 100);
        insights.push(`${infraPercent}% of institutional assets are issued on ${topInfra[0]}.`);

        // 2. Settlement Efficiency
        const t0Count = this.db.filter(a => a.settlement.includes('T+0') || a.settlement.includes('Real-time')).length;
        const t0Percent = Math.round((t0Count / this.db.length) * 100);
        insights.push(`${t0Percent}% of tokenized securities now settle in T+0 or Real-time.`);

        // 3. Compliance Authority
        const compliantCount = this.db.filter(a => a.dora === 'Compliant').length;
        insights.push(`${compliantCount} major projects have reached 'DORA Compliant' status under EU regulation.`);

        return insights;
    }

    getLinkedInSnippet() {
        const top = this.generateTopInsights()[0];
        return `🚀 Market Observation: ${top}\n\n` +
               `Verified by DCM Core Institute GTSR Database.\n\n` +
               `#Tokenization #InstituitonalData #DCMCore`;
    }
}

// For quick console execution
window.getInsights = () => {
    const gen = new InsightGenerator();
    console.log("--- DCM CORE ATOMIC INSIGHTS ---");
    gen.generateTopInsights().forEach(i => console.log(`[SIGNATURE] ${i}`));
};
