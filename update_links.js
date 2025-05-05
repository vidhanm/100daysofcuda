// Script to update all references from index.html to dashboard.html in day pages
const fs = require('fs');
const path = require('path');

// Get all day HTML files
const daysDir = path.join(__dirname, 'days');
const dayFiles = fs.readdirSync(daysDir).filter(file => file.startsWith('day-') && file.endsWith('.html'));

console.log(`Found ${dayFiles.length} day files to update`);

// Update references in each file
dayFiles.forEach(file => {
    const filePath = path.join(daysDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace ../index.html with ../dashboard.html
    const updatedContent = content.replace(/\.\.\/index\.html/g, '../dashboard.html');
    
    // Write the updated content back
    fs.writeFileSync(filePath, updatedContent);
    
    console.log(`Updated ${file}`);
});

console.log('All day files updated successfully!');

// Also update the generate_day_files.js script if it exists
const generatorPath = path.join(__dirname, 'generate_day_files.js');
if (fs.existsSync(generatorPath)) {
    let content = fs.readFileSync(generatorPath, 'utf8');
    
    // Replace ../index.html with ../dashboard.html in the template
    const updatedContent = content.replace(/\.\.\/index\.html/g, '../dashboard.html');
    
    // Write the updated content back
    fs.writeFileSync(generatorPath, updatedContent);
    
    console.log('Updated generate_day_files.js');
}

console.log('Update completed successfully!'); 