# Job Notification App — Design System

**A premium SaaS design system built on principles of clarity, intention, and confidence.**

## Overview

This is the design foundation for the Job Notification App—a professional, B2C SaaS product. The design system establishes all visual standards, components, spacing, typography, and layout patterns without implementing any product features.

## Philosophy

- **Calm** — Every interaction is purposeful and never disorienting
- **Intentional** — Every design decision serves a clear purpose
- **Coherent** — No conflicting patterns or unexpected behaviors
- **Confident** — Clear messaging, obvious actions, zero ambiguity

What we deliberately avoid:
- Gradients (solid colors only)
- Glassmorphism (clarity over texture)
- Neon colors (muted, professional palette)
- Animation noise (only meaningful transitions)
- Decorative elements (function over decoration)
- Random sizing (consistent scale system)

## Project Structure

```
design-system/
├── README.md                    # This file
├── DESIGN-SYSTEM.md             # Complete specification document
├── reference.html               # Visual reference page
├── tokens/
│   └── design-tokens.css        # CSS variables, base styles
├── components/
│   └── components.css           # Button, input, card, badge, alert styles
└── layouts/
    └── layout.css               # Topbar, header, two-column, footer
```

## Quick Start

### View the Design System

Open `reference.html` in a browser to see all components, colors, typography, and spacing demonstrated.

```bash
# From the design-system folder
open reference.html
```

### Use in Your Project

1. Import all three CSS files in order:

```html
<link rel="stylesheet" href="design-system/tokens/design-tokens.css">
<link rel="stylesheet" href="design-system/components/components.css">
<link rel="stylesheet" href="design-system/layouts/layout.css">
```

2. Import Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600&family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
```

3. Build your page using semantic HTML and design system classes/variables.

## Core System Values

### Color Palette (4 core colors)

| Name | Value | Purpose |
|------|-------|---------|
| Background | #F7F6F3 | Off-white page background |
| Primary Text | #111111 | All body text |
| Accent | #8B0000 | Primary actions, interactive states |
| White | #FFFFFF | Card backgrounds, contrast |

**Semantic Colors:**
- Success: #4B7C59 (muted green)
- Warning: #B8860B (muted amber)
- Error: #8B0000 (same as accent)

⚠️ **Constraint:** Maximum 4 colors per screen

### Typography

**Serif Font (Headings):**
- Crimson Text — conveys maturity and confidence
- H1: 48px
- H2: 36px
- H3: 28px
- H4: 24px

**Sans Font (Body):**
- Inter — clear, modern, readable
- Body Large: 18px
- Body: 16px (default)
- Body Small: 14px
- Label: 12px (uppercase)

**Line Heights:**
- Tight: 1.4 (headings)
- Normal: 1.6 (body text)
- Relaxed: 1.8 (large text, readability)

⚠️ **Constraint:** Max text width is 720px for readability

### Spacing Scale

Only 5 values. Never use random spacing.

```
8px   (--space-xs)   Tight, adjacent elements
16px  (--space-sm)   Component margins
24px  (--space-md)   Standard padding (most common)
40px  (--space-lg)   Major sections
64px  (--space-xl)   Hero areas
```

### Components

#### Buttons

```html
<!-- Primary (solid deep red) -->
<button class="btn-primary">Primary Button</button>

<!-- Secondary (outlined) -->
<button class="btn-secondary">Secondary Button</button>

<!-- Tertiary (text only) -->
<button class="btn-tertiary">Text Link</button>

<!-- Sizes -->
<button class="btn-primary btn-sm">Small</button>
<button class="btn-primary btn-lg">Large</button>

<!-- Full width -->
<button class="btn-primary btn-full">Full Width</button>
```

#### Form Inputs

```html
<div class="form-group">
  <label class="form-label required">Email</label>
  <input type="email" placeholder="user@example.com">
  <div class="form-help">Helper text</div>
</div>

<!-- With error -->
<input type="text" class="has-error">
<div class="form-error">Error message</div>

<!-- With success -->
<input type="text" class="has-success">
<div class="form-success">Success message</div>
```

#### Cards

```html
<div class="card">
  <div class="card-header">
    <h4 class="card-title">Card Title</h4>
    <p class="card-subtitle">Subtitle</p>
  </div>
  <div class="card-body">
    <!-- Content -->
  </div>
  <div class="card-footer">
    <button class="btn-secondary">Cancel</button>
    <button class="btn-primary">Save</button>
  </div>
