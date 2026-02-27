# Job Notification App — Premium SaaS Design System

**Version:** 1.0  
**Status:** Foundation Complete  
**Last Updated:** February 2026

---

## Design Philosophy

The Job Notification App operates under a design philosophy that prioritizes clarity, intention, and coherence over flashiness or novelty.

### Core Principles

1. **Calm** — Every interaction is purposeful, never disorienting
2. **Intentional** — Whitespace, color, and typography are deliberate
3. **Coherent** — No conflicting patterns or unexpected behaviors
4. **Confident** — Clear messaging, obvious actions, no ambiguity

### What We Avoid

- Gradients — Solid colors only
- Glassmorphism — Clarity over texture
- Neon colors — Muted, professional palette
- Animation noise — Only meaningful transitions
- Decorative elements — Function over decoration
- Random sizing — Consistent scale system
- Playful tone — Professional and trustworthy

---

## Color System

The color palette is restricted to **4 core colors** to maintain system coherence.

### Primary Colors

| Color | Value | Usage |
|-------|-------|-------|
| **Background** | #F7F6F3 | Page backgrounds, neutral surface |
| **Primary Text** | #111111 | All body text, labels |
| **Accent** | #8B0000 | Primary actions, interactive states |
| **White** | #FFFFFF | Card backgrounds, contrast |

### Semantic Colors

| Color | Value | Purpose |
|-------|-------|---------|
| **Success** | #4B7C59 | Positive feedback, confirmations |
| **Warning** | #B8860B | Alerts, caution states |
| **Error** | #8B0000 | Error messages (same as accent) |

### Supporting Neutrals

| Color | Value | Usage |
|-------|-------|------|
| Neutral Light | #F7F6F3 | Background |
| Neutral Medium | #DCDAD5 | Disabled, muted text |
| Neutral Dark | #333333 | Alternative text |
| Border | #E5E3E0 | Form inputs, card borders |
| Border Subtle | #EEE9E3 | Dividers, light separations |

### Color Rules

- No more than 4 colors visible on a single screen
- Semantic colors are paired with neutral backgrounds for accessibility
- Focus states always use accent color
- Hover states use a 10% darker shade of the primary color
- Disabled states use the neutral medium gray

---

## Typography

### Font Families

```
Serif (Headings):  Crimson Text, Georgia, serif
Sans (Body):       Inter, -apple-system, Segoe UI, sans-serif
Monospace (Code):  Fira Code, Monaco, monospace
```

### Type Scale

#### Headings (All Serif)

| Size | CSS Var | Usage |
|------|---------|-------|
| H1 | `var(--font-size-h1)` | Page titles (48px) |
| H2 | `var(--font-size-h2)` | Section headers (36px) |
| H3 | `var(--font-size-h3)` | Subsections (28px) |
| H4 | `var(--font-size-h4)` | Card titles (24px) |

#### Body Text (All Sans)

| Size | CSS Var | Usage |
|------|---------|-------|
| Large | `--font-size-body-large` | Key information (18px) |
| Normal | `--font-size-body` | Default body text (16px) |
| Small | `--font-size-body-small` | Secondary text (14px) |
| Label | `--font-size-label` | Form labels, badges (12px) |

### Font Weights

```
Regular:   400
Medium:    500
Semibold:  600
Bold:      700
```

### Line Heights

| Value | Variable | Usage |
|-------|----------|-------|
| 1.4 | `--line-height-tight` | Headings, dense text |
| 1.6 | `--line-height-normal` | Body text default |
| 1.8 | `--line-height-relaxed` | Large text, readability |

### Typography Rules

- **Max text width:** 720px (readability constraint)
- **No decorative fonts** — Only serif and sans-serif
- **Consistent sizing** — Use the scale above, never arbitrary sizes
- **Generous headings** — Use `line-height: 1.4` with increased letter-spacing for readability
- **Body hierarchy** — Use weight changes, not size changes for emphasis
- **Serif for confidence** — Headings use serif to convey maturity and authority
- **Sans for efficiency** — Body text uses sans-serif for clarity and digital readability

---

## Spacing System

All spacing must follow this **strictly enforced scale**. Never use arbitrary values.

```
8px   (--space-xs)
16px  (--space-sm)
24px  (--space-md)
40px  (--space-lg)
64px  (--space-xl)
```

