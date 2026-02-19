## 2024-05-22 - Input Validation for Local Storage
**Vulnerability:** The application was directly using `localStorage` values to construct CSS class names without validation. While `classList.add` provides some protection against XSS (by throwing on spaces), it allowed arbitrary strings to be added as classes, potentially leading to CSS injection or unexpected behavior.
**Learning:** Even client-side storage like `localStorage` should be treated as untrusted input because users (or XSS attacks) can modify it. Always validate or whitelist values before using them in DOM manipulation.
**Prevention:** Implement strict whitelisting for configuration values read from storage (e.g., theme preferences) and use safe defaults if validation fails.
