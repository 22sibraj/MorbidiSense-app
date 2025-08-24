// Navigation Service
class NavigationService {
    constructor() {
        this.routes = {
            'home': 'home.html',
            'predict': 'predict-risk.html',
            'explanation': 'explanation.html',
            'reports': 'report.html',
            'health': 'health-insights.html',
            'profile': 'user-profile.html',
            'settings': 'settings.html',
            'login': 'login.html',
            'register': 'register.html',
            'logout': 'logout.html'
        };
        this.templatesLoaded = false;
        this.init();
    }

    async init() {
        document.addEventListener('DOMContentLoaded', async () => {
            // Load templates first if not already loaded
            if (!this.templatesLoaded) {
                await this.loadTemplates();
                this.templatesLoaded = true;
            }
            
            this.setupNavigation();
            this.setupPageTransition();
            this.highlightActiveLink();
            
            // Trigger initial content fade-in
            const mainContent = document.querySelector('.main-content, main');
            if (mainContent) {
                mainContent.style.opacity = '0';
                setTimeout(() => {
                    mainContent.style.opacity = '1';
                }, 50);
            }
        });
    }
    
    async loadTemplates() {
        try {
            // Load header
            const headerResponse = await fetch('../templates/header.html');
            const headerHtml = await headerResponse.text();
            const headerPlaceholder = document.getElementById('header-placeholder');
            if (headerPlaceholder) {
                headerPlaceholder.outerHTML = headerHtml;
            }
            
            // Load sidebar
            const sidebarResponse = await fetch('../templates/sidebar.html');
            const sidebarHtml = await sidebarResponse.text();
            const sidebarPlaceholder = document.getElementById('sidebar-placeholder');
            if (sidebarPlaceholder) {
                sidebarPlaceholder.outerHTML = sidebarHtml;
            }
            
            // Add active class to current page in sidebar
            this.highlightActiveLink();
            
        } catch (error) {
            console.error('Error loading templates:', error);
        }
    }

    setupNavigation() {
        document.body.addEventListener('click', (e) => {
            // Handle navigation links
            if (e.target.closest('[data-route]')) {
                e.preventDefault();
                const route = e.target.closest('[data-route]').dataset.route;
                this.navigateTo(route);
            }
            
            // Handle regular links with href
            const link = e.target.closest('a[href]');
            if (link && !link.target && !link.hasAttribute('data-ignore')) {
                const href = link.getAttribute('href');
                if (href.startsWith('http') || href.startsWith('//') || href.startsWith('#')) {
                    return; // Skip external links and anchors
                }
                e.preventDefault();
                this.navigateToUrl(href);
            }
        });
    }

    async navigateTo(route) {
        const path = this.routes[route] || route;
        await this.navigateToUrl(path);
    }

    async navigateToUrl(url) {
        // Don't navigate if already on this page
        if (window.location.pathname.endsWith(url)) {
            return;
        }
        
        // Show loading state
        this.showPageTransition();
        
        try {
            // Fetch the new page
            const response = await fetch(url);
            if (!response.ok) throw new Error('Page not found');
            
            const html = await response.text();
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, 'text/html');
            
            // Update the page content
            document.title = newDoc.title;
            document.body.className = newDoc.body.className;
            
            // Fade out current content
            const oldContent = document.querySelector('.main-content, main');
            if (oldContent) {
                oldContent.style.opacity = '0';
                oldContent.style.transform = 'translateY(10px)';
            }
            
            // Small delay for fade out
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Get new content
            const newContent = newDoc.querySelector('.main-content, main');
            
            if (newContent && oldContent) {
                // Replace content
                oldContent.innerHTML = newContent.innerHTML;
                
                // Fade in new content
                setTimeout(() => {
                    oldContent.style.opacity = '1';
                    oldContent.style.transform = 'translateY(0)';
                    
                    // Update URL without page reload
                    window.history.pushState({}, '', url);
                    
                    // Update active link
                    this.highlightActiveLink();
                    
                    // Hide transition loader
                    this.hidePageTransition();
                    
                    // Scroll to top
                    window.scrollTo(0, 0);
                    
                }, 50);
            } else {
                // Fallback to traditional navigation if structure doesn't match
                window.location.href = url;
            }
        } catch (error) {
            console.error('Navigation error:', error);
            window.location.href = url; // Fallback to traditional navigation
        }
    }

    showPageTransition() {
        let loader = document.getElementById('page-transition');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'page-transition';
            loader.innerHTML = '<div class="loader"></div>';
            document.body.appendChild(loader);
        }
        loader.classList.add('active');
    }

    hidePageTransition() {
        const loader = document.getElementById('page-transition');
        if (loader) {
            loader.classList.remove('active');
            setTimeout(() => {
                if (loader) loader.remove();
            }, 500);
        }
    }

    setupPageTransition() {
        const style = document.createElement('style');
        style.textContent = `
            #page-transition {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }
            #page-transition.active {
                opacity: 1;
                pointer-events: all;
            }
            #page-transition .loader {
                border: 4px solid #f3f3f3;
                border-top: 4px solid #4361ee;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            /* Smooth page transitions */
            main, .main-content, body > div:not(.header):not(.sidebar) {
                transition: opacity 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    highlightActiveLink() {
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
}

// Initialize navigation service
const navigation = new NavigationService();

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
    navigation.navigateToUrl(window.location.pathname);
});

// Export for use in other modules
window.NavigationService = navigation;
