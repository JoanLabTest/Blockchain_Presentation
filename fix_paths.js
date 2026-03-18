const fs = require('fs');
const path = require('path');

function fixPaths(filePath, levelsDeep) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add prefix '../' depending on how many levels deeper the file was moved
    // If it was in en/ (level 0) and moved to en/learn/ (level 1), we add one '../'
    // If it moved to en/academy/pro/ (level 2), we add '../' twice.
    const prefix = '../'.repeat(levelsDeep);
    
    // We only want to replace relative links. 
    // This regex looks for href="...", src="..."
    let modified = content.replace(/(href|src)="([^"]+)"/g, (match, attr, url) => {
        // Skip absolute, root-relative, external, anchors, and data URIs
        if (url.startsWith('http') || url.startsWith('//') || url.startsWith('#') || url.startsWith('data:') || url.startsWith('/')) {
            return match;
        }
        
        // If it already has ../, we just prepend the prefix
        // For example, if it was ../js/script.js, it becomes ../../js/script.js
        if (url.startsWith('../')) {
            return `${attr}="${prefix}${url}"`;
        }
        
        // If it starts with ./, strip it and prepend prefix
        if (url.startsWith('./')) {
            return `${attr}="${prefix}${url.substring(2)}"`;
        }
        
        // For local files (e.g. styles.css), prepend prefix
        return `${attr}="${prefix}${url}"`;
    });
    
    fs.writeFileSync(filePath, modified);
    console.log(`Updated paths in ${filePath} (+${levelsDeep} levels)`);
}

// en/simple.html -> en/learn/index.html (Moved 1 level down)
fixPaths('en/learn/index.html', 1);

// en/guide.html -> en/expert/index.html (Moved 1 level down)
fixPaths('en/expert/index.html', 1);

// en/quiz.html -> en/academy/pro/index.html (Moved 2 levels down from en/)
fixPaths('en/academy/pro/index.html', 2);
