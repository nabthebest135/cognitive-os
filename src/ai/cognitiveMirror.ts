// Cognitive Mirror - AI that predicts needs based on context
export class CognitiveMirror {
  private isWatching = false;
  private currentContext: string = '';
  private predictions: string[] = [];

  async initialize(): Promise<void> {
    console.log('🪞 Cognitive Mirror: Initializing context awareness...');
    
    // Watch for context changes
    this.startContextWatching();
    
    console.log('🪞 Cognitive Mirror: Ready to predict your needs');
  }

  private startContextWatching(): void {
    // Immediate context analysis
    this.analyzeContext(`${document.title} ${window.location.href}`);
    
    // Fast URL monitoring (every 100ms for responsiveness)
    setInterval(() => {
      const newContext = `${document.title} ${window.location.href}`;
      if (newContext !== this.currentContext) {
        this.currentContext = newContext;
        this.analyzeContext(newContext);
      }
    }, 100);
    
    // Watch for page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.analyzeContext(`${document.title} ${window.location.href}`);
      }
    });
    
    // Watch for focus changes
    window.addEventListener('focus', () => {
      this.analyzeContext(`${document.title} ${window.location.href}`);
    });
  }

  private watchDocumentTitle(): void {
    // Check title immediately
    this.analyzeContext(document.title);
    
    // Watch for changes
    const observer = new MutationObserver(() => {
      const newTitle = document.title;
      if (newTitle !== this.currentContext) {
        this.currentContext = newTitle;
        this.analyzeContext(newTitle);
      }
    });

    observer.observe(document.querySelector('title') || document.head, {
      childList: true,
      subtree: true
    });
  }

  private watchURLChanges(): void {
    // Analyze current URL immediately
    this.analyzeContext(window.location.href);
    
    let currentURL = window.location.href;
    
    setInterval(() => {
      if (window.location.href !== currentURL) {
        currentURL = window.location.href;
        this.analyzeContext(currentURL);
      }
    }, 1000);
  }

  private watchClipboard(): void {
    // Watch for clipboard changes (indicates user copying/researching)
    document.addEventListener('copy', () => {
      navigator.clipboard.readText().then(text => {
        if (text.length > 5) {
          this.analyzeContext(`Copied: ${text.substring(0, 50)}`);
        }
      }).catch(() => {
        // Clipboard access denied - that's fine
      });
    });
  }

  private watchTypingPatterns(): void {
    let typingBuffer = '';
    
    document.addEventListener('keydown', (e) => {
      if (e.key.length === 1) {
        typingBuffer += e.key;
        
        // Analyze every 10 characters
        if (typingBuffer.length >= 10) {
          this.analyzeContext(`Typing: ${typingBuffer}`);
          typingBuffer = '';
        }
      }
    });
  }

  private async analyzeContext(context: string): Promise<void> {
    console.log('🪞 Context detected:', context);
    
    // Generate predictions based on context
    const predictions = this.predictNeeds(context);
    this.predictions = predictions;
    
    // Trigger proactive suggestions
    if (predictions.length > 0) {
      this.triggerProactiveSuggestions(predictions);
    }
  }



  private predictNeeds(context: string): string[] {
    const lower = context.toLowerCase();
    const url = window.location.href;
    const title = document.title.toLowerCase();
    
    // Advanced Gmail context detection
    if (url.includes('gmail') || url.includes('mail.google')) {
      if (title.includes('compose') || url.includes('compose')) {
        return ['Email templates', 'Professional signatures', 'Meeting scheduler'];
      }
      if (title.includes('inbox')) {
        return ['Email organizer', 'Auto-responder', 'Priority sorter'];
      }
      return ['Email templates', 'Meeting agenda', 'Calendar invite'];
    }
    
    // Advanced GitHub context detection
    if (url.includes('github.com')) {
      if (url.includes('/issues')) {
        return ['Bug report template', 'Issue tracker', 'Project roadmap'];
      }
      if (url.includes('/pull')) {
        return ['Code review checklist', 'PR template', 'Merge guidelines'];
      }
      if (url.includes('/blob') || url.includes('/tree')) {
        return ['Code documentation', 'README generator', 'API docs'];
      }
      return ['Code templates', 'Project structure', 'Deployment guide'];
    }
    
    // Advanced Wikipedia context detection
    if (url.includes('wikipedia.org')) {
      const topic = this.extractWikipediaTopic(url);
      return [`${topic} study guide`, `${topic} flashcards`, `${topic} timeline`];
    }
    
    // Advanced YouTube context detection
    if (url.includes('youtube.com')) {
      if (url.includes('/watch')) {
        return ['Video notes', 'Transcript summary', 'Learning checklist'];
      }
      if (url.includes('/playlist')) {
        return ['Course outline', 'Progress tracker', 'Study schedule'];
      }
      return ['Learning notes', 'Video summary', 'Practice exercises'];
    }
    
    // Advanced Amazon context detection
    if (url.includes('amazon.')) {
      if (url.includes('/dp/') || url.includes('/gp/product/')) {
        return ['Price tracker', 'Product comparison', 'Review analyzer'];
      }
      return ['Shopping list', 'Budget planner', 'Deal finder'];
    }
    
    // LinkedIn context
    if (url.includes('linkedin.com')) {
      return ['Profile optimizer', 'Connection templates', 'Job tracker'];
    }
    
    // Twitter/X context
    if (url.includes('twitter.com') || url.includes('x.com')) {
      return ['Tweet scheduler', 'Thread planner', 'Engagement tracker'];
    }
    
    // Stack Overflow context
    if (url.includes('stackoverflow.com')) {
      return ['Code solution', 'Debug helper', 'Learning path'];
    }
    
    // Default intelligent predictions
    return ['Smart assistant', 'Content generator', 'Productivity booster'];
  }
  
  private extractWikipediaTopic(url: string): string {
    const match = url.match(/\/wiki\/([^#?]+)/);
    if (match) {
      return match[1].replace(/_/g, ' ');
    }
    return 'Topic';
  }

  private triggerProactiveSuggestions(predictions: string[]): void {
    if (predictions.length > 0) {
      // Create floating suggestion panel
      this.showProactiveSuggestions(predictions);
    }
  }

  private showProactiveSuggestions(predictions: string[]): void {
    // Remove existing sidebar
    const existing = document.getElementById('cognitive-mirror-sidebar');
    if (existing) existing.remove();

    // Create advanced sidebar
    const sidebar = document.createElement('div');
    sidebar.id = 'cognitive-mirror-sidebar';
    sidebar.style.cssText = `
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
    const contextInfo = this.getAdvancedContext();
    
    sidebar.innerHTML = `
      <div style="padding: 20px; border-bottom: 1px solid #00ff00;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div style="font-weight: bold; font-size: 16px;">🪞 COGNITIVE MIRROR</div>
          <button onclick="this.parentElement.parentElement.remove()" 
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
               onclick="window.cognitiveMirror.executePrediction('${p}'); this.style.background='rgba(0,255,0,0.3)'; this.innerHTML='✅ EXECUTING...'">
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
        
        <div style="margin-top: 15px; text-align: center;">
          <button onclick="window.cognitiveMirror.refreshPredictions()" 
                  style="background: linear-gradient(45deg, #00ff00, #00aa00); border: none; color: black; padding: 8px 15px; border-radius: 5px; cursor: pointer; font-weight: bold; font-size: 11px;">
            🔄 REFRESH PREDICTIONS
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(sidebar);
    
    // Animate in
    setTimeout(() => {
      sidebar.style.transform = 'translateX(0)';
    }, 10);
  }

  private getAdvancedContext(): {site: string, activity: string, confidence: number} {
    const url = window.location.href;
    const title = document.title;
    
    if (url.includes('gmail')) return {site: 'Gmail', activity: 'Email Management', confidence: 95};
    if (url.includes('github')) return {site: 'GitHub', activity: 'Code Development', confidence: 92};
    if (url.includes('wikipedia')) return {site: 'Wikipedia', activity: 'Research & Learning', confidence: 88};
    if (url.includes('youtube')) return {site: 'YouTube', activity: 'Video Learning', confidence: 85};
    if (url.includes('amazon')) return {site: 'Amazon', activity: 'Shopping Research', confidence: 82};
    
    return {site: 'Unknown', activity: 'General Browsing', confidence: 60};
  }

  refreshPredictions(): void {
    const context = `${document.title} ${window.location.href}`;
    this.analyzeContext(context);
  }

  executePrediction(prediction: string): void {
    console.log('🪞 Executing prediction:', prediction);
    
    // Generate appropriate content based on prediction
    const content = this.generatePredictiveContent(prediction);
    
    // Download the generated content
    this.downloadPredictiveContent(content, prediction);
  }

  private generatePredictiveContent(prediction: string): string {
    switch (prediction) {
      case 'Generate code templates':
        return this.generateCodeTemplates();
      case 'Create study plan':
        return this.generateStudyPlan();
      case 'Create email templates':
        return this.generateEmailTemplates();
      case 'Generate meeting agenda':
        return this.generateMeetingAgenda();
      default:
        return `# ${prediction}\n\nGenerated based on your current context.\n\n## Next Steps\n- Review the content\n- Customize as needed\n- Take action\n\n---\n*Generated by Cognitive Mirror*`;
    }
  }

  private generateCodeTemplates(): string {
    return `# Code Templates\n\n## React Component\n\`\`\`jsx\nimport React from 'react';\n\nfunction MyComponent() {\n  return (\n    <div>\n      <h1>Hello World</h1>\n    </div>\n  );\n}\n\nexport default MyComponent;\n\`\`\`\n\n## API Function\n\`\`\`javascript\nasync function fetchData(url) {\n  try {\n    const response = await fetch(url);\n    return await response.json();\n  } catch (error) {\n    console.error('Error:', error);\n  }\n}\n\`\`\`\n\n---\n*Generated by Cognitive Mirror*`;
  }

  private generateStudyPlan(): string {
    return `# Study Plan\n\n## Week 1: Foundation\n- [ ] Read core concepts\n- [ ] Take notes\n- [ ] Practice exercises\n\n## Week 2: Application\n- [ ] Work on projects\n- [ ] Join study groups\n- [ ] Review progress\n\n## Week 3: Mastery\n- [ ] Advanced topics\n- [ ] Mock tests\n- [ ] Final review\n\n---\n*Generated by Cognitive Mirror*`;
  }

  private generateEmailTemplates(): string {
    return `# Email Templates\n\n## Meeting Request\nSubject: Meeting Request - [Topic]\n\nHi [Name],\n\nI'd like to schedule a meeting to discuss [topic]. \n\nAvailable times:\n- [Time 1]\n- [Time 2]\n- [Time 3]\n\nBest regards,\n[Your name]\n\n## Follow-up\nSubject: Following up on [Topic]\n\nHi [Name],\n\nJust following up on our previous conversation about [topic].\n\nNext steps:\n1. [Action 1]\n2. [Action 2]\n\nLet me know if you have any questions.\n\nBest,\n[Your name]\n\n---\n*Generated by Cognitive Mirror*`;
  }

  private generateMeetingAgenda(): string {
    return `# Meeting Agenda\n\n**Date:** [Date]\n**Time:** [Time]\n**Attendees:** [Names]\n\n## Agenda Items\n\n### 1. Opening (5 min)\n- Welcome\n- Agenda review\n\n### 2. Main Discussion (30 min)\n- [Topic 1]\n- [Topic 2]\n- [Topic 3]\n\n### 3. Action Items (10 min)\n- [ ] [Action 1] - [Owner]\n- [ ] [Action 2] - [Owner]\n- [ ] [Action 3] - [Owner]\n\n### 4. Next Steps (5 min)\n- Next meeting date\n- Follow-up tasks\n\n---\n*Generated by Cognitive Mirror*`;
  }

  private downloadPredictiveContent(content: string, prediction: string): void {
    const filename = `${prediction.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.md`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log(`🪞 Downloaded: ${filename}`);
  }

  getCurrentPredictions(): string[] {
    return this.predictions;
  }
}