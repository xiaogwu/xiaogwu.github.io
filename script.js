// Optimization: Activate Google Fonts immediately to improve FCP
const googleFontsCss = document.getElementById('google-fonts-css');
if (googleFontsCss) {
    googleFontsCss.rel = 'stylesheet';
}

document.addEventListener('DOMContentLoaded', () => {
    // Optimization: Defer loading of Font Awesome to improve initial load performance
    const fontAwesomeCss = document.getElementById('font-awesome-css');
    if (fontAwesomeCss) {
        fontAwesomeCss.rel = 'stylesheet';
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Only hijack click if it's an internal link
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();

                const id = targetId.substring(1);
                // Use getElementById for security (avoid selector injection) and robustness
                const targetElement = id ? document.getElementById(id) : null;

                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggle) {
        // Function to update button icon
        const updateButtonIcon = (isLight) => {
            themeToggle.textContent = isLight ? '☀️' : '🌙';
        };

        // Check local time for initial theme by checking the class applied by inline script
        const isDayTime = document.documentElement.classList.contains('light-mode-early');

        // Transfer early theme class from <html> to <body> and clean up
        document.documentElement.classList.remove('light-mode-early');

        // Apply initial theme
        if (isDayTime) {
            body.classList.add('light-mode');
            updateButtonIcon(true);
        } else {
            body.classList.remove('light-mode');
            updateButtonIcon(false);
        }

        // Toggle event listener
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            updateButtonIcon(isLight);
        });
    }

    // Hamburger Menu Logic
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");
            const expanded = hamburger.classList.contains("active");
            hamburger.setAttribute("aria-expanded", expanded);
        });

        document.querySelectorAll(".nav-links li a").forEach(n => n.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
        }));
    }

    // Typography Switcher Logic
    const typographySelect = document.getElementById('typography-select');

    if (typographySelect) {
        const TYPOGRAPHY_STORAGE_KEY = 'typography-preference';
        const savedTypography = localStorage.getItem(TYPOGRAPHY_STORAGE_KEY);
        const initialTypography = savedTypography || 'modern';

        // Apply initial typography
        typographySelect.value = initialTypography;
        if (initialTypography !== 'system') {
            document.body.classList.add(`typography-${initialTypography}`);
        }

        typographySelect.addEventListener('change', (e) => {
            const selectedTheme = e.target.value;

            // Save preference
            localStorage.setItem(TYPOGRAPHY_STORAGE_KEY, selectedTheme);

            // Remove all typography classes
            document.body.classList.remove('typography-modern', 'typography-classic', 'typography-tech');

            // Add the selected typography class if not system default
            if (selectedTheme !== 'system') {
                document.body.classList.add(`typography-${selectedTheme}`);
            }
        });
    }

    // Dynamic Tenure Calculation
    const appleTenureElement = document.getElementById('apple-tenure');
    if (appleTenureElement) {
        // Start date: November 26, 2018 (Monday after Thanksgiving).
        const startDate = new Date('2018-11-26');
        const currentDate = new Date();

        let years = currentDate.getFullYear() - startDate.getFullYear();
        const m = currentDate.getMonth() - startDate.getMonth();

        // Adjust if the current month is before the start month or
        // if it's the start month but the day hasn't passed yet.
        if (m < 0 || (m === 0 && currentDate.getDate() < startDate.getDate())) {
            years--;
        }

        appleTenureElement.textContent = years;
    }

    // Dynamic Copyright Year
    const copyrightYearElement = document.getElementById('copyright-year');
    if (copyrightYearElement) {
        copyrightYearElement.textContent = new Date().getFullYear();
    }

    // Back to Top Button Logic
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        const footer = document.querySelector('footer');

        // Optimization: Use IntersectionObserver to avoid scroll event listeners and layout thrashing
        if ('IntersectionObserver' in window) {
            let scrolledPastThreshold = false;
            let footerVisible = false;

            const updateButton = () => {
                if (scrolledPastThreshold && !footerVisible) {
                    backToTopButton.classList.add('visible');
                } else {
                    backToTopButton.classList.remove('visible');
                }
            };

            // Sentinel for top threshold (300px)
            const sentinel = document.createElement('div');
            Object.assign(sentinel.style, {
                position: 'absolute',
                top: '0',
                left: '0',
                width: '1px',
                height: '300px',
                pointerEvents: 'none',
                visibility: 'hidden',
                zIndex: '-1'
            });
            document.body.prepend(sentinel);

            const sentinelObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // If sentinel is NOT intersecting, we are past 300px
                    scrolledPastThreshold = !entry.isIntersecting;
                    updateButton();
                });
            });
            sentinelObserver.observe(sentinel);

            // Footer observer
            if (footer) {
                const footerObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        footerVisible = entry.isIntersecting;
                        updateButton();
                    });
                });
                footerObserver.observe(footer);
            }
        } else {
            // Fallback for older browsers
            const toggleBackToTop = () => {
                const scrolledPastThreshold = window.scrollY > 300;
                const footerVisible = footer && (window.innerHeight + window.scrollY) >= footer.offsetTop;

                if (scrolledPastThreshold && !footerVisible) {
                    backToTopButton.classList.add('visible');
                } else {
                    backToTopButton.classList.remove('visible');
                }
            };

            window.addEventListener('scroll', toggleBackToTop);
        }

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Email Obfuscation
    const emailLink = document.getElementById('email-link');
    if (emailLink) {
        const user = 'xiaogwu';
        const domain = 'gmail.com';
        emailLink.href = `mailto:${user}@${domain}`;
    }
});
