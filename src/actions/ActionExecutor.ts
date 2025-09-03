import { Intent } from '../types';

export interface ActionResult {
  success: boolean;
  message: string;
  data?: any;
}

export class ActionExecutor {
  async executeAction(intent: Intent, userInput: string): Promise<ActionResult> {
    console.log(`🚀 Executing ${intent.category} action for: "${userInput}"`);

    switch (intent.category) {
      case 'planning':
        return this.executePlanningAction(intent, userInput);
      case 'research':
        return this.executeResearchAction(intent, userInput);
      case 'coding':
        return this.executeCodingAction(intent, userInput);
      case 'communication':
        return this.executeCommunicationAction(intent, userInput);
      case 'creative':
        return this.executeCreativeAction(intent, userInput);
      default:
        return { success: false, message: 'Unknown action type' };
    }
  }

  private async executeResearchAction(intent: Intent, userInput: string): Promise<ActionResult> {
    // Extract topic from input using smart parsing
    const topic = this.extractTopicFromInput(userInput);
    console.log(`📚 Detected topic: ${topic}`);
    
    // Generate comprehensive study plan
    const studyPlan = this.generateUniversalStudyPlan(topic, userInput);
    const studyGuide = this.createStudyGuide(studyPlan);
    
    // Download study plan
    this.downloadFile(studyGuide, `${topic.replace(/\s+/g, '_')}_study_plan.md`, 'text/markdown');
    
    // Create resource finder
    const resourceFinder = this.createResourceFinder(topic);
    this.downloadFile(resourceFinder, `${topic.replace(/\s+/g, '_')}_resources.html`, 'text/html');

    return {
      success: true,
      message: `📚 Complete study system for ${topic} created. Downloaded study plan + resource finder.`,
      data: { topic, studyPlan }
    };
  }

  private async executePlanningAction(intent: Intent, userInput: string): Promise<ActionResult> {
    const people = intent.entities?.filter(e => e.type === 'person') || [];
    const dates = intent.entities?.filter(e => e.type === 'date') || [];
    const times = intent.entities?.filter(e => e.type === 'time') || [];

    const eventData = {
      title: this.generateEventTitle(userInput, people),
      date: dates[0]?.value || 'tomorrow',
      time: times[0]?.value || '2:00 PM',
      attendees: people.map(p => p.value),
      description: `Auto-generated from: "${userInput}"`
    };

    const icsContent = this.generateICSFile(eventData);
    this.downloadFile(icsContent, `${eventData.title.replace(/\s+/g, '_')}.ics`, 'text/calendar');

    return {
      success: true,
      message: `📅 Calendar event "${eventData.title}" created and ready for import.`,
      data: eventData
    };
  }

  private async executeCodingAction(intent: Intent, userInput: string): Promise<ActionResult> {
    const projectName = this.extractProjectName(userInput);
    const tech = this.extractTechnology(userInput);
    
    const projectStructure = this.generateProjectStructure(projectName, tech, userInput);
    this.downloadFile(projectStructure, `${projectName}_setup.md`, 'text/markdown');

    return {
      success: true,
      message: `💻 ${projectName} project setup with ${tech} configuration downloaded.`,
      data: { projectName, tech }
    };
  }

  private async executeCommunicationAction(intent: Intent, userInput: string): Promise<ActionResult> {
    const people = intent.entities?.filter(e => e.type === 'person') || [];
    const recipient = people[0]?.value || this.extractRecipient(userInput);

    const emailDraft = this.generateEmailDraft(recipient, userInput);
    const mailtoLink = `mailto:?subject=${encodeURIComponent(emailDraft.subject)}&body=${encodeURIComponent(emailDraft.body)}`;
    
    window.open(mailtoLink, '_blank');

    return {
      success: true,
      message: `💬 Email draft for ${recipient} opened in your email client.`,
      data: { recipient, emailDraft }
    };
  }

  private async executeCreativeAction(intent: Intent, userInput: string): Promise<ActionResult> {
    const project = this.extractCreativeProject(userInput);
    
    const creativeBrief = this.generateCreativeBrief(project, userInput);
    this.downloadFile(creativeBrief, `${project.replace(/\s+/g, '_')}_creative_brief.md`, 'text/markdown');

    return {
      success: true,
      message: `🎨 Creative brief for ${project} generated and downloaded.`,
      data: { project }
    };
  }

