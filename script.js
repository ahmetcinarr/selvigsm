/* ==========================================================================
   MobileHub - Interactive JavaScript
   ========================================================================== */

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeAnimations();
    initializeFormValidation();
    initializeInteractiveFeatures();
});

/* ==========================================================================
   Theme Management (Dark/Light Mode)
   ========================================================================== */

function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const htmlElement = document.documentElement;
    
    // Get saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Theme toggle event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = htmlElement.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }
    
    function setTheme(theme) {
        htmlElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (themeIcon) {
            if (theme === 'dark') {
                themeIcon.className = 'fas fa-sun';
            } else {
                themeIcon.className = 'fas fa-moon';
            }
        }
        
        // Animate theme transition
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }
}

/* ==========================================================================
   Animation Initialization
   ========================================================================== */

function initializeAnimations() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            delay: 0
        });
    }
    
    // Add intersection observer for custom animations
    initializeScrollAnimations();
    
    // Initialize floating elements animation
    initializeFloatingElements();
    
    // Initialize hover effects
    initializeHoverEffects();
}

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.stat-item, .feature-card, .product-card');
    animateElements.forEach(el => observer.observe(el));
}

function initializeFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        // Add random movement
        setInterval(() => {
            const randomX = Math.random() * 20 - 10;
            const randomY = Math.random() * 20 - 10;
            element.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }, 3000 + index * 1000);
    });
}

function initializeHoverEffects() {
    // Product card hover effects
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Button shine effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.overflow = 'hidden';
            
            const shine = document.createElement('div');
            shine.style.cssText = `
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s;
                pointer-events: none;
            `;
            
            this.appendChild(shine);
            
            setTimeout(() => {
                shine.style.left = '100%';
            }, 10);
            
            setTimeout(() => {
                if (shine.parentNode) {
                    shine.parentNode.removeChild(shine);
                }
            }, 600);
        });
    });
}

/* ==========================================================================
   Form Validation
   ========================================================================== */

function initializeFormValidation() {
    const activationForm = document.getElementById('activationForm');
    
    if (activationForm) {
        activationForm.addEventListener('submit', handleFormSubmission);
        
        // Real-time validation
        const formInputs = activationForm.querySelectorAll('input, select, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearValidation);
        });
    }
}

function handleFormSubmission(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const form = event.target;
    const isValid = validateForm(form);
    
    if (isValid) {
        submitForm(form);
    } else {
        // Scroll to first invalid field
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstInvalid.focus();
        }
    }
}

function validateForm(form) {
    let isValid = true;
    const formData = new FormData(form);
    
    // Validate each field
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(event) {
    const field = event.target;
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldId = field.id;
    
    let isValid = true;
    let errorMessage = '';
    
    // Check if field is required
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
    }
    
    // Specific validation based on field type/id
    if (value && isValid) {
        switch (fieldId) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address.';
                }
                break;
                
            case 'phoneNumber':
                const phoneRegex = /^[0-9]{10}$/;
                if (!phoneRegex.test(value.replace(/\D/g, ''))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid 10-digit phone number.';
                }
                break;
                
            case 'nationalId':
                const idRegex = /^[0-9]{9,11}$/;
                if (!idRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid National ID (9-11 digits).';
                }
                break;
                
            case 'simNumber':
                const simRegex = /^[0-9]{19,20}$/;
                if (!simRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid SIM card number (19-20 digits).';
                }
                break;
                
            case 'fullName':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long.';
                }
                break;
        }
    }
    
    // Update field validation state
    updateFieldValidation(field, isValid, errorMessage);
    
    return isValid;
}

function updateFieldValidation(field, isValid, errorMessage) {
    const feedback = field.nextElementSibling;
    
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        
        if (feedback && feedback.classList.contains('invalid-feedback')) {
            feedback.textContent = errorMessage;
        }
    }
}

function clearValidation(event) {
    const field = event.target;
    field.classList.remove('is-valid', 'is-invalid');
}

function submitForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const successMessage = document.getElementById('successMessage');
    
    // Show loading state
    if (submitButton) {
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
        submitButton.disabled = true;
        form.classList.add('loading');
    }
    
    // Simulate form submission
    setTimeout(() => {
        // Hide loading state
        if (submitButton) {
            submitButton.innerHTML = '<i class="fas fa-check me-2"></i>Activated!';
            form.classList.remove('loading');
        }
        
        // Show success message
        if (successMessage) {
            successMessage.classList.remove('d-none');
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Reset form after delay
        setTimeout(() => {
            form.reset();
            form.querySelectorAll('.is-valid').forEach(field => {
                field.classList.remove('is-valid');
            });
            
            if (submitButton) {
                submitButton.innerHTML = '<i class="fas fa-rocket me-2"></i>Activate SIM Card';
                submitButton.disabled = false;
            }
            
            if (successMessage) {
                successMessage.classList.add('d-none');
            }
        }, 5000);
        
    }, 2000);
}

/* ==========================================================================
   Interactive Features
   ========================================================================== */

function initializeInteractiveFeatures() {
    initializeProductTabs();
    initializeSearchFeatures();
    initializeCartFunctionality();
    initializeNavbarEffects();
    initializeKeyboardNavigation();
}

function initializeProductTabs() {
    const tabButtons = document.querySelectorAll('[data-bs-toggle="pill"]');
    
    tabButtons.forEach(button => {
        button.addEventListener('shown.bs.tab', function(event) {
            // Refresh AOS animations for newly visible content
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
            
            // Add stagger animation to product cards
            const targetPane = document.querySelector(event.target.getAttribute('data-bs-target'));
            if (targetPane) {
                const cards = targetPane.querySelectorAll('.product-card');
                cards.forEach((card, index) => {
                    card.style.animationDelay = `${index * 0.1}s`;
                    card.classList.add('fade-in-up');
                });
            }
        });
    });
}

function initializeSearchFeatures() {
    // Add search functionality (placeholder for future implementation)
    const searchInputs = document.querySelectorAll('input[type="search"]');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', debounce(function(event) {
            const query = event.target.value.toLowerCase();
            // Implement search logic here
            console.log('Searching for:', query);
        }, 300));
    });
}

function initializeCartFunctionality() {
    const addToCartButtons = document.querySelectorAll('.btn:contains("Add to Cart")');
    
    document.addEventListener('click', function(event) {
        if (event.target.closest('.btn') && event.target.textContent.includes('Add to Cart')) {
            event.preventDefault();
            
            const button = event.target.closest('.btn');
            const originalText = button.innerHTML;
            
            // Animation feedback
            button.innerHTML = '<i class="fas fa-check me-2"></i>Added!';
            button.classList.add('btn-success');
            button.classList.remove('btn-primary');
            
            // Reset after delay
            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('btn-success');
                button.classList.add('btn-primary');
            }, 2000);
            
            // Show cart notification (placeholder)
            showNotification('Product added to cart!', 'success');
        }
    });
}

function initializeNavbarEffects() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (navbar) {
            if (currentScrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 500) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
    });
}

function initializeKeyboardNavigation() {
    // Enhanced keyboard navigation
    document.addEventListener('keydown', function(event) {
        // Escape key closes modals/dropdowns
        if (event.key === 'Escape') {
            const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
            openDropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
        
        // Enter key on buttons
        if (event.key === 'Enter' && event.target.classList.contains('btn')) {
            event.target.click();
        }
    });
}

/* ==========================================================================
   Utility Functions
   ========================================================================== */

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

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

function formatPhoneNumber(input) {
    // Format phone number as user types
    let value = input.value.replace(/\D/g, '');
    let formattedValue = '';
    
    if (value.length > 0) {
        formattedValue = value.substring(0, 3);
    }
    if (value.length > 3) {
        formattedValue += '-' + value.substring(3, 6);
    }
    if (value.length > 6) {
        formattedValue += '-' + value.substring(6, 10);
    }
    
    input.value = formattedValue;
}

function smoothScrollTo(target, duration = 1000) {
    const targetElement = document.querySelector(target);
    if (!targetElement) return;
    
    const targetPosition = targetElement.offsetTop - 100;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

/* ==========================================================================
   Performance Optimizations
   ========================================================================== */

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLazyLoading);
} else {
    initializeLazyLoading();
}

/* ==========================================================================
   Error Handling
   ========================================================================== */

window.addEventListener('error', function(event) {
    console.error('JavaScript Error:', event.error);
    // Optionally show user-friendly error message
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
});

/* ==========================================================================
   Export for module systems (if needed)
   ========================================================================== */

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeTheme,
        initializeAnimations,
        initializeFormValidation,
        initializeInteractiveFeatures,
        showNotification,
        smoothScrollTo
    };
}