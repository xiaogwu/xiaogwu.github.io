## 2026-03-06 - Added Global Keyboard Focus Visible States
**Learning:** Interactive elements didn't uniformly have a defined focus-visible state. Without custom focus styles, some elements default to generic browser rings which don't match the design system or are entirely invisible when the background matches.
**Action:** Added a global ':focus-visible' CSS rule with custom outline using design system variables (var(--accent-color)) for links, buttons, selects, and inputs.
