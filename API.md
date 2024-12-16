# API Documentation

## Overview
This API provides endpoints to fetch Hacker News RSS data, extract titles from the RSS feed, and generate a summary of the news items.

## Endpoints

### 1. `/api/rss`
- **Description**: Fetches and returns the full RSS data.
- **Method**: GET
- **Response**:
  - **Success (200)**: JSON object containing the full RSS data.
  - **Error (500)**: JSON object with an error message.

### 2. `/api/titles`
- **Description**: Fetches and returns only the titles from the RSS data.
- **Method**: GET
- **Response**:
  - **Success (200)**: JSON array containing the titles.
  - **Error (500)**: JSON object with an error message.

### 3. `/api/summary`
- **Description**: Fetches the RSS data, extracts titles, and generates a summary using an AI service.
- **Method**: GET
- **Response**:
  - **Success (200)**: JSON object containing the summary and a timestamp.
  - **Error (500)**: JSON object with an error message.

## Environment Variables
- `API_KEY`: Bearer token for accessing the AI service.
- `HACKER_NEWS_RSS_URL`: URL of the Hacker News RSS feed (default: `https://news.ycombinator.com/rss`).

## Usage
To use the API, you need to deploy it using Cloudflare Workers and set up the necessary environment variables. The `wrangler.toml` file is already configured for deployment.

## Example Requests

### Fetch Full RSS Data
```bash
curl -X GET "http://localhost:8787/api/rss"
```

### Fetch Titles
```bash
curl -X GET "http://localhost:8787/api/titles"
```

### Fetch Summary
```bash
curl -X GET "http://localhost:8787/api/summary"
