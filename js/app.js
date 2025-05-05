document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupMobileMenu();
    setupScrollBehavior();
    addHoverEffects();
    setupViewToggle();
    animateLandingPage();
    
    // Set copyright year
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Determine if we're on a day page or the index page
    const path = window.location.pathname;
    if (path.includes('/day-')) {
        loadDayContent();
    } else if (path.includes('/index.html') || path.endsWith('/')) {
        loadDaysList();
        loadDaysGrid();
    }
});

/**
 * Initialize theme based on user preference or localStorage
 */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use the system preference
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Set the theme and update the toggle button
    setTheme(currentTheme);
    
    // Add event listener for theme toggle button with animation
    themeToggle.addEventListener('click', () => {
        // Add a temporary rotate animation class
        themeToggle.classList.add('rotate-animation');
        
        // Remove the class after animation completes
        setTimeout(() => {
            themeToggle.classList.remove('rotate-animation');
        }, 300);
        
        const currentTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    });
}

/**
 * Set the theme on the document
 * @param {string} theme - 'dark' or 'light'
 */
function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
}

/**
 * Setup mobile menu toggle functionality
 */
function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    if (!mobileMenuToggle) return;
    
    mobileMenuToggle.addEventListener('click', () => {
        const nav = document.getElementById('days-navigation');
        nav.classList.toggle('open');
    });
}

/**
 * Setup smooth scroll behavior
 */
function setupScrollBehavior() {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add scroll to top button if we're on a day page with enough content
    if (window.location.pathname.includes('/day-')) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                showScrollTopButton();
            } else {
                hideScrollTopButton();
            }
        });
    }
}

/**
 * Add hover effects to interactive elements
 */
function addHoverEffects() {
    // Optional: Add subtle hover effects to links in content
    const links = document.querySelectorAll('main a:not(.primary-button):not(.nav-button)');
    links.forEach(link => {
        link.classList.add('content-link');
    });
}

/**
 * Show the scroll to top button
 */
function showScrollTopButton() {
    let scrollBtn = document.getElementById('scroll-top-btn');
    
    if (!scrollBtn) {
        scrollBtn = document.createElement('button');
        scrollBtn.id = 'scroll-top-btn';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        scrollBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 15l-6-6-6 6"/>
            </svg>
        `;
        
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        document.body.appendChild(scrollBtn);
    }
    
    scrollBtn.classList.add('visible');
}

/**
 * Hide the scroll to top button
 */
function hideScrollTopButton() {
    const scrollBtn = document.getElementById('scroll-top-btn');
    if (scrollBtn) {
        scrollBtn.classList.remove('visible');
    }
}

/**
 * Load the list of days for the navigation sidebar
 */
async function loadDaysList() {
    try {
        const daysNav = document.getElementById('days-navigation');
        if (!daysNav) return;
        
        // Show loading state
        daysNav.innerHTML = '<div class="days-list-placeholder"><div class="loading"></div></div>';
        
        // Use the helper function to get the correct path
        const dataPath = resolvePath('./data/days.json');
        console.log('Fetching days list from:', dataPath);
        const response = await fetch(dataPath);
        
        if (!response.ok) {
            throw new Error(`Failed to load days data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Create the list container
        const listElement = document.createElement('div');
        listElement.className = 'days-list';
        
        // Create a link for each day with staggered animation
        data.forEach((day, index) => {
            const link = document.createElement('a');
            // Use the helper function to get the correct path
            link.href = resolvePath(`./days/day-${day.id}.html`);
            link.textContent = `Day ${day.id}: ${day.title}`;
            link.style.animationDelay = `${index * 20}ms`;
            link.classList.add('menu-item-animation');
            
            // Mark current day as active if we're on a day page
            const path = window.location.pathname;
            if (path.includes(`day-${day.id}`)) {
                link.classList.add('active');
            }
            
            listElement.appendChild(link);
        });
        
        // Replace the placeholder with the actual list
        daysNav.innerHTML = '';
        daysNav.appendChild(listElement);
        
    } catch (error) {
        console.error('Error loading days list:', error);
        const daysNav = document.getElementById('days-navigation');
        daysNav.innerHTML = `<div class="error-message">Failed to load days list. Please try again later.</div>`;
    }
}

/**
 * Load the content for the current day page
 */
