import { Intent } from '../types';
import { ActionResult } from './ActionExecutor';

interface PendingDownload {
  content: string;
  filename: string;
  mimeType: string;
  purpose: string;
}

export class UniversalActionExecutor {
  async executeUniversalAction(intent: Intent, userInput: string): Promise<ActionResult> {
    const { category: actionType, domain } = intent;
    
    console.log(`🚀 Executing ${actionType} action for ${domain} domain: "${userInput}"`);

    switch (actionType) {
      case 'create':
        return this.executeCreateAction(domain || 'general', userInput);
      case 'schedule':
        return this.executeScheduleAction(domain || 'general', userInput);
      case 'learn':
        return this.executeLearnAction(domain || 'general', userInput);
      case 'communicate':
        return this.executeCommunicateAction(domain || 'general', userInput);
      case 'analyze':
        return this.executeAnalyzeAction(domain || 'general', userInput);
      case 'organize':
        return this.executeOrganizeAction(domain || 'general', userInput);
      default:
        return this.executeGenericAction(domain || 'general', userInput);
    }
  }

  private async executeCreateAction(domain: string, userInput: string): Promise<ActionResult> {
    const content = this.generateCreativeContent(domain, userInput);
    const filename = `${domain}_${this.getActionName(userInput)}.md`;
    
    this.downloadFile(content, filename, 'text/markdown', `${domain} creation plan and guide`);
    
    return {
      success: true,
      message: `🛠️ Created ${domain} content and downloaded as ${filename}`,
      data: { domain, actionType: 'create' }
    };
  }

  private async executeScheduleAction(domain: string, userInput: string): Promise<ActionResult> {
    const eventData = this.generateEventData(domain, userInput);
    const icsContent = this.generateICSFile(eventData);
    
    this.downloadFile(icsContent, `${domain}_event.ics`, 'text/calendar', `Calendar event file for ${domain} scheduling`);
    
    return {
      success: true,
      message: `📅 Scheduled ${domain} event and created calendar file`,
      data: { domain, actionType: 'schedule', eventData }
    };
  }

  private async executeLearnAction(domain: string, userInput: string): Promise<ActionResult> {
    const studyPlan = this.generateStudyPlan(domain, userInput);
    const resourceFinder = this.generateResourceFinder(domain);
    
    this.downloadFile(studyPlan, `${domain}_study_plan.md`, 'text/markdown', `Study plan and learning guide for ${domain}`);
    this.downloadFile(resourceFinder, `${domain}_resources.html`, 'text/html', `Resource finder with links for ${domain} learning`);
    
    return {
      success: true,
      message: `📚 Created comprehensive ${domain} learning plan with resources`,
      data: { domain, actionType: 'learn' }
    };
  }

  private async executeCommunicateAction(domain: string, userInput: string): Promise<ActionResult> {
    const emailDraft = this.generateEmailDraft(domain, userInput);
    const mailtoLink = `mailto:?subject=${encodeURIComponent(emailDraft.subject)}&body=${encodeURIComponent(emailDraft.body)}`;
    
    window.open(mailtoLink, '_blank');
    
    return {
      success: true,
      message: `💬 Opened ${domain}-focused email draft in your email client`,
      data: { domain, actionType: 'communicate' }
    };
  }

  private async executeAnalyzeAction(domain: string, userInput: string): Promise<ActionResult> {
    const analysisReport = this.generateAnalysisReport(domain, userInput);
    
    this.downloadFile(analysisReport, `${domain}_analysis.md`, 'text/markdown');
    
    return {
      success: true,
      message: `🔍 Generated ${domain} analysis report and downloaded`,
      data: { domain, actionType: 'analyze' }
    };
  }

  private async executeOrganizeAction(domain: string, userInput: string): Promise<ActionResult> {
    const organizationPlan = this.generateOrganizationPlan(domain, userInput);
    
    this.downloadFile(organizationPlan, `${domain}_organization_plan.md`, 'text/markdown');
    
    return {
      success: true,
      message: `📋 Created ${domain} organization plan and downloaded`,
      data: { domain, actionType: 'organize' }
    };
  }

  private async executeGenericAction(domain: string, userInput: string): Promise<ActionResult> {
    const genericPlan = this.generateGenericPlan(domain, userInput);
    
    this.downloadFile(genericPlan, `${domain}_action_plan.md`, 'text/markdown');
    
    return {
      success: true,
      message: `🧠 Generated ${domain} action plan and downloaded`,
      data: { domain, actionType: 'generic' }
    };
  }

