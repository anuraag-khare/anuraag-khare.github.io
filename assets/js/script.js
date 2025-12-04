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
    // --- Smooth Scrolling ---
    // Handle links that point to hashes on the current page
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Check if the link is for the current page
            const [path, hash] = href.split('#');
            const currentPath = window.location.pathname;

            // If it's just a hash or the path matches the current page
            if ((!path || path === currentPath || currentPath.endsWith(path) || href.startsWith('#')) && hash) {
                const targetElement = document.getElementById(hash);
                if (targetElement) {
                    e.preventDefault();
                    // Close mobile menu if open
                    if (typeof closeMenu === 'function') closeMenu();
                    
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    
                    // Update URL without jumping
                    history.pushState(null, null, '#' + hash);
                }
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
    
    // Check if we're on a blog post page
    const isBlogPost = document.querySelector('.blog-post') !== null;

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

        // On blog post pages, just hide header when scrolling down, don't show on scroll up
        if (isBlogPost) {
            if (currentScrollY > scrollThreshold) {
                header.classList.add('sticky-navbar-hide');
                header.classList.remove('sticky-navbar-show');
            } else {
                // Only show at very top of page
                header.classList.remove('sticky-navbar-hide');
                header.classList.add('sticky-navbar-show');
            }
            return;
        }

        // Default behavior for non-blog pages
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
