document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize Web Haptics ---
    let haptics = null;
    if (typeof WebHaptics !== 'undefined') {
        haptics = new WebHaptics.WebHaptics();
    }


    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMenuButton = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // --- Theme Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');
    const htmlElement = document.documentElement;
    const moonIcon = '<i class="fas fa-moon"></i>';
    const sunIcon = '<i class="fas fa-sun"></i>';

    // Check for saved user preference, if any, on load of the website
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
        updateToggleIcons(savedTheme);
    } else if (prefersDark) {
        // Default to dark if system prefers it (or just default to dark as per original design)
        // Our default CSS is dark, so we don't need to do anything unless it's light
    }

    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleIcons(newTheme);
    }

    function updateToggleIcons(theme) {
        const icon = theme === 'light' ? moonIcon : sunIcon; // If light, show moon to switch to dark
        // Wait, if it's light mode, we want to show the Moon icon (to switch to dark).
        // If it's dark mode, we want to show the Sun icon (to switch to light).

        // Actually, let's look at the implementation plan. 
        // Dark is default.
        // If theme is 'light', we are in light mode. Button should show Moon.
        // If theme is not set or 'dark', we are in dark mode. Button should show Sun.

        const content = theme === 'light' ? moonIcon : sunIcon;

        if (themeToggleBtn) themeToggleBtn.innerHTML = content;
        if (themeToggleMobileBtn) {
            themeToggleMobileBtn.innerHTML = content + ' Toggle Theme';
        }
    }

    // Initial icon state
    if (htmlElement.getAttribute('data-theme') === 'light') {
        updateToggleIcons('light');
    } else {
        updateToggleIcons('dark');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (haptics) haptics.trigger(WebHaptics.defaultPatterns.success);
            toggleTheme();
        });
    }
    if (themeToggleMobileBtn) {
        themeToggleMobileBtn.addEventListener('click', () => {
            if (haptics) haptics.trigger(WebHaptics.defaultPatterns.success);
            toggleTheme();
        });
    }

    function openMenu() {
        if (haptics) haptics.trigger();
        mobileMenu.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        if (haptics) haptics.trigger();
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
                    if (haptics) haptics.trigger(); // Trigger on smooth scroll clicks
                    // Close mobile menu if open
                    if (typeof closeMenu === 'function') closeMenu();

                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });

                    // Update URL without jumping
                    history.pushState(null, null, '#' + hash);
                }
            } else if (haptics) {
                // Trigger for regular outward links if not smoothly scrolling
                haptics.trigger();
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

    // --- Global Click Haptics for generic buttons and links ---
    document.querySelectorAll('.btn, .card').forEach(el => {
        el.addEventListener('click', () => {
            if (haptics) haptics.trigger();
        });
    });

});
