// Navigation Indicator Animation
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const indicator = document.querySelector('.nav-indicator');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const nav = document.querySelector('nav');

    // Scroll-based navigation visibility
    let lastScrollY = window.scrollY;
    let ticking = false;

    // Show nav initially at top of page
    if (window.scrollY < 100) {
        nav.classList.add('nav-visible');
    }

    function updateNavVisibility() {
        const currentScrollY = window.scrollY;

        // Always show nav at top of page
        if (currentScrollY < 100) {
            nav.classList.add('nav-visible');
        }
        // Show nav when scrolling up
        else if (currentScrollY < lastScrollY) {
            nav.classList.add('nav-visible');
        }
        // Hide nav when scrolling down
        else if (currentScrollY > lastScrollY) {
            nav.classList.remove('nav-visible');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    function requestNavUpdate() {
        if (!ticking) {
            window.requestAnimationFrame(updateNavVisibility);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestNavUpdate, { passive: true });

    // Get current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Set active page indicator
    function setActiveIndicator(link, instant = false) {
        if (!indicator || !link) return;

        const linkRect = link.getBoundingClientRect();
        const navLinksContainer = link.parentElement;
        const containerRect = navLinksContainer.getBoundingClientRect();

        // Add padding to make pill background larger than text
        const paddingExtra = 16; // 1rem in pixels
        const left = linkRect.left - containerRect.left - paddingExtra;
        const width = linkRect.width + (paddingExtra * 2);

        if (instant) {
            indicator.style.transition = 'none';
        } else {
            indicator.style.transition = 'all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
        }

        indicator.style.left = left + 'px';
        indicator.style.width = width + 'px';
        indicator.classList.add('active');

        // Force reflow to apply transition
        if (instant) {
            void indicator.offsetWidth;
            indicator.style.transition = 'all 0.4s cubic-bezier(0.4, 0.0, 0.2, 1)';
        }
    }

    // Find and set active link on page load
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            const linkPage = href.split('/').pop();
            if (linkPage === currentPage ||
                (currentPage === 'index.html' && linkPage === 'index.html') ||
                (currentPage === '' && linkPage === 'index.html')) {
                setActiveIndicator(link, true);
                link.classList.add('active');
            }
        }
    });

    // Hover effect for navigation links
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            setActiveIndicator(this, false);
        });
    });

    // Return indicator to active page on mouse leave
    const navLinksContainer = document.querySelector('.nav-links');
    if (navLinksContainer) {
        navLinksContainer.addEventListener('mouseleave', function() {
            const activeLink = document.querySelector('.nav-link.active');
            if (activeLink) {
                setActiveIndicator(activeLink, false);
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // Mobile Menu Toggle
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Close mobile menu when clicking on a link
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // Smooth scroll for anchor links
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

    // Add fade-in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all content sections
    document.querySelectorAll('.content-section').forEach(section => {
        observer.observe(section);
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            const activeLink = document.querySelector('.nav-link.active');
            if (activeLink && indicator) {
                setActiveIndicator(activeLink, true);
            }
        }, 250);
    });

    // Portfolio image auto-switch on mobile
    function isMobile() {
        return window.innerWidth <= 768;
    }

    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const autoSwitchIntervals = [];

    function startAutoSwitch(card, index) {
        const defaultImg = card.querySelector('.thumb-default');
        const hoverImg = card.querySelector('.thumb-hover');

        if (!defaultImg || !hoverImg) return;

        let isHoverState = false;

        const interval = setInterval(() => {
            if (isMobile()) {
                isHoverState = !isHoverState;
                if (isHoverState) {
                    defaultImg.style.opacity = '0';
                    hoverImg.style.opacity = '1';
                } else {
                    defaultImg.style.opacity = '1';
                    hoverImg.style.opacity = '0';
                }
            }
        }, 2000);

        autoSwitchIntervals[index] = interval;
    }

    function stopAutoSwitch(index) {
        if (autoSwitchIntervals[index]) {
            clearInterval(autoSwitchIntervals[index]);
            autoSwitchIntervals[index] = null;
        }
    }

    // Initialize auto-switch for mobile
    portfolioCards.forEach((card, index) => {
        if (isMobile()) {
            startAutoSwitch(card, index);
        }
    });

    // Handle resize - start/stop auto-switch based on screen size
    window.addEventListener('resize', function() {
        portfolioCards.forEach((card, index) => {
            const defaultImg = card.querySelector('.thumb-default');
            const hoverImg = card.querySelector('.thumb-hover');

            if (isMobile()) {
                if (!autoSwitchIntervals[index]) {
                    startAutoSwitch(card, index);
                }
            } else {
                stopAutoSwitch(index);
                // Reset to default state on desktop
                if (defaultImg && hoverImg) {
                    defaultImg.style.opacity = '1';
                    hoverImg.style.opacity = '0';
                }
            }
        });
    });

    // Sort portfolio items by date (newest first)
    function sortPortfolioItems() {
        const grid = document.querySelector('.portfolio-grid');
        if (!grid) return;

        const items = Array.from(grid.querySelectorAll('.portfolio-card'));
        
        items.sort((a, b) => {
            const dateA = new Date(a.getAttribute('data-date') || '2000-01-01');
            const dateB = new Date(b.getAttribute('data-date') || '2000-01-01');
            return dateB - dateA; // Descending order
        });

        // Re-append items in sorted order
        items.forEach(item => grid.appendChild(item));
    }

    // Run sorting
    sortPortfolioItems();

    // Scroll-based Logo Opacity
    function handleLogoScroll() {
        const logoContainer = document.querySelector('.hero-logo-container');
        if (!logoContainer) return;

        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight;
        const maxScroll = docHeight - windowHeight;
        
        // Calculate the start of the transition
        // We want the transition to happen during the blank section scroll
        // Blank section is 120vh.
        // We start the transition when the user enters the blank section zone.
        const transitionDistance = windowHeight * 1.2; // 120vh
        const startTransition = Math.max(0, maxScroll - transitionDistance);
        
        let progress = 0;
        if (maxScroll > 0 && scrollY > startTransition) {
            progress = (scrollY - startTransition) / transitionDistance;
        }
        
        progress = Math.min(Math.max(progress, 0), 1);

        // Opacity: 0.02 -> 1.0
        const startOpacity = 0.02;
        const endOpacity = 1.0;
        const currentOpacity = startOpacity + (endOpacity - startOpacity) * progress;
        
        logoContainer.style.opacity = currentOpacity;
    }

    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(handleLogoScroll);
    });
    
    window.addEventListener('resize', handleLogoScroll);
    
    // Initial call
    handleLogoScroll();
});
