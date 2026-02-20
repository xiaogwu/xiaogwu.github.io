// Optimization: Activate Google Fonts immediately to improve FCP
const googleFontsCss = document.getElementById('google-fonts-css');
if (googleFontsCss) {
    googleFontsCss.rel = 'stylesheet';
}

document.addEventListener('DOMContentLoaded', () => {
    // Optimization: Defer loading of Font Awesome to improve initial load performance
    const loadFontAwesome = () => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
        link.integrity = 'sha384-5e2ESR8Ycmos6g3gAKr1Jvwye8sW4U1u/cAKulfVJnkakCcMqhOudbtPnvJ+nbv7';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    };
    loadFontAwesome();

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
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

        // Check local time for initial theme
        const currentHour = new Date().getHours();
        const isDayTime = currentHour >= 6 && currentHour < 18; // 6 AM to 6 PM

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

    // Back to Top Button Logic
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        const footer = document.querySelector('footer');

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

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
