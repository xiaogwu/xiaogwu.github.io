## 2026-02-17 - CSP Constraint on Performance Optimizations
**Learning:** This codebase uses a strict Content Security Policy (`script-src 'self'`) that prevents the standard optimization of using `onload` handlers in `link` tags (e.g., `<link rel="preload" onload="this.rel='stylesheet'">`). Inline scripts are blocked.
**Action:** When implementing non-blocking CSS loading or other optimizations, avoid inline event handlers and instead use external scripts (like `script.js`) to manipulate the DOM.
