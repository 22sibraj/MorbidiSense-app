/**
 * Utility script to update HTML files with the new navigation system
 * Run this script using Node.js to automatically update all HTML files
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PAGES_DIR = path.join(__dirname, '..', 'pages');
const TEMPLATES_DIR = path.join(__dirname, '..', 'templates');
const CORE_CSS_PATH = '../style/core.css';
const NAVIGATION_JS_PATH = '../scripts/navigation.js';
const LOAD_TEMPLATES_JS_PATH = '../scripts/loadTemplates.js';

// Common head content to be added to all pages
const COMMON_HEAD = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/x-icon" href="../image/favicon.ico">
    <link rel="stylesheet" href="${CORE_CSS_PATH}">
    <!-- Load navigation system -->
    <script src="${NAVIGATION_JS_PATH}" defer></script>
    <script src="${LOAD_TEMPLATES_JS_PATH}" defer></script>`;

// Common body start content
const BODY_START = `
    <!-- Header will be loaded here -->
    <div id="header-placeholder"></div>

    <!-- Sidebar will be loaded here -->
    <div id="sidebar-placeholder"></div>
    
    <!-- Page transition overlay -->
    <div id="page-transition" class="page-transition">
        <div class="loader"></div>
    </div>

    <div class="main-content">`;

// Common body end content
const BODY_END = `
    </div>`;

// Function to process HTML files
async function updateHtmlFiles() {
    try {
        // Get all HTML files in the pages directory
        const files = fs.readdirSync(PAGES_DIR).filter(file => file.endsWith('.html'));
        
        for (const file of files) {
            const filePath = path.join(PAGES_DIR, file);
            console.log(`Processing ${file}...`);
            
            // Skip login.html as it's already been updated
            if (file === 'login.html') {
                console.log('Skipping login.html (already updated)');
                continue;
            }
            
            // Read the file content
            let content = fs.readFileSync(filePath, 'utf8');
            
            // Skip files that already have the navigation system
            if (content.includes('id="header-placeholder"')) {
                console.log(`Skipping ${file} (already has navigation system)`);
                continue;
            }
            
            // Update head section
            content = content.replace(
                /<head>([\s\S]*?)<\/head>/,
                `<head>${COMMON_HEAD}
    <title>${extractTitle(content)}</title>
</head>`
            );
            
            // Update body section
            content = content.replace(
                /<body([^>]*)>([\s\S]*?)<\/body>/,
                (match, bodyAttrs, bodyContent) => {
                    // Preserve body classes
                    const bodyClass = bodyAttrs.match(/class=["']([^"']+)["']/);
                    const bodyClassAttr = bodyClass ? ` class="${bodyClass[1]}"` : '';
                    
                    // Wrap existing content in main-content div
                    return `<body${bodyClassAttr}>${BODY_START}
        ${bodyContent.trim()}
    ${BODY_END}
</body>`;
                }
            );
            
            // Save the updated content
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${file} with new navigation system`);
        }
        
        console.log('\nAll files have been updated with the new navigation system!');
        
    } catch (error) {
        console.error('Error updating HTML files:', error);
    }
}

// Helper function to extract title from HTML
function extractTitle(content) {
    const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : 'MorbidiSense App';
}

// Run the script
updateHtmlFiles();
