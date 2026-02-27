/**
 * Job Notification App — Router
 * Client-side routing without external dependencies
 * Handles navigation, page rendering, and URL management
 */

class Router {
  constructor() {
    this.currentRoute = '/';
    this.routes = {
      '/': this.renderLanding,
      '/dashboard': this.renderDashboard,
      '/saved': this.renderSaved,
      '/digest': this.renderDigest,
      '/settings': this.renderSettings,
      '/proof': this.renderProof,
    };

    // State management
    this.filters = {
      keyword: '',
      location: '',
      mode: '',
      experience: '',
      source: '',
      sort: 'latest'
    };

    this.savedJobs = this.loadSavedJobs();
    this.selectedJobId = null;

    this.init();
  }

  /**
   * Load saved jobs from localStorage
   */
  loadSavedJobs() {
    const saved = localStorage.getItem('savedJobs');
    return saved ? JSON.parse(saved) : [];
  }

  /**
   * Save jobs to localStorage
   */
  saveSavedJobs() {
    localStorage.setItem('savedJobs', JSON.stringify(this.savedJobs));
  }

  /**
   * Toggle save job
   */
  toggleSaveJob(jobId) {
    const index = this.savedJobs.indexOf(jobId);
    if (index > -1) {
      this.savedJobs.splice(index, 1);
    } else {
      this.savedJobs.push(jobId);
    }
    this.saveSavedJobs();
  }

  /**
   * Check if job is saved
   */
  isJobSaved(jobId) {
    return this.savedJobs.includes(jobId);
  }

  /**
   * Filter jobs based on criteria
   */
  filterJobs() {
    let filtered = jobsDatabase.slice();

    // Keyword search (title or company)
    if (this.filters.keyword) {
      const keyword = this.filters.keyword.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(keyword) ||
        job.company.toLowerCase().includes(keyword)
      );
    }

    // Location filter
    if (this.filters.location) {
      filtered = filtered.filter(job => job.location === this.filters.location);
    }

    // Mode filter
    if (this.filters.mode) {
      filtered = filtered.filter(job => job.mode === this.filters.mode);
    }

    // Experience filter
    if (this.filters.experience) {
      filtered = filtered.filter(job => job.experience === this.filters.experience);
    }

    // Source filter
    if (this.filters.source) {
      filtered = filtered.filter(job => job.source === this.filters.source);
    }

    // Sorting
    if (this.filters.sort === 'latest') {
      filtered.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
    } else if (this.filters.sort === 'oldest') {
      filtered.sort((a, b) => b.postedDaysAgo - a.postedDaysAgo);
    } else if (this.filters.sort === 'salary-high') {
      filtered.sort((a, b) => this.parseSalary(b.salaryRange) - this.parseSalary(a.salaryRange));
    } else if (this.filters.sort === 'salary-low') {
      filtered.sort((a, b) => this.parseSalary(a.salaryRange) - this.parseSalary(b.salaryRange));
    }

