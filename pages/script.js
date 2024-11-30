// 根据当前环境确定API地址
const getApiBaseUrl = () => {
    // 检查是否在本地开发环境
    const isLocalhost = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
    
    // 如果是本地开发环境，使用本地worker地址
    if (isLocalhost) {
        return 'http://localhost:8787';
    }
    
    // 生产环境使用相对路径，会自动指向部署的worker地址
    return '';
};

const WORKERS_API = getApiBaseUrl();

async function fetchRSSData() {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const itemsSection = document.querySelector('.items-section');
    
    try {
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';
        itemsSection.innerHTML = '';
        
        console.log('Fetching RSS data from:', `${WORKERS_API}/api/rss`);
        const response = await fetch(`${WORKERS_API}/api/rss`);
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers));
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response body:', errorText);
            throw new Error(`Failed to fetch RSS data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Received data type:', typeof data);
        console.log('Is array?', Array.isArray(data));
        
        if (!Array.isArray(data)) {
            console.error('Invalid data received:', data);
            throw new Error('Invalid data format received');
        }
        
        data.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item';
            itemElement.innerHTML = `
                <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                <p>${item.description}</p>
                <small>${item.pubDate}</small>
                <small>Comments: <a href="${item.comments}" target="_blank">${item.comments}</a></small>
            `;
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
        const response = await fetch(`${WORKERS_API}/api/summary`);
        if (!response.ok) {
            throw new Error('Failed to fetch summary');
        }
        
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }
        
        const summaryText = data.summary || 'No summary available';
        const timestamp = new Date(data.timestamp).toLocaleString();
        
        summaryContent.innerHTML = `
            <div class="summary-text">
                ${summaryText}
                <div class="summary-timestamp">
                    <small>Generated at: ${timestamp}</small>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching summary:', error);
        summaryContent.innerHTML = `
            <div class="error-message">
                Error loading summary: ${error.message}
                <br>
                <button class="retry-button" onclick="fetchSummary()">Retry</button>
            </div>
        `;
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', fetchRSSData);
