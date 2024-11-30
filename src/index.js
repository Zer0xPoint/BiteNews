import { parseStringPromise } from 'xml2js';
import axios from 'axios';

// 从环境变量获取配置
const createHeaders = (apiKey) => ({
  "Authorization": `Bearer ${apiKey}`
});

const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RSS Summary</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
            background-color: #f0f0f0;
            display: flex;
            gap: 20px;
        }
        .main-content {
            flex: 2;
        }
        .summary-section {
            flex: 1;
            position: sticky;
            top: 20px;
            height: fit-content;
            min-width: 300px;
        }
        .content-box {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .items-section {
            display: grid;
            gap: 20px;
        }
        .item {
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 8px;
            background-color: white;
            transition: transform 0.2s;
        }
        .item:hover {
            transform: translateY(-2px);
        }
        .error-message {
            color: red;
            padding: 10px;
            background-color: #ffe6e6;
            border-radius: 4px;
            margin: 10px 0;
        }
        .loading {
            text-align: center;
            padding: 20px;
            color: #666;
        }
        .summary-text {
            line-height: 1.6;
        }
        .summary-text strong {
            color: #2c3e50;
            display: block;
            margin-top: 15px;
            margin-bottom: 10px;
            font-size: 1.1em;
        }
        .summary-text • {
            display: block;
            margin-left: 20px;
            margin-top: 5px;
            color: #34495e;
        }
        .summary-timestamp {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #eee;
            font-size: 0.9em;
            color: #666;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .spinner {
            width: 24px;
            height: 24px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 10px auto;
        }
        .retry-button {
            background-color: #4CAF50;
            color: #fff;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .retry-button:hover {
            background-color: #3e8e41;
        }
    </style>
</head>
<body>
    <div class="main-content">
        <div class="content-box">
            <h1>RSS Feed</h1>
            <div id="loading" class="loading">Loading RSS feed...</div>
            <div id="error" class="error-message" style="display: none;"></div>
            <div class="items-section"></div>
        </div>
    </div>
    <div class="summary-section content-box">
        <h2>RSS Summary</h2>
        <div id="summary-content">
            <div class="spinner"></div>
            <div class="loading">Generating summary...</div>
        </div>
    </div>
    <script>
        async function fetchRSSData() {
            const loadingElement = document.getElementById('loading');
            const errorElement = document.getElementById('error');
            const itemsSection = document.querySelector('.items-section');
            
            try {
                loadingElement.style.display = 'block';
                errorElement.style.display = 'none';
                itemsSection.innerHTML = '';
                
                const response = await fetch('/api/rss');
                if (!response.ok) {
                    throw new Error('Failed to fetch RSS data');
                }
                
                const data = await response.json();
                if (!Array.isArray(data)) {
                    throw new Error('Invalid data format received');
                }
                
                data.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'item';
                    itemElement.innerHTML = \`
                        <h3><a href="\${item.link}" target="_blank">\${item.title}</a></h3>
                        <p>\${item.description}</p>
                        <small>\${item.pubDate}</small>
                        <small>Comments: <a href="\${item.comments}" target="_blank">\${item.comments}</a></small>
                    \`;
                    itemsSection.appendChild(itemElement);
                });
                
                loadingElement.style.display = 'none';
                
                // After displaying RSS items, fetch the summary
                fetchSummary();
            } catch (error) {
                console.error('Error fetching RSS data:', error);
                errorElement.textContent = 'Error loading RSS feed: ' + error.message;
                errorElement.style.display = 'block';
                loadingElement.style.display = 'none';
            }
        }
        
        async function fetchSummary() {
            const summaryContent = document.getElementById('summary-content');
            
            try {
                const response = await fetch('/api/summary');
                if (!response.ok) {
                    throw new Error('Failed to fetch summary');
                }
                
                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                
                const summaryText = data.summary || 'No summary available';
                const timestamp = new Date(data.timestamp).toLocaleString();
                
                summaryContent.innerHTML = \`
                    <div class="summary-text">
                        \${summaryText}
                        <div class="summary-timestamp">
                            <small>Generated at: \${timestamp}</small>
                        </div>
                    </div>
                \`;
            } catch (error) {
                console.error('Error fetching summary:', error);
                summaryContent.innerHTML = \`
                    <div class="error-message">
                        Error generating summary: \${error.message}
                        <br>
                        <button onclick="fetchSummary()" class="retry-button">Retry</button>
                    </div>
                \`;
            }
        }
        
        // Fetch data when page loads
        fetchRSSData();
    </script>
</body>
</html>`;

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
  const headers = createHeaders(env.API_KEY);
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
      return new Response(HTML_CONTENT, {
        headers: {
          'Content-Type': 'text/html',
          'Access-Control-Allow-Origin': '*'
        }
      });
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
        return new Response(JSON.stringify({ error: error.message }), {
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
        return new Response(JSON.stringify({ error: error.message }), {
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
        const aiResponse = await axios.post(
          env.API_BASE_URL + '@cf/meta/llama-3.1-8b-instruct',
          {
            messages: [
              { 
                role: "system", 
                content: `Analyze these Hacker News titles and create a structured summary following this format:

# Main Theme 1
- Key point or insight about this theme
- Related titles under this theme

# Main Theme 2
- Key point or insight about this theme
- Related titles under this theme

(Continue for all major themes found. Each theme should have 2-3 related titles. Use markdown formatting.)`
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
          error: error.message,
          details: 'Failed to generate summary',
          timestamp: new Date().toISOString()
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