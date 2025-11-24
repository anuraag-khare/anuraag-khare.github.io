document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link-mobile');
    const header = document.querySelector('header');

    if (mobileMenuButton && mobileMenu) {
        // Animate mobile menu open/close
        mobileMenu.classList.add('transition-transform', 'duration-300', 'ease-in-out');
        mobileMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.remove('scale-y-0');
                mobileMenu.classList.add('scale-y-100');
                document.body.style.overflow = 'hidden'; // Prevent background scroll
            } else {
                mobileMenu.classList.add('scale-y-0');
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('scale-y-100');
                    document.body.style.overflow = '';
                }, 300);
            }
        });

        // Close mobile menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('scale-y-0');
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('scale-y-100');
                    document.body.style.overflow = '';
                }, 300);
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.classList.contains('hidden') && !mobileMenu.contains(e.target) && e.target !== mobileMenuButton && !mobileMenuButton.contains(e.target)) {
                mobileMenu.classList.add('scale-y-0');
                setTimeout(() => {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('scale-y-100');
                    document.body.style.overflow = '';
                }, 300);
            }
        });
    }

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Prevent default for all but the download link
            if (this.getAttribute('href') !== '#' && !this.hasAttribute('download')) {
                e.preventDefault();
                const targetElement = document.querySelector(this.getAttribute('href'));
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // --- Scroll-triggered Animations using Intersection Observer ---
    const animatedElements = document.querySelectorAll('.hidden-anim');

    // Create an observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If the element is in the viewport
            if (entry.isIntersecting) {
                // Add the 'visible-anim' class to trigger the animation
                entry.target.classList.add('visible-anim');
                // Optional: Stop observing the element once it's visible
                observer.unobserve(entry.target);
            }
        });
    }, {
        // Options: trigger animation when element is 10% visible
        threshold: 0.1
    });

    // Observe each animated element
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // --- Sticky Header on Scroll Up ---
    let lastScrollY = window.scrollY;
    const scrollThreshold = 100; // Minimum scroll before hiding
    const scrollDelta = 10; // Minimum scroll change to trigger action

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Only trigger if we've scrolled past the threshold
        if (currentScrollY > scrollThreshold) {
            // Check if scroll difference is significant enough
            if (Math.abs(currentScrollY - lastScrollY) > scrollDelta) {
                if (currentScrollY > lastScrollY) {
                    // Scrolling down -> Hide header
                    header.classList.add('sticky-navbar-hide');
                    header.classList.remove('sticky-navbar-show');
                } else {
                    // Scrolling up -> Show header
                    header.classList.add('sticky-navbar-show');
                    header.classList.remove('sticky-navbar-hide');
                }
                lastScrollY = currentScrollY; // Update lastScrollY only when action is taken
            }
        } else {
            // At top of page -> Show header
            header.classList.remove('sticky-navbar-hide');
            header.classList.add('sticky-navbar-show');
            lastScrollY = currentScrollY;
        }
    });

});
