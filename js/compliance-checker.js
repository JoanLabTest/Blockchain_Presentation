/**
 * DCM CORE - STANDARD COMPLIANCE CHECKER
 * Interactive tool for self-assessing institutional DLT projects.
 */

const DIGITAL_BOND_CRITERIA = [
    { id: 'ident_tfin', group: 'Identification', label: 'TFIN ID assigned and mapped in registry', weight: 15 },
    { id: 'ident_isin', group: 'Identification', label: 'ISIN bridged to on-chain metadata', weight: 10 },
    { id: 'data_gtds', group: 'Technical Layer', label: 'GTDS mapping complete (Coupon, Maturity, Notional)', weight: 25 },
    { id: 'smart_lifecycle', group: 'Technical Layer', label: 'Lifecycle events automated via Smart Contract', weight: 20 },
    { id: 'settle_atomic', group: 'Settlement', label: 'Atomic DvP logic implemented (on-chain settlement)', weight: 20 },
    { id: 'legal_csd', group: 'Regulatory', label: 'Legal finality via CSD synchronization', weight: 10 }
];

function initComplianceChecker(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let html = `
        <div style="background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 20px; padding: 40px; text-align: left; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                <h3 style="font-family: 'Outfit'; font-size: 24px; color: #fff; margin: 0;">Digital Bond Compliance Audit</h3>
                <div id="complianceScore" style="font-size: 32px; font-weight: 800; color: #10b981; font-family: 'Outfit';">0%</div>
            </div>

            <div style="height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; margin-bottom: 30px; overflow: hidden;">
                <div id="complianceProgressBar" style="width: 0%; height: 100%; background: #10b981; transition: 0.6s cubic-bezier(0.22, 1, 0.36, 1);"></div>
            </div>

            <div style="display: grid; gap: 15px;">
    `;

    DIGITAL_BOND_CRITERIA.forEach(item => {
        html += `
            <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; cursor: pointer; transition: 0.2s;" class="checker-item">
                <input type="checkbox" id="${item.id}" data-weight="${item.weight}" class="compliance-checkbox" style="width: 20px; height: 20px; cursor: pointer; accent-color: #10b981;">
                <div style="flex-grow: 1;">
                    <div style="font-size: 11px; text-transform: uppercase; color: #64748b; letter-spacing: 1px; font-weight: 700;">${item.group}</div>
                    <label for="${item.id}" style="font-size: 14px; color: #e2e8f0; cursor: pointer;">${item.label}</label>
                </div>
            </div>
        `;
    });

    html += `
            </div>

            <div id="complianceResult" style="margin-top: 30px; padding: 20px; border-radius: 12px; font-size: 14px; display: none;">
            </div>

            <div style="margin-top: 30px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 11px; color: #475569;">SELF-ASSESSMENT TOOL v1.0</span>
                <button onclick="downloadAuditReport()" style="background: transparent; border: 1px solid #10b981; color: #10b981; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; transition: 0.3s;">
                    Download Report (PDF)
                </button>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // Add listeners
    const checkboxes = container.querySelectorAll('.compliance-checkbox');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', updateComplianceScore);
    });

    document.querySelectorAll('.checker-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT') {
                const input = item.querySelector('input');
                input.checked = !input.checked;
                updateComplianceScore();
            }
        });
    });
}

function updateComplianceScore() {
    let score = 0;
    const checkboxes = document.querySelectorAll('.compliance-checkbox');
    checkboxes.forEach(cb => {
        if (cb.checked) {
            score += parseInt(cb.getAttribute('data-weight'));
        }
    });

    const scoreEl = document.getElementById('complianceScore');
    const progressEl = document.getElementById('complianceProgressBar');
    const resultEl = document.getElementById('complianceResult');

    scoreEl.innerText = score + '%';
    progressEl.style.width = score + '%';

    if (score > 0) {
        resultEl.style.display = 'block';
        if (score === 100) {
            resultEl.style.background = 'rgba(16, 185, 129, 0.1)';
            resultEl.style.color = '#10b981';
            resultEl.style.border = '1px solid #10b981';
            resultEl.innerHTML = '<i class="fas fa-check-circle"></i> <strong>STANDARD CERTIFIED:</strong> Your infrastructure fully aligns with the Digital Bond blueprint.';
        } else if (score >= 60) {
            resultEl.style.background = 'rgba(59, 130, 246, 0.1)';
            resultEl.style.color = '#3b82f6';
            resultEl.style.border = '1px solid #3b82f6';
            resultEl.innerHTML = '<i class="fas fa-info-circle"></i> <strong>PARTIAL ALIGNMENT:</strong> Some manual reconcilement processes may still exist. Finalize GTDS mapping.';
        } else {
            resultEl.style.background = 'rgba(245, 158, 11, 0.1)';
            resultEl.style.color = '#f59e0b';
            resultEl.style.border = '1px solid #f59e0b';
            resultEl.innerHTML = '<i class="fas fa-triangle-exclamation"></i> <strong>LOW ALIGNMENT:</strong> Significant infrastructure gaps detected. Review the architectural blueprints.';
        }
    } else {
        resultEl.style.display = 'none';
    }
}

function downloadAuditReport() {
    alert("DCM_AUDIT_REPORT_TEMPLATE.pdf triggered.\n\nNote: In production environments, this generates a signed certificate of standard alignment.");
}

// Auto-initialize if container is on page
document.addEventListener('DOMContentLoaded', () => {
    initComplianceChecker('complianceCheckerTarget');
});