    return filtered;
  }

  /**
   * Parse salary range for sorting (extract first number)
   */
  parseSalary(range) {
    const match = range.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }

  /**
   * Get unique dropdown values
   */
  getUniqueValues(field) {
    return [...new Set(jobsDatabase.map(job => job[field]))].filter(Boolean).sort();
  }

  /**
   * Render individual job card
   */
  renderJobCard(job) {
    const isSaved = this.isJobSaved(job.id);
    return `
      <div data-job-id="${job.id}" style="background: #FFFFFF; border: 1px solid #E8E8E8; border-radius: 4px; padding: 24px; cursor: pointer; transition: all 200ms; display: flex; flex-direction: column; gap: 16px;">
        <!-- Header -->
        <div>
          <h3 style="font-family: 'Crimson Text', serif; font-size: 18px; margin: 0 0 8px 0; color: #111111; font-weight: 600; line-height: 1.4;">${job.title}</h3>
          <p style="margin: 0; color: #666666; font-size: 14px; font-weight: 500;">${job.company}</p>
        </div>

        <!-- Meta Tags -->
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          <span style="background: #F7F6F3; color: #666666; padding: 6px 10px; border-radius: 3px; font-size: 12px; font-family: 'Inter', sans-serif;">${job.location}</span>
          <span style="background: #F7F6F3; color: #666666; padding: 6px 10px; border-radius: 3px; font-size: 12px; font-family: 'Inter', sans-serif;">${job.mode}</span>
          <span style="background: #F7F6F3; color: #666666; padding: 6px 10px; border-radius: 3px; font-size: 12px; font-family: 'Inter', sans-serif;">${job.experience}</span>
          <span style="background: #8B0000; color: #FFFFFF; padding: 6px 10px; border-radius: 3px; font-size: 12px; font-family: 'Inter', sans-serif; font-weight: 500;">${job.salaryRange}</span>
        </div>

        <!-- Skills Preview -->
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${job.skills.slice(0, 3).map(skill => `<span style="background: #F0EEEB; color: #333333; padding: 4px 8px; border-radius: 3px; font-size: 12px; font-family: 'Inter', sans-serif;">${skill}</span>`).join('')}
          ${job.skills.length > 3 ? `<span style="background: #F0EEEB; color: #666666; padding: 4px 8px; border-radius: 3px; font-size: 12px; font-family: 'Inter', sans-serif;">+${job.skills.length - 3} more</span>` : ''}
        </div>

        <!-- Posted Info -->
        <p style="margin: 0; color: #999999; font-size: 12px; font-family: 'Inter', sans-serif;">Posted on ${job.source} • ${job.postedDaysAgo} ${job.postedDaysAgo === 1 ? 'day' : 'days'} ago</p>

        <!-- Action Buttons -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
          <button class="job-view-btn" data-job-id="${job.id}" style="padding: 10px 12px; background: #F7F6F3; border: 1px solid #E8E8E8; border-radius: 4px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; color: #111111; font-weight: 500; transition: all 200ms;">View Details</button>
          <button class="job-save-btn" data-job-id="${job.id}" style="padding: 10px 12px; background: #FFFFFF; border: 1px solid #E8E8E8; border-radius: 4px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; color: #8B0000; font-weight: 500; transition: all 200ms;">${isSaved ? '★ Saved' : '☆ Save'}</button>
        </div>
        <button class="job-apply-btn" data-job-id="${job.id}" style="width: 100%; padding: 12px 12px; background: #8B0000; border: none; border-radius: 4px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; color: #FFFFFF; font-weight: 500; transition: all 200ms;">Apply Now</button>
      </div>
    `;
  }

  /**
   * Render job modal with full details
   */
  renderJobModal(jobId) {
    const job = jobsDatabase.find(j => j.id === jobId);
    if (!job) return;

    const app = document.getElementById('app');
    const isSaved = this.isJobSaved(jobId);

    const modalHTML = `
      <div id="job-modal-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: flex-start; justify-content: center; padding: 40px 20px; z-index: 1000; overflow-y: auto;">
        <div id="job-modal" style="background: #FFFFFF; border-radius: 4px; width: 100%; max-width: 600px; padding: 40px; margin-top: 40px; position: relative;">
          <!-- Close Button -->
          <button id="modal-close" style="position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer; color: #999999;">✕</button>

          <!-- Header -->
          <div style="margin-bottom: 32px;">
            <h1 style="font-family: 'Crimson Text', serif; font-size: 32px; margin: 0 0 8px 0; color: #111111; font-weight: 600;">${job.title}</h1>
            <p style="margin: 0; color: #666666; font-size: 16px; font-weight: 500;">${job.company}</p>
          </div>

          <!-- Meta Information -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; padding-bottom: 32px; border-bottom: 1px solid #E8E8E8;">
            <div>
              <p style="margin: 0 0 4px 0; color: #999999; font-size: 12px; font-family: 'Inter', sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">Location</p>
              <p style="margin: 0; color: #111111; font-size: 15px; font-weight: 500;">${job.location}</p>
            </div>
            <div>
              <p style="margin: 0 0 4px 0; color: #999999; font-size: 12px; font-family: 'Inter', sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">Mode</p>
              <p style="margin: 0; color: #111111; font-size: 15px; font-weight: 500;">${job.mode}</p>
            </div>
            <div>
              <p style="margin: 0 0 4px 0; color: #999999; font-size: 12px; font-family: 'Inter', sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">Experience</p>
              <p style="margin: 0; color: #111111; font-size: 15px; font-weight: 500;">${job.experience}</p>
            </div>
            <div>
              <p style="margin: 0 0 4px 0; color: #999999; font-size: 12px; font-family: 'Inter', sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">Salary</p>
              <p style="margin: 0; color: #111111; font-size: 15px; font-weight: 500; color: #8B0000;">${job.salaryRange}</p>
            </div>
          </div>

          <!-- Description -->
          <div style="margin-bottom: 32px;">
            <h3 style="font-family: 'Crimson Text', serif; font-size: 18px; margin: 0 0 12px 0; color: #111111; font-weight: 600;">About This Role</h3>
            <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${job.description}</p>
          </div>

          <!-- Required Skills -->
          <div style="margin-bottom: 32px;">
            <h3 style="font-family: 'Crimson Text', serif; font-size: 18px; margin: 0 0 12px 0; color: #111111; font-weight: 600;">Required Skills</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${job.skills.map(skill => `<span style="background: #F0EEEB; color: #333333; padding: 6px 12px; border-radius: 3px; font-size: 13px; font-family: 'Inter', sans-serif;">${skill}</span>`).join('')}
            </div>
          </div>

          <!-- Job Details -->
          <div style="background: #F7F6F3; border-radius: 4px; padding: 16px; margin-bottom: 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
              <p style="margin: 0 0 4px 0; color: #999999; font-size: 12px; font-family: 'Inter', sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">Posted On</p>
              <p style="margin: 0; color: #111111; font-size: 14px; font-weight: 500;">${job.source}</p>
            </div>
            <div>
              <p style="margin: 0 0 4px 0; color: #999999; font-size: 12px; font-family: 'Inter', sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">Posted</p>
              <p style="margin: 0; color: #111111; font-size: 14px; font-weight: 500;">${job.postedDaysAgo} days ago</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <button id="modal-save-btn" style="padding: 12px 16px; background: #FFFFFF; border: 1px solid #E8E8E8; border-radius: 4px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 14px; color: #8B0000; font-weight: 500; transition: all 200ms;">${isSaved ? '★ Saved' : '☆ Save'}</button>
            <button id="modal-apply-btn" style="padding: 12px 16px; background: #8B0000; border: none; border-radius: 4px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 14px; color: #FFFFFF; font-weight: 500; transition: all 200ms;">Apply Now</button>
          </div>
        </div>
      </div>
    `;

    // Append modal to body
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);

    // Handle modal interactions
    document.getElementById('modal-close').addEventListener('click', () => {
      modalContainer.remove();
    });

    document.getElementById('job-modal-overlay').addEventListener('click', (e) => {
      if (e.target === document.getElementById('job-modal-overlay')) {
        modalContainer.remove();
      }
    });

    document.getElementById('modal-save-btn').addEventListener('click', () => {
      this.toggleSaveJob(jobId);
      const isSavedNow = this.isJobSaved(jobId);
      document.getElementById('modal-save-btn').textContent = isSavedNow ? '★ Saved' : '☆ Save';
    });

    document.getElementById('modal-apply-btn').addEventListener('click', () => {
      window.open(job.applyUrl, '_blank');
    });
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
    this.navigate(window.location.pathname || '/');
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

    // Attach event listeners for job cards
    this.attachJobCardListeners();
  }

  /**
   * Attach event listeners to job cards using delegation
   */
  attachJobCardListeners() {
    const app = document.getElementById('app');

    // View details button
    app.addEventListener('click', (e) => {
      if (e.target.classList.contains('job-view-btn')) {
        const jobId = parseInt(e.target.getAttribute('data-job-id'));
        this.renderJobModal(jobId);
      }
    });

    // Save button
    app.addEventListener('click', (e) => {
      if (e.target.classList.contains('job-save-btn')) {
        const jobId = parseInt(e.target.getAttribute('data-job-id'));
        this.toggleSaveJob(jobId);
        e.target.textContent = this.isJobSaved(jobId) ? '★ Saved' : '☆ Save';
        e.target.style.color = this.isJobSaved(jobId) ? '#8B0000' : '#8B0000';
      }
    });

    // Apply button
    app.addEventListener('click', (e) => {
      if (e.target.classList.contains('job-apply-btn')) {
        const jobId = parseInt(e.target.getAttribute('data-job-id'));
        const job = jobsDatabase.find(j => j.id === jobId);
        if (job) window.open(job.applyUrl, '_blank');
      }
    });

    // Filter handlers for dashboard
    const filterKeyword = app.querySelector('#filter-keyword');
    const filterLocation = app.querySelector('#filter-location');
    const filterMode = app.querySelector('#filter-mode');
    const filterExperience = app.querySelector('#filter-experience');
    const filterSource = app.querySelector('#filter-source');
    const filterSort = app.querySelector('#filter-sort');
    const clearFiltersBtn = app.querySelector('#clear-filters');

    if (filterKeyword) {
      filterKeyword.addEventListener('input', (e) => {
        this.filters.keyword = e.target.value;
        this.renderDashboard();
      });
    }

    if (filterLocation) {
      filterLocation.addEventListener('change', (e) => {
        this.filters.location = e.target.value;
        this.renderDashboard();
      });
    }

    if (filterMode) {
      filterMode.addEventListener('change', (e) => {
        this.filters.mode = e.target.value;
        this.renderDashboard();
      });
    }

    if (filterExperience) {
      filterExperience.addEventListener('change', (e) => {
        this.filters.experience = e.target.value;
        this.renderDashboard();
      });
    }

    if (filterSource) {
      filterSource.addEventListener('change', (e) => {
        this.filters.source = e.target.value;
        this.renderDashboard();
      });
    }

    if (filterSort) {
      filterSort.addEventListener('change', (e) => {
        this.filters.sort = e.target.value;
        this.renderDashboard();
      });
    }

    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        this.filters = {
          keyword: '',
          location: '',
          mode: '',
          experience: '',
          source: '',
          sort: 'latest'
        };
        this.renderDashboard();
      });
    }
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
      if (href === this.currentRoute) {
        link.classList.add('active');
      }
    });
  }

  /**
   * PAGE RENDERERS
   * Each method returns HTML content for that route
   */

  renderLanding() {
    return `
      <div class="landing-page">
        <div class="landing-container">
          <h1 class="landing-headline">Stop Missing The Right Jobs.</h1>
          <p class="landing-subtext">Precision-matched job discovery delivered daily at 9AM.</p>
          <a href="/settings" class="btn-primary landing-cta" data-link>Start Tracking</a>
        </div>
      </div>
    `;
  }

  renderDashboard = () => {
    const filteredJobs = this.filterJobs();

    return `
      <div style="padding: 40px; max-width: 1200px; margin: 0 auto;">
        <!-- Context Header -->
        <div style="margin-bottom: 40px; border-bottom: 1px solid #E8E8E8; padding-bottom: 24px;">
          <h1 style="font-family: 'Crimson Text', serif; font-size: 48px; margin: 0 0 8px 0; color: #111111; font-weight: 600;">Find Jobs</h1>
          <p style="margin: 0; color: #666666; font-size: 16px;">Curated job opportunities for Indian tech professionals</p>
        </div>

        <!-- Filter Bar -->
        <div style="background: #FFFFFF; border: 1px solid #E8E8E8; border-radius: 4px; padding: 24px; margin-bottom: 40px;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 16px;">
            <!-- Keyword Search -->
            <input 
              type="text" 
              placeholder="Search by title or company..." 
              value="${this.filters.keyword}"
              id="filter-keyword"
              style="padding: 10px 12px; border: 1px solid #E8E8E8; border-radius: 4px; font-family: 'Inter', sans-serif; font-size: 14px;"
            />

            <!-- Location Filter -->
            <select id="filter-location" style="padding: 10px 12px; border: 1px solid #E8E8E8; border-radius: 4px; font-family: 'Inter', sans-serif; font-size: 14px;">
              <option value="">All Locations</option>
              ${this.getUniqueValues('location').map(loc => `<option value="${loc}" ${this.filters.location === loc ? 'selected' : ''}>${loc}</option>`).join('')}
            </select>

            <!-- Mode Filter -->
            <select id="filter-mode" style="padding: 10px 12px; border: 1px solid #E8E8E8; border-radius: 4px; font-family: 'Inter', sans-serif; font-size: 14px;">
              <option value="">All Modes</option>
              <option value="Remote" ${this.filters.mode === 'Remote' ? 'selected' : ''}>Remote</option>
              <option value="Hybrid" ${this.filters.mode === 'Hybrid' ? 'selected' : ''}>Hybrid</option>
              <option value="Onsite" ${this.filters.mode === 'Onsite' ? 'selected' : ''}>Onsite</option>
            </select>

            <!-- Experience Filter -->
            <select id="filter-experience" style="padding: 10px 12px; border: 1px solid #E8E8E8; border-radius: 4px; font-family: 'Inter', sans-serif; font-size: 14px;">
              <option value="">All Levels</option>
              <option value="Fresher" ${this.filters.experience === 'Fresher' ? 'selected' : ''}>Fresher</option>
              <option value="0–1 Years" ${this.filters.experience === '0–1 Years' ? 'selected' : ''}>0–1 Years</option>
              <option value="1–3 Years" ${this.filters.experience === '1–3 Years' ? 'selected' : ''}>1–3 Years</option>
              <option value="3–5 Years" ${this.filters.experience === '3–5 Years' ? 'selected' : ''}>3–5 Years</option>
              <option value="5+ Years" ${this.filters.experience === '5+ Years' ? 'selected' : ''}>5+ Years</option>
            </select>

            <!-- Source Filter -->
            <select id="filter-source" style="padding: 10px 12px; border: 1px solid #E8E8E8; border-radius: 4px; font-family: 'Inter', sans-serif; font-size: 14px;">
              <option value="">All Sources</option>
              ${this.getUniqueValues('source').map(src => `<option value="${src}" ${this.filters.source === src ? 'selected' : ''}>${src}</option>`).join('')}
            </select>

            <!-- Sort -->
            <select id="filter-sort" style="padding: 10px 12px; border: 1px solid #E8E8E8; border-radius: 4px; font-family: 'Inter', sans-serif; font-size: 14px;">
              <option value="latest" ${this.filters.sort === 'latest' ? 'selected' : ''}>Latest First</option>
              <option value="oldest" ${this.filters.sort === 'oldest' ? 'selected' : ''}>Oldest First</option>
              <option value="salary-high" ${this.filters.sort === 'salary-high' ? 'selected' : ''}>Salary: High to Low</option>
              <option value="salary-low" ${this.filters.sort === 'salary-low' ? 'selected' : ''}>Salary: Low to High</option>
            </select>
          </div>

          <button id="clear-filters" style="padding: 8px 16px; background: #F7F6F3; border: 1px solid #E8E8E8; border-radius: 4px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; color: #666666;">Clear Filters</button>
        </div>

        <!-- Results Count -->
        <p style="color: #666666; font-size: 14px; margin-bottom: 24px; margin-top: -16px;">
          Showing ${filteredJobs.length} of ${jobsDatabase.length} jobs
        </p>

        ${filteredJobs.length === 0 ? `
          <!-- No Results State -->
          <div style="text-align: center; padding: 60px 24px; background: #F7F6F3; border-radius: 4px; border: 1px solid #E8E8E8;">
            <p style="font-family: 'Crimson Text', serif; font-size: 32px; margin: 0 0 16px 0; color: #111111; font-weight: 600;">No jobs found</p>
            <p style="margin: 0; color: #666666; font-size: 15px;">Try adjusting your filters to find more opportunities</p>
          </div>
        ` : `
          <!-- Job Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px;">
            ${filteredJobs.map(job => this.renderJobCard(job)).join('')}
          </div>
        `}
      </div>
    `;
  }

  renderSaved() {
    const savedJobObjects = this.savedJobs.map(jobId => jobsDatabase.find(job => job.id === jobId)).filter(Boolean);

    return `
      <div style="padding: 40px; max-width: 1200px; margin: 0 auto;">
        <!-- Context Header -->
        <div style="margin-bottom: 40px; border-bottom: 1px solid #E8E8E8; padding-bottom: 24px;">
          <h1 style="font-family: 'Crimson Text', serif; font-size: 48px; margin: 0 0 8px 0; color: #111111; font-weight: 600;">Saved Jobs</h1>
          <p style="margin: 0; color: #666666; font-size: 16px;">Your curated list of job opportunities</p>
        </div>

        ${savedJobObjects.length === 0 ? `
          <!-- Empty State -->
          <div style="text-align: center; padding: 60px 24px; background: #F7F6F3; border-radius: 4px; border: 1px solid #E8E8E8;">
            <p style="font-family: 'Crimson Text', serif; font-size: 32px; margin: 0 0 16px 0; color: #111111; font-weight: 600;">No saved jobs yet</p>
            <p style="margin: 0 0 24px 0; color: #666666; font-size: 15px;">When you find jobs that interest you, save them here for easy access.</p>
            <a href="/dashboard" data-link style="display: inline-block; padding: 12px 24px; background: #8B0000; color: #FFFFFF; text-decoration: none; border-radius: 4px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500;">Browse Jobs</a>
          </div>
        ` : `
          <!-- Saved Jobs Count -->
          <p style="color: #666666; font-size: 14px; margin-bottom: 24px;">
            ${savedJobObjects.length} saved ${savedJobObjects.length === 1 ? 'job' : 'jobs'}
          </p>

          <!-- Jobs Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px;">
            ${savedJobObjects.map(job => this.renderJobCard(job)).join('')}
          </div>
        `}
      </div>
    `;
  };

  renderDigest() {
    return `
      <div class="page-placeholder">
        <h1 class="page-title">Job Digest</h1>
        <p class="page-subtext">Your daily job digest will be delivered at 9AM to your email. Set up your preferences to get started.</p>
      </div>
    `;
  }

  renderSettings() {
    return `
      <div class="settings-page">
        <h1 class="page-title">Preferences</h1>
        <p class="page-subtext">Customize your job notification preferences. These settings will be saved for your daily digest.</p>
        
        <div class="settings-form">
          <div class="form-group">
            <label class="form-label required">Role Keywords</label>
            <input type="text" placeholder="e.g., Product Manager, Designer, Engineer">
            <div class="form-help">Separate multiple keywords with commas.</div>
          </div>

          <div class="form-group">
            <label class="form-label required">Preferred Locations</label>
            <input type="text" placeholder="e.g., San Francisco, New York, Remote">
            <div class="form-help">Enter cities or type "Remote" for remote positions.</div>
          </div>

          <div class="form-group">
            <label class="form-label required">Work Mode</label>
            <div class="checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" name="workmode" value="remote">
                <span>Remote</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="workmode" value="hybrid">
                <span>Hybrid</span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" name="workmode" value="onsite">
                <span>Onsite</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label required">Experience Level</label>
            <div class="select-wrapper">
              <select>
                <option value="">Select an option</option>
                <option value="entry">Entry Level (0-2 years)</option>
                <option value="mid">Mid Level (2-5 years)</option>
                <option value="senior">Senior (5+ years)</option>
              </select>
            </div>
          </div>

          <div class="settings-actions">
            <button class="btn-secondary" disabled>Reset</button>
            <button class="btn-primary" disabled>Save Preferences</button>
          </div>

          <p class="settings-notice">Preferences placeholder. Functionality coming in next step.</p>
        </div>
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