  // Universal topic extraction - handles ANY subject/domain
  private extractTopicFromInput(input: string): string {
    const lowerInput = input.toLowerCase();
    
    // Academic subjects
    const subjects = [
      'chemistry', 'physics', 'biology', 'mathematics', 'math', 'calculus', 'algebra',
      'history', 'english', 'literature', 'psychology', 'sociology', 'economics',
      'computer science', 'programming', 'engineering', 'medicine', 'law',
      'philosophy', 'art', 'music', 'geography', 'geology', 'astronomy',
      'statistics', 'finance', 'accounting', 'marketing', 'business'
    ];
    
    // Professional domains
    const domains = [
      'project management', 'data science', 'machine learning', 'artificial intelligence',
      'cybersecurity', 'networking', 'database', 'web development', 'mobile development',
      'graphic design', 'ux design', 'ui design', 'digital marketing', 'seo',
      'content writing', 'copywriting', 'photography', 'video editing'
    ];
    
    // Check for exact matches
    for (const subject of [...subjects, ...domains]) {
      if (lowerInput.includes(subject)) {
        return subject;
      }
    }
    
    // Extract from common patterns
    if (lowerInput.includes('exam')) {
      const examMatch = lowerInput.match(/(\w+)\s+exam/);
      if (examMatch) return examMatch[1];
    }
    
    if (lowerInput.includes('study')) {
      const studyMatch = lowerInput.match(/study\s+(?:for\s+)?(\w+)/);
      if (studyMatch) return studyMatch[1];
    }
    
    // Default to general study
    return 'general study';
  }

  // Universal study plan generator
  private generateUniversalStudyPlan(topic: string, input: string): any {
    const isExam = input.includes('exam');
    const isAdvanced = input.includes('advanced') || input.includes('graduate');
    const isBeginner = input.includes('beginner') || input.includes('intro');
    
    // Generate chapters based on topic
    const chapters = this.generateChapters(topic, isAdvanced, isBeginner);
    const resources = this.generateResources(topic);
    const timeline = isExam ? '1-2 weeks intensive' : '4-8 weeks comprehensive';
    
    return {
      topic,
      level: isAdvanced ? 'Advanced' : isBeginner ? 'Beginner' : 'Intermediate',
      chapters,
      resources,
      timeline,
      studyMethod: isExam ? 'exam-focused' : 'comprehensive learning'
    };
  }

  private generateChapters(topic: string, isAdvanced: boolean, isBeginner: boolean): string[] {
    const topicLower = topic.toLowerCase();
    
    // Subject-specific chapters
    const chapterMap: { [key: string]: string[] } = {
      chemistry: ['Atomic Structure', 'Chemical Bonding', 'Thermodynamics', 'Kinetics', 'Equilibrium', 'Organic Chemistry'],
      physics: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Optics', 'Quantum Physics', 'Relativity'],
      mathematics: ['Algebra', 'Calculus', 'Geometry', 'Statistics', 'Linear Algebra', 'Differential Equations'],
      biology: ['Cell Biology', 'Genetics', 'Evolution', 'Ecology', 'Physiology', 'Molecular Biology'],
      history: ['Ancient History', 'Medieval Period', 'Renaissance', 'Modern Era', 'Contemporary History'],
      psychology: ['Cognitive Psychology', 'Behavioral Psychology', 'Developmental Psychology', 'Social Psychology'],
      'computer science': ['Programming Fundamentals', 'Data Structures', 'Algorithms', 'Database Systems', 'Software Engineering'],
      economics: ['Microeconomics', 'Macroeconomics', 'International Economics', 'Economic Theory', 'Econometrics']
    };
    
    // Find matching chapters
    for (const [subject, chapters] of Object.entries(chapterMap)) {
      if (topicLower.includes(subject)) {
        return isAdvanced ? chapters : chapters.slice(0, 4);
      }
    }
    
    // Generic chapters for any topic
    const level = isAdvanced ? 'Advanced' : isBeginner ? 'Basic' : 'Intermediate';
    return [
      `${level} ${topic} Fundamentals`,
      `${topic} Core Concepts`,
      `${topic} Applications`,
      `${topic} Problem Solving`,
      `Advanced ${topic} Topics`
    ];
  }

  private generateResources(topic: string): string[] {
    return [
      `Khan Academy ${topic}`,
      `YouTube ${topic} tutorials`,
      `Coursera ${topic} courses`,
      `MIT OpenCourseWare ${topic}`,
      `${topic} textbooks and PDFs`,
      `${topic} practice problems`,
      `${topic} research papers`,
      `Online ${topic} communities`
    ];
  }

