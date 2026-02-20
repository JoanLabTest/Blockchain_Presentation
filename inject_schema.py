import os
import glob
from bs4 import BeautifulSoup

# Define Schemas for each page
schemas = {
    "networks/index.html": {
        "headline": "Blockchain Networks Hub | Institutional Architecture Analysis",
        "description": "Portail comparatif des infrastructures Layer 1 : Consensus, Throughput, Tokenomics et Décentralisation pour Bitcoin, Ethereum, Solana et BNB.",
        "keywords": '["Blockchain", "Layer 1", "Consensus", "Bitcoin", "Ethereum", "Solana", "BNB"]'
    },
    "networks/bitcoin.html": {
        "headline": "Bitcoin (BTC) | Architecture & Tokenomics pour les Institutionnels",
        "description": "Analyse académique de Bitcoin : Architecture UTXO, Preuve de Travail (PoW), mécanique du Halving, Lightning Network et vecteurs de risques (Mining Pools).",
        "keywords": '["Bitcoin", "BTC", "PoW", "Halving", "Lightning Network", "UTXO", "Store of Value"]'
    },
    "networks/ethereum.html": {
        "headline": "Ethereum (ETH) | EVM, PoS & Ultrasound Money",
        "description": "Deep-dive institutionnel sur Ethereum : Transition Proof of Stake, The Merge, mécanique de burn EIP-1559, et scalabilité Rollup-centric (L2).",
        "keywords": '["Ethereum", "ETH", "EVM", "PoS", "EIP-1559", "Rollups", "Smart Contracts"]'
    },
    "networks/solana.html": {
        "headline": "Solana (SOL) | Analyse de la Haute Fréquence Blockchain",
        "description": "Étude technique de Solana : Proof of History (PoH), parallélisme Sealevel, tokenomics inflationnistes et risques de centralisation matérielle.",
        "keywords": '["Solana", "SOL", "PoH", "Sealevel", "High Frequency", "TPS", "DeFi"]'
    },
    "networks/bnb.html": {
        "headline": "BNB Smart Chain (BSC) | Compromis Corporate & Consensus PoSA",
        "description": "Analyse institutionnelle de la BNB Smart Chain : Consensus Proof of Staked Authority (PoSA) à 21 nœuds, politique d'Auto-Burn et centralisation Binance.",
        "keywords": '["BNB Chain", "BSC", "PoSA", "Binance", "EVM", "Auto-Burn", "Centralization"]'
    }
}

base_path = '/Users/joanl/blockchain-presentation/'

for rel_path, schema_data in schemas.items():
    file_path = os.path.join(base_path, rel_path)
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Generate JSON-LD Snippet
    json_ld = f"""
    <!-- JSON-LD SCHEMA -->
    <script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "{schema_data['headline']}",
      "description": "{schema_data['description']}",
      "keywords": {schema_data['keywords']},
      "author": {{
        "@type": "Organization",
        "name": "DCM Digital | Research OS"
      }},
      "datePublished": "2026-02-20",
      "dateModified": "2026-02-20",
      "publisher": {{
        "@type": "Organization",
        "name": "DCM Digital"
      }}
    }}
    </script>
    """

    # Inject JSON-LD just before </head> if not already there
    if '<script type="application/ld+json">' not in content:
        content = content.replace('</head>', json_ld + '</head>')
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("JSON-LD successfully injected in all 5 pages.")
