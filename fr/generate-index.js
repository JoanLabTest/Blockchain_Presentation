const fs = require('fs');
const path = require('path');

// CONFIG
const TARGET_FILES = [
    'index.html',
    'pos-economics.html',
    'smart-contracts.html',
    'yield-mechanics.html',
    'legal_pilot.html',
    'ai-finance.html',
    'guide.html',
    'simple.html'
];

const OUTPUT_FILE = 'search-index.json';

// CATEGORY MAPPING
const CATEGORY_RULES = {
    'pos-economics.html': 'RISK',
    'smart-contracts.html': 'TECH',
    'yield-mechanics.html': 'MACRO',
    'legal_pilot.html': 'LEGAL',
    'ai-finance.html': 'TECH',
    'guide.html': 'TOOL',
    'simple.html': 'TOOL',
    'index.html': 'GOV' // Default / Hub
};

// KEYWORD TAGGER (Simple NLP)
const AUTO_TAGS = {
    'risk': ['#Risk', '#Danger'],
    'liquidity': ['#Liquidity', '#Market'],
    'staking': ['#Staking', '#PoS'],
    'contract': ['#SmartContract', '#Code'],
    'legal': ['#Regulation', '#Compliance'],
    'security': ['#Security', '#Audit'],
    'yield': ['#Yield', '#APY'],
    'ai': ['#AI', '#Tech'],
    'token': ['#Tokenization', '#RWA']
};

function extractContent(html) {
    const items = [];

    // Regex for Sections with ID
    const sectionRegex = /<section[^>]*id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/section>/gi;
    let match;

    while ((match = sectionRegex.exec(html)) !== null) {
        const sectionId = match[1];
        const sectionContent = match[2];

        // Extract H2
        const h2Match = /<h2[^>]*>(.*?)<\/h2>/i.exec(sectionContent);
        const title = h2Match ? cleanText(h2Match[1]) : `Section ${sectionId}`;

        // Extract Text (Paragraphs)
        const pRegex = /<p[^>]*>(.*?)<\/p>/gi;
        let pMatch;
        let fullText = "";

        while ((pMatch = pRegex.exec(sectionContent)) !== null) {
            fullText += cleanText(pMatch[1]) + " ";
        }

        if (fullText.length > 20) {
            items.push({
                id: sectionId,
                title: title,
                content: fullText.substring(0, 150) + "...", // Short snippet
                fullText: fullText.trim(), // Full text for search
            });
        }
    }
    return items;
}

function cleanText(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function generateTags(text) {
    let tags = [];
    const lowerText = text.toLowerCase();

    Object.keys(AUTO_TAGS).forEach(key => {
        if (lowerText.includes(key)) {
            tags = [...tags, ...AUTO_TAGS[key]];
        }
    });

    return [...new Set(tags)]; // Unique
}

// MAIN EXECUTION
console.log("🚀 Starting Automatic Index Generation...");
let masterIndex = [];

TARGET_FILES.forEach(fileName => {
    const filePath = path.join(__dirname, fileName);
    if (fs.existsSync(filePath)) {
        console.log(`Processing ${fileName}...`);
        const html = fs.readFileSync(filePath, 'utf8');
        const sections = extractContent(html);

        sections.forEach(section => {
            const category = CATEGORY_RULES[fileName] || 'TECH';
            const tags = generateTags(section.fullText);

            masterIndex.push({
                id: `${fileName.replace('.html', '')}-${section.id}`,
                title: section.title,
                page: fileName,
                anchor: `#${section.id}`,
                category: category,
                type: 'Auto-Index', // Mark as auto-generated
                tags: tags,
                content: section.content,
                fullText: section.fullText,
                weight: 5 // Default weight for auto-items
            });
        });
    } else {
        console.warn(`File not found: ${fileName}`);
    }
});

// MERGE WITH MANUAL HIGH-VALUE ITEMS
// (In a real scenario, we might want to keep manual items as overrides. 
// For this demo, let's append them or keep them if they have higher weight.)

try {
    const existingIndex = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    console.log(`Loaded ${existingIndex.length} existing manual items.`);

    // Filter out previous auto-generated items to avoid dupes if re-running
    const manualItems = existingIndex.filter(i => i.weight > 5);

    // Combine: Manual (High Priority) + Auto (Background Coverage)
    const finalIndex = [...manualItems, ...masterIndex];

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(finalIndex, null, 4));
    console.log(`✅ Successfully generated index with ${finalIndex.length} items.`);

} catch (e) {
    console.error("Error reading/writing index:", e);
    // If no existing file, just write the new one
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(masterIndex, null, 4));
}
