import os
import glob
from bs4 import BeautifulSoup

# Define Bibliographies for each page
bibliographies = {
    "networks/index.html": """
        <!-- BIBLIOGRAPHY -->
        <div class="content-section" data-aos="fade-up" style="border-top: 1px dashed #333;">
            <div class="feature-box" style="background: rgba(255, 255, 255, 0.02); border-left: 3px solid #666;">
                <h4><i class="fa-solid fa-book" style="color: #888;"></i> Références & Académie (Hub)</h4>
                <ul style="color: #ccc; font-size: 14px; padding-left: 20px; line-height: 1.8; margin-top: 10px;">
                    <li><a href="https://ethereum.org/en/whitepaper/" target="_blank" style="color: #627EEA;">Ethereum Whitepaper</a> – Buterin, V. (2013)</li>
                    <li><a href="https://solana.com/solana-whitepaper.pdf" target="_blank" style="color: #14F195;">Solana: A new architecture for a high performance blockchain</a> – Yakovenko, A. (2017)</li>
                    <li><a href="https://bitcoin.org/bitcoin.pdf" target="_blank" style="color: #F7931A;">Bitcoin: A Peer-to-Peer Electronic Cash System</a> – Nakamoto, S. (2008)</li>
                </ul>
            </div>
        </div>
    """,
    "networks/bitcoin.html": """
        <!-- BIBLIOGRAPHY -->
        <div class="content-section" data-aos="fade-up" style="border-top: 1px dashed #333;">
            <div class="feature-box" style="background: rgba(247, 147, 26, 0.05); border-left: 3px solid var(--btc-orange);">
                <h4><i class="fa-solid fa-book" style="color: var(--btc-orange);"></i> Références & Académie</h4>
                <ul style="color: #ccc; font-size: 14px; padding-left: 20px; line-height: 1.8; margin-top: 10px;">
                    <li>Nakamoto, S. (2008). <i>Bitcoin: A Peer-to-Peer Electronic Cash System</i>. (<a href="https://bitcoin.org/bitcoin.pdf" target="_blank" style="color: var(--btc-orange);">Whitepaper</a>)</li>
                    <li>Poon, J., & Dryja, T. (2016). <i>The Bitcoin Lightning Network: Scalable Off-Chain Instant Payments</i>.</li>
                    <li>Github Repo: <a href="https://github.com/bitcoin/bips" target="_blank" style="color: var(--btc-orange);">Bitcoin Improvement Proposals (BIPs)</a></li>
                </ul>
            </div>
        </div>
    """,
    "networks/ethereum.html": """
        <!-- BIBLIOGRAPHY -->
        <div class="content-section" data-aos="fade-up" style="border-top: 1px dashed #333;">
            <div class="feature-box" style="background: rgba(98, 126, 234, 0.05); border-left: 3px solid var(--eth-purple);">
                <h4><i class="fa-solid fa-book" style="color: var(--eth-purple);"></i> Références & Académie</h4>
                <ul style="color: #ccc; font-size: 14px; padding-left: 20px; line-height: 1.8; margin-top: 10px;">
                    <li>Buterin, V. (2013). <i>A Next-Generation Smart Contract and Decentralized Application Platform</i>. (<a href="https://ethereum.org/en/whitepaper/" target="_blank" style="color: var(--eth-purple);">Whitepaper</a>)</li>
                    <li>Buterin, V. et al. (EIP-1559). <i>Fee market change for ETH 1.0 chain</i>. (<a href="https://eips.ethereum.org/EIPS/eip-1559" target="_blank" style="color: var(--eth-purple);">EIP Specification</a>)</li>
                    <li>Github Repo: <a href="https://github.com/ethereum/consensus-specs" target="_blank" style="color: var(--eth-purple);">Ethereum Proof-of-Stake Consensus Specifications</a></li>
                </ul>
            </div>
        </div>
    """,
    "networks/solana.html": """
        <!-- BIBLIOGRAPHY -->
        <div class="content-section" data-aos="fade-up" style="border-top: 1px dashed #333;">
            <div class="feature-box" style="background: rgba(20, 241, 149, 0.05); border-left: 3px solid var(--sol-green);">
                <h4><i class="fa-solid fa-book" style="color: var(--sol-green);"></i> Références & Académie</h4>
                <ul style="color: #ccc; font-size: 14px; padding-left: 20px; line-height: 1.8; margin-top: 10px;">
                    <li>Yakovenko, A. (2017). <i>Solana: A new architecture for a high performance blockchain v0.8.13</i>. (<a href="https://solana.com/solana-whitepaper.pdf" target="_blank" style="color: var(--sol-green);">Whitepaper</a>)</li>
                    <li>Solana Docs. <i>Sealevel - Parallel Smart Contracts Processing</i>. (<a href="https://docs.solana.com/implemented-proposals/sealevel" target="_blank" style="color: var(--sol-green);">Docs</a>)</li>
                    <li>Network Metrics & Explorer: <a href="https://explorer.solana.com/" target="_blank" style="color: var(--sol-green);">Solana Foundation Dashboard</a></li>
                </ul>
            </div>
        </div>
    """,
    "networks/bnb.html": """
        <!-- BIBLIOGRAPHY -->
        <div class="content-section" data-aos="fade-up" style="border-top: 1px dashed #333;">
            <div class="feature-box" style="background: rgba(243, 186, 47, 0.05); border-left: 3px solid var(--bnb-yellow);">
                <h4><i class="fa-solid fa-book" style="color: var(--bnb-yellow);"></i> Références & Académie</h4>
                <ul style="color: #ccc; font-size: 14px; padding-left: 20px; line-height: 1.8; margin-top: 10px;">
                    <li>Binance. (2020). <i>BNB Smart Chain: A Dual-Chain Architecture</i>. (<a href="https://github.com/bnb-chain/whitepaper" target="_blank" style="color: var(--bnb-yellow);">Whitepaper</a>)</li>
                    <li>BNB Chain Docs. <i>Proof of Staked Authority (PoSA) Consensus Engine</i>. (<a href="https://docs.bnbchain.org/" target="_blank" style="color: var(--bnb-yellow);">Docs</a>)</li>
                    <li>Network Validation: <a href="https://bscscan.com/validators" target="_blank" style="color: var(--bnb-yellow);">BscScan Validator Leaderboard</a></li>
                </ul>
            </div>
        </div>
    """
}

base_path = '/Users/joanl/blockchain-presentation/'

for rel_path, biblio_html in bibliographies.items():
    file_path = os.path.join(base_path, rel_path)
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Inject bibliography right before the quiz container or the end of the container div if hub
    if "<!-- BIBLIOGRAPHY -->" not in content:
        if "id=\"quiz-container\"" in content:
            # For network subpages
            content = content.replace('<div class="content-section" data-aos="fade-up" id="quiz-container">', biblio_html + '\n        <div class="content-section" data-aos="fade-up" id="quiz-container">')
        else:
            # For index hub
            content = content.replace('</div>\n\n    <!-- FOOTER -->', biblio_html + '\n    </div>\n\n    <!-- FOOTER -->')
            
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

print("Bibliographies successfully injected in all 5 pages.")
