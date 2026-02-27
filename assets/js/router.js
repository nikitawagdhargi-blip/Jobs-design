/**
 * Job Notification App — Router
 * Client-side routing without external dependencies
 * Handles navigation, page rendering, and URL management
 */

class Router {
  constructor() {
    this.currentRoute = '/dashboard';
    this.routes = {
      '/': this.renderDashboard,
      '/dashboard': this.renderDashboard,
      '/saved': this.renderSaved,
      '/digest': this.renderDigest,
      '/settings': this.renderSettings,
      '/proof': this.renderProof,
    };

    this.init();
  }

  /**
   * Initialize router - set up event listeners
   */
  init() {
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => this.navigate(window.location.pathname));

    // Handle all internal navigation links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-link]');
      if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        this.navigate(href);
      }
    });

    // Handle mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuToggle && mobileMenu) {
      mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
      });

      // Close mobile menu when a link is clicked
      mobileMenu.addEventListener('click', (e) => {
        if (e.target.closest('[data-link]')) {
          mobileMenu.classList.remove('active');
        }
      });
    }

    // Navigate to initial route
    this.navigate(window.location.pathname || '/dashboard');
  }

  /**
   * Navigate to a route
   * @param {string} path - The route path
   */
  navigate(path) {
    // Normalize path
    path = path.replace(/\/$/, '') || '/';
    if (path !== '/' && !path.startsWith('/')) path = '/' + path;

    this.currentRoute = path;

    // Update browser history
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }

    // Render the page
    this.render();

    // Update active navigation link
    this.updateActiveNav();

    // Close mobile menu if open
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
      mobileMenu.classList.remove('active');
    }

    // Scroll to top
    window.scrollTo(0, 0);
  }

  /**
   * Render the current route
   */
  render() {
    const app = document.getElementById('app');

    // Find matching route handler
    let routeHandler = this.routes[this.currentRoute];

    // If no exact match, try 404
    if (!routeHandler) {
      routeHandler = this.renderNotFound;
    }

    // Call route handler with this context
    const content = routeHandler.call(this);

    // Update app content with animation
    app.innerHTML = content;
    app.classList.remove('page-content');
    // Trigger reflow to restart animation
    void app.offsetWidth;
    app.classList.add('page-content');
  }

  /**
   * Update active navigation link
   */
  updateActiveNav() {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.remove('active');
    });

    // Add active class to current route link
    document.querySelectorAll('[data-route]').forEach((link) => {
      const href = link.getAttribute('href');
      if (href === this.currentRoute || (this.currentRoute === '/' && href === '/dashboard')) {
        link.classList.add('active');
      }
    });
  }

  /**
   * PAGE RENDERERS
   * Each method returns HTML content for that route
   */

  renderDashboard() {
    return `
      <div class="page-placeholder">
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtext">This section will be built in the next step.</p>
      </div>
    `;
  }

  renderSaved() {
    return `
      <div class="page-placeholder">
        <h1 class="page-title">Saved Jobs</h1>
        <p class="page-subtext">This section will be built in the next step.</p>
      </div>
    `;
  }

  renderDigest() {
    return `
      <div class="page-placeholder">
        <h1 class="page-title">Job Digest</h1>
        <p class="page-subtext">This section will be built in the next step.</p>
      </div>
    `;
  }

  renderSettings() {
    return `
      <div class="page-placeholder">
        <h1 class="page-title">Settings</h1>
        <p class="page-subtext">This section will be built in the next step.</p>
      </div>
    `;
  }

  renderProof() {
    return `
      <div class="page-placeholder">
        <h1 class="page-title">Proof</h1>
        <p class="page-subtext">This section will be built in the next step.</p>
      </div>
    `;
  }

  renderNotFound() {
    return `
      <div class="page-not-found">
        <h1 class="page-title">Page Not Found</h1>
        <p class="page-subtext">The page you are looking for does not exist.</p>
        <a href="/dashboard" class="btn-primary" data-link>Return to Dashboard</a>
      </div>
    `;
  }
}

/**
 * Initialize router when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new Router();
  });
} else {
  new Router();
}
