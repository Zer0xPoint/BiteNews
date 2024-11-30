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