  private generateCreativeContent(domain: string, userInput: string): string {
    const templates = {
      programming: `# ${domain} Project Plan\n\n## Overview\n${userInput}\n\n## Technical Stack\n- Choose appropriate framework\n- Set up development environment\n- Plan architecture\n\n## Next Steps\n1. Initialize repository\n2. Set up basic structure\n3. Begin implementation`,
      
      fitness: `# ${domain} Plan\n\n## Goal\n${userInput}\n\n## Workout Structure\n- Warm-up (10 minutes)\n- Main workout (30-45 minutes)\n- Cool-down (10 minutes)\n\n## Progress Tracking\n- Weekly measurements\n- Performance metrics\n- Adjustment schedule`,
      
      cooking: `# ${domain} Recipe Plan\n\n## Inspiration\n${userInput}\n\n## Recipe Development\n- Ingredient research\n- Technique planning\n- Taste testing\n\n## Execution\n1. Gather ingredients\n2. Prep workspace\n3. Follow method\n4. Document results`,
      
      default: `# ${domain} Action Plan\n\n## Your Request\n"${userInput}"\n\n## Recommended Approach\n1. **Research & Discovery**\n   - Gather relevant information\n   - Identify key requirements\n   - Study best practices\n\n2. **Planning & Strategy**\n   - Define clear objectives\n   - Create timeline\n   - Allocate resources\n\n3. **Implementation**\n   - Execute step-by-step\n   - Monitor progress\n   - Adjust as needed\n\n4. **Review & Optimize**\n   - Evaluate results\n   - Document learnings\n   - Plan improvements\n\n## Next Steps\n- [ ] Start with research phase\n- [ ] Set realistic timeline\n- [ ] Begin implementation\n\n## Resources & Tools\n- Online tutorials and guides\n- Community forums\n- Documentation\n- Practice exercises\n\n---\n*Generated by Cognitive OS - Your AI Assistant*`
    };
    
    return templates[domain as keyof typeof templates] || templates.default;
  }

  private generateStudyPlan(domain: string, userInput: string): string {
    return `# ${domain} Study Plan\n\n## Learning Objective\n${userInput}\n\n## Study Schedule\n**Week 1**: Foundation concepts\n**Week 2**: Intermediate topics\n**Week 3**: Advanced applications\n**Week 4**: Practice and review\n\n## Key Topics\n- Core principles\n- Practical applications\n- Common challenges\n- Best practices\n\n## Study Methods\n1. **Read**: Comprehensive materials\n2. **Practice**: Hands-on exercises\n3. **Review**: Regular reinforcement\n4. **Test**: Knowledge validation\n\n## Resources\n- Textbooks and guides\n- Online courses\n- Practice exercises\n- Community forums\n\n---\n*Generated by Cognitive OS Universal Learning System*`;
  }

  private generateResourceFinder(domain: string): string {
    return `<!DOCTYPE html>
<html>
<head>
    <title>${domain} Learning Resources</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; text-transform: capitalize; }
        .resource-section { margin: 20px 0; padding: 15px; background: #ecf0f1; border-radius: 5px; }
        .link { display: inline-block; margin: 5px; padding: 10px 15px; background: #3498db; color: white; text-decoration: none; border-radius: 5px; }
        .link:hover { background: #2980b9; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📚 ${domain} Learning Hub</h1>
        
        <div class="resource-section">
            <h3>🎓 Online Courses</h3>
            <a href="https://www.coursera.org/search?query=${encodeURIComponent(domain)}" class="link" target="_blank">Coursera</a>
            <a href="https://www.udemy.com/courses/search/?q=${encodeURIComponent(domain)}" class="link" target="_blank">Udemy</a>
            <a href="https://www.khanacademy.org/search?search_again=1&q=${encodeURIComponent(domain)}" class="link" target="_blank">Khan Academy</a>
        </div>
        
        <div class="resource-section">
            <h3>📖 Books & Articles</h3>
            <a href="https://www.goodreads.com/search?q=${encodeURIComponent(domain)}" class="link" target="_blank">Goodreads</a>
            <a href="https://scholar.google.com/scholar?q=${encodeURIComponent(domain)}" class="link" target="_blank">Google Scholar</a>
            <a href="https://www.amazon.com/s?k=${encodeURIComponent(domain + ' books')}" class="link" target="_blank">Amazon Books</a>
        </div>
        
        <div class="resource-section">
            <h3>🎥 Video Learning</h3>
            <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(domain + ' tutorial')}" class="link" target="_blank">YouTube</a>
            <a href="https://vimeo.com/search?q=${encodeURIComponent(domain)}" class="link" target="_blank">Vimeo</a>
        </div>
        
        <div class="resource-section">
            <h3>💬 Communities</h3>
            <a href="https://www.reddit.com/search/?q=${encodeURIComponent(domain)}" class="link" target="_blank">Reddit</a>
            <a href="https://discord.com/invite/study" class="link" target="_blank">Study Discord</a>
        </div>
        
        <p><strong>Instructions:</strong> Click any link above to find real resources for ${domain}. Bookmark this page for easy access!</p>
    </div>
</body>
</html>`;
  }

