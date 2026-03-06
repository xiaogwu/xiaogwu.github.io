const crypto = require('crypto');
// get hash of script content
const scriptContent = `
        // Apply theme before paint to prevent flash
        var h = new Date().getHours();
        if (h >= 6 && h < 18) document.documentElement.classList.add('light-mode-early');
        // Prevent clickjacking
        if (window.top !== window.self) { try { window.top.location = window.self.location; } catch (e) { document.documentElement.style.display = 'none'; } }
    `;
const hash = crypto.createHash('sha256').update(scriptContent).digest('base64');
console.log(hash);
