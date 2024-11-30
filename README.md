# Hacker News RSS Cloudflare Worker

## Overview
This Cloudflare Worker fetches and parses the Hacker News RSS feed, converting it into a JSON format for easy consumption.

## Prerequisites
- Node.js (v16+)
- Cloudflare Wrangler CLI
- Cloudflare Account

## Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Development
- Start local development:
  ```bash
  npm run start
  ```

## Deployment
- Deploy to Cloudflare:
  ```bash
  npm run deploy
  ```

## Features
- Fetches Hacker News RSS feed
- Converts XML to JSON
- Extracts key item details (title, link, description, publication date)
- CORS enabled for wide compatibility

## Usage
The worker exposes an endpoint that returns Hacker News top stories as a JSON array.

## Error Handling
- Catches and returns any fetch or parsing errors
- Returns a 500 status code with error details if something goes wrong
