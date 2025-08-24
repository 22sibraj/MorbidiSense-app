/**
 * Loads HTML templates into the specified elements
 * Should be included in all HTML files that need navigation
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Load header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        try {
            const response = await fetch('../templates/header.html');
            if (response.ok) {
                headerPlaceholder.outerHTML = await response.text();
            }
        } catch (error) {
            console.error('Error loading header:', error);
        }
    }

    // Load sidebar
    const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
    if (sidebarPlaceholder) {
        try {
            const response = await fetch('../templates/sidebar.html');
            if (response.ok) {
                sidebarPlaceholder.outerHTML = await response.text();
                
                // Highlight active link after sidebar loads
                highlightActiveLink();
            }
        } catch (error) {
            console.error('Error loading sidebar:', error);
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
