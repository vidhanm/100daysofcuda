// Script to generate day HTML files from the content in 100 days data.md
const fs = require('fs');
const path = require('path');

// Read the content of the 100 days data.md file
const data = fs.readFileSync('100 days data.md', 'utf8');

// Split the content by day sections (starting with ## Day X)
const dayRegex = /## Day (\d+)[\s\S]*?(?=## Day \d+|$)/g;
const days = [];
let match;

while ((match = dayRegex.exec(data)) !== null) {
    const dayNumber = match[1];
    const content = match[0].trim();
    days.push({ dayNumber, content });
}

// Create the days directory if it doesn't exist
const daysDir = path.join(__dirname, 'days');
if (!fs.existsSync(daysDir)) {
    fs.mkdirSync(daysDir);
}

// Template for each day HTML file
const createDayHTML = (dayNumber, content) => {
    // Format the day number with leading zero if needed
    const formattedDayNumber = dayNumber.padStart(2, '0');
    
    // Extract title and description
    const titleMatch = content.match(/### File: `(.+)`/) || content.match(/### Files: `(.+)`/) || content.match(/### Files: (.+)/) || ["", `Day ${dayNumber} Content`];
    let title = titleMatch[1] || `Day ${dayNumber} Content`;
    
    // Extract summary
    const summaryMatch = content.match(/\*\*Summary:\*\*\s*([^\n]+)/) || ["", ""];
    let description = summaryMatch[1] || `Content for Day ${dayNumber}`;
    
    // Parse the markdown content to HTML
    let htmlContent = "";
    const contentLines = content.split('\n');
    
    for (const line of contentLines) {
        if (line.startsWith('## Day')) {
            htmlContent += `<h2>${line.replace('## ', '')}</h2>`;
        } else if (line.startsWith('### File:') || line.startsWith('### Files:')) {
            htmlContent += `<h3>${line.replace('### ', '')}</h3>`;
        } else if (line.startsWith('### Reading:')) {
            htmlContent += `<h3>${line.replace('### ', '')}</h3>`;
        } else if (line.startsWith('### Blog:')) {
            htmlContent += `<h3>${line.replace('### ', '')}</h3>`;
        } else if (line.startsWith('**Summary:**')) {
            htmlContent += `<h4>Summary:</h4>`;
        } else if (line.startsWith('**Learned:**')) {
            htmlContent += `<h4>Learned:</h4>`;
        } else if (line.startsWith('**Key Components:**')) {
            htmlContent += `<h4>Key Components:</h4>`;
        } else if (line.startsWith('**Performance Highlights:**')) {
            htmlContent += `<h4>Performance Highlights:</h4>`;
        } else if (line.startsWith('**Findings:**')) {
            htmlContent += `<h4>Findings:</h4>`;
        } else if (line.startsWith('**Components Developed:**')) {
            htmlContent += `<h4>Components Developed:</h4>`;
        } else if (line.startsWith('**Learnings:**')) {
            htmlContent += `<h4>Learnings:</h4>`;
        } else if (line.startsWith('**Future Plans:**')) {
            htmlContent += `<h4>Future Plans:</h4>`;
        } else if (line.startsWith('**Benchmark Results:**')) {
            htmlContent += `<h4>Benchmark Results:</h4>`;
        } else if (line.startsWith('**Link to Blog:**')) {
            htmlContent += `<h4>Link to Blog:</h4>`;
        } else if (line.startsWith('**Game of Life Rules Implemented:**')) {
            htmlContent += `<h4>Game of Life Rules Implemented:</h4>`;
        } else if (line.startsWith('**Key Concepts Implemented:**')) {
            htmlContent += `<h4>Key Concepts Implemented:</h4>`;
        } else if (line.startsWith('- ')) {
            // Handle list items
            htmlContent += `<li>${line.replace('- ', '')}</li>`;
        } else if (line.startsWith('  - ')) {
            // Handle nested list items
            htmlContent += `<li style="margin-left: 20px;">${line.replace('  - ', '')}</li>`;
        } else if (line.match(/^\d+\./)) {
            // Handle numbered list items
            htmlContent += `<li>${line.replace(/^\d+\.\s*/, '')}</li>`;
        } else if (line.startsWith('---')) {
            // Handle horizontal rules
            htmlContent += `<hr>`;
        } else if (line.trim() === '') {
            // Handle empty lines
            htmlContent += `<br>`;
        } else {
            // Regular paragraph text
            htmlContent += `<p>${line}</p>`;
        }
    }
    
    // Convert links to proper HTML
    htmlContent = htmlContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Wrap lists properly
    htmlContent = htmlContent.replace(/<li>(.*?)<\/li><li>/g, '<li>$1</li><li>');
    htmlContent = htmlContent.replace(/<li>(.*?)<\/li><br>/g, '<li>$1</li></ul><br>');
    htmlContent = htmlContent.replace(/<h4>(.*?)<\/h4><li>/g, '<h4>$1</h4><ul><li>');
    
    // Clean up any remaining list items
    if (htmlContent.includes('<li>') && !htmlContent.includes('<ul>')) {
        htmlContent = htmlContent.replace(/<li>/, '<ul><li>');
        if (!htmlContent.includes('</ul>')) {
            htmlContent += '</ul>';
        }
    }
    
    // Create the HTML file content
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Day ${dayNumber} of 100 Days of CUDA - ${title}">
    <meta name="theme-color" content="#4361ee">
    <title>Day ${dayNumber}: ${title} - 100 Days of CUDA</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="shortcut icon" href="../assets/favicon.svg" type="image/svg+xml">
    <style>
        /* Add specific styles for code display */
        pre {
            background-color: var(--code-bg);
            padding: 1rem;
            border-radius: 4px;
            overflow-x: auto;
        }
        
        code {
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 0.9rem;
            color: var(--text-color);
        }
        
        h2, h3, h4 {
            color: var(--primary-color);
            margin-top: 1.5rem;
        }
        
        ul, ol {
            padding-left: 2rem;
            margin-bottom: 1rem;
        }
        
        li {
            margin-bottom: 0.5rem;
        }
        
        a {
            color: var(--primary-color);
            text-decoration: none;
        }
        
        a:hover {
            text-decoration: underline;
        }
        
        @media (max-width: 768px) {
            pre, code {
                font-size: 0.85rem;
            }
            
            h2 {
                font-size: 1.5rem;
            }
            
            h3 {
                font-size: 1.3rem;
            }
            
            h4 {
                font-size: 1.1rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="header-content">
                <h1><a href="../index.html" style="text-decoration: none; color: inherit;">100 Days of CUDA</a></h1>
                <button id="theme-toggle" aria-label="Toggle dark/light mode">
                    <span class="theme-icon"></span>
                </button>
            </div>
        </header>
        
        <div class="content-wrapper">
            <aside class="sidebar">
                <div class="sidebar-header">
                    <h2>Days</h2>
                    <button id="mobile-menu-toggle" aria-label="Toggle menu">
                        <span class="menu-icon"></span>
                    </button>
                </div>
                <nav id="days-navigation">
                    <!-- Day links will be generated here -->
                    <div class="days-list-placeholder">Loading...</div>
                </nav>
            </aside>
            
            <main>
                <!-- Day content -->
                <div class="day-content">
                    ${htmlContent}
                </div>
            </main>
        </div>
        
        <footer>
            <p>&copy; <span id="current-year"></span> 100 Days of CUDA</p>
        </footer>
    </div>
    
    <script src="../js/app.js"></script>
</body>
</html>`;
};

// Generate HTML files for each day
days.forEach(day => {
    const { dayNumber, content } = day;
    const formattedDayNumber = dayNumber.padStart(2, '0');
    const htmlContent = createDayHTML(dayNumber, content);
    const filePath = path.join(daysDir, `day-${formattedDayNumber}.html`);
    
    fs.writeFileSync(filePath, htmlContent);
    console.log(`Created ${filePath}`);
});

// If we have < 100 days, create placeholder files for the rest
for (let i = days.length + 1; i <= 100; i++) {
    const dayNumber = i.toString();
    const formattedDayNumber = dayNumber.padStart(2, '0');
    
    // Create a simple placeholder content
    const placeholderContent = `## Day ${dayNumber}\n**Summary:**\nComing soon! This day's content is still being developed.`;
    
    const htmlContent = createDayHTML(dayNumber, placeholderContent);
    const filePath = path.join(daysDir, `day-${formattedDayNumber}.html`);
    
    fs.writeFileSync(filePath, htmlContent);
    console.log(`Created placeholder for ${filePath}`);
}

console.log(`Successfully generated ${days.length} day files and ${100 - days.length} placeholder files.`); 