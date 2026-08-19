# Software Design Document (SDD)
## Personal Campaign Website — Dr. Alfredo Elías Alfaro Ramos

**Candidate:** Dr. Alfredo Elías Alfaro Ramos  
**Position:** Profesor de Economía — Instituto Tecnológico de Costa Rica, Sede San Carlos  
**Election:** Director del Campus Tecnológico Local de San Carlos  
**Document version:** 1.0  
**UI Language:** Spanish (Costa Rican)

---

## 1. Project Overview

### 1.1 Goal
Build a single-page website that presents the personal profile, academic career, and achievements of Dr. Alfredo Elías Alfaro Ramos in support of his candidacy for Director of the Campus Tecnológico Local de San Carlos (Instituto Tecnológico de Costa Rica).

### 1.2 Purpose
The site must convey credibility, professionalism, and community commitment to the university voters. It must be visually polished, easy to navigate, and load fast on both desktop and mobile.

### 1.3 Scope
- Single HTML page with smooth-scroll navigation.
- Nine content sections (in Spanish): Inicio, Sobre mí, Logros, Investigación, Docencia, Trabajo Comunal, Publicaciones, Premios, Contacto.
- Fixed top navigation bar with logo (left) and section links (right).
- Carousels / sliders in at least two sections (Hero banner and Achievements / Awards).
- White and blue color palette.
- No back-end required at launch; contact form uses a third-party form service (Formspree).

### 1.4 Non-Goals
- No CMS, database, or authentication system.
- No server-side rendering or complex build pipeline.
- No multi-language support in v1.

---

## 2. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Markup | HTML5 | Semantic, accessible structure |
| Styling | CSS3 + Tailwind CSS v3 (CDN) | Utility-first, rapid UI, no build step needed for v1 |
| Interactivity | Vanilla JavaScript (ES2022) | No framework overhead for a single page |
| Carousel / Slider | Swiper.js v11 (CDN) | Actively maintained, mobile-friendly, accessible |
| Smooth Scroll | CSS `scroll-behavior: smooth` + JS IntersectionObserver | Native, no extra library |
| Icons | Font Awesome 6 Free (CDN) | Free, MIT-licensed, wide icon set |
| Contact Form | Formspree (free tier) | Zero back-end, HTTPS POST, built-in spam protection |
| Fonts | Google Fonts — Inter (body) + Merriweather (headings) | Professional academic feel |
| Hosting | GitHub Pages or Netlify (free tier) | Static hosting, HTTPS enforced |

> **Security note:** All CDN resources must be loaded over HTTPS and pinned with Subresource Integrity (SRI) hashes. No secrets or API keys are embedded in the source code.

---

## 3. Color Palette & Design System

### 3.1 Color Tokens

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#003DA5` | Primary blue — navbar, headings, buttons |
| `--color-primary-light` | `#1A56DB` | Hover states, active nav link |
| `--color-accent` | `#0EA5E9` | Section dividers, icons, highlights |
| `--color-bg` | `#FFFFFF` | Default section background |
| `--color-bg-alt` | `#F0F6FF` | Alternating section background |
| `--color-text` | `#1E293B` | Body text |
| `--color-text-muted` | `#64748B` | Captions, labels |
| `--color-white` | `#FFFFFF` | Text on dark/blue backgrounds |

### 3.2 Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| Page headings (h1) | Merriweather | Bold | 3rem |
| Section headings (h2) | Merriweather | Bold | 2.25rem |
| Sub-headings (h3) | Merriweather | SemiBold | 1.5rem |
| Body text | Inter | Regular | 1rem (16px) |
| Labels / captions | Inter | Medium | 0.875rem |

---

## 4. Page Architecture

### 4.1 File Structure

```
personal-webpage/
├── index.html            # Single-page entry point
├── css/
│   └── styles.css        # CSS custom properties and component overrides
├── js/
│   └── main.js           # Scroll spy, carousel init, mobile menu, form handling
├── assets/
│   ├── images/           # Profile photo, campus photos, event photos
│   ├── icons/            # Custom SVG icons if needed
│   └── docs/             # PDF publications (optional download links)
├── .gitignore
└── personal-webpage-sdd.md
```

### 4.2 Section Map

