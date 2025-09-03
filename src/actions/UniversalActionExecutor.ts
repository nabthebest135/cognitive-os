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
    // Detect specific creative requests and provide rich content
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('roleplay') || lowerInput.includes('scenario')) {
      return this.generateRoleplayScenarios();
    }
    
    if (lowerInput.includes('story') || lowerInput.includes('writing')) {
      return this.generateStoryIdeas();
    }
    
    if (lowerInput.includes('game') || lowerInput.includes('activity')) {
      return this.generateGameIdeas();
    }
    
    if (lowerInput.includes('app') && (lowerInput.includes('design') || lowerInput.includes('interface') || lowerInput.includes('ui'))) {
      return this.generateAppDesignGuide(userInput);
    }
    
    if (lowerInput.includes('blog') && (lowerInput.includes('post') || lowerInput.includes('article') || lowerInput.includes('write'))) {
      return this.generateBlogPostGuide(userInput);
    }
    
    if (lowerInput.includes('website') || lowerInput.includes('landing page')) {
      return this.generateWebsiteGuide(userInput);
    }
    
    if (lowerInput.includes('marketing') || lowerInput.includes('campaign')) {
      return this.generateMarketingPlan(userInput);
    }
    
    // Handle code requests specifically
    if (this.isCodeRequest(lowerInput)) {
      return this.generateCodeSolution(userInput);
    }
    
    // Universal content generator for ANY topic
    return this.generateUniversalContent(userInput, domain);
    
    // Domain-specific templates
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

  private generateRoleplayScenarios(): string {
    return `# 🎭 Roleplay Scenarios Collection

Here are engaging roleplay scenarios across different genres to spark your imagination:

## 🏰 Fantasy & Adventure

### The Dragon's Pact
You are a seasoned adventurer who has stumbled upon a dragon's hoard. However, the dragon isn't what you expected—it's ancient, wise, and more interested in a bargain than a fight. What does it want, and what are you willing to trade?

### The Fallen Kingdom
You are the last surviving member of a royal family, hiding in exile after your kingdom was overthrown. The time has come to reclaim your throne, but you must unite disparate, distrustful factions and confront the sorcerer who seized power.

### Guardians of the Forest
You belong to a mystical order tasked with protecting a sacred, ancient forest from a creeping blight. The blight isn't natural—it's caused by a mysterious force, and you must work with unlikely allies to stop it.

## 🚀 Sci-Fi & Dystopian

### The Last Signal
In a desolate, post-apocalyptic world, you are a scavenger searching for resources. One day, you pick up a clear radio signal—the first human voice you've heard in years, coming from a location that shouldn't be habitable.

### Mind Heist
You are a skilled "mind-diver," a specialist who can enter and navigate the subconscious minds of others. Your latest job is to extract critical information from a powerful corporate CEO's mind, but it's heavily guarded with dangerous traps.

### First Contact
You are a crew member on a deep space exploration vessel that has discovered an alien signal. You've been chosen to make first diplomatic contact, but the alien species communicates in ways you've never encountered.

## 🕵️ Modern & Mystery

### The Missing Heiress
A wealthy socialite has vanished without a trace, and you are the detective hired to find her. The family is full of secrets, the last person to see her is uncooperative, and every clue leads to more questions.

### A Second Chance
You are a former criminal just released from prison, trying to go straight. Your old crew has tracked you down and wants you for "one last job." Do you risk your new life to help them?

### The Mysterious Artifact
While cleaning your grandmother's attic, you discover an intricately carved box containing a mysterious artifact that seems to affect the world around you in subtle, strange ways.

## 🎪 Light & Fun

### The Time Loop Café
You work at a small café where, inexplicably, the same hour repeats every day. Only you seem to notice. How do you use this knowledge?

### Superhero in Training
You've just discovered you have superpowers, but they're... unconventional. Maybe you can talk to houseplants, or you're incredibly lucky with parking spaces. How do you become a hero?

### The Magical Pet Shop
You inherit a pet shop from a mysterious relative, only to discover that all the "pets" are actually magical creatures in disguise.

## 💡 Tips for Great Roleplay

- **Start with character motivation**: What does your character want?
- **Embrace conflict**: Tension makes stories interesting
- **Say "yes, and..."**: Build on ideas rather than shutting them down
- **Focus on relationships**: How characters interact drives the story
- **Don't be afraid to fail**: Failure often leads to the best stories

## 🎲 Quick Scenario Generator

Combine elements from different categories:
- **Setting**: Medieval village, Space station, Modern city, Magical realm
- **Conflict**: Missing person, Ancient curse, Corporate conspiracy, Alien invasion
- **Twist**: Nothing is as it seems, Time is running out, Someone is lying, Magic is real

---
*Generated by Cognitive OS - Your Creative AI Assistant*`;
  }

  private generateStoryIdeas(): string {
    return `# ✍️ Story Ideas & Writing Prompts

## 📖 Short Story Concepts

### The Memory Thief
In a world where memories can be extracted and sold, you discover that someone has been stealing your childhood memories. But when you track them down, you realize they had a good reason.

### The Last Library
Books are now illegal, and you are the secret keeper of the world's last library, hidden beneath a coffee shop. When a government inspector becomes suspicious, you must decide whether to trust them.

### Digital Ghosts
After your best friend dies, you start receiving messages from their social media accounts. At first, you think someone is playing a cruel joke, but the messages contain information only your friend could know.

## 🌟 Character-Driven Stories

### The Substitute Teacher
A mysterious substitute teacher appears at different schools, always for exactly one day, and always manages to change one student's life forever. Who are they, and what's their mission?

### The Night Shift
Working the night shift at a 24-hour diner, you've seen it all. But tonight, the same customer keeps coming in every hour, each time looking slightly different and claiming it's their first visit.

### The Inheritance
You inherit a house from a great-aunt you never met, but the inheritance comes with an unusual condition: you must live in the house for exactly one year, and you cannot change anything about it.

## 🔮 Speculative Fiction

### The Emotion Market
In the future, emotions can be bottled and sold. You work as an "emotion harvester," but you've just discovered that the company is harvesting emotions from people without their consent.

### The Backup Planet
Humanity has a backup planet in case Earth becomes uninhabitable. You're part of the advance team sent to prepare it, but you discover that the planet isn't as empty as everyone thought.

### The Algorithm
An AI designed to predict human behavior becomes so accurate that it starts influencing the very behaviors it's supposed to predict. You're the programmer who created it, and now you must decide whether to shut it down.

## 💝 Romance & Relationships

### The Time Traveler's Dilemma
You can travel through time, but only to moments in your own past. You use this ability to try to fix your relationship, but every change you make seems to make things worse.

### The Matchmaker's Curse
You have an uncanny ability to set up perfect couples, but you can never find love yourself. When you finally meet someone special, you discover they're immune to your matchmaking abilities.

### Letters to the Future
You and your partner write letters to each other to be opened in 10 years. When the time comes, you discover that the letters reveal secrets that change everything.

## 🎭 Writing Exercises

1. **The Object**: Write a story centered around a single object that passes through multiple hands
2. **The Conversation**: Write a story told entirely through dialogue
3. **The Reversal**: Start with the ending and work backwards
4. **The Constraint**: Write a story without using the letter 'e' (or any letter you choose)
5. **The Perspective**: Tell the same event from three different viewpoints

---
*Generated by Cognitive OS - Your Creative Writing Assistant*`;
  }

  private generateGameIdeas(): string {
    return `# 🎮 Game Ideas & Activities

## 🏠 Indoor Games

### Creative Challenges
- **Story Building**: Each person adds one sentence to create a collaborative story
- **Character Creation**: Design and roleplay original characters with unique quirks
- **Improv Theater**: Act out random scenarios with no script
- **Mystery Box**: Guess what's in the box using only yes/no questions

### Mind Games
- **20 Questions Plus**: Classic game with themed categories
- **Word Association Chain**: See how far you can go before repeating
- **Riddle Tournament**: Create and solve original riddles
- **Memory Palace**: Build and test elaborate memory challenges

## 🌳 Outdoor Adventures

### Exploration Games
- **Urban Scavenger Hunt**: Find specific items or locations in your city
- **Nature Photography Challenge**: Capture specific themes or subjects
- **Geocaching Adventure**: Use GPS to find hidden treasures
- **Historical Walking Tour**: Research and visit local historical sites

### Active Games
- **Parkour Training**: Learn basic parkour moves safely
- **Obstacle Course Design**: Create and time custom obstacle courses
- **Team Challenges**: Collaborative problem-solving activities
- **Adventure Racing**: Combine multiple activities into a race

## 🎲 Party Games

### Social Games
- **Two Truths and a Lie**: Classic with creative twists
- **Would You Rather**: Extreme edition with impossible choices
- **Charades Evolution**: Add themes, time limits, or team challenges
- **Human Bingo**: Find people who match specific criteria

### Creative Games
- **Pictionary Plus**: Draw with your non-dominant hand or eyes closed
- **Song Association**: Connect songs through lyrics or themes
- **Accent Challenge**: Speak in different accents or languages
- **Compliment Battle**: Competitive complimenting

## 🧩 Puzzle & Strategy

### Brain Teasers
- **Escape Room at Home**: Design puzzles for others to solve
- **Logic Grid Puzzles**: Create custom logic problems
- **Code Breaking**: Invent and crack secret codes
- **Pattern Recognition**: Design visual or numerical patterns

### Strategy Games
- **Resource Management**: Allocate limited resources to achieve goals
- **Negotiation Games**: Practice diplomacy and deal-making
- **Territory Control**: Strategic games using maps or boards
- **Economic Simulation**: Manage virtual businesses or economies

## 🎨 Creative Activities

### Art & Design
- **Collaborative Art**: Multiple people work on the same piece
- **Style Mimicry**: Recreate famous artworks in different styles
- **Random Art Challenge**: Use random objects as art supplies
- **Digital Art Battle**: Create art using only phone apps

### Performance
- **Talent Show**: Showcase unique or silly talents
- **Comedy Roast**: Gentle, fun roasting of friends
- **Dance Battle**: Learn and perform different dance styles
- **Voice Acting**: Perform scenes with different character voices

## 🌐 Digital Games

### Online Multiplayer
- **Virtual Escape Rooms**: Solve puzzles together online
- **Online Trivia**: Custom trivia about your friend group
- **Collaborative Playlists**: Build themed music playlists together
- **Virtual Tours**: Explore museums or landmarks online together

### App-Based Games
- **Photo Challenges**: Use apps to create themed photo contests
- **Fitness Challenges**: Gamify exercise with tracking apps
- **Learning Games**: Educational apps made competitive
- **Creative Apps**: Use drawing or music apps for challenges

## 🎯 Quick Game Ideas

- **60-Second Challenges**: Do as much as possible in one minute
- **Alphabet Games**: Go through the alphabet with themed words
- **Number Games**: Mathematical or counting challenges
- **Color Games**: Activities based on specific colors
- **Time Period Games**: Act like you're in different historical eras

---
*Generated by Cognitive OS - Your Entertainment AI Assistant*`;
  }

  private generateAppDesignGuide(userInput: string): string {
    return `# 📱 Mobile App Interface Design Guide

## Your Project
"${userInput}"

## 🎨 Design Process

### 1. User Research & Planning
- **Target Audience**: Who will use this app?
- **Core Features**: What are the 3 main functions?
- **User Journey**: How do users navigate through the app?
- **Competitor Analysis**: What similar apps exist?

### 2. Information Architecture
- **App Structure**: Main sections and subsections
- **Navigation Flow**: How users move between screens
- **Content Hierarchy**: What's most important on each screen
- **User Actions**: Primary and secondary actions per screen

### 3. Wireframing
- **Low-fidelity sketches**: Basic layout and structure
- **Screen flow**: Connection between different screens
- **Interactive elements**: Buttons, forms, navigation
- **Content placement**: Text, images, and media positioning

### 4. Visual Design
- **Color Palette**: Primary, secondary, and accent colors
- **Typography**: Font choices for headers, body text, and UI elements
- **Iconography**: Consistent icon style and usage
- **Spacing**: Margins, padding, and white space

## 🛠️ Design Tools

### Free Tools
- **Figma**: Professional design and prototyping
- **Adobe XD**: UI/UX design and collaboration
- **Sketch**: Mac-only design tool
- **InVision**: Prototyping and user testing

### Mobile-Specific Considerations
- **Screen sizes**: Design for multiple device sizes
- **Touch targets**: Minimum 44px for touchable elements
- **Thumb zones**: Easy-to-reach areas on mobile screens
- **Loading states**: What users see while content loads

## 📱 Platform Guidelines

### iOS Design
- **Human Interface Guidelines**: Apple's design principles
- **Navigation**: Tab bars, navigation bars, and modals
- **Typography**: San Francisco font system
- **Colors**: System colors and accessibility

### Android Design
- **Material Design**: Google's design system
- **Navigation**: Bottom navigation, app bars, and drawers
- **Typography**: Roboto font family
- **Elevation**: Shadows and depth

## ✅ Design Checklist

- [ ] User personas defined
- [ ] User flow mapped out
- [ ] Wireframes created for key screens
- [ ] Visual design system established
- [ ] Responsive design considered
- [ ] Accessibility guidelines followed
- [ ] Prototype created and tested
- [ ] Design handoff prepared for developers

## 📚 Resources

- **Inspiration**: Dribbble, Behance, Mobbin
- **Icons**: Feather Icons, Heroicons, Material Icons
- **Images**: Unsplash, Pexels, Illustrations.co
- **Fonts**: Google Fonts, Font Squirrel

---
*Generated by Cognitive OS - Your Design AI Assistant*`;
  }

  private generateBlogPostGuide(userInput: string): string {
    return `# ✍️ Blog Post Writing Guide

## Your Topic
"${userInput}"

## 📝 Content Strategy

### 1. Research & Planning
- **Target Audience**: Who are you writing for?
- **Search Intent**: What questions are people asking?
- **Keyword Research**: What terms should you include?
- **Unique Angle**: What's your fresh perspective?

### 2. Content Structure

#### Compelling Headline
- **Clear benefit**: What will readers gain?
- **Emotional hook**: Why should they care?
- **SEO-friendly**: Include target keywords
- **Length**: 50-60 characters for SEO

#### Introduction (150-200 words)
- **Hook**: Start with a question, statistic, or story
- **Problem**: What challenge does your audience face?
- **Promise**: What will this post deliver?
- **Preview**: Brief overview of what's coming

#### Main Content
- **Subheadings**: Break content into digestible sections
- **Examples**: Real-world applications and case studies
- **Data**: Statistics, research, and credible sources
- **Visuals**: Images, charts, and infographics

#### Conclusion
- **Summary**: Key takeaways and main points
- **Call-to-action**: What should readers do next?
- **Engagement**: Ask questions to encourage comments

## 📊 Content Types

### How-to Guides
- Step-by-step instructions
- Screenshots or images for each step
- Common mistakes to avoid
- Tools and resources needed

### List Posts
- "X Ways to...", "Top X Tools for..."
- Each point with explanation and examples
- Actionable tips readers can implement
- Logical order (importance, difficulty, etc.)

### Opinion/Analysis
- Your unique perspective on industry trends
- Supporting evidence and examples
- Counterarguments and balanced view
- Personal experiences and insights

### Case Studies
- Real examples and results
- Before and after scenarios
- Lessons learned and key insights
- Actionable takeaways for readers

## 🚀 SEO Optimization

### On-Page SEO
- **Title tag**: Include primary keyword
- **Meta description**: Compelling 150-160 character summary
- **Headers**: Use H1, H2, H3 structure with keywords
- **Internal links**: Link to related content on your site
- **External links**: Link to authoritative sources

### Content Optimization
- **Keyword density**: Natural inclusion, avoid stuffing
- **Semantic keywords**: Related terms and synonyms
- **Featured snippets**: Structure content to answer questions
- **Image alt text**: Describe images for accessibility and SEO

## 📱 Promotion Strategy

### Social Media
- **Platform-specific**: Tailor content for each platform
- **Visual content**: Create quote cards and infographics
- **Hashtags**: Research and use relevant hashtags
- **Engagement**: Respond to comments and shares

### Email Marketing
- **Newsletter**: Share with your email subscribers
- **Segmentation**: Target relevant audience segments
- **Subject line**: Compelling reason to open
- **Preview**: Teaser that encourages clicks

### Community Engagement
- **Forums**: Share in relevant online communities
- **Comments**: Engage on other blogs in your niche
- **Collaborations**: Partner with other creators
- **Guest posting**: Write for other publications

## ✅ Publishing Checklist

- [ ] Content thoroughly researched and fact-checked
- [ ] Grammar and spelling reviewed
- [ ] SEO elements optimized
- [ ] Images added with alt text
- [ ] Internal and external links included
- [ ] Call-to-action clear and compelling
- [ ] Social media posts scheduled
- [ ] Email newsletter prepared

---
*Generated by Cognitive OS - Your Content AI Assistant*`;
  }

  private generateWebsiteGuide(userInput: string): string {
    return `# 🌐 Website Development Guide

## Your Project
"${userInput}"

## 🛠️ Planning Phase

### 1. Define Purpose & Goals
- **Primary objective**: What should the website achieve?
- **Target audience**: Who are your visitors?
- **Success metrics**: How will you measure success?
- **Unique value**: What sets you apart?

### 2. Content Strategy
- **Site structure**: Main pages and navigation
- **Content audit**: What content do you need?
- **SEO strategy**: Target keywords and topics
- **Content calendar**: When will you publish new content?

## 🎨 Design & Development

### Design Process
- **Wireframes**: Basic layout and structure
- **Mockups**: Visual design and branding
- **Prototype**: Interactive version for testing
- **Style guide**: Colors, fonts, and components

### Technical Implementation
- **Platform choice**: WordPress, Webflow, custom code
- **Responsive design**: Mobile, tablet, and desktop
- **Performance**: Fast loading and optimization
- **Security**: SSL certificates and backups

### Essential Pages
- **Homepage**: Clear value proposition and navigation
- **About**: Your story and credibility
- **Services/Products**: What you offer
- **Contact**: How to reach you
- **Privacy Policy**: Legal requirements

## 🚀 Launch & Optimization

### Pre-Launch Checklist
- [ ] All pages tested on multiple devices
- [ ] Forms and functionality working
- [ ] SEO elements in place
- [ ] Analytics tracking setup
- [ ] Backup system configured

### Post-Launch Activities
- **Monitor performance**: Speed, uptime, and user experience
- **Track analytics**: Visitor behavior and conversions
- **Gather feedback**: User testing and surveys
- **Continuous improvement**: Regular updates and optimization

---
*Generated by Cognitive OS - Your Web Development AI Assistant*`;
  }

  private generateMarketingPlan(userInput: string): string {
    return `# 📊 Marketing Campaign Strategy

## Your Campaign
"${userInput}"

## 🎯 Strategy Development

### 1. Market Research
- **Target audience**: Demographics, interests, and behaviors
- **Competitor analysis**: What are others doing?
- **Market trends**: Current opportunities and challenges
- **SWOT analysis**: Strengths, weaknesses, opportunities, threats

### 2. Campaign Objectives
- **SMART goals**: Specific, measurable, achievable, relevant, time-bound
- **Key metrics**: What will you track?
- **Budget allocation**: How much for each channel?
- **Timeline**: Campaign phases and milestones

## 📱 Channel Strategy

### Digital Marketing
- **Social media**: Platform-specific content and advertising
- **Email marketing**: Nurture sequences and newsletters
- **Content marketing**: Blog posts, videos, and resources
- **SEO/SEM**: Organic and paid search strategies

### Traditional Marketing
- **Print advertising**: Magazines, newspapers, and flyers
- **Radio/TV**: Broadcast advertising opportunities
- **Events**: Trade shows, conferences, and networking
- **Direct mail**: Targeted postal campaigns

### Content Calendar
- **Weekly themes**: Consistent messaging across channels
- **Content types**: Educational, promotional, and entertaining
- **Publishing schedule**: When and where to post
- **Seasonal campaigns**: Holiday and event-based marketing

## 📊 Measurement & Optimization

### Key Performance Indicators
- **Awareness**: Reach, impressions, and brand mentions
- **Engagement**: Likes, shares, comments, and time spent
- **Conversion**: Leads, sales, and customer acquisition cost
- **Retention**: Customer lifetime value and repeat purchases

### Testing & Optimization
- **A/B testing**: Headlines, images, and call-to-actions
- **Analytics review**: Weekly and monthly performance analysis
- **Campaign adjustments**: Budget reallocation and strategy pivots
- **ROI calculation**: Return on investment for each channel

---
*Generated by Cognitive OS - Your Marketing AI Assistant*`;
  }

  private generateUniversalContent(userInput: string, domain: string): string {
    // Extract key terms and generate structured content
    const words = userInput.toLowerCase().split(/\s+/);
    const topic = this.extractMainTopic(userInput);
    const actionType = this.detectActionType(words);
    
    return `# ${topic} ${actionType} Guide

## Your Request
"${userInput}"

## Overview
${this.generateOverview(topic, actionType)}

## Key Considerations
${this.generateKeyPoints(topic, actionType)}

## Step-by-Step Approach
${this.generateSteps(topic, actionType)}

## Resources & Tools
${this.generateResources(topic)}

## Tips for Success
${this.generateTips(topic, actionType)}

## Next Steps
- [ ] Research ${topic} fundamentals
- [ ] Gather necessary tools/materials
- [ ] Start with basic implementation
- [ ] Test and iterate
- [ ] Seek feedback and improve

## Related Topics
${this.generateRelatedTopics(topic)}

---
*Generated by Cognitive OS - Your Universal AI Assistant*

**Need more specific help?** Try asking about:
- "${topic} best practices"
- "${topic} tools and software"
- "${topic} step by step tutorial"
- "${topic} common mistakes to avoid"`;
  }

  private extractMainTopic(input: string): string {
    // Remove common words and extract the main subject
    const commonWords = ['design', 'create', 'make', 'build', 'develop', 'write', 'plan', 'how', 'to', 'a', 'an', 'the', 'for', 'with', 'about'];
    const words = input.toLowerCase().split(/\s+/).filter(word => !commonWords.includes(word));
    
    // Capitalize and join the main topic
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Custom Project';
  }

  private detectActionType(words: string[]): string {
    if (words.some(w => ['design', 'create', 'make', 'build'].includes(w))) return 'Design';
    if (words.some(w => ['write', 'blog', 'article', 'content'].includes(w))) return 'Writing';
    if (words.some(w => ['develop', 'code', 'program', 'software'].includes(w))) return 'Development';
    if (words.some(w => ['plan', 'strategy', 'organize'].includes(w))) return 'Planning';
    if (words.some(w => ['learn', 'study', 'research'].includes(w))) return 'Learning';
    if (words.some(w => ['specs', 'specifications', 'features', 'list'].includes(w))) return 'Specifications';
    return 'Project';
  }

  private generateOverview(topic: string, actionType: string): string {
    const templates = {
      'Design': `Creating a ${topic.toLowerCase()} involves understanding user needs, aesthetic principles, and functional requirements. This guide will help you approach the design process systematically.`,
      'Writing': `Writing about ${topic.toLowerCase()} requires research, clear structure, and engaging content. This guide covers the essential elements for effective ${topic.toLowerCase()} content.`,
      'Development': `Developing ${topic.toLowerCase()} involves technical planning, implementation, and testing. This guide outlines the key phases and considerations.`,
      'Planning': `Planning for ${topic.toLowerCase()} requires strategic thinking, resource allocation, and timeline management. This guide helps structure your approach.`,
      'Learning': `Learning about ${topic.toLowerCase()} involves understanding fundamentals, practicing skills, and applying knowledge. This guide provides a structured learning path.`,
      'Specifications': `Understanding ${topic.toLowerCase()} specifications helps in making informed decisions. This guide covers key features, capabilities, and technical details.`,
      'Project': `Working with ${topic.toLowerCase()} requires understanding its context, applications, and best practices. This guide provides comprehensive insights.`
    };
    
    return templates[actionType as keyof typeof templates] || templates['Project'];
  }

  private generateKeyPoints(topic: string, actionType: string): string {
    return `• **Purpose & Goals**: Define what you want to achieve with ${topic.toLowerCase()}
• **Target Audience**: Identify who will use or benefit from this
• **Requirements**: List essential features, constraints, and specifications
• **Budget & Resources**: Determine available time, money, and materials
• **Quality Standards**: Set benchmarks for success and completion criteria
• **Timeline**: Establish realistic milestones and deadlines
• **Risk Assessment**: Identify potential challenges and mitigation strategies`;
  }

  private generateSteps(topic: string, actionType: string): string {
    return `### Phase 1: Research & Discovery
- Investigate existing ${topic.toLowerCase()} solutions and approaches
- Analyze user needs, market trends, and best practices
- Gather inspiration and reference materials
- Define project scope and objectives

### Phase 2: Planning & Design
- Create detailed specifications and requirements
- Develop initial concepts and prototypes
- Plan resource allocation and timeline
- Establish quality metrics and success criteria

### Phase 3: Implementation
- Execute the plan using appropriate tools and methods
- Follow industry standards and best practices
- Monitor progress and adjust as needed
- Document the process and decisions

### Phase 4: Testing & Refinement
- Test functionality, usability, and performance
- Gather feedback from users or stakeholders
- Make necessary improvements and optimizations
- Prepare for launch or deployment

### Phase 5: Launch & Maintenance
- Deploy or release the final ${topic.toLowerCase()}
- Monitor performance and user feedback
- Plan for ongoing maintenance and updates
- Document lessons learned for future projects`;
  }

  private generateResources(topic: string): string {
    return `### Online Resources
- **Search**: "${topic.toLowerCase()} tutorial", "${topic.toLowerCase()} guide", "${topic.toLowerCase()} best practices"
- **Communities**: Reddit communities, Discord servers, professional forums
- **Documentation**: Official guides, wikis, and technical documentation
- **Courses**: Coursera, Udemy, YouTube tutorials, and online workshops

### Tools & Software
- **Design Tools**: Figma, Adobe Creative Suite, Canva, Sketch
- **Development**: VS Code, GitHub, various frameworks and libraries
- **Planning**: Notion, Trello, Asana, Google Workspace
- **Research**: Google Scholar, industry publications, expert blogs

### Professional Help
- **Freelancers**: Upwork, Fiverr, 99designs for specialized skills
- **Consultants**: Industry experts for strategic guidance
- **Communities**: Local meetups, professional associations
- **Mentorship**: Find experienced practitioners in the field`;
  }

  private generateTips(topic: string, actionType: string): string {
    return `• **Start Simple**: Begin with basic concepts before advancing to complex features
• **Iterate Frequently**: Make small improvements based on feedback and testing
• **Stay Updated**: Follow industry trends and emerging best practices
• **Document Everything**: Keep detailed records of decisions and processes
• **Seek Feedback**: Get input from users, peers, and experts regularly
• **Learn Continuously**: Invest time in skill development and knowledge updates
• **Plan for Scale**: Consider future growth and expansion needs
• **Focus on Quality**: Prioritize excellence over speed in critical areas`;
  }

  private generateRelatedTopics(topic: string): string {
    const words = topic.toLowerCase().split(' ');
    const relatedTerms = [];
    
    // Generate related topics based on the main topic
    if (words.some(w => ['mouse', 'keyboard', 'hardware'].includes(w))) {
      relatedTerms.push('Ergonomic Design', 'User Interface Hardware', 'Gaming Peripherals', 'Accessibility Tools');
    } else if (words.some(w => ['carpet', 'rug', 'textile'].includes(w))) {
      relatedTerms.push('Interior Design', 'Textile Patterns', 'Home Decoration', 'Material Selection');
    } else if (words.some(w => ['macbook', 'laptop', 'computer'].includes(w))) {
      relatedTerms.push('Computer Hardware', 'Performance Benchmarks', 'Software Compatibility', 'Tech Specifications');
    } else {
      relatedTerms.push('Industry Standards', 'Best Practices', 'Quality Assurance', 'Innovation Trends');
    }
    
    return relatedTerms.map(term => `• ${term}`).join('\n');
  }

  private isCodeRequest(input: string): boolean {
    const codeKeywords = ['code', 'python', 'javascript', 'java', 'html', 'css', 'sql', 'function', 'program', 'script', 'hello world', 'print'];
    return codeKeywords.some(keyword => input.includes(keyword));
  }

  private generateCodeSolution(userInput: string): string {
    const lowerInput = userInput.toLowerCase();
    
    // Python Hello World
    if (lowerInput.includes('python') && (lowerInput.includes('hello') || lowerInput.includes('print'))) {
      return `# Python Hello World Code

## Your Request
"${userInput}"

## Solution

\`\`\`python
print("Hello World")
\`\`\`

## How to Run
1. Save the code in a file called \`hello.py\`
2. Open terminal/command prompt
3. Navigate to the file location
4. Run: \`python hello.py\`

## Expected Output
\`\`\`
Hello World
\`\`\`

## Explanation
- \`print()\` is a built-in Python function
- It displays text to the console
- Strings are enclosed in quotes (" or ')
- Python is case-sensitive

## Next Steps
- Try printing different messages
- Learn about variables: \`name = "World"\` then \`print(f"Hello {name}")\`
- Explore Python basics: variables, loops, functions

---
*Generated by Cognitive OS - Your Code Assistant*`;
    }
    
    // JavaScript Hello World
    if (lowerInput.includes('javascript') && lowerInput.includes('hello')) {
      return `# JavaScript Hello World Code

## Your Request
"${userInput}"

## Solution

\`\`\`javascript
console.log("Hello World");
\`\`\`

## How to Run
1. Open browser developer tools (F12)
2. Go to Console tab
3. Paste the code and press Enter

Or create an HTML file:
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>Hello World</title>
</head>
<body>
    <script>
        console.log("Hello World");
        alert("Hello World");
    </script>
</body>
</html>
\`\`\`

## Expected Output
- Console: \`Hello World\`
- Alert popup: \`Hello World\`

---
*Generated by Cognitive OS - Your Code Assistant*`;
    }
    
    // Generic code request
    return `# Code Solution

## Your Request
"${userInput}"

## Basic Implementation

Based on your request, here's a starting point:

\`\`\`
// Your code will depend on the specific language and requirements
// This is a template - modify according to your needs
\`\`\`

## Steps to Implement
1. Choose your programming language
2. Set up development environment
3. Write the basic structure
4. Test and debug
5. Refine and optimize

## Common Languages for This Task
- **Python**: Great for beginners, readable syntax
- **JavaScript**: Web development, versatile
- **Java**: Enterprise applications, robust
- **C++**: Performance-critical applications

## Resources
- Official documentation for your chosen language
- Online coding platforms (CodePen, Repl.it)
- Tutorial websites (W3Schools, MDN, Python.org)
- Community forums (Stack Overflow, Reddit)

---
*Generated by Cognitive OS - Your Code Assistant*`;
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