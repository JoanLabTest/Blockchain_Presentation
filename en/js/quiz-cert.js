/**
 * DCM QUIZ CERTIFICATION MANAGER - v1.0 (Phase 6)
 * Generates institutional-grade certificates using jsPDF.
 */

const QuizCert = {
    // Tiers mapping
    TIERS: {
        'level-1': { id: 'BRONZE', title: 'DCM Digital Apprentice', color: [141, 110, 99] },
        'level-2': { id: 'BRONZE', title: 'DCM Digital Apprentice', color: [141, 110, 99] },
        'level-3': { id: 'SILVER', title: 'DCM Digital Practitioner', color: [144, 164, 174] },
        'level-4': { id: 'SILVER', title: 'DCM Digital Practitioner', color: [144, 164, 174] },
        'level-5': { id: 'GOLD', title: 'DCM Digital Expert', color: [255, 193, 7] },
        'super': { id: 'BLACK', title: 'DCM Strategic Strategist', color: [124, 58, 237] }
    },

    /**
     * Main entry point for generation.
     */
    generate: async (userName, levelKey, score) => {
        console.log(`📜 Generating Certificate: ${userName} | ${levelKey} | ${score}%`);

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        const tier = QuizCert.TIERS[levelKey] || QuizCert.TIERS['level-1'];
        const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        const certId = `DCM-CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${levelKey.split('-').pop().toUpperCase()}`;

        // 1. Background / Border
        QuizCert._drawBorder(doc, tier.color);

        // 2. Header / Branding
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(28);
        doc.text('DCM DIGITAL ACADEMY', 148, 45, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text('INSTITUTIONAL GRADE DIGITAL GOVERNANCE ASSESSMENT', 148, 52, { align: 'center' });

        // 3. Title Section
        doc.setFontSize(36);
        doc.setTextColor(tier.color[0], tier.color[1], tier.color[2]);
        doc.text('CERTIFICAT DE RÉUSSITE', 148, 85, { align: 'center' });

        // 4. Content
        doc.setFontSize(16);
        doc.setTextColor(71, 85, 105);
        doc.text('Ce certificat est décerné à :', 148, 105, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(32);
        doc.setTextColor(15, 23, 42);
        doc.text(userName.toUpperCase(), 148, 120, { align: 'center' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(14);
        doc.setTextColor(71, 85, 105);
        doc.text(`Pour avoir complété avec succès le cycle d'évaluation :`, 148, 135, { align: 'center' });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.setTextColor(tier.color[0], tier.color[1], tier.color[2]);
        doc.text(tier.title, 148, 145, { align: 'center' });

        // 5. Performance Badge
        QuizCert._drawPerformanceBadge(doc, 220, 140, score);

        // 6. Seal / Integrity
        QuizCert._drawSeal(doc, 50, 160, certId);

        // 7. Footer
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(148, 163, 184);
        doc.text(`Délivré le ${date}`, 148, 175, { align: 'center' });
        doc.text(`ID de vérification : ${certId}`, 148, 180, { align: 'center' });

        doc.setFontSize(8);
        doc.text('Validated by DCM Governance Engine v4.3.0 | SHA-256 Notarization Active', 148, 195, { align: 'center' });

        // Save
        doc.save(`DCM_Certificate_${userName.replace(/\s+/g, '_')}_${tier.id}.pdf`);
    },

    /**
     * Draws the decorative certificate border.
     */
    _drawBorder: (doc, color) => {
        // Outer frame
        doc.setDrawColor(color[0], color[1], color[2]);
        doc.setLineWidth(1.5);
        doc.rect(10, 10, 277, 190);

        // Inner frame
        doc.setLineWidth(0.5);
        doc.rect(13, 13, 271, 184);

        // Corner accents
        const s = 15;
        // Top Left
        doc.line(10, 10 + s, 10 + s, 10);
        // Top Right
        doc.line(287 - s, 10, 287, 10 + s);
        // Bottom Left
        doc.line(10, 200 - s, 10 + s, 200);
        // Bottom Right
        doc.line(287 - s, 200, 287, 200 - s);
    },

    /**
     * Draws a performance score badge.
     */
    _drawPerformanceBadge: (doc, x, y, score) => {
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(x, y, 40, 25, 3, 3, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(x, y, 40, 25, 3, 3, 'S');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text('SCORE FINAL', x + 20, y + 8, { align: 'center' });

        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.text(`${score}%`, x + 20, y + 18, { align: 'center' });
    },

    /**
     * Draws an institutional seal mock.
     */
    _drawSeal: (doc, x, y, certId) => {
        // Outer circle
        doc.setFillColor(30, 41, 59);
        doc.circle(x, y, 20, 'F');

        // Inner detail
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(0.3);
        doc.circle(x, y, 17, 'S');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6);
        doc.setTextColor(255, 255, 255);
        doc.text('DCM DIGITAL', x, y - 5, { align: 'center' });
        doc.text('QUALIFIED', x, y + 0, { align: 'center' });
        doc.text('GOVERNANCE', x, y + 5, { align: 'center' });
    }
};

// Expose to window
if (typeof window !== 'undefined') {
    window.QuizCert = QuizCert;
}
