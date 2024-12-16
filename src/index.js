import { parseStringPromise } from 'xml2js';
import axios from 'axios';

// 从环境变量获取配置
const createHeaders = (apiKey) => ({
  "Authorization": `Bearer ${apiKey}`
});

// Cache mechanism
let rssCache = {
  data: null,
  timestamp: null,
  expirationTime: 5 * 60 * 1000 // 5 minutes
};

// Reusable function to fetch and parse RSS data
async function fetchRSSData(env) {
  // Check cache validity
  const now = Date.now();
  if (rssCache.data && rssCache.timestamp && (now - rssCache.timestamp < rssCache.expirationTime)) {
    return rssCache.data;
  }

  // Fetch and parse new data
  const headers = createHeaders(env.API_KEY);
  try {
    const response = await axios.get(env.HACKER_NEWS_RSS_URL, { headers });
    const rssText = await response.data;
    const parsedRss = await parseStringPromise(rssText, {
      explicitArray: false,
      trim: true
    });

    const items = Array.isArray(parsedRss.rss.channel.item) 
      ? parsedRss.rss.channel.item 
      : [parsedRss.rss.channel.item];

    // Format items with all necessary information
    const formattedItems = items.map(item => ({
      title: item.title,
      link: item.link,
      description: item.description,
      pubDate: new Date(item.pubDate).toLocaleString(),
      comments: item.comments
    }));

    // Update cache
    rssCache.data = formattedItems;
    rssCache.timestamp = now;

    return formattedItems;
  } catch (error) {
    console.error('Error fetching RSS data:', error);
    throw new Error('Failed to fetch RSS data');
  }
}

// Function to extract only titles from RSS data
function extractTitles(items) {
  return items.map(item => item.title);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname === '/' || pathname === '/api/test') {
      // Redirect to the static page served by Cloudflare Pages
      return Response.redirect('/', 302);
    }

    if (pathname === '/api/rss') {
      try {
        const items = await fetchRSSData(env);
        return new Response(JSON.stringify(items), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (error) {
        console.error('Error fetching RSS:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch RSS data' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    if (pathname === '/api/titles') {
      try {
        const items = await fetchRSSData(env);
        const titles = extractTitles(items);
        return new Response(JSON.stringify(titles), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (error) {
        console.error('Error fetching titles:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch titles' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    if (pathname === '/api/summary') {
      try {
        const items = await fetchRSSData(env);
        const titles = extractTitles(items);

        const headers = createHeaders(env.API_KEY);
        try {
          const aiResponse = await axios.post(
            env.API_BASE_URL + '@cf/meta/llama-3.2-3b-instruct',
            {
              messages: [
                { 
                  role: "system", 
                  content: `Analyze these Hacker News titles and create a structured summary following this markdown format:

                  (Summary all the titles in 2-3 sentences here)

# Categories

## Technology & Software
- Headline 1
- Headline 2

## Science & Space
- Headline 3
- Headline 4

## Automotive & AI
- Headline 5
- Headline 6

## History & Archaeology
- Headline 7
- Headline 8

## Business & Legal
- Headline 9
- Headline 10

## Arts & Culture
- Headline 11
- Headline 12

(Each Categories should have 2-3 related titles. Use markdown formatting.)`
                },
                { 
                  role: "user", 
                  content: titles.join("\n")
                }
              ]
            },
            { headers }
          );

          let summaryText;
          if (aiResponse.data && aiResponse.data.result && aiResponse.data.result.response) {
            summaryText = aiResponse.data.result.response;
          } else if (typeof aiResponse.data === 'string') {
            summaryText = aiResponse.data;
          } else {
            console.error('Unexpected AI response:', JSON.stringify(aiResponse.data, null, 2));
            throw new Error('Unable to generate summary. Unexpected API response format.');
          }

          // Convert markdown to HTML with specific formatting
          summaryText = summaryText
            .replace(/^# (.*$)/gm, '<h2>$1</h2>') // Convert headers
            .replace(/^- (.*$)/gm, '<li>$1</li>') // Convert list items
            .replace(/\n\n/g, '</ul><ul>') // Separate lists
            .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>') // Wrap lists in ul tags
            .replace(/<\/ul><ul>/g, '') // Clean up adjacent lists
            .replace(/\n/g, ''); // Remove remaining newlines

          return new Response(JSON.stringify({ 
            summary: summaryText,
            timestamp: new Date().toISOString()
          }), {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        } catch (error) {
          console.error('Summary generation error:', error);
          return new Response(JSON.stringify({ 
            error: 'Failed to generate summary',
            details: 'Unexpected API response format',
            timestamp: new Date().toISOString()
          }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
      } catch (error) {
        console.error('Error fetching RSS:', error);
        return new Response(JSON.stringify({ 
          error: 'Failed to fetch RSS data' 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    return new Response('Not Found', { status: 404 });
  }
};
