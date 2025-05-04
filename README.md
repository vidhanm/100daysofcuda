# 100 Days of CUDA

A website for tracking your progress through 100 days of CUDA programming challenges.

## Features

- Clean, responsive design with dark/light mode toggle
- 100 daily CUDA programming challenges
- Interactive code environments via Compiler Explorer (Godbolt) and Google Colab
- Mobile-friendly interface

## Project Structure

```
├── index.html          # Home page
├── css/
│   └── styles.css      # Main stylesheet
├── js/
│   └── app.js          # JavaScript functionality
├── days/               # Individual day pages
│   ├── day-01.html
│   ├── day-02.html
│   └── ...
├── assets/             # Images, icons, etc.
│   ├── favicon.svg
│   ├── sun.svg
│   ├── moon.svg
│   └── colab-badge.svg
├── data/
│   └── days.json       # Challenge data for all 100 days
└── vercel.json         # Vercel deployment configuration
```

## Local Development

To run this site locally:

1. Clone the repository
2. Open the project folder in your preferred code editor
3. Start a local development server using one of these methods:
   - **Using the included Node.js server**: Run `node server.js` and visit http://localhost:3000
   - Using Node.js: `npx serve` (requires Node.js to be installed)
   - Using Python: `python -m http.server`
   - Using PHP: `php -S localhost:8000`
   - Or any other local server of your choice

> **Important Note**: It's recommended to access the site through a local web server rather than opening the HTML files directly. This ensures that file paths work correctly and prevents CORS issues when loading the JSON data.

## Deployment

This site is configured for easy deployment to Vercel. To deploy:

1. Fork or clone this repository to your GitHub account
2. Sign up for a [Vercel](https://vercel.com) account
3. Import your GitHub repository in Vercel
4. No additional configuration needed - the `vercel.json` file handles all settings

## Customization

### Adding or Modifying Challenges

Edit the `data/days.json` file to add, remove, or modify challenges. Each challenge has the following structure:

```json
{
  "id": "01",
  "title": "Vector Addition",
  "description": "Description of the challenge",
  "codeStubUrl": "https://godbolt.org/z/example",
  "embedType": "godbolt" // or "colab"
}
```

### Styling

The site uses CSS custom properties (variables) for theming. Edit the `:root` and `[data-theme="dark"]` sections in `css/styles.css` to customize colors.

## Technology Stack

- HTML5
- CSS3 (with custom properties for theming)
- Vanilla JavaScript (ES6+)
- No frameworks or libraries required

## License

MIT License - feel free to use, modify, and distribute this code for personal or commercial projects. 