  private generateAnalysisReport(domain: string, userInput: string): string {
    return `# ${domain} Analysis Report\n\n## Analysis Subject\n${userInput}\n\n## Key Findings\n- Primary observations\n- Important patterns\n- Notable trends\n- Critical insights\n\n## Methodology\n- Data collection approach\n- Analysis techniques used\n- Validation methods\n\n## Recommendations\n1. Immediate actions\n2. Short-term improvements\n3. Long-term strategies\n\n## Next Steps\n- Follow-up analysis\n- Implementation plan\n- Success metrics\n\n---\n*Generated by Cognitive OS Analysis Engine*`;
  }

  private generateOrganizationPlan(domain: string, userInput: string): string {
    return `# ${domain} Organization Plan\n\n## Organization Goal\n${userInput}\n\n## Current State Assessment\n- What needs organizing\n- Current challenges\n- Available resources\n\n## Organization Strategy\n1. **Sort**: Categorize items/tasks\n2. **Prioritize**: Rank by importance\n3. **Structure**: Create logical system\n4. **Maintain**: Establish routines\n\n## Implementation Timeline\n- **Phase 1**: Initial sorting (Week 1)\n- **Phase 2**: System creation (Week 2)\n- **Phase 3**: Maintenance setup (Week 3)\n\n## Success Metrics\n- Efficiency improvements\n- Time savings\n- Stress reduction\n\n---\n*Generated by Cognitive OS Organization System*`;
  }

  private generateGenericPlan(domain: string, userInput: string): string {
    return `# ${domain} Action Plan\n\n## Objective\n${userInput}\n\n## Approach\n1. **Research**: Gather relevant information\n2. **Plan**: Develop strategy\n3. **Execute**: Take action\n4. **Review**: Evaluate results\n\n## Key Considerations\n- Available resources\n- Time constraints\n- Success criteria\n- Risk factors\n\n## Next Steps\n- Define specific actions\n- Set timeline\n- Begin implementation\n\n---\n*Generated by Cognitive OS Universal Action System*`;
  }

  private getActionName(input: string): string {
    return input.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 20);
  }

  private generateEventData(domain: string, userInput: string): any {
    return {
      title: `${domain} Event: ${userInput.substring(0, 50)}`,
      description: `Auto-generated ${domain} event from: "${userInput}"`,
      date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      duration: '1 hour'
    };
  }

  private generateICSFile(event: any): string {
    const now = new Date();
    const eventDate = new Date(event.date);
    
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Cognitive OS//Universal Calendar//EN
BEGIN:VEVENT
UID:${Date.now()}@cognitive-os.local
DTSTAMP:${now.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${eventDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${event.title}
DESCRIPTION:${event.description}
END:VEVENT
END:VCALENDAR`;
  }

  private generateEmailDraft(domain: string, userInput: string): any {
    return {
      subject: `${domain} Update: ${userInput.substring(0, 30)}...`,
      body: `Hi,\n\nI wanted to update you regarding ${domain}: ${userInput}\n\nPlease let me know your thoughts.\n\nBest regards,\n[Your name]`
    };
  }

  private downloadFile(content: string, filename: string, mimeType: string, purpose?: string): void {
    // Show what's being downloaded
    console.log(`📁 Preparing download: ${filename}`);
    console.log(`📝 Purpose: ${purpose || 'Generated content'}`);
    console.log(`📄 Type: ${mimeType}`);
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log(`✅ Downloaded: ${filename} - ${purpose || 'Generated content'}`);
  }
}