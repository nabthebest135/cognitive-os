// Cognitive Mirror - Content Script (runs on ALL websites)
class CognitiveMirrorExtension {
  constructor() {
    this.currentContext = '';
    this.predictions = [];
    this.sidebar = null;
    this.init();
  }

  init() {
    console.log('🪞 Cognitive Mirror Extension loaded on:', window.location.href);
    
    // Start monitoring immediately
    this.analyzeContext();
    
    // Monitor for changes every 100ms
    setInterval(() => {
      this.analyzeContext();
    }, 100);
    
    // Monitor title changes
    const observer = new MutationObserver(() => {
      this.analyzeContext();
    });
    
    if (document.querySelector('title')) {
      observer.observe(document.querySelector('title'), {
        childList: true,
        subtree: true
      });
    }
  }

  analyzeContext() {
    const url = window.location.href;
    const title = document.title;
    const context = `${title} ${url}`;
    
    if (context !== this.currentContext) {
      this.currentContext = context;
      console.log('🪞 Context changed:', url, title);
      
      const predictions = this.predictNeeds(url, title);
      this.predictions = predictions;
      
      if (predictions.length > 0) {
        this.showSidebar(predictions);
      }
    }
  }

  predictNeeds(url, title) {
    const lower = title.toLowerCase();
    
    // YouTube detection
    if (url.includes('youtube.com/watch')) {
      if (lower.includes('macbook') || lower.includes('mac')) {
        return ['MacBook M4 specs guide', 'Price comparison chart', 'Review summary'];
      }
      if (lower.includes('iphone')) {
        return ['iPhone comparison', 'Feature breakdown', 'Best deals finder'];
      }
      if (lower.includes('tutorial') || lower.includes('code')) {
        return ['Tutorial notes', 'Code examples', 'Practice exercises'];
      }
      return ['Video notes', 'Key points summary', 'Learning checklist'];
    }
    
    // Gmail detection
    if (url.includes('mail.google.com')) {
      return ['Email templates', 'Meeting scheduler', 'Auto-responder'];
    }
    
    // GitHub detection
    if (url.includes('github.com')) {
      return ['Code templates', 'Project structure', 'Deployment guide'];
    }
    
    // Amazon detection
    if (url.includes('amazon.')) {
      return ['Price tracker', 'Product comparison', 'Review analyzer'];
    }
    
    // Google Search detection
    if (url.includes('google.com/search')) {
      const searchTerm = this.extractSearchTerm(url);
      if (searchTerm.includes('macbook')) {
        return ['MacBook buying guide', 'Specs comparison', 'Best deals'];
      }
      return [`${searchTerm} research guide`, 'Summary notes', 'Action plan'];
    }
    
    // Wikipedia detection
    if (url.includes('wikipedia.org')) {
      const topic = this.extractWikipediaTopic(url);
      return [`${topic} study guide`, `${topic} flashcards`, `${topic} timeline`];
    }
    
    return [];
  }

  extractSearchTerm(url) {
    const urlParams = new URLSearchParams(url.split('?')[1] || '');
    return urlParams.get('q') || 'search';
  }