### Spacing Rules

- **Whitespace is intentional** — Every gap has purpose
- **No random increments** — Never use 13px, 27px, 35px, etc.
- **Consistency across sections** — Same spacing = visual relationship
- **Component padding** — Use `--space-md` (24px) for standard card/form spacing
- **Section gaps** — Use `--space-lg` (40px) for major separations
- **Form rows** — Use `--space-md` (24px) between form inputs

### CSS Variables

```css
--space-xs: 8px;    /* Tight, adjacent elements */
--space-sm: 16px;   /* Component margins */
--space-md: 24px;   /* Standard padding/gaps */
--space-lg: 40px;   /* Major sections */
--space-xl: 64px;   /* Hero/banner areas */
```

---

## Global Layout Structure

Every page follows a consistent **5-layer structure**:

```
┌─────────────────────────────────┐
│        TOP BAR (64px)           │
│  Left: App Name                 │
│  Center: Progress Step X / Y    │
│  Right: Status Badge            │
├─────────────────────────────────┤
│     CONTEXT HEADER              │
│  Headline (H2)                  │
│  Subtext (Body Text)            │
│  Clear purpose statement        │
├──────────────────┬──────────────┤
│                  │              │
│ PRIMARY (70%)    │ SECONDARY    │
│                  │ (30%)        │
│  • Main content  │ • Step info  │
│  • Forms         │ • Prompt box │
│  • Cards         │ • Actions    │
│                  │              │
├──────────────────┴──────────────┤
│      PROOF FOOTER (80px)        │
│  □ UI Built  □ Logic  □ Test    │
└─────────────────────────────────┘
```

### Top Bar

- **Height:** 64px
- **Position:** Sticky, z-index 100
- **Border:** Bottom subtle border
- **Shadow:** Minimal shadow (--shadow-sm)
- **Left Section:** App name (serif, H4 size)
- **Center Section:** Progress indicator (e.g., "Step 2 / 8")
- **Right Section:** Status badge (Not Started / In Progress / Shipped)

### Context Header

- **Background:** Off-white (--color-background)
- **Padding:** `--space-lg` (40px)
- **Headline:** Serif, H2 size, confident, large
- **Subtext:** Body text, muted color, max 720px width
- **Purpose:** Set user expectations clearly
- **Language:** Direct, no hype or marketing speak

### Primary Workspace (70%)

- **Content:** Main task area, forms, data displays
- **Components:** Cards with subtle borders, clean inputs, predictable layouts
- **Spacing:** Vertical stack with `--space-md` gaps
- **No crowding:** Whitespace is generous

### Secondary Panel (30%)

- **Position:** Sticky (top: topbar-height + space-lg)
- **Content:** Step explanation, copyable prompts, action buttons
- **Card style:** Subtle white background, border
- **Button width:** Full width in this panel
- **Grouping:** Vertically stacked sections with `--space-md` gaps

### Proof Footer

- **Height:** Minimum 80px
- **Layout:** Horizontal checklist
- **Items:** □ UI Built | □ Logic Working | □ Test Passed | □ Deployed
- **Style:** Minimalist, simple checkboxes
- **Responsive:** Wraps to vertical on mobile

---

## Component Specifications

### Buttons