```
┌──────────────────────────────────────────────────────────────────┐
│  NAVBAR  [Logo / Name]      [Inicio | Sobre mí | Logros |        │
│                              Investigación | Docencia |          │
│                              Comunidad | Publicaciones |         │
│                              Premios | Contacto]                 │
├──────────────────────────────────────────────────────────────────┤
│  #inicio          Full-viewport Swiper carousel hero banner      │
│  #sobre-mi        Two-column: photo + bio + stat counters        │
│  #logros          Swiper carousel of achievement cards           │
│  #investigacion   CSS grid of research project cards             │
│  #docencia        Icon course list + teaching philosophy quote   │
│  #comunidad       Vertical alternating timeline                  │
│  #publicaciones   Accordion list grouped by year                 │
│  #premios         Swiper carousel of award badges                │
│  #contacto        Contact form + social links                    │
├──────────────────────────────────────────────────────────────────┤
│  FOOTER  Copyright + ITCR Sede San Carlos mention                │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Component Specifications

### 5.1 Navbar
- Fixed to top, `z-index: 50`, white background with subtle bottom shadow.
- **Left:** Logo image or text mark with candidate name.
- **Right:** Anchor links — Inicio, Sobre mí, Logros, Investigación, Docencia, Comunidad, Publicaciones, Premios, Contacto.
- Active link highlighted in `--color-primary-light` with an underline indicator.
- Hamburger menu on mobile (< 768 px) with smooth slide-down drawer.
- `IntersectionObserver` updates the active link as the user scrolls.

### 5.2 Hero Section (`#inicio`)
- Full-viewport height (`100vh`).
- Swiper.js carousel with 3–5 slides; each slide uses a background image with a `--color-primary` semi-transparent gradient overlay.
- Slide content: context subtitle ("Candidato a Director de Campus Tecnológico Local de San Carlos"), large candidate name heading, campaign tagline, and a CTA button ("Conoce mi propuesta") that scrolls to `#sobre-mi`.
- Swiper autoplay (5 s interval), pagination dots, keyboard navigation, touch/swipe support.

### 5.3 About Me Section (`#sobre-mi`)
- White background, two-column layout (desktop), stacked on mobile.
- **Left column:** Professional circular profile photo with a `--color-primary` border accent.
- **Right column:** Full name, title, institution badge, biography paragraph, and a stat counters row (e.g., años de docencia, publicaciones, proyectos de investigación, premios).
- Stat counters animate from 0 to target value when the section enters the viewport (IntersectionObserver + `requestAnimationFrame`).

### 5.4 Achievements Section (`#logros`)
- `--color-bg-alt` background.
- Section title + descriptive subtitle.
- Swiper.js carousel of achievement cards; each card has an icon, year, title, and two-line description.
- Navigation arrows visible on desktop; swipe on mobile.

### 5.5 Research Section (`#investigacion`)
- White background.
- Responsive CSS grid: 3 columns (desktop ≥ 1024 px), 2 columns (tablet), 1 column (mobile).
- Each card: project title, year range, status badge (active / completed), short abstract, optional external link.

### 5.6 Teaching Section (`#docencia`)
- `--color-bg-alt` background.
- **Left column:** List of courses taught — icon, course code, course name.
- **Right column:** "Filosofía de Enseñanza" blockquote styled with a `--color-primary` left border and italic text.

### 5.7 Community Work Section (`#comunidad`)
- White background.
- Vertical timeline: alternating left/right layout on desktop, single column on mobile.
- Each timeline node: date, activity title, organization, and short description.
- Blue circle connector dots on the center axis.

### 5.8 Publications Section (`#publicaciones`)
- `--color-bg-alt` background.
- Accordion list grouped by year (most recent first).
- Each item: authors, article/paper title (italic), journal or conference name, DOI / external link.
- Accordion open/close toggled via vanilla JS; only one item open at a time per group.

### 5.9 Awards Section (`#premios`)
- White background.
- Swiper.js carousel of award cards — badge icon or image, award name, year, issuing institution.

### 5.10 Contact Section (`#contacto`)
- `--color-primary` dark blue background, white text.
- **Left column:** Candidate name, academic title, institutional email, office location (Campus San Carlos).
- **Right column:** Formspree-powered form with fields: name, email, message, honeypot (hidden), submit button.
- `fetch` POST submission; inline success / error feedback without page reload.
- Social icon row: LinkedIn, ResearchGate, ORCID.

