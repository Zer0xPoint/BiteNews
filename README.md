# BiteNews - Hacker News RSS Reader

## Overview
BiteNews is a modern web application that transforms the Hacker News RSS feed into a clean, user-friendly interface. Built with Cloudflare Workers, it provides real-time access to top stories from Hacker News with enhanced readability and features.

## Features
- Real-time RSS feed parsing
- Clean, modern UI for better readability
- XML to JSON conversion
- Responsive design for all devices
- Fast performance with Cloudflare Workers
- CORS enabled for wide compatibility
- Search and filter capabilities

## Tech Stack
- Cloudflare Workers for serverless deployment
- Node.js (v16+)
- Axios for HTTP requests
- XML2JS for RSS parsing
- Modern HTML/CSS for frontend

## Prerequisites
- Node.js (v16+)
- Cloudflare Wrangler CLI
- Cloudflare Account with Workers enabled

## Setup and Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Zer0xPoint/BiteNews.git
   cd BiteNews
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the variables with your Cloudflare credentials

## Development
Start local development server:
```bash
npm run dev
```
The application will be available at `http://localhost:8787`

## Deployment
Deploy to Cloudflare Workers:
```bash
npm run deploy
```

## API Endpoints
- `GET /`: Serves the main web interface
- `GET /api/feed`: Returns the parsed Hacker News feed in JSON format

## Error Handling
- Comprehensive error handling for network issues
- Fallback content for failed requests
- Detailed error messages in development mode
- 500 status codes with error details for API errors

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is open source and available under the MIT License.
