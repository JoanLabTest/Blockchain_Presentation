/**
 * BACKTESTING & SENSITIVITY ENGINE (A2)
 * Phase 112: Strategic Validation
 * logic for simulating market shocks and auditing score robustness.
 */

export const BacktestingEngine = {
    // SCENARIOS
    SCENARIOS: {
        LIQUIDITY_SHOCK: { name: 'Liquidity Shock', liquidityDrop: 0.7, volSpike: 0.5, recoveryProb: 0.8 },
        REGULATORY_FREEZE: { name: 'Regulatory Freeze', legalPenalty: 0.8, liquidityDrop: 0.3, recoveryProb: 0.4 },
        COLLATERAL_DEPEGGING: { name: 'Collateral Depeg', collateralValueDrop: 0.4, recoveryProb: 0.6 },
        MICA_COMPLIANCE_FAIL: { name: 'MiCA Compliance Failure', legalPenalty: 0.9, liquidityDrop: 0.5, recoveryProb: 0.2 }
    },

    /**
     * Run a sensitivity audit on a specific asset metrics set.
     */
    runSensitivityAudit: (assetMetrics, scenarioKey) => {
        const scenario = BacktestingEngine.SCENARIOS[scenarioKey];
        if (!scenario) return null;

        console.log(`🔬 Running Institutional Sensitivity Audit: ${scenario.name}`);

        const baselineScore = BacktestingEngine.calculateMockDCM(assetMetrics);

        // Apply shocks
        const shockedMetrics = { ...assetMetrics };
        if (scenario.liquidityDrop) shockedMetrics.liquidity *= (1 - scenario.liquidityDrop);
        if (scenario.legalPenalty) shockedMetrics.legalScore *= (1 - scenario.legalPenalty);
        if (scenario.collateralValueDrop) shockedMetrics.collateralization *= (1 - scenario.collateralValueDrop);

        const shockedScore = BacktestingEngine.calculateMockDCM(shockedMetrics);
        const varianceRaw = ((shockedScore - baselineScore) / baselineScore * 100);

        // Advanced Resilience Index (Phase 112)
        // Adjusting resilience based on Recovery Probability
        let resilienceStatus = 'HIGH';
        if (shockedScore < 40 || scenario.recoveryProb < 0.3) resilienceStatus = 'CRITICAL';
        else if (shockedScore < 65 || scenario.recoveryProb < 0.6) resilienceStatus = 'MEDIUM';

        // --- PHASE 114: MiCA Compliance Layer ---
        let micaStatus = 'COMPLIANT (EMT)';
        if (scenarioKey === 'MICA_COMPLIANCE_FAIL') micaStatus = 'NON-COMPLIANT';
        else if (scenarioKey === 'REGULATORY_FREEZE') micaStatus = 'RESTRICTED (EU)';

        return {
            scenario: scenario.name,
            baseline: baselineScore,
            shocked: shockedScore,
            variance: varianceRaw.toFixed(1) + '%',
            resilience: resilienceStatus,
            recoveryProbability: (scenario.recoveryProb * 100) + '%',
            micaStatus: micaStatus
        };
    },

    /**
     * Internal mock scoring for validation tests.
     */
    calculateMockDCM: (m) => {
        // Simplified weights for backtesting logic
        const wLiquidity = 0.4;
        const wLegal = 0.3;
        const wCollateral = 0.3;

        const score = (m.liquidity * wLiquidity) + (m.legalScore * wLegal) + (m.collateralization * wCollateral);
        return Math.min(100, Math.max(0, score));
    }
};

// Auto-run test if script is loaded
if (typeof window !== 'undefined') {
    window.BacktestingEngine = BacktestingEngine;
}