  private createStudyGuide(plan: any): string {
    return `# ${plan.topic} Study Plan

## Overview
- **Level**: ${plan.level}
- **Timeline**: ${plan.timeline}
- **Method**: ${plan.studyMethod}
- **Focus**: Complete ${plan.topic} mastery

## Learning Path
${plan.chapters.map((chapter: string, index: number) => `${index + 1}. **${chapter}**`).join('\n')}

## Resources
${plan.resources.map((resource: string) => `- 🔗 ${resource}`).join('\n')}

## Study Strategy
1. **Foundation**: Start with core concepts
2. **Practice**: Apply knowledge through exercises
3. **Review**: Reinforce weak areas
4. **Test**: Validate understanding
5. **Advance**: Move to complex topics

## Next Steps
1. Download the resource finder (HTML file)
2. Set up your study schedule
3. Begin with: ${plan.chapters[0]}
4. Track your progress daily

---
*Generated by Cognitive OS - Universal Learning Assistant*`;
  }

  private createResourceFinder(topic: string): string {
    return `<!DOCTYPE html>
<html>
<head>
    <title>${topic} Resource Hub</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
        .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; color: white; margin-bottom: 40px; }
        .header h1 { font-size: 3em; margin: 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
        .header p { font-size: 1.2em; opacity: 0.9; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; }
        .section { background: white; border-radius: 15px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        .section h3 { color: #333; margin-top: 0; font-size: 1.5em; }
        .link { display: inline-block; margin: 8px; padding: 12px 20px; background: linear-gradient(45deg, #667eea, #764ba2); color: white; text-decoration: none; border-radius: 25px; transition: transform 0.2s; }
        .link:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
        .footer { text-align: center; color: white; margin-top: 40px; opacity: 0.8; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📚 ${topic} Resource Hub</h1>
            <p>Your complete learning ecosystem for ${topic}</p>
        </div>
        
        <div class="grid">
            <div class="section">
                <h3>📖 Free Textbooks & Materials</h3>
                <a href="https://openstax.org/subjects" class="link" target="_blank">OpenStax Textbooks</a>
                <a href="https://libgen.is/search.php?req=${encodeURIComponent(topic)}" class="link" target="_blank">Library Genesis</a>
                <a href="https://archive.org/search.php?query=${encodeURIComponent(topic)}" class="link" target="_blank">Internet Archive</a>
                <a href="https://www.gutenberg.org/ebooks/search/?query=${encodeURIComponent(topic)}" class="link" target="_blank">Project Gutenberg</a>
            </div>
            
            <div class="section">
                <h3>🎥 Video Learning</h3>
                <a href="https://www.khanacademy.org/search?search_again=1&q=${encodeURIComponent(topic)}" class="link" target="_blank">Khan Academy</a>
                <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(topic + ' tutorial')}" class="link" target="_blank">YouTube Tutorials</a>
                <a href="https://ocw.mit.edu/search/?q=${encodeURIComponent(topic)}" class="link" target="_blank">MIT OpenCourseWare</a>
                <a href="https://www.coursera.org/search?query=${encodeURIComponent(topic)}" class="link" target="_blank">Coursera</a>
            </div>
            
            <div class="section">
                <h3>🧠 Practice & Testing</h3>
                <a href="https://quizlet.com/search?query=${encodeURIComponent(topic)}" class="link" target="_blank">Quizlet Flashcards</a>
                <a href="https://www.wolframalpha.com/examples/${encodeURIComponent(topic.toLowerCase())}" class="link" target="_blank">Wolfram Alpha</a>
                <a href="https://www.khanacademy.org/search?search_again=1&q=${encodeURIComponent(topic + ' practice')}" class="link" target="_blank">Practice Problems</a>
            </div>
            
            <div class="section">
                <h3>🔬 Research & Papers</h3>
                <a href="https://scholar.google.com/scholar?q=${encodeURIComponent(topic)}" class="link" target="_blank">Google Scholar</a>
                <a href="https://www.researchgate.net/search?q=${encodeURIComponent(topic)}" class="link" target="_blank">ResearchGate</a>
                <a href="https://arxiv.org/search/?query=${encodeURIComponent(topic)}" class="link" target="_blank">arXiv Papers</a>
                <a href="https://www.jstor.org/action/doBasicSearch?Query=${encodeURIComponent(topic)}" class="link" target="_blank">JSTOR</a>
            </div>
            
            <div class="section">
                <h3>💬 Communities & Help</h3>
                <a href="https://www.reddit.com/search/?q=${encodeURIComponent(topic)}" class="link" target="_blank">Reddit Communities</a>
                <a href="https://stackoverflow.com/search?q=${encodeURIComponent(topic)}" class="link" target="_blank">Stack Overflow</a>
                <a href="https://discord.com/invite/study" class="link" target="_blank">Study Discord</a>
            </div>
            
            <div class="section">
                <h3>🛠️ Tools & Apps</h3>
                <a href="https://www.notion.so/" class="link" target="_blank">Notion (Notes)</a>
                <a href="https://anki.com/" class="link" target="_blank">Anki (Flashcards)</a>
                <a href="https://www.wolframalpha.com/" class="link" target="_blank">Wolfram Alpha</a>
                <a href="https://www.desmos.com/" class="link" target="_blank">Desmos Calculator</a>
            </div>
        </div>
        
        <div class="footer">
            <p>🧠 Generated by Cognitive OS | Your AI Learning Assistant</p>
            <p>Bookmark this page for instant access to ${topic} resources!</p>
        </div>
    </div>
</body>
</html>`;
  }

