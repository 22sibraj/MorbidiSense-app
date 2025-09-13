const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'pages');
const pages = fs.readdirSync(pagesDir).filter(file => file.endsWith('.html'));

pages.forEach(page => {
    if (page === 'login.html' || page === 'register.html') return; // Skip auth pages
    
    const filePath = path.join(pagesDir, page);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the page already has the footer placeholder
    if (content.includes('id="footer-placeholder"')) {
        console.log(`Skipping ${page} - already has footer placeholder`);
        return;
    }
    
    // Find the closing </main> tag and insert the footer after it
    if (content.includes('</main>')) {
        const newContent = content.replace(
            '</main>',
            `    </main>

    <!-- Footer Section -->
    <div id="footer-placeholder"></div>

    <!-- Include Footer Script -->
    <script src="../scripts/footer.js"></script>`
        );
        
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${page} with new footer`);
    } else if (content.includes('</body>')) {
        // If no main tag, just add before closing body
        const newContent = content.replace(
            '    </body>',
            `    <!-- Footer Section -->
    <div id="footer-placeholder"></div>

    <!-- Include Footer Script -->
    <script src="../scripts/footer.js"></script>
    </body>`
        );
        
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated ${page} with new footer (before body close)`);
    } else {
        console.log(`Skipping ${page} - could not find insertion point`);
    }
});

console.log('Footer update completed!');
