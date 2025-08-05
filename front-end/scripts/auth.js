// Toggle password visibility
function setupPasswordToggle() {
    const togglePassword = document.querySelector('.toggle-password');
    const password = document.getElementById('pwd');
    const eyeIcon = document.querySelector('.eye-icon');

    if (togglePassword && password) {
        togglePassword.addEventListener('click', function() {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            
            eyeIcon.textContent = type === 'password' ? '👁️' : '🔒';
            
            const isPressed = this.getAttribute('aria-pressed') === 'true';
            this.setAttribute('aria-pressed', !isPressed);
        });
    }
}

// Login function
async function login() {
    const username = document.getElementById('txt-username').value;
    const password = document.getElementById('pwd').value;
    const messageDiv = document.getElementById('message');
    const loader = document.querySelector('.loader');

    // Basic validation
    if (!username || !password) {
        showMessage('Please enter both username and password', 'error');
        return;
    }

    try {
        // Show loader
        if (loader) loader.style.display = 'flex';
        
        // Here you would typically make an API call to your backend
        // For now, we'll simulate a delay and show success message
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate successful login
        showMessage('Login successful! Redirecting...', 'success');
        
        // Redirect after a short delay
        setTimeout(() => {
            window.location.href = '../pages/home.html';
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        showMessage('Invalid username or password', 'error');
    } finally {
        // Hide loader
        if (loader) loader.style.display = 'none';
    }
}

// Helper function to show messages
function showMessage(message, type = 'error') {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = 'message';
        messageDiv.classList.add(type);
        messageDiv.style.display = 'block';
        
        // Auto-hide message after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Initialize when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    setupPasswordToggle();
    
    // If there's a form, prevent default submission
    const form = document.querySelector('.login-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            login();
        });
    }
});
