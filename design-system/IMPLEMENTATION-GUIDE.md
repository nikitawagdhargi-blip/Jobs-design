# Design System Implementation Guide

Quick reference for developers integrating the design system into product features.

## File Structure

```
project/
├── design-system/
│   ├── tokens/design-tokens.css      ← Import first
│   ├── components/components.css      ← Import second
│   ├── layouts/layout.css             ← Import third
│   └── reference.html                 ← Visual reference
└── src/
    └── pages/                          ← Your product pages
```

## HTML Head Setup

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Google Fonts (required) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600&family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
  
  <!-- Design System (in order) -->
  <link rel="stylesheet" href="../design-system/tokens/design-tokens.css">
  <link rel="stylesheet" href="../design-system/components/components.css">
  <link rel="stylesheet" href="../design-system/layouts/layout.css">
  
  <!-- Your custom styles (after design system) -->
  <link rel="stylesheet" href="styles.css">
  
  <title>Page Title</title>
</head>
<body>
  <!-- Your content here -->
</body>
</html>
```

## Basic Page Template

```html
<div class="app-container">
  <!-- 1. TOP BAR -->
  <div class="topbar">
    <div class="topbar-left">
      <h1 class="app-name">Job Notification App</h1>
    </div>
    <div class="topbar-center">
      <div class="progress-indicator">
        Step <span class="progress-step">2</span> / 5
      </div>
    </div>
    <div class="topbar-right">
      <div class="status-badge in-progress">
        <span class="status-dot"></span>
        In Progress
      </div>
    </div>
  </div>

  <!-- 2. CONTEXT HEADER -->
  <div class="context-header">
    <h2 class="context-headline">Set Your Preferences</h2>
    <p class="context-subtext">Choose job titles and companies to customize your notifications.</p>
  </div>

  <!-- 3. MAIN LAYOUT (Primary + Secondary) -->
  <div class="main-layout">
    <!-- 3A. PRIMARY WORKSPACE (70%) -->
    <div class="primary-workspace">
      <!-- Your main content: cards, forms, lists, etc. -->
    </div>

    <!-- 3B. SECONDARY PANEL (30%) -->
    <div class="secondary-panel">
      <!-- Step explanation, prompts, buttons -->
    </div>
  </div>

  <!-- 4. PROOF FOOTER -->
  <div class="proof-footer">
    <div class="proof-checklist">
      <div class="proof-item done">
        <span class="proof-checkbox">☑</span> UI Built
      </div>
      <div class="proof-item">
        <span class="proof-checkbox">☐</span> Logic Working
      </div>
    </div>
  </div>
</div>
```

## Common Patterns

### Form with Validation

```html
<div class="card">
  <div class="card-body">
    <form>
      <div class="form-group">
        <label class="form-label required">Email Address</label>
        <input 
          type="email" 
          placeholder="user@example.com"
          required
        >
        <div class="form-help">We'll use this to send job notifications.</div>
      </div>

      <div class="form-group">
        <label class="form-label required">Job Title</label>
        <input 
          type="text" 
          placeholder="e.g., Product Manager"
          class="has-error"
          value="Invalid input"
        >
        <div class="form-error">This title is not in our database. Try a different one.</div>
      </div>

      <div class="form-group">
        <label class="form-label">Location</label>
        <div class="select-wrapper">
          <select>
            <option>San Francisco</option>
            <option>New York</option>
            <option>Remote</option>
          </select>
        </div>
      </div>
    </form>
  </div>

  <div class="card-footer">
    <button class="btn-secondary">Back</button>
    <button class="btn-primary">Continue</button>
  </div>
</div>
```

### Success/Error Page

```html
<div class="primary-workspace">
  <!-- Success State -->
  <div class="alert alert-success" style="margin-bottom: var(--space-lg);">
    <strong>All set!</strong> Your preferences are saved and you'll start receiving job notifications immediately.
  </div>

  <div class="card">
    <div class="card-header">
      <h4 class="card-title">Next Steps</h4>
    </div>
    <div class="card-body">
      <p>Your notification preferences are active. Here's what happens next:</p>
      <ul style="margin-top: var(--space-md);">
        <li>We'll monitor job boards for matches to your criteria</li>
        <li>Email notifications arrive within 1 hour of job posting</li>
        <li>You can update preferences anytime from your dashboard</li>
      </ul>
    </div>
  </div>
</div>
```

```html
<!-- Error State -->
<div class="alert alert-error" style="margin-bottom: var(--space-lg);">
  <strong>We couldn't save your preferences.</strong> This usually means our servers are experiencing issues. Please try again in a few moments.
</div>

<div class="secondary-panel">
  <div class="secondary-actions">
    <button class="btn-primary btn-full">Try Again</button>
    <button class="btn-secondary btn-full">Contact Support</button>
  </div>
</div>
```

### Multi-option Selection

```html
<div class="primary-workspace">
  <h3 class="h3">Select job titles you're interested in</h3>
  
  <div class="stack gap-md">
    <div class="card" style="cursor: pointer; border: 2px solid var(--color-border);">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="card-title">Product Manager</h4>
          <p class="card-subtitle">Digital product roles</p>
        </div>
        <input type="checkbox" checked>
      </div>
    </div>

    <div class="card" style="cursor: pointer; border: 2px solid var(--color-border);">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="card-title">Software Engineer</h4>
          <p class="card-subtitle">Backend, frontend, fullstack</p>
        </div>
        <input type="checkbox">
      </div>
    </div>

    <div class="card" style="cursor: pointer; border: 2px solid var(--color-border);">
      <div class="flex items-center justify-between">
        <div>
          <h4 class="card-title">Designer</h4>
          <p class="card-subtitle">UX/UI and product design</p>
        </div>
        <input type="checkbox">
      </div>
    </div>
  </div>
