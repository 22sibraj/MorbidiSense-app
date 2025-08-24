/**
 * Loads HTML templates into the specified elements
 * Should be included in all HTML files that need navigation
 */

// Function to get the correct base path for templates
function getBasePath() {
    // Check if we're in the pages directory
    const currentPath = window.location.pathname;
    if (currentPath.includes('/pages/')) {
        return '../templates/';
    }
    return 'templates/';
}

document.addEventListener('DOMContentLoaded', async function() {
    const basePath = getBasePath();
    
    // Show loader
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'flex';
    
    try {
        // Load header
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            const headerResponse = await fetch(`${basePath}header.html`);
            if (headerResponse.ok) {
                headerPlaceholder.outerHTML = await headerResponse.text();
            } else {
                console.error('Failed to load header template');
            }
        }

        // Load sidebar
        const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
        if (sidebarPlaceholder) {
            const sidebarResponse = await fetch(`${basePath}sidebar.html`);
            if (sidebarResponse.ok) {
                sidebarPlaceholder.outerHTML = await sidebarResponse.text();
                // Highlight active link after sidebar loads
                highlightActiveLink();
            } else {
                console.error('Failed to load sidebar template');
            }
        }

        // Add page transition overlay if it doesn't exist
        if (!document.getElementById('page-transition')) {
            const pageTransition = document.createElement('div');
            pageTransition.id = 'page-transition';
            pageTransition.className = 'page-transition';
            pageTransition.innerHTML = '<div class="loader"></div>';
            document.body.appendChild(pageTransition);
        }
    } catch (error) {
        console.error('Error loading templates:', error);
    } finally {
        // Hide loader
        if (loader) loader.style.display = 'none';
        
        // Show main content with fade-in effect
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.opacity = '0';
            mainContent.style.display = 'block';
            setTimeout(() => {
                mainContent.style.opacity = '1';
                mainContent.style.transition = 'opacity 0.3s ease-in-out';
            }, 50);
        }
    }
});

/**
 * Highlights the active link in the navigation
 */
function highlightActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'home.html';
    
    // Update sidebar links
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        const href = link.getAttribute('href') || '';
        const routeMatch = href.split('/').pop() || '';
        
        if (currentPath === routeMatch || 
            (routeMatch && currentPath.startsWith(routeMatch.split('.')[0]))) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
            
            // Also highlight parent menu item if exists
            const parentItem = link.closest('.item');
            if (parentItem) {
                parentItem.classList.add('active');
            }
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
            
            // Remove active class from parent if no child is active
            const parentItem = link.closest('.item');
            if (parentItem && !parentItem.querySelector('.active')) {
                parentItem.classList.remove('active');
            }
        }
    });
    
    // Update data-route links
    document.querySelectorAll('[data-route]').forEach(link => {
        const route = link.dataset.route;
        if (route && currentPath.includes(route.split('.')[0])) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}
