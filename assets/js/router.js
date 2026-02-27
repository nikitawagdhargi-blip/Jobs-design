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
      '/jt/07-test': this.renderTest,
      '/jt/08-ship': this.renderShip,
    };

    // State management
    this.filters = {
      keyword: '',
      location: '',
      mode: '',
      experience: '',
      source: '',
      status: 'All',
      sort: 'match-score',
      showOnlyMatches: false
    };

    this.savedJobs = this.loadSavedJobs();
    this.preferences = this.loadPreferences();
    this.todayDigest = this.loadTodayDigest();
    this.jobStatuses = this.loadJobStatuses();
    this.statusLog = this.loadStatusLog();
    this.testStatus = this.loadTestStatus();          // <-- track checklist state
    this.selectedJobId = null;

    this.init();
  }

  /**
   * Get today's date in YYYY-MM-DD format
   */
  getTodayDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  /**
   * Load job statuses map from localStorage
   */
  loadJobStatuses() {
    const saved = localStorage.getItem('jobTrackerStatus');
    return saved ? JSON.parse(saved) : {};
  }

  /**
   * Save job statuses map
   */
  saveJobStatuses() {
    localStorage.setItem('jobTrackerStatus', JSON.stringify(this.jobStatuses));
  }

  /**
   * Load status change log for digest
   */
  loadStatusLog() {
    const saved = localStorage.getItem('jobTrackerStatusLog');
    return saved ? JSON.parse(saved) : [];
  }

  /**
   * Save status change log
   */
  saveStatusLog() {
    localStorage.setItem('jobTrackerStatusLog', JSON.stringify(this.statusLog));
  }

  /**
   * Record status change in log
   */
  logStatusChange(job, status) {
    this.statusLog.unshift({
      jobId: job.id,
      title: job.title,
      company: job.company,
      status,
      date: new Date().toISOString()
    });
    // keep log size reasonable (eg. 50)
    if (this.statusLog.length > 50) this.statusLog.pop();
    this.saveStatusLog();
  }

  /**
   * Get color for status badge
   */
  getStatusBadgeColor(status) {
    switch (status) {
      case 'Applied': return {bg:'#E3F2FD', text:'#1565C0'}; // blue
      case 'Rejected': return {bg:'#FFEBEE', text:'#C62828'}; // red
      case 'Selected': return {bg:'#E8F5E9', text:'#2E7D32'}; // green
      default: return {bg:'#F5F5F5', text:'#666666'}; // neutral
    }
  }

  /**
   * Format date for display
   */
  formatDisplayDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Load digest for today from localStorage
   */
  loadTodayDigest() {
    const today = this.getTodayDate();
    const key = `jobTrackerDigest_${today}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  }

  /**
   * Generate and save today's digest
   */
  generateDigest() {
    if (!this.hasPreferences()) {
      return null;
    }

    // Get all jobs with match scores
    let jobs = jobsDatabase.map(job => ({
      ...job,
      matchScore: this.calculateMatchScore(job)
    }));

    // Filter jobs with match score >= minMatchScore
    jobs = jobs.filter(job => job.matchScore >= this.preferences.minMatchScore);

    // Sort by: matchScore descending, then postedDaysAgo ascending
    jobs.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore;
      }
      return a.postedDaysAgo - b.postedDaysAgo;
    });

    // Take top 10
    const topJobs = jobs.slice(0, 10);

    if (topJobs.length === 0) {
      return null;
    }

    // Create digest object
    const today = this.getTodayDate();
    const digest = {
      date: today,
      generatedAt: new Date().toISOString(),
      jobCount: topJobs.length,
      jobs: topJobs.map(job => ({
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        experience: job.experience,
        matchScore: job.matchScore,
        applyUrl: job.applyUrl,
        salaryRange: job.salaryRange
      }))
    };

    // Save to localStorage
    const key = `jobTrackerDigest_${today}`;
    localStorage.setItem(key, JSON.stringify(digest));
    this.todayDigest = digest;

    return digest;
  }

  /**
   * Format digest as plain text
   */
  formatDigestAsText() {
    if (!this.todayDigest) return '';

    const lines = [
      '═══════════════════════════════════════════',
      'TOP 10 JOBS FOR YOU — 9AM DIGEST',
      this.formatDisplayDate(this.todayDigest.date),
      '═══════════════════════════════════════════',
      ''
    ];

    this.todayDigest.jobs.forEach((job, index) => {
      lines.push(`${index + 1}. ${job.title}`);
      lines.push(`   Company: ${job.company}`);
      lines.push(`   Location: ${job.location}`);
      lines.push(`   Experience: ${job.experience}`);
      lines.push(`   Salary: ${job.salaryRange}`);
      lines.push(`   Match Score: ${job.matchScore}%`);
      lines.push(`   Apply: ${job.applyUrl}`);
      lines.push('');
    });

    lines.push('═══════════════════════════════════════════');
    lines.push('This digest was generated based on your preferences.');
    lines.push('Set your preferences to activate personalized matching.');

    return lines.join('\n');
  }

  /**
   * Load preferences from localStorage
   */
  loadPreferences() {
    const saved = localStorage.getItem('jobTrackerPreferences');
    return saved ? JSON.parse(saved) : {
      roleKeywords: [],
      preferredLocations: [],
      preferredMode: [],
      experienceLevel: '',
      skills: [],
      minMatchScore: 40
    };
  }

  /**
   * Save preferences to localStorage
   */
  savePreferences() {
    localStorage.setItem('jobTrackerPreferences', JSON.stringify(this.preferences));
  }

  /**
   * Check if preferences are set
   */
  hasPreferences() {
    return this.preferences.roleKeywords.length > 0 || 
           this.preferences.preferredLocations.length > 0 || 
           this.preferences.preferredMode.length > 0 || 
           this.preferences.skills.length > 0 ||
           this.preferences.experienceLevel !== '';
  }

  /**
   * Calculate match score for a job
   * Scoring rules:
   * +25 if roleKeyword in job.title (case-insensitive)
   * +15 if roleKeyword in job.description
   * +15 if job.location matches preferredLocations
   * +10 if job.mode matches preferredMode
   * +10 if job.experience matches experienceLevel
   * +15 if overlap between job.skills and user.skills
   * +5 if postedDaysAgo <= 2
   * +5 if source is LinkedIn
   * Cap at 100
   */
  calculateMatchScore(job) {
    let score = 0;

    // +25 if any roleKeyword in job.title
    if (this.preferences.roleKeywords.length > 0) {
      const jobTitleLower = job.title.toLowerCase();
      for (const keyword of this.preferences.roleKeywords) {
        if (jobTitleLower.includes(keyword.toLowerCase())) {
          score += 25;
          break;
        }
      }
    }

    // +15 if any roleKeyword in job.description
    if (this.preferences.roleKeywords.length > 0) {
      const jobDescLower = job.description.toLowerCase();
      for (const keyword of this.preferences.roleKeywords) {
        if (jobDescLower.includes(keyword.toLowerCase())) {
          score += 15;
          break;
        }
      }
    }

    // +15 if job.location matches preferredLocations
    if (this.preferences.preferredLocations.length > 0 && 
        this.preferences.preferredLocations.includes(job.location)) {
      score += 15;
    }

    // +10 if job.mode matches preferredMode
    if (this.preferences.preferredMode.length > 0 && 
        this.preferences.preferredMode.includes(job.mode)) {
      score += 10;
    }

    // +10 if job.experience matches experienceLevel
    if (this.preferences.experienceLevel && job.experience === this.preferences.experienceLevel) {
      score += 10;
    }

    // +15 if overlap between job.skills and user.skills
    if (this.preferences.skills.length > 0 && job.skills.length > 0) {
      const jobSkillsLower = job.skills.map(s => s.toLowerCase());
      const userSkillsLower = this.preferences.skills.map(s => s.toLowerCase());
      for (const userSkill of userSkillsLower) {
        if (jobSkillsLower.some(js => js.includes(userSkill) || userSkill.includes(js))) {
          score += 15;
          break;
        }
      }
    }

    // +5 if postedDaysAgo <= 2
    if (job.postedDaysAgo <= 2) {
      score += 5;
    }

    // +5 if source is LinkedIn
    if (job.source === 'LinkedIn') {
      score += 5;
    }

    // Cap at 100
    return Math.min(score, 100);
  }

  /**
   * Get match score color badge
   */
  getMatchScoreBadgeColor(score) {
    if (score >= 80) return { bg: '#E8F5E9', text: '#2E7D32', label: 'Excellent' };
    if (score >= 60) return { bg: '#FFF8E1', text: '#F57F17', label: 'Good' };
    if (score >= 40) return { bg: '#F5F5F5', text: '#666666', label: 'Neutral' };
    return { bg: '#FAFAFA', text: '#CCCCCC', label: 'Low' };
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

    // Calculate match scores for all jobs
    filtered = filtered.map(job => ({
      ...job,
      matchScore: this.calculateMatchScore(job)
    }));

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

    // Show only matches above threshold
    if (this.filters.showOnlyMatches && this.hasPreferences()) {
      filtered = filtered.filter(job => job.matchScore >= this.preferences.minMatchScore);
    }

    // Status filter
    if (this.filters.status && this.filters.status !== 'All') {
      filtered = filtered.filter(job => {
        const status = this.jobStatuses[job.id] || 'Not Applied';
        return status === this.filters.status;
      });
    }

    // Sorting
    if (this.filters.sort === 'match-score') {
      filtered.sort((a, b) => b.matchScore - a.matchScore);
    } else if (this.filters.sort === 'latest') {
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
    const badgeColor = this.getMatchScoreBadgeColor(job.matchScore || 0);
    
    return `
      <div data-job-id="${job.id}" style="background: #FFFFFF; border: 1px solid #E8E8E8; border-radius: 4px; padding: 24px; cursor: pointer; transition: all 200ms; display: flex; flex-direction: column; gap: 16px; position: relative;">
        <!-- Match Score Badge -->
        ${job.matchScore !== undefined ? `
          <div style="position: absolute; top: 12px; right: 12px; background: ${badgeColor.bg}; color: ${badgeColor.text}; padding: 6px 12px; border-radius: 3px; font-size: 12px; font-family: 'Inter', sans-serif; font-weight: 600;">
            ${job.matchScore}% Match
          </div>
        ` : ''}

        <!-- Header -->
        <div style="padding-right: ${job.matchScore !== undefined ? '60px' : '0'};">
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

        <!-- Status Badge & Selector -->
        <div style="position:absolute; top:12px; left:12px;">
          ${(() => {
            const st = this.jobStatuses[job.id] || 'Not Applied';
            const col = this.getStatusBadgeColor(st);
            return `<span style="background:${col.bg};color:${col.text};padding:4px 8px;border-radius:3px;font-size:12px;font-family:'Inter',sans-serif;font-weight:600;">${st}</span>`;
          })()}
        </div>

        <!-- Action Buttons -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
          <button class="job-view-btn" data-job-id="${job.id}" style="padding: 10px 12px; background: #F7F6F3; border: 1px solid #E8E8E8; border-radius: 4px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; color: #111111; font-weight: 500; transition: all 200ms;">View Details</button>
          <button class="job-save-btn" data-job-id="${job.id}" style="padding: 10px 12px; background: #FFFFFF; border: 1px solid #E8E8E8; border-radius: 4px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; color: #8B0000; font-weight: 500; transition: all 200ms;">${isSaved ? '★ Saved' : '☆ Save'}</button>
        </div>
        <button class="job-apply-btn" data-job-id="${job.id}" style="width: 100%; padding: 12px 12px; background: #8B0000; border: none; border-radius: 4px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; color: #FFFFFF; font-weight: 500; transition: all 200ms;">Apply Now</button>

        <!-- Status Selector -->
        <div style="margin-top:12px;">
          <select class="job-status-select" data-job-id="${job.id}" style="width:100%;padding:8px 10px;border:1px solid #E8E8E8;border-radius:4px;font-family:'Inter',sans-serif;font-size:13px;">
            ${['Not Applied','Applied','Rejected','Selected'].map(s=>`<option value="${s}" ${((this.jobStatuses[job.id]||'Not Applied')===s?'selected':'')}>${s}</option>`).join('')}
          </select>
        </div>
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

    // Helper: show non-blocking toast
    const showToast = (message) => {
      const toast = document.createElement('div');
      toast.textContent = message;
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.right = '20px';
      toast.style.background = '#111';
      toast.style.color = '#fff';
      toast.style.padding = '12px 20px';
      toast.style.borderRadius = '4px';
      toast.style.fontFamily = 'Inter, sans-serif';
      toast.style.fontSize = '14px';
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 200ms';
      document.body.appendChild(toast);
      requestAnimationFrame(() => { toast.style.opacity = '1'; });
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => { toast.remove(); }, 200);
      }, 2500);
    };

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

    // Status selector change
    app.addEventListener('change', (e) => {
      if (e.target.classList.contains('job-status-select')) {
        const jobId = parseInt(e.target.getAttribute('data-job-id'));
        const newStatus = e.target.value;
        const oldStatus = this.jobStatuses[jobId] || 'Not Applied';
        if (newStatus !== oldStatus) {
          this.jobStatuses[jobId] = newStatus;
          this.saveJobStatuses();
          const job = jobsDatabase.find(j=>j.id===jobId);
          if (job) {
            this.logStatusChange(job, newStatus);
          }
          showToast(`Status updated: ${newStatus}`);
          this.renderDashboard();
          this.renderSaved();
          this.renderDigest();
        }
      }
    });

    // Preference form submission
    const prefForm = app.querySelector('#preferences-form');
    if (prefForm) {
      // Handle score slider update
      const scoreSlider = app.querySelector('#pref-min-score');
      if (scoreSlider) {
        scoreSlider.addEventListener('input', (e) => {
          app.querySelector('#score-display').textContent = e.target.value + '%';
        });
      }

      // Handle reset button
      const resetBtn = app.querySelector('#pref-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.preferences = {
            roleKeywords: [],
            preferredLocations: [],
            preferredMode: [],
            experienceLevel: '',
            skills: [],
            minMatchScore: 40
          };
          this.savePreferences();
          this.renderSettings();
        });
      }

      // Handle form submission
      prefForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Collect keywords
        const keywords = app.querySelector('#pref-keywords').value
          .split(',')
          .map(k => k.trim())
          .filter(k => k.length > 0);

        // Collect locations
        const locations = Array.from(app.querySelectorAll('.pref-location:checked'))
          .map(cb => cb.value);

        // Collect modes
        const modes = Array.from(app.querySelectorAll('.pref-mode:checked'))
          .map(cb => cb.value);

        // Get experience level
        const experience = app.querySelector('#pref-experience').value;

        // Collect skills
        const skills = app.querySelector('#pref-skills').value
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0);

        // Get minimum score
        const minScore = parseInt(app.querySelector('#pref-min-score').value);

        // Update preferences
        this.preferences = {
          roleKeywords: keywords,
          preferredLocations: locations,
          preferredMode: modes,
          experienceLevel: experience,
          skills: skills,
          minMatchScore: minScore
        };

        this.savePreferences();
        this.navigate('/dashboard');
      });
    }

    // Filter handlers for dashboard
    const filterKeyword = app.querySelector('#filter-keyword');
    const filterLocation = app.querySelector('#filter-location');
    const filterMode = app.querySelector('#filter-mode');
    const filterExperience = app.querySelector('#filter-experience');
    const filterSource = app.querySelector('#filter-source');
    const filterStatus = app.querySelector('#filter-status');
    const filterSort = app.querySelector('#filter-sort');
    const clearFiltersBtn = app.querySelector('#clear-filters');
    const showOnlyMatchesToggle = app.querySelector('#show-only-matches');

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

    if (filterStatus) {
      filterStatus.addEventListener('change', (e) => {
        this.filters.status = e.target.value;
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
          status: 'All',
          sort: 'match-score',
          showOnlyMatches: false
        };
        this.renderDashboard();
      });
    }

    if (showOnlyMatchesToggle) {
      showOnlyMatchesToggle.addEventListener('change', (e) => {
        this.filters.showOnlyMatches = e.target.checked;
        this.renderDashboard();
      });
    }

    // Digest page button handlers
    const generateDigestBtn = app.querySelector('#generate-digest-btn');
    const copyDigestBtn = app.querySelector('#copy-digest-btn');
    const emailDigestBtn = app.querySelector('#email-digest-btn');
    const regenerateDigestBtn = app.querySelector('#regenerate-digest-btn');

    if (generateDigestBtn) {
      generateDigestBtn.addEventListener('click', () => {
        const digest = this.generateDigest();
        if (digest) {
          this.renderDigest();
        }
      });
    }

    if (copyDigestBtn) {
      copyDigestBtn.addEventListener('click', () => {
        const text = this.formatDigestAsText();
        navigator.clipboard.writeText(text).then(() => {
          const originalText = copyDigestBtn.textContent;
          copyDigestBtn.textContent = '✓ Copied!';
          setTimeout(() => {
            copyDigestBtn.textContent = originalText;
          }, 2000);
        }).catch(() => {
          alert('Failed to copy to clipboard');
        });
      });
    }

    if (emailDigestBtn) {
      emailDigestBtn.addEventListener('click', () => {
        const text = this.formatDigestAsText();
        const subject = 'My 9AM Job Digest';
        const body = encodeURIComponent(text);
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;
      });
    }

    if (regenerateDigestBtn) {
      regenerateDigestBtn.addEventListener('click', () => {
        const today = this.getTodayDate();
        const key = `jobTrackerDigest_${today}`;
        localStorage.removeItem(key);
        this.todayDigest = null;
        const digest = this.generateDigest();
        if (digest) {
          this.renderDigest();
        }
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
    const hasPrefs = this.hasPreferences();

    return `
      <div style="padding: 40px; max-width: 1200px; margin: 0 auto;">
        <!-- Context Header -->
        <div style="margin-bottom: 40px; border-bottom: 1px solid #E8E8E8; padding-bottom: 24px;">
          <h1 style="font-family: 'Crimson Text', serif; font-size: 48px; margin: 0 0 8px 0; color: #111111; font-weight: 600;">Find Jobs</h1>
          <p style="margin: 0; color: #666666; font-size: 16px;">Curated job opportunities for Indian tech professionals</p>
        </div>

        ${!hasPrefs ? `
          <!-- Preferences Banner -->
          <div style="background: #FFF3E0; border: 1px solid #FFB74D; border-radius: 4px; padding: 16px 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
            <p style="margin: 0; color: #E65100; font-size: 14px; font-family: 'Inter', sans-serif;">Set your preferences to activate intelligent matching.</p>
            <a href="/settings" data-link style="color: #E65100; text-decoration: none; font-weight: 500; font-size: 14px; font-family: 'Inter', sans-serif;">Configure Now →</a>
          </div>
        ` : ''}

        <!-- Filter Bar -->
        <div style="background: #FFFFFF; border: 1px solid #E8E8E8; border-radius: 4px; padding: 24px; margin-bottom: 24px;">
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

            <!-- Status Filter -->
            <select id="filter-status" style="padding: 10px 12px; border: 1px solid #E8E8E8; border-radius: 4px; font-family: 'Inter', sans-serif; font-size: 14px;">
              <option value="All">All Statuses</option>
              <option value="Not Applied" ${this.filters.status==='Not Applied'?'selected':''}>Not Applied</option>
              <option value="Applied" ${this.filters.status==='Applied'?'selected':''}>Applied</option>
              <option value="Rejected" ${this.filters.status==='Rejected'?'selected':''}>Rejected</option>
              <option value="Selected" ${this.filters.status==='Selected'?'selected':''}>Selected</option>
            </select>

            <!-- Sort -->
            <select id="filter-sort" style="padding: 10px 12px; border: 1px solid #E8E8E8; border-radius: 4px; font-family: 'Inter', sans-serif; font-size: 14px;">
              ${hasPrefs ? `<option value="match-score" ${this.filters.sort === 'match-score' ? 'selected' : ''}>Best Match</option>` : ''}
              <option value="latest" ${this.filters.sort === 'latest' ? 'selected' : ''}>Latest First</option>
              <option value="oldest" ${this.filters.sort === 'oldest' ? 'selected' : ''}>Oldest First</option>
              <option value="salary-high" ${this.filters.sort === 'salary-high' ? 'selected' : ''}>Salary: High to Low</option>
              <option value="salary-low" ${this.filters.sort === 'salary-low' ? 'selected' : ''}>Salary: Low to High</option>
            </select>
          </div>

          <!-- Filter Controls -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <button id="clear-filters" style="padding: 8px 16px; background: #F7F6F3; border: 1px solid #E8E8E8; border-radius: 4px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; color: #666666;">Clear Filters</button>
            
            ${hasPrefs ? `
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px; color: #666666;">
                <input type="checkbox" id="show-only-matches" ${this.filters.showOnlyMatches ? 'checked' : ''} style="cursor: pointer;">
                <span>Show only jobs above my threshold (${this.preferences.minMatchScore}%+)</span>
              </label>
            ` : ''}
          </div>
        </div>

        <!-- Results Count -->
        <p style="color: #666666; font-size: 14px; margin-bottom: 24px;">
          Showing ${filteredJobs.length} of ${jobsDatabase.length} jobs
        </p>

        ${filteredJobs.length === 0 ? `
          <!-- No Results State -->
          <div style="text-align: center; padding: 60px 24px; background: #F7F6F3; border-radius: 4px; border: 1px solid #E8E8E8;">
            <p style="font-family: 'Crimson Text', serif; font-size: 32px; margin: 0 0 16px 0; color: #111111; font-weight: 600;">No roles match your criteria.</p>
            <p style="margin: 0 0 24px 0; color: #666666; font-size: 15px;">Adjust your filters or ${hasPrefs ? 'lower your match threshold' : 'set your preferences'} to see more opportunities.</p>
            ${!hasPrefs ? `<a href="/settings" data-link style="display: inline-block; padding: 10px 20px; background: #8B0000; color: #FFFFFF; text-decoration: none; border-radius: 4px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;">Set Preferences</a>` : ''}
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
    const hasPrefs = this.hasPreferences();
    const digest = this.todayDigest;
    const today = this.getTodayDate();
    const displayDate = this.formatDisplayDate(today);

    if (!hasPrefs) {
      return `
        <div style="padding: 40px; max-width: 900px; margin: 0 auto;">
          <div style="margin-bottom: 40px; border-bottom: 1px solid #E8E8E8; padding-bottom: 24px;">
            <h1 style="font-family: 'Crimson Text', serif; font-size: 48px; margin: 0 0 8px 0; color: #111111; font-weight: 600;">Daily Digest</h1>
            <p style="margin: 0; color: #666666; font-size: 16px;">Smart job summaries delivered to you every morning</p>
          </div>

          <!-- Blocking Message -->
          <div style="text-align: center; padding: 60px 24px; background: #FFF3E0; border: 1px solid #FFB74D; border-radius: 4px;">
            <p style="font-family: 'Crimson Text', serif; font-size: 32px; margin: 0 0 16px 0; color: #E65100; font-weight: 600;">Set your preferences first</p>
            <p style="margin: 0 0 24px 0; color: #E65100; font-size: 15px; font-family: 'Inter', sans-serif;">Configure your job preferences to generate a personalized digest.</p>
            <a href="/settings" data-link style="display: inline-block; padding: 12px 24px; background: #E65100; color: #FFFFFF; text-decoration: none; border-radius: 4px; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500;">Configure Preferences</a>
          </div>
        </div>
      `;
    }

    if (!digest) {
      return `
        <div style="padding: 40px; max-width: 900px; margin: 0 auto;">
          <div style="margin-bottom: 40px; border-bottom: 1px solid #E8E8E8; padding-bottom: 24px;">
            <h1 style="font-family: 'Crimson Text', serif; font-size: 48px; margin: 0 0 8px 0; color: #111111; font-weight: 600;">Daily Digest</h1>
            <p style="margin: 0; color: #666666; font-size: 16px;">Smart job summaries delivered to you every morning</p>
          </div>

          <!-- Generate Button -->
          <div style="text-align: center; margin-bottom: 40px;">
            <button id="generate-digest-btn" style="padding: 12px 32px; background: #8B0000; border: none; border-radius: 4px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 14px; color: #FFFFFF; font-weight: 500;">Generate Today's 9AM Digest (Simulated)</button>
          </div>

          <!-- No Matches State -->
          <div style="text-align: center; padding: 60px 24px; background: #F7F6F3; border-radius: 4px; border: 1px solid #E8E8E8;">
            <p style="font-family: 'Crimson Text', serif; font-size: 32px; margin: 0 0 16px 0; color: #111111; font-weight: 600;">No matching roles today.</p>
            <p style="margin: 0 0 24px 0; color: #666666; font-size: 15px; font-family: 'Inter', sans-serif;">Check again tomorrow or adjust your preferences to see matching jobs.</p>
            <a href="/settings" data-link style="display: inline-block; margin-right: 12px; padding: 10px 20px; background: #F7F6F3; border: 1px solid #E8E8E8; color: #111111; text-decoration: none; border-radius: 4px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;">Adjust Preferences</a>
            <a href="/dashboard" data-link style="display: inline-block; padding: 10px 20px; background: #8B0000; border: none; color: #FFFFFF; text-decoration: none; border-radius: 4px; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;">Browse All Jobs</a>
          </div>

          <!-- Demo Note -->
          <p style="margin-top: 32px; text-align: center; color: #CCCCCC; font-size: 12px; font-family: 'Inter', sans-serif;">Demo Mode: Daily 9AM trigger simulated manually.</p>
        </div>
      `;
    }

    // Render existing digest
    return `
      <div style="padding: 40px; max-width: 900px; margin: 0 auto;">
        <!-- Context Header -->
        <div style="margin-bottom: 40px; border-bottom: 1px solid #E8E8E8; padding-bottom: 24px;">
          <h1 style="font-family: 'Crimson Text', serif; font-size: 48px; margin: 0 0 8px 0; color: #111111; font-weight: 600;">Daily Digest</h1>
          <p style="margin: 0; color: #666666; font-size: 16px;">Smart job summaries delivered to you every morning</p>
        </div>

        <!-- Digest Container (Email-style) -->
        <div style="background: #F7F6F3; padding: 40px 20px; border-radius: 4px;">
          <div style="background: #FFFFFF; max-width: 720px; margin: 0 auto; border-radius: 4px; padding: 40px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
            <!-- Digest Header -->
            <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #E8E8E8;">
              <h2 style="font-family: 'Crimson Text', serif; font-size: 28px; margin: 0 0 8px 0; color: #111111; font-weight: 600;">Top 10 Jobs For You</h2>
              <p style="margin: 0 0 8px 0; color: #666666; font-size: 14px; font-family: 'Inter', sans-serif;">9AM Digest</p>
              <p style="margin: 0; color: #999999; font-size: 13px; font-family: 'Inter', sans-serif;">${displayDate}</p>
            </div>

            <!-- Jobs List -->
            <div style="margin-bottom: 32px;">
              ${digest.jobs.map((job, index) => `
                <div style="padding: 20px 0; border-bottom: 1px solid #F0F0F0; ${index === digest.jobs.length - 1 ? 'border-bottom: none;' : ''}">
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 8px;">
                    <div style="flex: 1;">
                      <h3 style="font-family: 'Crimson Text', serif; font-size: 18px; margin: 0 0 4px 0; color: #111111; font-weight: 600;">${index + 1}. ${job.title}</h3>
                      <p style="margin: 0 0 8px 0; color: #666666; font-size: 14px; font-family: 'Inter', sans-serif; font-weight: 500;">${job.company}</p>
                    </div>
                    <div style="background: ${job.matchScore >= 80 ? '#E8F5E9' : job.matchScore >= 60 ? '#FFF8E1' : job.matchScore >= 40 ? '#F5F5F5' : '#FAFAFA'}; color: ${job.matchScore >= 80 ? '#2E7D32' : job.matchScore >= 60 ? '#F57F17' : job.matchScore >= 40 ? '#666666' : '#CCCCCC'}; padding: 8px 12px; border-radius: 3px; font-size: 13px; font-family: 'Inter', sans-serif; font-weight: 600; white-space: nowrap;">
                      ${job.matchScore}% Match
                    </div>
                  </div>

                  <!-- Job Meta -->
                  <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 12px; font-size: 13px; font-family: 'Inter', sans-serif; color: #666666;">
                    <span>📍 ${job.location}</span>
                    <span>💼 ${job.experience}</span>
                    <span>💰 ${job.salaryRange}</span>
                  </div>

                  <!-- Apply Button -->
                  <a href="${job.applyUrl}" target="_blank" style="display: inline-block; padding: 8px 16px; background: #8B0000; color: #FFFFFF; text-decoration: none; border-radius: 3px; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500;">Apply Now</a>
                </div>
              `).join('')}
            </div>

            <!-- Digest Footer -->
            <div style="text-align: center; padding-top: 24px; border-top: 2px solid #E8E8E8; color: #999999; font-size: 12px; font-family: 'Inter', sans-serif;">
              <p style="margin: 0;">This digest was generated based on your preferences.</p>
              <p style="margin: 4px 0 0 0;">Modify your settings anytime to get better recommendations.</p>
            </div>
          </div>
        </div>

        <!-- Recent Status Updates -->
        ${this.statusLog && this.statusLog.length ? `
        <div style="margin-top: 40px; max-width: 720px; margin-left: auto; margin-right: auto;">
          <h3 style="font-family: 'Crimson Text', serif; font-size: 22px; color: #111111;">Recent Status Updates</h3>
          <ul style="list-style: none; padding: 0; margin: 16px 0 0 0; font-family: 'Inter', sans-serif; color: #666666; font-size: 14px;">
            ${this.statusLog.slice(0,5).map(u=>`
              <li style="margin-bottom: 12px;">
                <strong>${u.title}</strong> at <em>${u.company}</em> – ${u.status} (<span>${new Date(u.date).toLocaleString()}</span>)
              </li>
            `).join('')}
          </ul>
        </div>
        ` : ''}

        <!-- Action Buttons -->
        <div style="display: flex; gap: 12px; justify-content: center; margin-top: 32px; flex-wrap: wrap;">
          <button id="copy-digest-btn" style="padding: 12px 24px; background: #F7F6F3; border: 1px solid #E8E8E8; border-radius: 4px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 14px; color: #111111; font-weight: 500;">Copy to Clipboard</button>
          <button id="email-digest-btn" style="padding: 12px 24px; background: #8B0000; border: none; border-radius: 4px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 14px; color: #FFFFFF; font-weight: 500;">Create Email Draft</button>
          <button id="regenerate-digest-btn" style="padding: 12px 24px; background: #F7F6F3; border: 1px solid #E8E8E8; border-radius: 4px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 14px; color: #666666; font-weight: 500;">Regenerate</button>
        </div>

        <!-- Demo Note -->
        <p style="margin-top: 32px; text-align: center; color: #CCCCCC; font-size: 12px; font-family: 'Inter', sans-serif;">Demo Mode: Daily 9AM trigger simulated manually.</p>
      </div>
    `;
  }

  renderSettings() {
    const prefs = this.preferences;
    
    return `
      <div style="padding: 40px; max-width: 900px; margin: 0 auto;">
        <div style="margin-bottom: 40px; border-bottom: 1px solid #E8E8E8; padding-bottom: 24px;">
          <h1 style="font-family: 'Crimson Text', serif; font-size: 48px; margin: 0 0 8px 0; color: #111111; font-weight: 600;">Preferences</h1>
          <p style="margin: 0; color: #666666; font-size: 16px;">Customize your job matching for intelligent recommendations</p>
        </div>

        <form id="preferences-form" style="display: flex; flex-direction: column; gap: 32px;">
          <!-- Role Keywords -->
          <div>
            <label style="display: block; font-family: 'Crimson Text', serif; font-size: 18px; color: #111111; font-weight: 600; margin-bottom: 8px;">Role Keywords</label>
            <input 
              type="text"
              id="pref-keywords"
              value="${prefs.roleKeywords.join(', ')}"
              placeholder="e.g., Python Developer, Frontend Engineer, Product Manager"
              style="width: 100%; padding: 12px 16px; border: 1px solid #E8E8E8; border-radius: 4px; font-family: 'Inter', sans-serif; font-size: 14px; box-sizing: border-box;"
            />
            <p style="margin: 8px 0 0 0; color: #999999; font-size: 13px; font-family: 'Inter', sans-serif;">Separate multiple keywords with commas. These will be matched against job titles and descriptions.</p>
          </div>

          <!-- Preferred Locations -->
          <div>
            <label style="display: block; font-family: 'Crimson Text', serif; font-size: 18px; color: #111111; font-weight: 600; margin-bottom: 12px;">Preferred Locations</label>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px;">
              ${this.getUniqueValues('location').map(loc => `
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 14px;">
                  <input type="checkbox" class="pref-location" value="${loc}" ${prefs.preferredLocations.includes(loc) ? 'checked' : ''}>
                  <span>${loc}</span>
                </label>
              `).join('')}
            </div>
            <p style="margin: 12px 0 0 0; color: #999999; font-size: 13px; font-family: 'Inter', sans-serif;">Select all locations you'd be interested in +${prefs.preferredLocations.length > 0 ? ` (${prefs.preferredLocations.length} selected)` : ''}</p>
          </div>

          <!-- Preferred Work Mode -->
          <div>
            <label style="display: block; font-family: 'Crimson Text', serif; font-size: 18px; color: #111111; font-weight: 600; margin-bottom: 12px;">Work Mode</label>
            <div style="display: flex; gap: 16px; flex-wrap: wrap;">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 14px;">
                <input type="checkbox" class="pref-mode" value="Remote" ${prefs.preferredMode.includes('Remote') ? 'checked' : ''}>
                <span>Remote</span>
              </label>
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 14px;">
                <input type="checkbox" class="pref-mode" value="Hybrid" ${prefs.preferredMode.includes('Hybrid') ? 'checked' : ''}>
                <span>Hybrid</span>
              </label>
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 14px;">
                <input type="checkbox" class="pref-mode" value="Onsite" ${prefs.preferredMode.includes('Onsite') ? 'checked' : ''}>
                <span>Onsite</span>
              </label>
            </div>
          </div>

          <!-- Experience Level -->
          <div>
            <label style="display: block; font-family: 'Crimson Text', serif; font-size: 18px; color: #111111; font-weight: 600; margin-bottom: 8px;">Experience Level Target</label>
            <select 
              id="pref-experience"
              style="width: 100%; padding: 12px 16px; border: 1px solid #E8E8E8; border-radius: 4px; font-family: 'Inter', sans-serif; font-size: 14px; background-color: #FFFFFF; cursor: pointer;"
            >
              <option value="">No preference</option>
              <option value="Fresher" ${prefs.experienceLevel === 'Fresher' ? 'selected' : ''}>Fresher</option>
              <option value="0–1 Years" ${prefs.experienceLevel === '0–1 Years' ? 'selected' : ''}>0–1 Years</option>
              <option value="1–3 Years" ${prefs.experienceLevel === '1–3 Years' ? 'selected' : ''}>1–3 Years</option>
              <option value="3–5 Years" ${prefs.experienceLevel === '3–5 Years' ? 'selected' : ''}>3–5 Years</option>
              <option value="5+ Years" ${prefs.experienceLevel === '5+ Years' ? 'selected' : ''}>5+ Years</option>
            </select>
          </div>

          <!-- Skills -->
          <div>
            <label style="display: block; font-family: 'Crimson Text', serif; font-size: 18px; color: #111111; font-weight: 600; margin-bottom: 8px;">Skills</label>
            <input 
              type="text"
              id="pref-skills"
              value="${prefs.skills.join(', ')}"
              placeholder="e.g., JavaScript, React, SQL, AWS"
              style="width: 100%; padding: 12px 16px; border: 1px solid #E8E8E8; border-radius: 4px; font-family: 'Inter', sans-serif; font-size: 14px; box-sizing: border-box;"
            />
            <p style="margin: 8px 0 0 0; color: #999999; font-size: 13px; font-family: 'Inter', sans-serif;">Separate skills with commas. Jobs will score higher if they match these skills.</p>
          </div>

          <!-- Match Score Threshold -->
          <div>
            <label style="display: block; font-family: 'Crimson Text', serif; font-size: 18px; color: #111111; font-weight: 600; margin-bottom: 12px;">
              Minimum Match Score: <span id="score-display" style="color: #8B0000;">${prefs.minMatchScore}%</span>
            </label>
            <input 
              type="range"
              id="pref-min-score"
              min="0"
              max="100"
              value="${prefs.minMatchScore}"
              style="width: 100%; cursor: pointer; height: 6px; border-radius: 3px; background: #E8E8E8; outline: none; -webkit-appearance: none;"
            />
            <p style="margin: 12px 0 0 0; color: #999999; font-size: 13px; font-family: 'Inter', sans-serif;">Only show jobs with match scores at or above this threshold when "Show only matches" is enabled.</p>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 12px; justify-content: flex-end; padding-top: 24px; border-top: 1px solid #E8E8E8;">
            <button type="button" id="pref-reset-btn" style="padding: 12px 24px; background: #F7F6F3; border: 1px solid #E8E8E8; border-radius: 4px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 14px; color: #666666; font-weight: 500;">Reset</button>
            <button type="submit" id="pref-save-btn" style="padding: 12px 24px; background: #8B0000; border: none; border-radius: 4px; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 14px; color: #FFFFFF; font-weight: 500;">Save Preferences</button>
          </div>
        </form>
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