</div>
```

### Copyable Prompt

```html
<div class="secondary-panel">
  <div class="step-explanation">
    <h4 class="step-title">Job Search Tips</h4>
    <p class="step-description">Be specific in your title search. For example:</p>
  </div>

  <div class="prompt-box">
    <div class="prompt-label">Example Search Terms</div>
    <div class="prompt-content">Senior Product Manager
Product Manager - B2B
Manager of Product Strategy</div>
    <button class="prompt-copy-btn">Copy</button>
  </div>
</div>
```

## CSS Variables in Custom Styles

```css
/* Always use variables, never hardcode values */

.custom-component {
  padding: var(--space-md);
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-body);
  color: var(--color-text-primary);
  transition: all var(--transition-normal);
}

.custom-component:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-sm);
}

.custom-component.error {
  border-color: var(--color-error);
}

.custom-heading {
  font-family: var(--font-serif);
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-serif-semibold);
  line-height: var(--line-height-tight);
}

.custom-spacing {
  margin-top: var(--space-lg);
  margin-bottom: var(--space-md);
  padding: var(--space-md);
}
```

## DO NOT DO THESE THINGS

```html
<!-- ✗ DON'T: Use hardcoded spacing -->
<div style="margin: 13px; padding: 27px;">Content</div>

<!-- ✓ DO: Use spacing scale -->
<div style="margin: var(--space-md); padding: var(--space-md);">Content</div>

<!-- ✗ DON'T: Create button variants -->
<button class="btn-custom-gradient">Button</button>

<!-- ✓ DO: Use existing button classes -->
<button class="btn-primary">Button</button>

<!-- ✗ DON'T: Override focus styles -->
button:focus { outline: none; }

<!-- ✓ DO: Keep focus rings visible -->
button:focus-visible { outline: var(--focus-ring); }

<!-- ✗ DON'T: Use gradients or colors outside palette -->
<div style="background: linear-gradient(45deg, #ff00ff, #00ffff);">Content</div>

<!-- ✓ DO: Use design system colors -->
<div style="background: var(--color-accent);">Content</div>

<!-- ✗ DON'T: Use decorative fonts -->
<h1 style="font-family: 'Comic Sans';">Title</h1>

<!-- ✓ DO: Use serif for headings, sans for body -->
<h1 class="h1">Title</h1>

<!-- ✗ DON'T: Create custom shadows -->
<div style="box-shadow: 0 20px 60px rgba(0,0,0,0.3);">Card</div>

<!-- ✓ DO: Use shadow variables -->
<div class="card">Content</div>
```

## Accessibility Checklist

Before shipping any page:

- [ ] All interactive elements have focus rings
- [ ] Color contrast is 4.5:1 or higher
- [ ] Headings follow proper hierarchy (h1, h2, h3, etc.)
- [ ] Form labels are associated with inputs
- [ ] Button text is descriptive
- [ ] Error messages are clear and actionable
- [ ] Page structure makes sense without CSS
- [ ] All images have alt text
- [ ] Keyboard navigation works (Tab, Enter, Escape)

## Testing the Design System

### Browser Testing

```
Chrome/Edge 90+     ✓
Firefox 88+         ✓
Safari 14+          ✓
iOS Safari 14+      ✓
Chrome Android      ✓
```

### Manual Testing Checklist

- [ ] Page loads without Google Fonts fallback (fonts load)
- [ ] All buttons are clickable and have hover/active states
- [ ] Form inputs show focus ring on Tab
- [ ] Responsive layout works at 640px, 1024px, 1440px
- [ ] Touch targets are at least 44×44px on mobile
- [ ] Text is readable at all breakpoints
- [ ] No layout shift when content loads
- [ ] Transitions are smooth (no jank)

## Responsive Breakpoints

```css
/* Mobile first approach */
@media (min-width: 640px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
  .main-layout {
    flex-direction: row;  /* Two-column layout activates */
  }
}

@media (min-width: 1440px) {
  /* Large screen styles */
}
```

## Performance Notes

- All CSS is critical (no lazy loading)
- Google Fonts load asynchronously
- Focus rings use browser native outline (no custom rendering)
- Transitions use GPU-friendly properties (opacity, transform)
- No animation loop unless necessary
- Shadows use subtle values (minimal paint performance)

## Extending the Design System

### Adding a New Component

1. Add styles to `components/components.css`
2. Use only design system variables
3. Add example to `reference.html`
4. Update `DESIGN-SYSTEM.md`
5. Document class names and usage

### Adding a New Color

1. Update `tokens/design-tokens.css` with CSS variable
2. Add to DESIGN-SYSTEM.md with usage notes
3. Update reference.html color grid
4. Verify accessibility (min 4.5:1 contrast)

### Adding a New Spacing Value

**Don't.** The 5-value scale is intentionally strict. Work within existing values. If you think you need a new spacing value, reconsider the layout.

## Contact & Support

Questions about the design system? Refer to:
1. `reference.html` — Visual examples
2. `DESIGN-SYSTEM.md` — Complete specification
3. `README.md` — Quick start and philosophy

---

**Last Updated:** February 2026  
**Design System Version:** 1.0