  // Helper methods for other actions
  private extractProjectName(input: string): string {
    const patterns = [
      /create\s+(\w+)\s+project/i,
      /build\s+(\w+)\s+app/i,
      /new\s+(\w+)/i
    ];
    
    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) return match[1];
    }
    
    return 'new-project';
  }

  private extractTechnology(input: string): string {
    const techs = ['react', 'vue', 'angular', 'node', 'python', 'java', 'typescript', 'javascript'];
    const lowerInput = input.toLowerCase();
    
    for (const tech of techs) {
      if (lowerInput.includes(tech)) return tech;
    }
    
    return 'general';
  }

  private extractRecipient(input: string): string {
    if (input.includes('client')) return 'client';
    if (input.includes('team')) return 'team';
    if (input.includes('manager')) return 'manager';
    return 'recipient';
  }

  private extractCreativeProject(input: string): string {
    if (input.includes('logo')) return 'logo design';
    if (input.includes('website')) return 'website design';
    if (input.includes('app')) return 'app design';
    if (input.includes('brand')) return 'brand identity';
    return 'creative project';
  }

  private generateEventTitle(input: string, people: any[]): string {
    if (people.length > 0) return `Meeting with ${people[0].value}`;
    if (input.includes('meeting')) return 'Team Meeting';
    if (input.includes('call')) return 'Phone Call';
    return 'Scheduled Event';
  }

  private generateICSFile(event: any): string {
    const now = new Date();
    const eventDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Cognitive OS//Calendar Event//EN
BEGIN:VEVENT
UID:${Date.now()}@cognitive-os.local
DTSTAMP:${now.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${eventDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${event.title}
DESCRIPTION:${event.description}
END:VEVENT
END:VCALENDAR`;
  }

  private generateProjectStructure(name: string, tech: string, input: string): string {
    return `# ${name} Project Setup

## Technology Stack
- **Primary**: ${tech}
- **Generated from**: "${input}"

## Quick Start
1. Create project directory: \`mkdir ${name}\`
2. Initialize: \`cd ${name} && npm init -y\`
3. Install dependencies based on ${tech}
4. Start coding!

## Recommended Structure
\`\`\`
${name}/
├── src/
├── public/
├── tests/
├── docs/
└── README.md
\`\`\`

---
*Generated by Cognitive OS*`;
  }

  private generateEmailDraft(recipient: string, input: string): any {
    return {
      subject: `Follow-up: ${input.substring(0, 50)}...`,
      body: `Hi ${recipient},\n\nI wanted to follow up regarding: ${input}\n\nPlease let me know your thoughts.\n\nBest regards,\n[Your name]`
    };
  }

  private generateCreativeBrief(project: string, input: string): string {
    return `# Creative Brief: ${project}

## Project Overview
${input}

## Objectives
- Create compelling ${project}
- Align with brand/project goals
- Engage target audience effectively

## Deliverables
- Initial concepts (3-5 variations)
- Refined design based on feedback
- Final assets in required formats

## Timeline
- Concepts: 2-3 days
- Refinement: 1-2 days
- Final delivery: 1 day

## Next Steps
1. Research inspiration and references
2. Create mood board
3. Develop initial concepts
4. Present for feedback

---
*Generated by Cognitive OS Creative Assistant*`;
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log(`📁 Downloaded: ${filename}`);
  }
}