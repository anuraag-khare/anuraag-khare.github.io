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

    // --- Animated Role Typing Effect ---
    const roleElement = document.getElementById('animated-role');
    if (roleElement) {
        const roles = ["Anuraag Khare", "a backend developer", "a GenAI specialist", "a Founding Engineer"];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingDelay = 100;  // Slightly slower typing
        let erasingDelay = 50;  // Slightly slower erasing
        let pauseAfterTyping = 2500;    // Much longer pause after typing
        let pauseAfterErasing = 800;   // Longer pause after erasing

        function typeRole() {
            const currentScrollY = window.scrollY;  // Store current scroll position
            const currentRole = roles[roleIndex];
            if (!isDeleting) {
                // Typing
                roleElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === currentRole.length) {
                    isDeleting = true;
                    setTimeout(typeRole, pauseAfterTyping);
                } else {
                    setTimeout(typeRole, typingDelay);
                }
            } else {
                // Deleting
                roleElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    isDeleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    setTimeout(typeRole, pauseAfterErasing);
                } else {
                    setTimeout(typeRole, erasingDelay);
                }
            }
            window.scrollTo(0, currentScrollY);  // Maintain scroll position
        }
        // Start with the name, but immediately start animating
        setTimeout(typeRole, 1200);
    }

});
