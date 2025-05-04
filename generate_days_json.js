// Script to generate days.json file from the content in 100 days data.md
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

// Extract information for each day
const daysData = days.map(day => {
    const { dayNumber, content } = day;
    
    // Extract title
    const titleMatch = content.match(/### File: `(.+)`/) || content.match(/### Files: `(.+)`/) || content.match(/### Files: (.+)/) || ["", `Day ${dayNumber} Content`];
    let title = titleMatch[1] || `Day ${dayNumber} Content`;
    
    // Extract summary
    const summaryMatch = content.match(/\*\*Summary:\*\*\s*([^\n]+)/) || ["", ""];
    let description = summaryMatch[1] || `Content for Day ${dayNumber}`;
    
    // Clean up description - remove extra spaces and newlines
    description = description.trim().replace(/\s+/g, ' ');
    
    // Format day number with leading zero
    const formattedDayNumber = dayNumber.padStart(2, '0');
    
    return {
        id: formattedDayNumber,
        title: title,
        description: description,
        codeStubUrl: "https://godbolt.org/e#z:OYLghAFBqRAWIDGB7AJgUwKKoJYBdkAnAGhxAgDMcAbdAOwEMBbdEAcgEY3iLk68Ayoga0QHACw8%2BeAKoBndAAUAHuwAM3AFZji1BnVCIArqgbEFtRHhx9y9VAGFk1I0zogATJPsAZHHXQAOVcAI3RCEEkAB2Q5fBs6Jxc3T2jY%2BL4/AOCmMIjJC3QrBIE8BkI8JNd3L3N0S2s%2BUvK8LKDQ8MjzMoqqlNq5Htb/dtzO8QBKc2QjQkRWNgBSDwBmf0QXDABqRZWHG0HCdGZdzEW1AEFltboNk3QdveNTAH1CI34cFgA6OFPzq6XAD0QK2DhkABELlsANbhALULYUD7FPgAl4vYDUZAhEQYrYAN2QOFQWwYqFQEH8eC2ACozFtqXSQsRGfw6YhWUy6BMdgB2ABCAK2IrZNJJykeEK2eDgR3JAElUMpvpLlgKtiFsYgYRCvqq6ZrtTClSrlLshZdRYyKFsqcrHg4tjz%2BZbodbRYhFgBWAUSn3S3bShg%2Bv3KgM7DwakKh/3eiEW4WixZ8hOXFNpwEXJlMBj%2BCC8lNu60oOiDMVbQJSrYcNSJq2iplxABeDyDlcNLfQyAoVP4E3rWetIK2AAlYjSWEwiABPJMiplwF4h32BAOspcx1frrZLr3b%2BOD628Qh2pk4at1lYai%2B7J1r6%2BRoVRnCFwXzj1Lld%2BiPtnBHj0RU3WNfxWaUL1pLYPAAkUMwBD8RwhdACRweYtinWcPyZWlUGXVkcJeFk6Vwr1rw/Z4GAAWREbUIGWAA2XCGS7AcyIbEUKOo6haIY3CiJYmCtk4mjkEQOiPEYl5OS2AS2KHUURycKIZzZKIjDwOQZWQLYMBQ%2BZyJMKj0CYRBlIgJiNzwmScFbVlOOM0yZ3HQYABVkCQvT0FY4tPUMyiHLMvjLP4mz0DsvyAqcic3I81CvMHBDQR8BgUTgWF4XqLYAHd8DSjgjVEmEth7Gs1BlOVjlQOQP3JVA73qvYOFZB8zhWVrMHMqygp0qTmu8%2BD2K2RTkGUrYjjkIxqBpXEdS03cJwM0x/JMsy91ZEjWS7cKlsi2L5jc5y8H69NBpHRRCCZcbJrwD9BlQEAkBmGkGqdZYPAAJXQCappASNoLk48iDPdlbzArYrxvR1KwtJ91VfV0P2tO6HpQdTHTvXcpJA%2BN0b2P6/sEuDBuRx60ZemS8HukB7GoBLTtBBxaH0IwokWhgADEjnQTqGGO90OMMzn0G5vi%2BZLQWuc6xA%2BY/I48FmOhwYS1MATYKZqHYb1uHcNgNGIZB2HBKEwXVdUZJmOY21WLhiDwdQ1amGExDUNRdHYcRuCYZ3XZ1vWDbYbg5BAV27d1h3iAJcI4lscQgA%3D",
        embedType: dayNumber % 2 === 0 ? "godbolt" : "colab" // Alternate between godbolt and colab for variety
    };
});

// Add placeholder entries for any missing days to reach 100
for (let i = daysData.length + 1; i <= 100; i++) {
    const formattedDayNumber = i.toString().padStart(2, '0');
    daysData.push({
        id: formattedDayNumber,
        title: `Coming Soon`,
        description: `Day ${i} content is in development.`,
        codeStubUrl: "https://godbolt.org/e#z:OYLghAFBqRAWIDGB7AJgUwKKoJYBdkAnAGhxAgDMcAbdAOwEMBbdEAcgEY3iLk68Ayoga0QHACw8%2BeAKoBndAAUAHuwAM3AFZji1BnVCIArqgbEFtRHhx9y9VAGFk1I0zogATJPsAZHHXQAOVcAI3RCEEkAB2Q5fBs6Jxc3T2jY%2BL4/AOCmMIjJC3QrBIE8BkI8JNd3L3N0S2s%2BUvK8LKDQ8MjzMoqqlNq5Htb/dtzO8QBKc2QjQkRWNgBSDwBmf0QXDABqRZWHG0HCdGZdzEW1AEFltboNk3QdveNTAH1CI34cFgA6OFPzq6XAD0QK2DhkABELlsANbhALULYUD7FPgAl4vYDUZAhEQYrYAN2QOFQWwYqFQEH8eC2ACozFtqXSQsRGfw6YhWUy6BMdgB2ABCAK2IrZNJJykeEK2eDgR3JAElUMpvpLlgKtiFsYgYRCvqq6ZrtTClSrlLshZdRYyKFsqcrHg4tjz%2BZbodbRYhFgBWAUSn3S3bShg%2Bv3KgM7DwakKh/3eiEW4WixZ8hOXFNpwEXJlMBj%2BCC8lNu60oOiDMVbQJSrYcNSJq2iplxABeDyDlcNLfQyAoVP4E3rWetIK2AAlYjSWEwiABPJMiplwF4h32BAOspcx1frrZLr3b%2BOD628Qh2pk4at1lYai%2B7J1r6%2BRoVRnCFwXzj1Lld%2BiPtnBHj0RU3WNfxWaUL1pLYPAAkUMwBD8RwhdACRweYtinWcPyZWlUGXVkcJeFk6Vwr1rw/Z4GAAWREbUIGWAA2XCGS7AcyIbEUKOo6haIY3CiJYmCtk4mjkEQOiPEYl5OS2AS2KHUURycKIZzZKIjDwOQZWQLYMBQ%2BZyJMKj0CYRBlIgJiNzwmScFbVlOOM0yZ3HQYABVkCQvT0FY4tPUMyiHLMvjLP4mz0DsvyAqcic3I81CvMHBDQR8BgUTgWF4XqLYAHd8DSjgjVEmEth7Gs1BlOVjlQOQP3JVA73qvYOFZB8zhWVrMHMqygp0qTmu8%2BD2K2RTkGUrYjjkIxqBpXEdS03cJwM0x/JMsy91ZEjWS7cKlsi2L5jc5y8H69NBpHRRCCZcbJrwD9BlQEAkBmGkGqdZYPAAJXQCappASNoLk48iDPdlbzArYrxvR1KwtJ91VfV0P2tO6HpQdTHTvXcpJA%2BN0b2P6/sEuDBuRx60ZemS8HukB7GoBLTtBBxaH0IwokWhgADEjnQTqGGO90OMMzn0G5vi%2BZLQWuc6xA%2BY/I48FmOhwYS1MATYKZqHYb1uHcNgNGIZB2HBKEwXVdUZJmOY21WLhiDwdQ1amGExDUNRdHYcRuCYZ3XZ1vWDbYbg5BAV27d1h3iAJcI4lscQgA%3D",
        embedType: i % 2 === 0 ? "godbolt" : "colab"
    });
}

// Write the data to days.json
fs.writeFileSync('data/days.json', JSON.stringify(daysData, null, 2));
console.log('Successfully generated days.json with 100 days of data.'); 