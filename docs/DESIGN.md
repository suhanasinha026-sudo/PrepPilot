# Design System Specification: The Academic Atelier (EduPrep)

## 1. Overview & Creative North Star
### The Creative North Star: "The Academic Atelier"
This design system moves away from the sterile, gamified tropes of typical EdTech platforms. Instead, it draws inspiration from high-end editorial layouts, physical architectural studio spaces, and modern productivity tools like Linear and Notion. The goal is to create a digital environment that feels both authoritative and airy—a focused sanctuary where complex academic pursuits feel organized and achievable.

We break the "standard template" look through **intentional asymmetry**, **tonal layering**, and **editorial typography**. Rather than trapping content in rigid, dark-bordered boxes, we use light, shifting surface tones and soft ambient shadows to create a sense of physical depth, allowing the student’s focus to flow naturally from high-level goals to granular study tasks.

---

## 2. Colors & Surface Philosophy
The palette is rooted in **Electric Indigo (`#4648d4`)** and **Deep Violet (`#6063ee`)**, balanced by a cool, alabaster-toned neutral scale. This high-contrast pairing ensures energy without visual fatigue during long late-night study sessions.

### The "No-Line" Rule
To maintain a clean, modern aesthetic, **1px solid borders for sectioning are discouraged**. Structural boundaries must be defined through:
- **Background Color Shifts:** Placing a `surface-container-lowest` (`#ffffff`) card directly onto a `surface` (`#f8f9fa`) or `surface-container-low` (`#f3f4f5`) background.
- **Whitespace:** Using generous `24px` to `32px` gaps to imply separation.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical sheets of fine paper stacked upon a desk:
- **Base Layer (`surface` / `#f8f9fa`):** The primary canvas of the application.
- **Secondary Sections (`surface-container-low` / `#f3f4f5`):** Used for sidebars, filter panels, or secondary contentwells.
- **Interactive Cards (`surface-container-lowest` / `#ffffff`):** Reserved for the most important interactive elements (Subject Cards, AI Chat bubbles, Opportunity listings) to make them "pop" via pure brightness.
- **Floating Elements (`surface-bright` with Backdrop Blur):** Navigation bars and floating action menus should use a `rgba(255, 255, 255, 0.8)` fill with a `12px` blur to allow the colors of the content beneath to bleed through softly.

### Signature Gradients
Use gradients sparingly to denote **Intelligence** and **Progression**:
- **Primary Brand Gradient:** `linear-gradient(135deg, #4648d4 0%, #6063ee 100%)` — Use for primary CTAs and active states.
- **AI Aura Gradient:** `linear-gradient(135deg, #6063ee 0%, #d23284 100%)` — Specifically reserved for the Study AI Assistant, flashcards, and "Smart Insight" badges.

---

## 3. Typography: Editorial Authority
We utilize **Inter** (or **Plus Jakarta Sans** for headings) to balance technical precision with approachable warmth.

*   **Display Large (`3.0rem` / `48px`, `-0.02em` tracking, Bold):** Reserved for hero moments, such as the "Welcome back" dashboard header or major exam countdowns.
*   **Headline Medium (`1.875rem` / `30px`, `-0.01em` tracking, Semi-Bold):** Used for top-level page titles (e.g., "Curriculum & Syllabus", "Previous Year Papers").
*   **Section Title (`1.125rem` / `18px`, Semi-Bold):** The workhorse for grouping content blocks.
*   **Body Large (`1.125rem` / `18px`, Regular, `1.6` line-height):** Used for AI explanations and long-form reading material to ensure maximum readability.
*   **Body Medium (`1.0rem` / `16px`, Regular):** Default UI text for cards and descriptions.
*   **Label Small (`0.75rem` / `12px`, `0.05em` tracking, Medium, Uppercase):** Used for metadata, semester tags, and "Difficulty" badges.

---

## 4. Elevation & Depth: Tonal Layering
In this system, shadow is an ambient byproduct of light, never a heavy graphic element.

*   **Level 0 (Flat):** Secondary containers (`#f3f4f5`) sitting on the main background (`#f8f9fa`).
*   **Level 1 (Resting Card):** `0 4px 20px rgba(25, 28, 29, 0.04)`. Used for standard Subject and Resource cards.
*   **Level 2 (Hover/Active State):** `0 10px 30px rgba(70, 72, 212, 0.08)`. Notice the shadow is tinted with the primary Indigo hue to simulate light reflecting through a colored lens.
*   **The "Ghost Border" Fallback:** In high-density areas like the AI Chat input or Search bars, use the `outline-variant` token (`#c7c4d7`) at **40% opacity**. Never use a solid grey border.

---

## 5. Components & Interactive Patterns

### Buttons & Chips
- **Primary CTA:** Pill-shaped (`9999px` radius), utilizing the Primary Brand Gradient, white text, and a subtle inner top-highlight (`rgba(255,255,255,0.2)`).
- **Filter Chips (Semester/Branch):** `8px` radius (`lg`). Inactive state uses `surface-container` (`#edeeef`) with `on-surface-variant` text. Active state shifts to `primary-fixed` (`#e1e0ff`) with `on-primary-fixed` (`#07006c`) bold text—avoiding heavy dark fills for filters to keep the page light.

### Academic Subject Cards
- **Structure:** `12px` radius (`xl`), pure white background (`#ffffff`), `24px` internal padding.
- **Visual Anchor:** Each card must feature a custom-tinted icon container (`48px x 48px`, `12px` radius) using the `primary-fixed` or `secondary-fixed` tokens.
- **Progress Indicators:** Linear progress bars should be `6px` high with `full` rounding. The track is `surface-container-high` (`#e7e8e9`), and the fill is the Primary Gradient.

### The Study AI Assistant (Floating & Full-View)
- **Glassmorphic Container:** When minimized or in a sidebar, use `rgba(255, 255, 255, 0.85)` with `backdrop-filter: blur(16px)`.
- **Message Bubbles:** User messages use `primary` (`#4648d4`) with white text and asymmetric rounding (`16px 16px 4px 16px`). AI responses sit on `surface-container-low` (`#f3f4f5`) with `on-surface` text and a subtle `1px` border of `primary-fixed` (`#e1e0ff`) to signify "verified intelligence."

### Data Visualization (Progress & Analytics)
- Avoid "rainbow" charts. Use a monochromatic scale of Indigo (`primary`, `primary-container`, `primary-fixed-dim`) paired with `tertiary` (`#b10e6b`) solely for highlighting "Critical/Exam Tomorrow" alerts or peak performance milestones.
