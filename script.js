document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMenuButton = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    function openMenu() {
        mobileMenu.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        mobileMenu.style.display = 'none';
        document.body.style.overflow = '';
    }

    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', openMenu);
    }

    if (closeMenuButton) {
        closeMenuButton.addEventListener('click', closeMenu);
    }

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const animatedElements = document.querySelectorAll('.fade-in-up');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(el => {
        // Pause animation initially if not already running
        // Actually, CSS handles the initial state (opacity 0). 
        // We just need to trigger the class or ensure it plays.
        // Since we used 'forwards', we can just re-trigger or add a class.
        // But our CSS defines the animation directly on the class. 
        // A better approach for scroll trigger is to add the class via JS.

        // Let's reset the animation logic:
        // 1. Remove the class initially (or use a different class in HTML)
        // 2. Add it when intersecting.

        // For now, let's assume the CSS animation runs on load. 
        // To make it scroll-triggered, we should add a 'visible' class.

        el.style.opacity = '0'; // Ensure hidden initially
        el.style.animation = 'none'; // Stop auto-play
        observer.observe(el);
    });

    // Re-define observer for the 'visible' logic
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = ''; // Revert to CSS defined animation
                entry.target.style.opacity = '';
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        scrollObserver.observe(el);
    });


    // --- Sticky Header Logic ---
    const header = document.getElementById('main-header');
    let lastScrollY = window.scrollY;
    const scrollThreshold = 100;
    const scrollDelta = 10;

    // --- Mouse Glow Effect ---
    const cursorGlow = document.getElementById('cursor-glow');
    document.addEventListener('mousemove', (e) => {
        if (cursorGlow) {
            cursorGlow.style.setProperty('--mouse-x', `${e.clientX}px`);
            cursorGlow.style.setProperty('--mouse-y', `${e.clientY}px`);
        }
    });

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > scrollThreshold) {
            if (Math.abs(currentScrollY - lastScrollY) > scrollDelta) {
                if (currentScrollY > lastScrollY) {
                    // Scrolling down
                    header.classList.add('sticky-navbar-hide');
                    header.classList.remove('sticky-navbar-show');
                } else {
                    // Scrolling up
                    header.classList.add('sticky-navbar-show');
                    header.classList.remove('sticky-navbar-hide');
                }
                lastScrollY = currentScrollY;
            }
        } else {
            // Top of page
            header.classList.remove('sticky-navbar-hide');
            header.classList.add('sticky-navbar-show');
            lastScrollY = currentScrollY;
        }
    });

});