</div>
```

#### Alerts

```html
<div class="alert alert-success">Success message</div>
<div class="alert alert-warning">Warning message</div>
<div class="alert alert-error">Error message</div>
<div class="alert alert-info">Info message</div>
```

#### Badges

```html
<span class="badge">Default</span>
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-error">Error</span>
```

### Global Layout

Every page follows this structure:

```
┌─────────────────────────────────┐
│        TOP BAR (64px)           │
│  Left: App Name                 │
│  Center: Progress (Step X / Y)  │
│  Right: Status Badge            │
├─────────────────────────────────┤
│     CONTEXT HEADER              │
│  H2 Headline                    │
│  Subtext explanation            │
├──────────────────┬──────────────┤
│                  │              │
│ PRIMARY (70%)    │ SECONDARY    │
│ Main content     │ (30%)        │
│                  │ Step info    │
│                  │ Prompts      │
├──────────────────┴──────────────┤
│      PROOF FOOTER (80px)        │
│  □ UI Built □ Logic □ Test      │
└─────────────────────────────────┘
```

**Top Bar:**
- Height: 64px
- Sticky positioning
- App name (left), progress (center), status (right)

**Context Header:**
- Large serif headline
- One-line supporting text
- Explains page purpose

**Primary Workspace (70%):**
- Main content area
- Cards, forms, data displays
- Vertical stacking with consistent gaps

**Secondary Panel (30%):**
- Sticky (stays visible on scroll)
- Step explanation
- Copyable prompt box
- Action buttons

**Proof Footer:**
- Checklist style
- □ UI Built | □ Logic Working | □ Test Passed | □ Deployed

## CSS Variables

All values are defined as CSS custom properties in `tokens/design-tokens.css`:

```css
/* Colors */
--color-background
--color-text-primary
--color-accent
--color-white
--color-success
--color-warning
--color-error

/* Typography */
--font-serif
--font-sans
--font-mono
--font-size-h1 through --font-size-label
--font-weight-regular through --font-weight-bold
--line-height-tight / normal / relaxed

/* Spacing */
--space-xs: 8px
--space-sm: 16px
--space-md: 24px
--space-lg: 40px
--space-xl: 64px

/* Borders & Radius */
--radius-sm: 4px
--radius-md: 6px
--radius-lg: 8px

/* Shadows (subtle only) */
--shadow-sm
--shadow-md
--shadow-lg

/* Transitions */
--transition-fast: 150ms ease-in-out
--transition-normal: 200ms ease-in-out
--transition-slow: 300ms ease-in-out
```

## Usage Examples

### Simple Page Layout

```html
<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600&family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="design-system/tokens/design-tokens.css">
  <link rel="stylesheet" href="design-system/components/components.css">
  <link rel="stylesheet" href="design-system/layouts/layout.css">
</head>
<body>
  <div class="app-container">
    <!-- Top Bar -->
    <div class="topbar">
      <div class="topbar-left">
        <h1 class="app-name">Job Notification App</h1>
      </div>
      <div class="topbar-center">
        <div class="progress-indicator">
          Step <span class="progress-step">1</span> / 5
        </div>
      </div>
      <div class="topbar-right">
        <div class="status-badge in-progress">
          <span class="status-dot"></span>
          In Progress
        </div>
      </div>
    </div>

    <!-- Context Header -->
    <div class="context-header">
      <h2 class="context-headline">Create Your Profile</h2>
      <p class="context-subtext">Tell us about yourself so we can send better job notifications.</p>
    </div>

    <!-- Main Layout -->
    <div class="main-layout">
      <!-- Primary Content -->
      <div class="primary-workspace">
        <div class="card">
          <div class="card-body">
            <div class="form-group">
              <label class="form-label required">Full Name</label>
              <input type="text" placeholder="Your name">
            </div>
            <div class="form-group">
              <label class="form-label required">Email</label>
              <input type="email" placeholder="your@email.com">
            </div>
          </div>
        </div>
      </div>

      <!-- Secondary Panel -->
      <div class="secondary-panel">
        <div class="step-explanation">
          <h4 class="step-title">Step 1: Profile</h4>
          <p class="step-description">Start by creating your profile. This helps us personalize job recommendations.</p>
        </div>
        <div class="secondary-actions">
          <button class="btn-primary btn-full">Continue</button>
          <button class="btn-secondary btn-full">Save Draft</button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="proof-footer">
      <div class="proof-checklist">
        <div class="proof-item done">
          <span class="proof-checkbox">☑</span> Profile Created
        </div>
        <div class="proof-item">
          <span class="proof-checkbox">☐</span> Preferences Set
        </div>
      </div>
    </div>
  </div>
