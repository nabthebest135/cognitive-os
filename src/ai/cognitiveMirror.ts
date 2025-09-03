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
    // Watch document title changes (indicates new page/app)
    this.watchDocumentTitle();
    
    // Watch URL changes
    this.watchURLChanges();
    
    // Watch clipboard for context clues
    this.watchClipboard();
    
    // Watch typing patterns
    this.watchTypingPatterns();
  }

  private watchDocumentTitle(): void {
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

  private analyzeContext(context: string): void {
    console.log('🪞 Context detected:', context);
    
    const predictions = this.predictNeeds(context);
    this.predictions = predictions;
    
    // Trigger proactive suggestions
    this.triggerProactiveSuggestions(predictions);
  }

  private predictNeeds(context: string): string[] {
    const lower = context.toLowerCase();
    const predictions: string[] = [];

    // Coding context
    if (lower.includes('github') || lower.includes('vscode') || lower.includes('code')) {
      predictions.push('Generate code templates');
      predictions.push('Create debugging checklist');
      predictions.push('Setup deployment guide');
    }

    // Research context
    if (lower.includes('wikipedia') || lower.includes('research') || lower.includes('study')) {
      predictions.push('Create study plan');
      predictions.push('Generate summary notes');
      predictions.push('Find related resources');
    }

    // Email context
    if (lower.includes('gmail') || lower.includes('email') || lower.includes('mail')) {
      predictions.push('Create email templates');
      predictions.push('Generate meeting agenda');
      predictions.push('Setup calendar invite');
    }

    // Shopping context
    if (lower.includes('amazon') || lower.includes('shop') || lower.includes('buy')) {
      predictions.push('Create comparison chart');
      predictions.push('Generate budget tracker');
      predictions.push('Find better deals');
    }

    // Learning context
    if (lower.includes('youtube') || lower.includes('tutorial') || lower.includes('learn')) {
      predictions.push('Create learning notes');
      predictions.push('Generate practice exercises');
      predictions.push('Build progress tracker');
    }

    return predictions;
  }

  private triggerProactiveSuggestions(predictions: string[]): void {
    if (predictions.length > 0) {
      // Create floating suggestion panel
      this.showProactiveSuggestions(predictions);
    }
  }

  private showProactiveSuggestions(predictions: string[]): void {
    // Remove existing suggestions
    const existing = document.getElementById('cognitive-mirror-suggestions');
    if (existing) existing.remove();

    // Create new suggestion panel
    const panel = document.createElement('div');
    panel.id = 'cognitive-mirror-suggestions';
    panel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.9);
      color: #00ff00;
      padding: 15px;
      border-radius: 10px;
      border: 1px solid #00ff00;
      font-family: monospace;
      font-size: 12px;
      z-index: 10000;
      max-width: 300px;
      box-shadow: 0 4px 20px rgba(0, 255, 0, 0.3);
    `;

    panel.innerHTML = `
      <div style="margin-bottom: 10px; font-weight: bold;">
        🪞 Cognitive Mirror Predictions:
      </div>
      ${predictions.map(p => `
        <div style="margin: 5px 0; cursor: pointer; padding: 5px; border-radius: 3px;" 
             onmouseover="this.style.background='rgba(0,255,0,0.2)'"
             onmouseout="this.style.background='transparent'"
             onclick="window.cognitiveMirror.executePrediction('${p}')">
          • ${p}
        </div>
      `).join('')}
      <div style="margin-top: 10px; text-align: right;">
        <button onclick="this.parentElement.remove()" 
                style="background: none; border: 1px solid #00ff00; color: #00ff00; padding: 2px 8px; border-radius: 3px; cursor: pointer;">
          ✕
        </button>
      </div>
    `;

    document.body.appendChild(panel);

    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (panel.parentElement) panel.remove();
    }, 10000);
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