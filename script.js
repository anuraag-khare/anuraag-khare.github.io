document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link-mobile');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
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

    // --- Sticky Navbar Show/Hide on Scroll ---
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    let ticking = false;

    function handleNavbar() {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 60) {
            // Scrolling down
            header.classList.remove('sticky-navbar-show');
            header.classList.add('sticky-navbar-hide');
        } else {
            // Scrolling up
            header.classList.remove('sticky-navbar-hide');
            header.classList.add('sticky-navbar-show');
        }
        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(handleNavbar);
            ticking = true;
        }
    });
    // Show navbar by default
    header.classList.add('sticky-navbar-show');

});