</body>
</html>
```

## Accessibility

- **Focus states:** Always visible, 2px ring
- **Color contrast:** 4.5:1 minimum (WCAG AA)
- **Keyboard navigation:** Logical tab order
- **Semantic HTML:** Proper heading hierarchy, associated labels
- **Screen readers:** Descriptive button text, ARIA where needed
- **Color independence:** Never use color alone for meaning

## Transitions

- **Fast:** 150ms (button clicks, quick feedback)
- **Normal:** 200ms (default interactive elements)
- **Slow:** 300ms (modals, layout shifts)
- **Easing:** ease-in-out (no bounce, no parallax)

## Do's and Don'ts

### ✓ Do's

- Use the spacing scale strictly
- Leverage CSS variables for all values
- Follow type hierarchy (serif ≠ sans)
- Test contrast ratios
- Use focus rings consistently
- Keep motion minimal and purposeful
- Test on real devices

### ✗ Don'ts

- Create custom spacing values
- Mix multiple font families
- Use very large or very small sizes outside the scale
- Apply shadows unnecessarily
- Use animations for decoration
- Disable focus rings for aesthetics
- Use color alone to convey meaning
- Create one-off component variants

## Error States

Errors should:
- **Clearly explain** what went wrong
- **Never blame** the user
- **Suggest a fix** with next steps
- **Be actionable** — user knows what to do

Example:
```html
<div class="alert alert-error">
  <strong>Couldn't send email.</strong> 
  Please check your email address (must include @) and try again.
</div>
```

## Empty States

Empty states should:
- **Explain** why the screen is empty
- **Guide** the user to next action
- **Provide** a clear call-to-action
- **Never** show a blank screen

Example:
```html
<div style="text-align: center; padding: var(--space-lg);">
  <h3>No notifications yet</h3>
  <p style="color: var(--color-neutral-medium); margin: var(--space-md) 0;">
    When new jobs match your preferences, we'll notify you here.
  </p>
  <button class="btn-primary">Review Your Preferences</button>
</div>
```

## Responsive Design

- **Breakpoint 640px:** Tablets
- **Breakpoint 1024px:** Desktop (layout switches to single column below this)
- **Breakpoint 1440px:** Large screens
- **Mobile:** Single column, full-width buttons, 44px× minimum touch targets
- **Touch:** Minimum 44px × 44px interactive areas

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

## File Sizes

- `design-tokens.css` ~8KB
- `components.css` ~12KB
- `layout.css` ~7KB
- **Total:** ~27KB (uncompressed, gzips to ~6KB)

## Maintenance

### When to Update

- Adding new component
- Changing color values
- Updating spacing rules
- Adding new breakpoints

### How to Update

1. Update relevant CSS file (tokens/components/layouts)
2. Update `DESIGN-SYSTEM.md` documentation
3. Update `reference.html` with new examples
4. Test in browser
5. Commit changes with clear message

### Version Control

This design system uses semantic versioning:
- **Major:** Philosophy or core constraint changes
- **Minor:** New components or tokens
- **Patch:** Bug fixes or documentation updates

Current version: **1.0** (Foundation Complete)

## Next Steps (Product Development)

When ready to build product features:

1. Create page templates using this foundation
2. Build components on top of design system classes
3. Extend CSS only where design system doesn't cover
4. Never override core tokens or spacing values
5. Test accessibility at each step
6. Maintain consistency with system philosophy

## Questions?

Refer to `DESIGN-SYSTEM.md` for detailed specifications, component API, and guidelines.

---

**Design System Status:** ✅ Foundation Complete  
**Ready for:** Product feature development  
**Last Updated:** February 2026
