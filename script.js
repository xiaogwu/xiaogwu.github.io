document.addEventListener('DOMContentLoaded', () => {
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

    console.log('Script loaded successfully.');

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
        });

        document.querySelectorAll(".nav-links li a").forEach(n => n.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
        }));
    }

    // Typography Switcher Logic
    const typographySelect = document.getElementById('typography-select');

    if (typographySelect) {
        typographySelect.addEventListener('change', (e) => {
            const selectedTheme = e.target.value;

            // Remove all typography classes
            document.body.classList.remove('typography-modern', 'typography-classic', 'typography-tech');

            // Add the selected typography class if not system default
            if (selectedTheme !== 'system') {
                document.body.classList.add(`typography-${selectedTheme}`);
            }
        });
    }
});