### 5.11 Footer
- Dark navy (`#001D6C`) background, centered white text.
- Copyright line + "Instituto Tecnológico de Costa Rica — Sede San Carlos".

---

## 6. Interactions & Behaviours

| Behaviour | Mechanism |
|---|---|
| Smooth scroll to section | CSS `scroll-behavior: smooth` on `<html>` |
| Active nav link tracking | `IntersectionObserver` on each `<section>` |
| Mobile nav open / close | Vanilla JS class toggle on drawer element |
| Hero carousel | Swiper.js v11 — autoplay, pagination, keyboard |
| Achievements carousel | Swiper.js v11 — navigation arrows, loop |
| Awards carousel | Swiper.js v11 — navigation arrows, loop |
| Stat counter animation | `IntersectionObserver` + `requestAnimationFrame` |
| Publications accordion | Vanilla JS `classList.toggle` |
| Contact form | `fetch` POST to Formspree — no page reload |
| Section scroll-reveal | CSS `@keyframes fadeInUp` triggered by IntersectionObserver |

---

## 7. Accessibility & SEO

- Semantic HTML5 elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`.
- `aria-label` on `<nav>`, carousel controls, and accordion buttons.
- `alt` text required on all images.
- Color contrast ratio ≥ 4.5:1 for all body text; ≥ 3:1 for large text (WCAG AA).
- `lang="es"` on `<html>`.
- Open Graph meta tags for social sharing preview.
- `<title>` and `<meta name="description">` with candidate name and election context.
- Keyboard navigable: all interactive elements reachable via Tab.

---

## 8. Security Requirements

- All external scripts and stylesheets loaded via HTTPS CDN with SRI (`integrity` + `crossorigin`) attributes.
- No API keys, tokens, or secrets embedded in any source file.
- Formspree form endpoint is a public URL (not a secret); honeypot field added to reduce spam.
- `.gitignore` created and includes local environment files and OS artifacts.
- All images self-hosted in `assets/images/` to avoid third-party tracking pixels.
- No `eval()` or `innerHTML` with untrusted content in JavaScript.

---

## 9. Implementation Sub-Tasks

### Sub-Task 1 — Project Scaffolding
- **Intent:** Establish the file structure, CDN imports, and CSS design tokens so all subsequent sub-tasks have a stable base.
- **Expected Outcomes:** `index.html` loads in a browser with correct fonts, no console errors; CSS variables resolve; folder structure matches §4.1.
- **Todo List:**
  1. Create folder structure: `css/`, `js/`, `assets/images/`, `assets/icons/`, `assets/docs/`.
  2. Write `index.html` boilerplate — `<head>` with meta tags, CDN links (Tailwind CSS v3, Swiper.js v11, Font Awesome 6 Free) with SRI hashes, empty section anchors.
  3. Write `css/styles.css` with CSS custom properties (color tokens, typography scale, base resets).
  4. Create `.gitignore` (node_modules, .DS_Store, .env).
- **Relevant context:** §2 Technology Stack, §3 Design System, §4.1 File Structure.
- **Status:** `[x] done`

### Sub-Task 2 — Navbar
- **Intent:** Fixed navigation bar with logo, section links, scroll-spy active state, and responsive hamburger menu.
- **Expected Outcomes:** Navbar is visible and fixed on all scroll positions; active link updates on scroll; hamburger opens/closes correctly on mobile.
- **Todo List:**
  1. Build `<header>` + `<nav>` HTML with logo placeholder and anchor links.
  2. Style with Tailwind utilities and custom CSS for active-link indicator.
  3. Implement hamburger toggle logic in `main.js`.
  4. Implement `IntersectionObserver` scroll-spy in `main.js`.
- **Relevant context:** §5.1 Navbar.
- **Status:** `[x] done`

### Sub-Task 3 — Hero Section
- **Intent:** Full-viewport Swiper carousel that immediately communicates the candidate's identity and campaign context.
- **Expected Outcomes:** Carousel auto-plays, is keyboard and touch navigable, CTA button scrolls to `#sobre-mi`.
- **Todo List:**
  1. Add `#inicio` HTML with Swiper wrapper and 3 placeholder slides.
  2. Initialize Swiper instance in `main.js` with autoplay (5 s), pagination, keyboard options.
  3. Style gradient overlay and slide typography layout.
