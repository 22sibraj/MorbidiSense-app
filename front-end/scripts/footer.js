// Load footer into all pages
function loadFooter() {
    console.log('Loading footer...');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    
    if (!footerPlaceholder) {
        console.error('Footer placeholder not found in the DOM');
        return;
    }

    // Add temporary loading message
    footerPlaceholder.innerHTML = '<div style="padding: 10px; background: #f0f0f0; text-align: center;">Loading footer...</div>';
    
    // Try to load the footer
    fetch('../templates/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            console.log('Footer HTML loaded successfully');
            footerPlaceholder.outerHTML = html;
            
            // Re-initialize any footer-specific scripts if needed
            initFooterScripts();
        })
        .catch(error => {
            console.error('Error loading footer:', error);
            // Fallback: Add a visible error message
            footerPlaceholder.innerHTML = `
                <div style="
                    color: #721c24;
                    background-color: #f8d7da;
                    border: 1px solid #f5c6cb;
                    padding: 15px;
                    margin: 10px 0;
                    border-radius: 4px;
                    text-align: center;
                ">
                    <strong>Error loading footer:</strong> ${error.message}
                    <div style="margin-top: 10px; font-size: 0.9em;">
                        Please check the console for more details.
                    </div>
                </div>`;
        });
}

// Initialize any footer-specific scripts
function initFooterScripts() {
    // Back to top button functionality
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Show/hide back to top button
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
    }
}

// Load footer when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
} else {
    loadFooter();
}