#### Primary Button
- **Background:** Deep red (#8B0000)
- **Text:** White, medium weight
- **Padding:** 0 20px (horizontal)
- **Height:** 44px (medium default)
- **Border radius:** 8px
- **Hover:** Darker red (#6B0000)
- **Active:** Even darker (#5A0000)
- **Focus:** 2px solid accent ring
- **Disabled:** Gray background, muted text
- **Transition:** 200ms ease-in-out

#### Secondary Button
- **Background:** Transparent
- **Border:** 1px solid (--color-border)
- **Text:** Primary text color
- **Hover:** Light gray background + darker border
- **Same border radius:** 8px
- **Focus ring:** Same as primary

#### Tertiary Button
- **Style:** Text-only, no border
- **Color:** Accent red
- **Hover:** Slightly darker + underline
- **Use:** Links within content, secondary actions

#### Button Sizes
- **Small:** 36px height, 14px text
- **Medium:** 44px height, 16px text (default)
- **Large:** 52px height, 18px text

#### Button Widths
- **Icon buttons:** 44px × 44px square
- **Regular buttons:** Content width
- **Full width:** Constrain in secondary panel and modals

### Form Inputs

#### Text Inputs
- **Height:** 44px
- **Padding:** 12px vertical, 16px horizontal
- **Border:** 1px solid (--color-border)
- **Border radius:** 8px
- **Focus:** Accent border + subtle inset ring
- **Disabled:** Gray background, disabled styles
- **Transition:** 200ms ease-in-out

#### Labels
- **Size:** 14px
- **Weight:** Medium (500)
- **Margin below:** 8px
- **Required indicator:** Red asterisk (*)

#### Form Groups
- **Spacing between inputs:** 24px
- **Help text:** 12px, muted gray, below input
- **Error text:** 12px, error color, below input
- **Success text:** 12px, success color, below input

#### Select/Dropdown
- **Same height/border as text input:** 44px
- **Dropdown arrow:** Right-aligned, custom styling
- **Remove default styling:** appearance: none

### Cards

#### Standard Card
- **Background:** White
- **Border:** 1px solid (--color-border)
- **Padding:** 24px (--space-md)
- **Border radius:** 8px
- **Shadow on hover:** Subtle shadow (--shadow-md)
- **Transition:** 200ms ease-in-out

#### Card Sections
- **Header:** 24px padding bottom, border separator
- **Title:** H4 serif, bold
- **Subtitle:** 14px, muted color
- **Body:** Standard padding, content area
- **Footer:** Border separator, right-aligned buttons

#### Card Sizes
- **Small:** 16px padding
- **Medium:** 24px padding (default)
- **Large:** 40px padding

### Badges & Tags

- **Background:** Light gray (--color-hover)
- **Padding:** 4px 12px
- **Border radius:** 6px
- **Font size:** 12px, medium weight
- **Semantic variants:** Primary, success, warning, error
- **Colored versions:** Solid background + white text

### Alerts

#### Alert Structure
- **Padding:** 16px
- **Border:** 1px solid
- **Border radius:** 8px
- **Font size:** 14px
- **Line height:** 1.6

#### Alert Variants
- **Error:** Red tinted background + red border
- **Warning:** Amber tinted background + amber border
- **Success:** Green tinted background + green border
- **Info:** Blue tinted background + blue border

#### Alert Content
- **Never blame the user** — Use "We couldn't" not "You failed"
- **Explain the problem** — Be specific
- **Suggest a fix** — Provide next steps
- **Example:** "We couldn't send the email. Please check your email address and try again."

---

## Interactions & Transitions

### Transition Timing

```
Fast:   150ms  (quick feedback, button clicks)
Normal: 200ms  (default, all interactive elements)
Slow:   300ms  (modals, major layout shifts)
```

### Transition Easing

- **Function:** `ease-in-out`
- **No bounce:** Keep interactions precise
- **No parallax:** Avoid motion sickness
- **Predictable:** Users should anticipate movement

### Focus States

- **Visible:** 2px solid ring, accent color
- **Offset:** 2px from element edge
- **High contrast:** Works on all backgrounds
- **Keyboard navigation:** Always visible

### Hover States

- **Buttons:** 10% darker shade
- **Cards:** Subtle shadow + slightly darker border
- **Links:** Underline + color change
- **Disabled:** No hover effect, cursor: not-allowed

### Active States

- **Scale:** No scaling (avoid jank)
- **Color:** Darker shade of primary
- **Opacity:** No opacity changes
- **Feedback:** Instant, within 100ms

---

## Error & Empty States

### Error States

#### Error Messages
- **Color:** Error red (#8B0000)
- **Font size:** 14px
- **Below form input** or in an alert
- **Clear explanation:** Always explain what went wrong
- **Action-oriented:** Guide user to fix
- **Example:** "Email is invalid. Please use a valid format like user@example.com"

#### Form Field Errors
- **Border color:** Change to error red
- **Inset focus ring:** Use error color
- **Help text:** Display error message below
- **Visual weight:** Match button weight for visibility

#### Page-Level Errors
- **Alert component:** Display at top of main content
- **Icon:** ⚠️ Error symbol (optional)
- **Title:** Clear problem statement
- **Details:** Explain what happened and why
- **Action:** Provide button to retry or recover

### Empty States

#### Empty List View
- **Illustration area:** (optional, minimal)
- **Headline:** "No [items] yet"
- **Subtext:** Explain why it's empty or how to populate
- **Primary action:** Clear button to create first item
- **Tone:** Helpful, not sad or apologetic

#### Empty Search Results
- **Message:** "No results found for [search term]"
- **Suggestion:** "Try different keywords or adjust filters"
- **Action:** Link to clear filters or start over
- **No results:** Show full dataset as fallback

#### Disabled Feature
- **Message:** Clearly state feature is not available
- **Reason:** Explain why (not premium, not enabled, etc.)
- **Next step:** Link to upgrade, enable, or more info

---

## Accessibility & Compliance

### Color Contrast

- **Text on background:** Minimum 4.5:1 ratio
- **All interactive elements:** Sufficient contrast
- **Primary accent on background:** High contrast for small text
- **Test:** Use WCAG AAA standards

### Keyboard Navigation

- **Tab order:** Logical, left-to-right, top-to-bottom
- **Focus visible:** Always obvious where focus is
- **Focus trapping:** Modals trap focus internally
- **Escape to close:** Modals close on Escape key

### Screen Readers

- **Semantic HTML:** Use proper heading hierarchy
- **Form labels:** Always associated with `<label>` elements
- **Button text:** Clear and descriptive
- **ARIA attributes:** Use only when necessary
- **Skip links:** Allow navigation to main content

### Color Independence

- **Never color alone:** Use text, icons, or patterns too
- **Error messages:** Include ⚠️ icon + text
- **Status indicators:** Use text label + color + icon

---

## Asset Management

### CSS Files

1. **design-tokens.css** — All CSS variables, base styles
2. **components.css** — Button, input, card, badge styles
3. **layout.css** — Topbar, header, two-column layout, footer

### Loading Order

```html
<link rel="stylesheet" href="design-tokens.css">
<link rel="stylesheet" href="components.css">
<link rel="stylesheet" href="layout.css">
```

### Variable Usage

All spacing, colors, sizing use CSS custom properties:

```css
.example {
  padding: var(--space-md);
  background: var(--color-background);
  font-size: var(--font-size-body);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
}
```

---

## Implementation Guidelines

### Do's

✓ Use the spacing scale strictly — no exceptions  
✓ Leverage CSS variables for all values  
✓ Follow type hierarchy — serif + sans clear distinction  
✓ Test contrast ratios on all text  
✓ Use focus rings consistently  
✓ Maintain generous whitespace  
✓ Keep motion minimal and purposeful  
✓ Test on real devices, not just desktop  

### Don'ts

✗ Create custom spacing values  
✗ Mix multiple font families  
✗ Use very large or very small sizes outside the scale  
✗ Apply shadows to cards unless necessary  
✗ Use animations for decoration  
✗ Disable focus rings for "aesthetic" reasons  
✗ Use color alone to convey meaning  
✗ Create one-off component variants  

---

## Responsive Design

### Breakpoints

```
Small:  640px  (tablets)
Medium: 1024px (small desktops)
Large:  1440px (large desktops)
```

### Mobile Strategy

- **Single column layout** below 1024px
- **Secondary panel** stacks below primary
- **Top bar** adjusts to mobile-friendly height
- **Touch targets:** Minimum 44px × 44px
- **Form inputs:** Full width on mobile
- **Buttons:** Full width in secondary panel

---

## Design System Maintenance

### Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Feb 2026 | Initial foundation |

### Future Enhancements

- [ ] Dark mode styles
- [ ] Animation library
- [ ] Icon system
- [ ] Component storybook
- [ ] Accessibility checklist
- [ ] Mobile navigation patterns

### Feedback & Updates

Design system updates should:

1. Maintain the core philosophy
2. Update all three CSS files consistently
3. Test for backward compatibility
4. Update documentation immediately
5. Communicate changes to team

---

## Summary

This design system provides a **professional, calm, and intentional foundation** for the Job Notification App. Every decision—from color to spacing to typography—supports the core philosophy of confidence and clarity.

The system is **strict about constraints** (spacing scale, color limits, type sizes) while **flexible in application** (components can be combined and extended as needed).

No product features have been added. This is purely the design foundation upon which all future product work will be built.