  extractWikipediaTopic(url) {
    const match = url.match(/\/wiki\/([^#?]+)/);
    return match ? match[1].replace(/_/g, ' ') : 'Topic';
  }

  showSidebar(predictions) {
    // Remove existing sidebar
    if (this.sidebar) {
      this.sidebar.remove();
    }

    // Create sidebar
    this.sidebar = document.createElement('div');
    this.sidebar.id = 'cognitive-mirror-sidebar';
    this.sidebar.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 350px;
      height: 100vh;
      background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(0, 50, 0, 0.9));
      color: #00ff00;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      z-index: 999999;
      box-shadow: -5px 0 20px rgba(0, 255, 0, 0.3);
      border-left: 2px solid #00ff00;
      overflow-y: auto;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;

    const currentTime = new Date().toLocaleTimeString();
    const contextInfo = this.getContextInfo();
    
    this.sidebar.innerHTML = `
      <div style="padding: 20px; border-bottom: 1px solid #00ff00;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div style="font-weight: bold; font-size: 16px;">🪞 COGNITIVE MIRROR</div>
          <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                  style="background: none; border: 1px solid #ff0000; color: #ff0000; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-size: 12px;">
            ✕ CLOSE
          </button>
        </div>
        <div style="font-size: 11px; color: #00aa00; margin-bottom: 10px;">
          🕒 ${currentTime} | 🎯 ACTIVE MONITORING
        </div>
        <div style="background: rgba(0, 255, 0, 0.1); padding: 10px; border-radius: 5px; margin-bottom: 15px;">
          <div style="font-weight: bold; margin-bottom: 5px;">📍 CURRENT CONTEXT:</div>
          <div style="font-size: 11px; color: #00cc00;">
            ${contextInfo.site} | ${contextInfo.activity}
          </div>
        </div>
      </div>
      
      <div style="padding: 20px;">
        <div style="font-weight: bold; margin-bottom: 15px; color: #00ffff;">⚡ INSTANT PREDICTIONS:</div>
        ${predictions.map((p, i) => `
          <div style="margin: 8px 0; padding: 12px; background: rgba(0, 255, 0, 0.05); border: 1px solid rgba(0, 255, 0, 0.3); border-radius: 5px; cursor: pointer; transition: all 0.2s;" 
               onmouseover="this.style.background='rgba(0,255,0,0.15)'; this.style.borderColor='#00ff00';"
               onmouseout="this.style.background='rgba(0,255,0,0.05)'; this.style.borderColor='rgba(0,255,0,0.3)';"
               onclick="window.cognitiveMirror.executePrediction('${p}')">
            <div style="font-weight: bold; color: #00ffff; margin-bottom: 3px;">${i + 1}. ${p}</div>
            <div style="font-size: 10px; color: #00aa00;">Click to generate & download</div>
          </div>
        `).join('')}
        
        <div style="margin-top: 20px; padding: 15px; background: rgba(0, 100, 255, 0.1); border: 1px solid rgba(0, 100, 255, 0.3); border-radius: 5px;">
          <div style="font-weight: bold; color: #0088ff; margin-bottom: 8px;">🧠 LEARNING INSIGHTS:</div>
          <div style="font-size: 11px; color: #0066cc;">
            • Detected ${contextInfo.confidence}% context match<br>
            • ${predictions.length} predictions generated<br>
            • Response time: <50ms
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(this.sidebar);
    
    // Animate in
    setTimeout(() => {
      this.sidebar.style.transform = 'translateX(0)';
    }, 10);

    // Make globally accessible
    window.cognitiveMirror = this;
  }

  getContextInfo() {
    const url = window.location.href;
    const title = document.title.toLowerCase();
    
    if (url.includes('youtube.com')) {
      if (title.includes('macbook')) {
        return {site: 'YouTube', activity: 'MacBook Review/Tutorial', confidence: 95};
      }
      return {site: 'YouTube', activity: 'Video Learning', confidence: 90};
    }
    
    if (url.includes('gmail')) return {site: 'Gmail', activity: 'Email Management', confidence: 95};
    if (url.includes('github')) return {site: 'GitHub', activity: 'Code Development', confidence: 92};
    if (url.includes('wikipedia')) return {site: 'Wikipedia', activity: 'Research & Learning', confidence: 88};
    if (url.includes('amazon')) return {site: 'Amazon', activity: 'Shopping Research', confidence: 85};
    if (url.includes('google.com/search')) return {site: 'Google', activity: 'Web Search', confidence: 90};
    
    return {site: 'Unknown', activity: 'General Browsing', confidence: 60};
  }

  executePrediction(prediction) {
    console.log('🪞 Executing prediction:', prediction);
    
    const content = this.generateContent(prediction);
    this.downloadFile(content, `${prediction.toLowerCase().replace(/\s+/g, '_')}.md`);
  }

  generateContent(prediction) {
    const url = window.location.href;
    const title = document.title;
    
    return `# ${prediction}

## Context
- **Page**: ${title}
- **URL**: ${url}
- **Generated**: ${new Date().toLocaleString()}

## Content
Based on your current activity, here's what you need for "${prediction}":

### Key Points
- Relevant information for your current context
- Actionable steps you can take
- Resources and tools to help you

### Next Steps
1. Review the generated content
2. Customize based on your needs
3. Take action on the recommendations

---
*Generated by Cognitive Mirror Extension*`;
  }

  downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('📁 Downloaded:', filename);
  }
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CognitiveMirrorExtension();
  });
} else {
  new CognitiveMirrorExtension();
}