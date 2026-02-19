## 2026-02-17 - CSP Constraint on Performance Optimizations
**Learning:** This codebase uses a strict Content Security Policy (`script-src 'self'`) that prevents the standard optimization of using `onload` handlers in `link` tags (e.g., `<link rel="preload" onload="this.rel='stylesheet'">`). Inline scripts are blocked.
**Action:** When implementing non-blocking CSS loading or other optimizations, avoid inline event handlers and instead use external scripts (like `script.js`) to manipulate the DOM.

## 2026-02-17 - Performance Test Enforcement
**Learning:** When optimizing resource loading (like removing blocking fonts), ensure the test suite explicitly enforces the new behavior. Enabling a previously skipped test (`xit` -> `it`) and refining it to check for *absence* of blocking links provided immediate validation of the optimization.
**Action:** Always check `test/` for skipped or pending tests related to performance before starting optimization work.
