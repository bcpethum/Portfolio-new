// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme preference or default to system preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
} else if (prefersDarkScheme.matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon('dark');
}

// Theme toggle event listener
themeToggle.addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', function() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(115, 70, 199, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'var(--bg-primary)';
        navbar.style.backdropFilter = 'blur(20px)';
    }
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', function() {
    let current = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            
            // Add staggered animation for timeline items
            if (entry.target.classList.contains('timeline-item')) {
                const items = document.querySelectorAll('.timeline-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('slide-in-left');
                    }, index * 200);
                });
            }
            
            // Add staggered animation for skill badges
            if (entry.target.classList.contains('skill-category')) {
                const badges = entry.target.querySelectorAll('.skill-badge');
                badges.forEach((badge, index) => {
                    setTimeout(() => {
                        badge.style.animation = `slideInUp 0.5s ease ${index * 0.1}s both`;
                    }, 100);
                });
            }
        }
    });
}, observerOptions);

// Observe all sections and key elements
document.querySelectorAll('.section, .timeline-item, .skill-category, .education-item, .reference-item').forEach(el => {
    observer.observe(el);
});

// EmailJS Configuration & Contact form handling
// Wait for DOM and SDK to be ready, then attach handlers
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    // Ensure EmailJS SDK is available
    if (!window.emailjs) {
        console.error('EmailJS SDK failed to load.');
        showNotification('Email service not available. Please refresh the page.', 'error');
        return;
    }

    // Initialize EmailJS
    emailjs.init({
        publicKey: "agiH9azgoI5fxvJN0", // Replace with your EmailJS Public Key from https://dashboard.emailjs.com/admin/account
    });

    // No form present
    if (!contactForm) {
        return;
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Simple form validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Prepare button for sending state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton ? submitButton.innerHTML : '';
        
        if (submitButton) {
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
        }
        
        // Send email using EmailJS
        emailjs.sendForm(
            'service_kodrqb8',      // Service ID from https://dashboard.emailjs.com/admin
            'template_jd41c2k',     // Template ID from https://dashboard.emailjs.com/admin/templates
            contactForm
        )
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            contactForm.reset();
            if (submitButton) {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        }, function(error) {
            console.error('FAILED...', error);
            const detail = error?.text || 'Please try again or contact me directly.';
            showNotification(`Email failed: ${detail}`, 'error');
            if (submitButton) {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    });
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add notification styles if not already present
    if (!document.querySelector('.notification-styles')) {
        const notificationStyles = document.createElement('style');
        notificationStyles.className = 'notification-styles';
        notificationStyles.textContent = `
            .notification {
                position: fixed;
                top: 90px;
                right: 20px;
                background: var(--bg-primary);
                border-radius: var(--radius-md);
                box-shadow: 0 8px 25px var(--shadow);
                z-index: 10000;
                animation: slideInRight 0.3s ease;
                max-width: 400px;
            }
            
            .notification-success {
                border-left: 4px solid #27ae60;
            }
            
            .notification-error {
                border-left: 4px solid #e74c3c;
            }
            
            .notification-content {
                padding: 16px;
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .notification-success .fa-check-circle {
                color: #27ae60;
            }
            
            .notification-error .fa-exclamation-circle {
                color: #e74c3c;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                margin-left: auto;
                padding: 4px;
                border-radius: 4px;
                transition: all var(--transition-fast);
            }
            
            .notification-close:hover {
                background: var(--bg-secondary);
                color: var(--text-primary);
            }
        `;
        document.head.appendChild(notificationStyles);
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Download CV function
function downloadCV() {
    // In a real implementation, this would download an actual CV file
    showNotification('CV Downloading', 'success');
}

// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation on page load
document.addEventListener('DOMContentLoaded', function() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 80);
        }, 1000);
    }
});

// Particles animation for hero background
function createParticles() {
    const hero = document.querySelector('.hero');
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
        z-index: 0;
    `;
    
    hero.appendChild(particlesContainer);
    
    for (let i = 0; i < 50; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: var(--primary-color);
        border-radius: 50%;
        opacity: 0.1;
        animation: float ${Math.random() * 20 + 10}s linear infinite;
    `;
    
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    
    container.appendChild(particle);
    
    // Remove and recreate particle after animation
    particle.addEventListener('animationend', () => {
        particle.remove();
        createParticle(container);
    });
}

// Initialize particles on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(createParticles, 2000);
});

// Skill bars animation (alternative to badges)
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach(bar => {
        const percentage = bar.dataset.percentage;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = percentage + '%';
        }, 500);
    });
}

// Performance optimization: Debounced scroll handler
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(function() {
    const navbar = document.querySelector('.navbar');
    const scrolled = window.scrollY > 100;
    
    if (scrolled) {
        navbar.style.background = 'rgba(106, 86, 129, 0.95)';
    } else {
        navbar.style.background = 'var(--bg-primary)';
    }
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);

// Preloader
window.addEventListener('load', function() {
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--bg-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;
    
    preloader.innerHTML = `
        <div class="loader">
            <div class="loader-ring"></div>
            <div class="loader-text">PETHUM</div>
        </div>
    `;
    
    const loaderStyles = document.createElement('style');
    loaderStyles.textContent = `
        .loader {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .loader-ring {
            width: 60px;
            height: 60px;
            border: 3px solid var(--bg-secondary);
            border-top: 3px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            position: absolute;
        }
        
        .loader-text {
            font-weight: 700;
            font-size: 1rem;
            color: var(--primary-color);
            letter-spacing: 2px;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    
    document.head.appendChild(loaderStyles);
    document.body.appendChild(preloader);
    
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.remove();
        }, 500);
    }, 1500);
});