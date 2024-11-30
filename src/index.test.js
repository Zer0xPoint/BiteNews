import api from './index.js';
import axios from 'axios';

jest.mock('axios');

describe('api.fetch', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should return a JSON response with items and summary', async () => {
    const mockRssText = `
      <rss version="2.0">
        <channel>
          <item>
            <title>Test Title</title>
            <link>http://example.com</link>
            <description>Test Description</description>
            <pubDate>Mon, 01 Jan 2024 00:00:00 GMT</pubDate>
          </item>
        </channel>
      </rss>
    `;

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        text: () => Promise.resolve(mockRssText)
      })
    );

    const mockSummaryResponse = { 
      data: { 
        result: { 
          response: 'Mocked summary'
        } 
      } 
    };
    axios.post = jest.fn().mockResolvedValue(mockSummaryResponse);

    const request = { method: 'GET' };
    const response = await api.fetch(request);
    
    expect(response.status).toBe(200);
    const responseData = await response.json();
    expect(responseData).toHaveProperty('items');
    expect(responseData.items).toHaveLength(1);
    expect(responseData.items[0]).toEqual({
      title: 'Test Title',
      link: 'http://example.com',
      description: 'Test Description',
      pubDate: 'Mon, 01 Jan 2024 00:00:00 GMT'
    });
    expect(responseData).toHaveProperty('summary');
    expect(global.fetch).toHaveBeenCalledWith('https://news.ycombinator.com/rss');
  });

  it('should handle errors and return a 500 status code', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network error'))
    );

    const request = { method: 'GET' };
    const response = await api.fetch(request);
    
    expect(response.status).toBe(500);
    const responseData = await response.json();
    expect(responseData).toHaveProperty('error');
  });
});
