import axios from 'axios';
import { parseStringPromise } from 'xml2js';

// 从环境变量获取配置
const createHeaders = (apiKey) => ({
  "Authorization": `Bearer ${apiKey}`
});

// Cache mechanism
let rssCache = {
  data: null,
  timestamp: null,
  CACHE_DURATION: 5 * 60 * 1000  // 5 minutes in milliseconds
};

// Reusable function to fetch and parse RSS data
async function fetchRSSData(env) {
  // Check cache validity
  const now = Date.now();
  if (rssCache.data && rssCache.timestamp && (now - rssCache.timestamp < rssCache.CACHE_DURATION)) {
    return rssCache.data;
  }

  // Fetch and parse new data
  const response = await axios.get('https://news.ycombinator.com/rss');
  const result = await parseStringPromise(response.data);
  const items = Array.isArray(result.rss.channel[0].item) 
    ? result.rss.channel[0].item 
    : [result.rss.channel[0].item];

  // Format items with all necessary information
  const formattedItems = items.map(item => ({
    title: item.title[0],
    link: item.link[0],
    description: item.description[0],
    pubDate: new Date(item.pubDate[0]).toLocaleString(),
    comments: item.comments[0]
  }));

  // Update cache
  rssCache.data = formattedItems;
  rssCache.timestamp = now;

  return formattedItems;
}

// Function to extract only titles from RSS data
function extractTitles(items) {
  return items.map(item => item.title).join('\n');
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle API routes
    if (url.pathname === '/api/rss') {
      try {
        const items = await fetchRSSData(env);
        return new Response(JSON.stringify(items), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    if (url.pathname === '/api/summary') {
      try {
        const items = await fetchRSSData(env);
        const titles = extractTitles(items);
        
        const openaiResponse = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: "gpt-3.5-turbo",
            messages: [{
              role: "system",
              content: "You are a helpful assistant that summarizes Hacker News RSS feeds."
            }, {
              role: "user",
              content: `Please provide a brief summary of the main themes and trends from these Hacker News titles:\n\n${titles}`
            }],
            temperature: 0.7,
            max_tokens: 500
          },
          { headers: createHeaders(env.OPENAI_API_KEY) }
        );
        
        return new Response(JSON.stringify({
          summary: openaiResponse.data.choices[0].message.content,
          timestamp: new Date().toISOString()
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    if (url.pathname === '/api/titles') {
      try {
        const items = await fetchRSSData(env);
        const titles = extractTitles(items);
        return new Response(JSON.stringify(titles), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Return 404 for unknown API routes
    return new Response('Not Found', { status: 404 });
  }
};