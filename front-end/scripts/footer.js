// Load footer into all pages
document.addEventListener('DOMContentLoaded', function() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('../templates/footer.html')
            .then(response => response.text())
            .then(html => {
                footerPlaceholder.outerHTML = html;
            })
            .catch(error => {
                console.error('Error loading footer:', error);
            });
    }
});