- **Relevant context:** §5.2 Hero Section.
- **Status:** `[x] done`

### Sub-Task 4 — About Me Section
- **Intent:** Present Dr. Alfaro's profile photo, biography, and key career stats with an animated counter.
- **Expected Outcomes:** Responsive two-column layout; counters animate once on first viewport entry.
- **Todo List:**
  1. Build two-column `#sobre-mi` HTML layout.
  2. Add placeholder profile photo with blue circular border.
  3. Implement stat counter animation in `main.js`.
- **Relevant context:** §5.3 About Me Section.
- **Status:** `[x] done`

### Sub-Task 5 — Achievements Section
- **Intent:** Showcase key career milestones in a visually engaging carousel.
- **Expected Outcomes:** Achievement cards render correctly; carousel has working navigation arrows and loops.
- **Todo List:**
  1. Build `#logros` HTML with Swiper card structure.
  2. Initialize second Swiper instance in `main.js`.
  3. Style cards with `--color-primary` top border accent.
- **Relevant context:** §5.4 Achievements Section.
- **Status:** `[x] done`

### Sub-Task 6 — Research, Teaching, and Community Work Sections
- **Intent:** Three mid-page sections covering professional depth — research output, teaching activity, and community engagement.
- **Expected Outcomes:** Grid, icon list, blockquote, and timeline components all render correctly on desktop and mobile.
- **Todo List:**
  1. Build `#investigacion` CSS grid with placeholder research project cards.
  2. Build `#docencia` two-column layout with course list and philosophy quote.
  3. Build `#comunidad` CSS-only vertical timeline.
- **Relevant context:** §5.5, §5.6, §5.7.
- **Status:** `[x] done`

### Sub-Task 7 — Publications and Awards Sections
- **Intent:** Display academic publications in a readable accordion and awards in a carousel.
- **Expected Outcomes:** Accordion toggles open/close per item; awards Swiper carousel functions with loop and navigation.
- **Todo List:**
  1. Build `#publicaciones` accordion HTML grouped by year.
  2. Implement accordion toggle logic in `main.js`.
  3. Build `#premios` Swiper carousel HTML.
  4. Initialize awards Swiper instance in `main.js`.
- **Relevant context:** §5.8, §5.9.
- **Status:** `[x] done`

### Sub-Task 8 — Contact Section and Footer
- **Intent:** Provide voters and supporters a way to reach the candidate; close the page cleanly.
- **Expected Outcomes:** Form submits via Formspree without page reload; success/error message displayed inline; footer renders.
- **Todo List:**
  1. Build `#contacto` two-column HTML with contact info and form (including honeypot).
  2. Wire `fetch` POST to Formspree endpoint in `main.js`.
  3. Add social icon links (LinkedIn, ResearchGate, ORCID).
  4. Build `<footer>` HTML.
- **Relevant context:** §5.10, §5.11.
- **Status:** `[x] done`

### Sub-Task 9 — Scroll-Reveal Animations and Final Polish
- **Intent:** Add entrance animations to all sections and perform a final cross-device review.
- **Expected Outcomes:** Sections fade in smoothly on scroll with no layout shift; page passes a manual accessibility checklist.
- **Todo List:**
  1. Define `@keyframes fadeInUp` in `styles.css`.
  2. Add `IntersectionObserver` in `main.js` to apply the animation class to each section and its children.
  3. Review contrast ratios, alt texts, aria-labels.
  4. Test on Chrome, Firefox, Safari (desktop and mobile viewports).
- **Relevant context:** §6 Interactions, §7 Accessibility.
- **Status:** `[x] done`

---

## 10. Open Questions

| # | Question | Status |
|---|---|---|
| 1 | Professional profile photo available? | Pending — placeholder used until provided |
| 2 | Hero background images available? | Pending — placeholders used initially |
| 3 | Actual publications, courses, and award data? | Pending — to be provided by candidate |
| 4 | Formspree account and form endpoint URL? | Pending — to be created by site owner |
| 5 | Is use of the ITCR institutional logo permitted? | Pending — confirm ITCR branding guidelines |
| 6 | Preferred deployment target (GitHub Pages or Netlify)? | Pending — to be confirmed |