async function loadDayContent() {
    try {
        const path = window.location.pathname;
        console.log('Current path:', path);
        
        // Improved day extraction to handle various URL patterns
        const dayMatch = path.match(/day-(\d+)/);
        
        if (!dayMatch) {
            console.error('Could not extract day number from URL:', path);
            throw new Error('Invalid day page URL');
        }
        
        // Extract day number and pad with leading zero if needed
        let dayId = dayMatch[1];
        // Ensure dayId is padded to 2 digits if it's not already
        if (dayId.length === 1) {
            dayId = '0' + dayId;
        }
        console.log('Formatted day ID:', dayId);
        
        const main = document.querySelector('main');
        
        if (!main) return;
        
        // Show loading indicator
        main.innerHTML = '<div class="loading"></div>';
        
        // Use the helper function to get the correct path
        const dataPath = resolvePath('./data/days.json');
        console.log('Fetching data from:', dataPath);
        const response = await fetch(dataPath);
        
        if (!response.ok) {
            console.error('Failed to fetch data:', response.status, response.statusText);
            throw new Error(`Failed to load days data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Loaded data:', data);
        
        // Find the current day - make sure we find the correct day even if formats don't match
        const currentDay = data.find(day => {
            // Strip leading zeros for comparison if needed
            const dataId = day.id;
            const urlId = dayId;
            return dataId === urlId;
        });
        
        if (!currentDay) {
            console.error('Day not found in data. Day ID:', dayId, 'Available IDs:', data.map(d => d.id));
            throw new Error(`Day ${dayId} not found in data`);
        }
        
        console.log('Current day data:', currentDay);
        
        // Find previous and next day IDs
        const currentIndex = data.findIndex(day => day.id === dayId);
        const prevDay = currentIndex > 0 ? data[currentIndex - 1] : null;
        const nextDay = currentIndex < data.length - 1 ? data[currentIndex + 1] : null;
        
        // Render the day content
        main.innerHTML = `
            <div class="day-header">
                <h2 class="day-title">Day ${currentDay.id}: ${currentDay.title}</h2>
                <p class="day-description">${currentDay.description}</p>
            </div>
            
            ${renderEmbed(currentDay)}
            
            <div class="navigation-buttons">
                ${prevDay ? 
                    `<a href="day-${prevDay.id}.html" class="nav-button prev-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M15 18l-6-6 6-6"/>
                        </svg>
                        Previous: Day ${prevDay.id}
                    </a>` : 
                    `<span class="nav-button prev-button disabled">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M15 18l-6-6 6-6"/>
                        </svg>
                        Previous
                    </span>`
                }
                
                ${nextDay ? 
                    `<a href="day-${nextDay.id}.html" class="nav-button next-button">
                        Next: Day ${nextDay.id}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </a>` : 
                    `<span class="nav-button next-button disabled">
                        Next
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </span>`
                }
            </div>
        `;
        
        // Also load the days list for the sidebar
        loadDaysList();
        
    } catch (error) {
        console.error('Error loading day content:', error);
        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = `
                <div class="error-message">
                    Failed to load day content. Please try again later.
                    <p>${error.message}</p>
                </div>
            `;
        }
    }
}

/**
 * Render the appropriate embed based on the day's embed type
 * @param {Object} day - The day object from days.json
 * @returns {string} HTML for the embed
 */
function renderEmbed(day) {
    // Use the helper function to get the correct path
    const imgPath = resolvePath('./assets/colab-badge.svg');
    
    if (day.embedType === 'godbolt') {
        return `
            <div class="embed-container">
                <iframe width="800px" height="200px" src="${day.codeStubUrl}" allowfullscreen></iframe>
            </div>
        `;
    } else if (day.embedType === 'colab') {
        return `
            <a href="${day.codeStubUrl}" target="_blank" class="colab-button">
                <img src="${imgPath}" alt="Open In Colab">
                Run in Google Colab
            </a>
        `;
    } else {
        // Default to showing a code block
        return `
            <div class="code-container">
                <pre><code>// Code for Day ${day.id}: ${day.title}
// Will be loaded from ${day.codeStubUrl}</code></pre>
            </div>
        `;
    }
}

/**
 * Helper function to get the correct path for assets based on current URL
 * @param {string} relativePath - The relative path to resolve
 * @returns {string} The correct path for the current page
 */
function resolvePath(relativePath) {
    const path = window.location.pathname;
    const isInDaysDir = path.includes('/days/') || path.includes('/day-');
    
    // If we're in a day page, we need to go up one level
    if (isInDaysDir) {
        // Path starts with "../" for day pages
        if (relativePath.startsWith('./')) {
            return relativePath.replace('./', '../');
        } else if (!relativePath.startsWith('../')) {
            return '../' + relativePath;
        }
    }
    
    return relativePath;
}

/**
 * Setup view toggle functionality between list and grid views
 */
function setupViewToggle() {
    const listViewBtn = document.getElementById('list-view');
    const gridViewBtn = document.getElementById('grid-view');
    const daysGrid = document.getElementById('days-grid');
    
    if (!listViewBtn || !gridViewBtn || !daysGrid) return;
    
    listViewBtn.addEventListener('click', () => {
        if (!listViewBtn.classList.contains('active')) {
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            daysGrid.classList.remove('days-grid');
            daysGrid.classList.add('days-list-view');
        }
    });
    
    gridViewBtn.addEventListener('click', () => {
        if (!gridViewBtn.classList.contains('active')) {
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            daysGrid.classList.add('days-grid');
            daysGrid.classList.remove('days-list-view');
        }
    });
}

/**
 * Load days cards for the grid layout
 */
async function loadDaysGrid() {
    try {
        const daysGrid = document.getElementById('days-grid');
        if (!daysGrid) return;
        
        // Clear any existing content
        daysGrid.innerHTML = '<div class="loading"></div>';
        
        // Fetch days data
        const dataPath = resolvePath('./data/days.json');
        const response = await fetch(dataPath);
        
        if (!response.ok) {
            throw new Error(`Failed to load days data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Create HTML for grid cards
        let gridHTML = '';
        
        // Get completed days count
        const completedDays = data.filter(day => !day.title.includes('Coming Soon')).length;
        const progress = Math.round((completedDays / 100) * 100);
        
        // Update progress bar if it exists
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.welcome-card strong');
        
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        if (progressText) {
            const progressInfoElement = progressText.parentElement;
            progressInfoElement.innerHTML = `<strong>Progress:</strong> ${completedDays} days completed (${progress}%)`;
        }
        
        // Get days for grid display (first 6 or completed ones)
        const displayDays = data.filter(day => !day.title.includes('Coming Soon')).slice(0, 6);
        
        // Generate HTML for each day card
        displayDays.forEach(day => {
            gridHTML += `
                <div class="day-card" data-day="${day.id}">
                    <div class="day-card-header">Day ${day.id}</div>
                    <div class="day-card-body">
                        <h4 class="day-card-title">${day.title}</h4>
                        <p class="day-card-description">${day.description}</p>
                    </div>
                    <div class="day-card-footer">
                        <a href="days/day-${day.id}.html" class="view-day-btn">View Day</a>
                    </div>
                </div>
            `;
        });
        
        // Add "View All" card if there are more than 6 completed days
        if (completedDays > 6) {
            gridHTML += `
                <div class="day-card view-all-card">
                    <div class="day-card-body" style="display: flex; align-items: center; justify-content: center; text-align: center;">
                        <div>
                            <h4 class="day-card-title">Explore All Days</h4>
                            <p class="day-card-description">View all ${completedDays} completed days and continue your CUDA journey</p>
                            <a href="#days-navigation" class="primary-button">View All Days</a>
                        </div>
                    </div>
                </div>
            `;
        }
        
        // Update the grid
        daysGrid.innerHTML = gridHTML;
        
        // Add hover animation to cards
        const cards = document.querySelectorAll('.day-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            setTimeout(() => {
                card.classList.add('float-animation');
            }, index * 100);
        });
        
    } catch (error) {
        console.error('Error loading days grid:', error);
        const daysGrid = document.getElementById('days-grid');
        if (daysGrid) {
            daysGrid.innerHTML = `<div class="error-message">Failed to load days data. Please try again later.</div>`;
        }
    }
}

/**
 * Animate elements on the landing page
 */
function animateLandingPage() {
    // Check if we're on the landing page
    if (!document.querySelector('.landing-container')) return;
    
    // Animate the performance chart bars when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const chart = entry.target;
                const bars = chart.querySelectorAll('.bar-fill');
                
                setTimeout(() => {
                    bars.forEach(bar => {
                        const height = bar.style.height;
                        bar.style.height = '0%';
                        
                        setTimeout(() => {
                            bar.style.height = height;
                        }, 100);
                    });
                }, 300);
                
                // Stop observing after animation
                observer.unobserve(chart);
            }
        });
    }, { threshold: 0.5 });
    
    // Observe the chart if it exists
    const chart = document.querySelector('.performance-chart');
    if (chart) observer.observe(chart);
    
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animate timeline sections when scrolled into view
    const timelineSections = document.querySelectorAll('.timeline-section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    timelineSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        sectionObserver.observe(section);
    });
    
    // Add style for visible sections
    const style = document.createElement('style');
    style.textContent = `
        .section-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
} 