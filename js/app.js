document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupMobileMenu();
    setupScrollBehavior();
    addHoverEffects();
    
    // Set copyright year
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Determine if we're on a day page or the index page
    const path = window.location.pathname;
    if (path.includes('/day-')) {
        loadDayContent();
    } else {
        loadDaysList();
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