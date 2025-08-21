// Modern Data Rescue Hub JavaScript
class DataRescueHub {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initNavigation();
        this.initScrollEffects();
        this.initAnimations();
        this.initFormHandlers();
        this.initModalHandlers();
        this.initServiceCards();
        this.fixDropdowns();
    }

    setupEventListeners() {
        window.addEventListener('load', () => this.handlePageLoad());
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    // Navigation Functions
    initNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Mobile menu toggle - Fixed
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
            });
        }

        // Smooth scrolling for navigation links - Fixed
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    const targetElement = document.querySelector(href);
                    
                    if (targetElement) {
                        // Close mobile menu first if open
                        if (navToggle && navMenu) {
                            navToggle.classList.remove('active');
                            navMenu.classList.remove('active');
                            document.body.style.overflow = 'auto';
                        }
                        
                        // Smooth scroll to target
                        const navbar = document.querySelector('.navbar');
                        const navbarHeight = navbar ? navbar.offsetHeight : 80;
                        const targetPosition = targetElement.offsetTop - navbarHeight - 20;

                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Update active link
                        navLinks.forEach(nl => nl.classList.remove('active'));
                        link.classList.add('active');
                    }
                }
            });
        });

        // Close mobile menu when clicking outside - Fixed
        document.addEventListener('click', (e) => {
            if (navToggle && navMenu && 
                !navToggle.contains(e.target) && 
                !navMenu.contains(e.target) &&
                navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Scroll Effects
    handleScroll() {
        this.updateNavbarOnScroll();
        this.updateActiveNavigation();
        this.triggerScrollAnimations();
    }

    updateNavbarOnScroll() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }

    updateActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        const scrollPosition = window.scrollY + 150;

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
    }

    initScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.service-card, .feature-item, .visual-card, .contact-card, .highlight-item'
        );
        
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });
    }

    triggerScrollAnimations() {
        const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        document.documentElement.style.setProperty('--scroll-progress', scrollProgress);
    }

    // Animation Functions
    initAnimations() {
        // Stagger animation for hero stats
        const heroStats = document.querySelectorAll('.stat-card');
        heroStats.forEach((stat, index) => {
            stat.style.animationDelay = `${0.8 + (index * 0.1)}s`;
        });

        // Stagger animation for service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            card.style.setProperty('--animation-delay', `${index * 0.1}s`);
        });
    }

    // Form Handling
    initFormHandlers() {
        const contactForm = document.getElementById('contactForm');
        const modalForm = document.getElementById('modalContactForm');

        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e, 'contact'));
        }

        if (modalForm) {
            modalForm.addEventListener('submit', (e) => this.handleFormSubmit(e, 'modal'));
        }

        // Add floating label effect
        this.initFloatingLabels();
    }

    initFloatingLabels() {
        const formGroups = document.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('.form-control');
            const label = group.querySelector('.form-label');
            
            if (input && label) {
                // Check if input has value on page load
                if (input.value && input.value.trim() !== '') {
                    label.classList.add('active');
                }

                input.addEventListener('focus', () => {
                    label.classList.add('active');
                });

                input.addEventListener('blur', () => {
                    if (!input.value || input.value.trim() === '') {
                        label.classList.remove('active');
                    }
                });

                input.addEventListener('input', () => {
                    if (input.value && input.value.trim() !== '') {
                        label.classList.add('active');
                    } else {
                        label.classList.remove('active');
                    }
                });

                // Handle select elements differently
                if (input.tagName === 'SELECT') {
                    input.addEventListener('change', () => {
                        if (input.value) {
                            label.classList.add('active');
                        } else {
                            label.classList.remove('active');
                        }
                    });
                }
            }
        });
    }

    // Fix dropdown functionality
    fixDropdowns() {
        const selects = document.querySelectorAll('select.form-control');
        selects.forEach(select => {
            // Ensure the select is clickable and functional
            select.style.pointerEvents = 'auto';
            select.style.cursor = 'pointer';
            
            // Add click handler to ensure it opens
            select.addEventListener('click', (e) => {
                e.stopPropagation();
                select.focus();
            });
            
            // Handle change events
            select.addEventListener('change', (e) => {
                const label = select.parentElement.querySelector('.form-label');
                if (label) {
                    if (select.value) {
                        label.classList.add('active');
                    } else {
                        label.classList.remove('active');
                    }
                }
            });
        });
    }

    async handleFormSubmit(e, formType) {
        e.preventDefault();
        
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalContent = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<span>Sending...</span>';
        submitButton.disabled = true;
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        try {
            // Simulate API call
            await this.simulateFormSubmission(data);
            
            // Show success
            this.showNotification('Message sent successfully! We will contact you soon.', 'success');
            
            // Reset form
            form.reset();
            this.resetFloatingLabels(form);
            
            // Close modal if it's modal form
            if (formType === 'modal') {
                this.closeContactModal();
            }
            
        } catch (error) {
            this.showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            // Reset button
            submitButton.innerHTML = originalContent;
            submitButton.disabled = false;
        }
    }

    simulateFormSubmission(data) {
        return new Promise((resolve) => {
            // Log form data for development
            console.log('Form submission data:', data);
            
            // Simulate network delay
            setTimeout(resolve, 1500);
        });
    }

    resetFloatingLabels(form) {
        const labels = form.querySelectorAll('.form-label');
        labels.forEach(label => label.classList.remove('active'));
    }

    // Modal Functions - Fixed
    initModalHandlers() {
        // Make functions globally available
        window.openContactModal = () => this.openContactModal();
        window.closeContactModal = () => this.closeContactModal();
        
        // Add click handlers to buttons that should open modal
        const modalTriggers = document.querySelectorAll('[onclick*="openContactModal"]');
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.openContactModal();
            });
        });
        
        // Handle modal backdrop clicks
        const modal = document.getElementById('contactModal');
        if (modal) {
            const backdrop = modal.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.addEventListener('click', () => this.closeContactModal());
            }
        }
    }

    openContactModal() {
        const modal = document.getElementById('contactModal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Focus first input after animation
            setTimeout(() => {
                const firstInput = modal.querySelector('input');
                if (firstInput) {
                    firstInput.focus();
                }
            }, 150);
        }
    }

    closeContactModal() {
        const modal = document.getElementById('contactModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
            
            // Reset modal form
            const modalForm = document.getElementById('modalContactForm');
            if (modalForm) {
                modalForm.reset();
                this.resetFloatingLabels(modalForm);
            }
        }
    }

    handleKeyPress(e) {
        // Close modal on Escape key
        if (e.key === 'Escape') {
            const modal = document.getElementById('contactModal');
            if (modal && !modal.classList.contains('hidden')) {
                this.closeContactModal();
            }
        }
    }

    // Service Cards - Fixed
    initServiceCards() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            // Add cursor pointer
            card.style.cursor = 'pointer';
            
            // Add click handler for all service cards
            card.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Scroll to contact section
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    const navbar = document.querySelector('.navbar');
                    const navbarHeight = navbar ? navbar.offsetHeight : 80;
                    const targetPosition = contactSection.offsetTop - navbarHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Pre-fill device type after scroll
                    setTimeout(() => {
                        this.prefillDeviceType(card);
                    }, 800);
                }
            });
            
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-8px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }

    prefillDeviceType(serviceCard) {
        const title = serviceCard.querySelector('.service-title')?.textContent.toLowerCase();
        const deviceSelect = document.querySelector('select[name="device"]');
        
        if (title && deviceSelect) {
            let deviceValue = '';
            
            if (title.includes('hard drive')) deviceValue = 'hard-drive';
            else if (title.includes('ssd')) deviceValue = 'ssd';
            else if (title.includes('external')) deviceValue = 'external-drive';
            else if (title.includes('memory card')) deviceValue = 'memory-card';
            else if (title.includes('cctv') || title.includes('dvr')) deviceValue = 'cctv-dvr';
            else if (title.includes('server') || title.includes('raid') || title.includes('nas')) deviceValue = 'server-raid';
            
            if (deviceValue) {
                deviceSelect.value = deviceValue;
                
                // Trigger change event and update label
                deviceSelect.dispatchEvent(new Event('change'));
                const label = deviceSelect.parentElement.querySelector('.form-label');
                if (label) {
                    label.classList.add('active');
                }
                
                // Visual feedback
                deviceSelect.style.borderColor = 'var(--accent-green)';
                setTimeout(() => {
                    deviceSelect.style.borderColor = '';
                }, 2000);
                
                this.showNotification(`Selected: ${title}`, 'success');
            }
        }
    }

    // Notification System
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        
        const colors = {
            success: { bg: '#10b981', border: '#059669' },
            error: { bg: '#ef4444', border: '#dc2626' },
            info: { bg: '#3b82f6', border: '#2563eb' }
        };
        
        const color = colors[type] || colors.info;
        
        notification.innerHTML = `
            <div class="notification__content">
                <div class="notification__icon">${type === 'success' ? '✓' : type === 'error' ? '⚠' : 'ℹ'}</div>
                <span class="notification__message">${message}</span>
                <button class="notification__close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '2rem',
            right: '2rem',
            zIndex: '3000',
            background: color.bg,
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            maxWidth: '400px',
            animation: 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            border: `2px solid ${color.border}`
        });
        
        // Add notification styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .notification__content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .notification__icon {
                    font-size: 1.25rem;
                    font-weight: bold;
                }
                .notification__message {
                    flex: 1;
                    font-weight: 500;
                }
                .notification__close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.25rem;
                    cursor: pointer;
                    padding: 0.25rem;
                    border-radius: 4px;
                    opacity: 0.8;
                    transition: all 0.2s ease;
                }
                .notification__close:hover {
                    opacity: 1;
                    background: rgba(255, 255, 255, 0.2);
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) reverse';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Page Load Handler
    handlePageLoad() {
        // Hide any loading screens
        const loader = document.getElementById('pageLoader');
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.remove(), 500);
            }, 800);
        }
        
        // Trigger initial animations
        this.triggerInitialAnimations();
        
        // Initialize any additional components
        this.initializeComponents();
    }

    triggerInitialAnimations() {
        // Add entrance animations to hero elements
        const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-stats, .hero-actions');
        heroElements.forEach((el, index) => {
            el.style.animation = `fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${0.2 + (index * 0.2)}s both`;
        });
    }

    initializeComponents() {
        // Add any additional component initializations here
        this.initButtonEffects();
        this.initPhoneTracking();
        this.addAccessibilityFeatures();
        this.initSocialLinks();
    }

    initButtonEffects() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (!button.disabled) {
                    button.style.transform = 'translateY(-2px)';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
            
            button.addEventListener('mousedown', () => {
                if (!button.disabled) {
                    button.style.transform = 'translateY(0) scale(0.98)';
                }
            });
            
            button.addEventListener('mouseup', () => {
                if (!button.disabled) {
                    button.style.transform = 'translateY(-2px) scale(1)';
                }
            });
        });
    }

    initPhoneTracking() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            link.addEventListener('click', () => {
                console.log('Phone number clicked:', link.href);
                this.showNotification('Redirecting to phone app...', 'info');
            });
        });
    }

    // Fix social media links
    initSocialLinks() {
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const text = link.textContent.trim();
                
                // Open appropriate social media platform
                let url = '#';
                if (text.includes('Facebook')) {
                    url = 'https://facebook.com/datarescuehub';
                } else if (text.includes('Twitter')) {
                    url = 'https://twitter.com/datarescuehub';
                } else if (text.includes('LinkedIn')) {
                    url = 'https://linkedin.com/company/datarescuehub';
                } else if (text.includes('Instagram')) {
                    url = 'https://instagram.com/datarescuehub';
                }
                
                if (url !== '#') {
                    window.open(url, '_blank');
                    this.showNotification(`Opening ${text}...`, 'info');
                }
            });
        });
    }

    addAccessibilityFeatures() {
        // Add skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#home';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--accent-green);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const homeSection = document.getElementById('home');
            if (homeSection) {
                homeSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }

    handleResize() {
        // Handle any resize-specific logic
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        // Close mobile menu on resize to larger screen
        if (window.innerWidth > 768) {
            navMenu?.classList.remove('active');
            navToggle?.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DataRescueHub();
});

// Add CSS for additional animations and fixes
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .service-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .btn {
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .form-label.active {
        transform: translateY(-2.5rem) scale(0.85);
        color: var(--accent-green);
    }
    
    select.form-control {
        cursor: pointer;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23064e3b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 1rem center;
        background-size: 16px;
        padding-right: 3rem;
    }
`;
document.head.appendChild(additionalStyles);