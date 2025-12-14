// Navigation Indicator Animation
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const indicator = document.querySelector('.nav-indicator');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    // Get current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Set active page indicator
    function setActiveIndicator(link, instant = false) {
        if (!indicator || !link) return;

        const linkRect = link.getBoundingClientRect();
        const navLinksContainer = link.parentElement;
        const containerRect = navLinksContainer.getBoundingClientRect();

        const left = linkRect.left - containerRect.left;
        const width = linkRect.width;

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
});
