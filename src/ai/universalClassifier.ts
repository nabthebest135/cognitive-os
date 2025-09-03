import { Intent, ExtractedEntity } from '../types';

export interface UniversalAction {
  actionType: 'create' | 'schedule' | 'learn' | 'communicate' | 'analyze' | 'organize';
  domain: string;
  confidence: number;
  suggestion: string;
  action: string;
  icon: string;
}

export class UniversalClassifier {
  private actionPatterns = {
    create: [
      'create', 'make', 'build', 'design', 'develop', 'write', 'draft', 'generate',
      'compose', 'craft', 'produce', 'construct', 'form', 'establish', 'setup'
    ],
    schedule: [
      'schedule', 'plan', 'book', 'arrange', 'organize', 'set', 'remind', 'calendar',
      'appointment', 'meeting', 'event', 'deadline', 'time', 'date', 'when'
    ],
    learn: [
      'study', 'learn', 'research', 'analyze', 'investigate', 'explore', 'understand',
      'exam', 'test', 'homework', 'assignment', 'practice', 'review', 'memorize'
    ],
    communicate: [
      'email', 'call', 'message', 'contact', 'reach', 'notify', 'inform', 'update',
      'send', 'tell', 'discuss', 'talk', 'chat', 'follow', 'reply', 'respond'
    ],
    analyze: [
      'analyze', 'review', 'check', 'evaluate', 'assess', 'examine', 'inspect',
      'compare', 'measure', 'calculate', 'compute', 'process', 'debug', 'test'
    ],
    organize: [
      'organize', 'sort', 'categorize', 'group', 'arrange', 'structure', 'manage',
      'clean', 'tidy', 'file', 'archive', 'backup', 'sync', 'optimize'
    ]
  };

  private domainKeywords = {
    // Academic domains
    'chemistry': ['chemistry', 'chemical', 'molecule', 'atom', 'reaction', 'formula', 'periodic'],
    'physics': ['physics', 'force', 'energy', 'motion', 'quantum', 'relativity', 'mechanics'],
    'mathematics': ['math', 'mathematics', 'algebra', 'calculus', 'geometry', 'statistics', 'equation'],
    'biology': ['biology', 'cell', 'dna', 'genetics', 'evolution', 'organism', 'anatomy'],
    'history': ['history', 'historical', 'ancient', 'medieval', 'war', 'civilization', 'empire'],
    'literature': ['literature', 'book', 'novel', 'poem', 'author', 'writing', 'story'],
    
    // Professional domains
    'programming': ['code', 'programming', 'software', 'javascript', 'python', 'react', 'api'],
    'marketing': ['marketing', 'campaign', 'brand', 'advertising', 'promotion', 'seo', 'social'],
    'finance': ['finance', 'money', 'investment', 'budget', 'accounting', 'profit', 'revenue'],
    'design': ['design', 'ui', 'ux', 'graphics', 'logo', 'layout', 'visual', 'mockup'],
    'business': ['business', 'company', 'startup', 'entrepreneur', 'strategy', 'management'],
    
    // Personal domains
    'fitness': ['fitness', 'workout', 'exercise', 'gym', 'training', 'health', 'muscle'],
    'cooking': ['cooking', 'recipe', 'food', 'kitchen', 'ingredients', 'meal', 'chef'],
    'travel': ['travel', 'trip', 'vacation', 'flight', 'hotel', 'destination', 'tourism'],
    'music': ['music', 'song', 'instrument', 'band', 'concert', 'melody', 'rhythm'],
    'sports': ['sports', 'game', 'team', 'player', 'match', 'tournament', 'competition'],
    'photography': ['photography', 'photo', 'camera', 'picture', 'lens', 'shot', 'image'],
    'gardening': ['garden', 'plant', 'flower', 'seed', 'soil', 'grow', 'harvest'],
    'art': ['art', 'painting', 'drawing', 'sketch', 'canvas', 'brush', 'creative'],
    
    // Technology domains
    'ai': ['ai', 'artificial intelligence', 'machine learning', 'neural', 'algorithm'],
    'blockchain': ['blockchain', 'crypto', 'bitcoin', 'ethereum', 'smart contract'],
    'cybersecurity': ['security', 'hacking', 'encryption', 'firewall', 'vulnerability'],
    'data science': ['data', 'analytics', 'visualization', 'statistics', 'dataset'],
    
    // Health domains
    'medicine': ['medicine', 'doctor', 'patient', 'treatment', 'diagnosis', 'health'],
    'psychology': ['psychology', 'mental', 'behavior', 'therapy', 'cognitive', 'emotion'],
    'nutrition': ['nutrition', 'diet', 'vitamin', 'protein', 'calories', 'healthy'],
    
    // Creative domains
    'writing': ['writing', 'author', 'blog', 'article', 'content', 'publish', 'editor'],
    'video': ['video', 'film', 'movie', 'editing', 'camera', 'production', 'youtube'],
    'gaming': ['game', 'gaming', 'player', 'level', 'character', 'console', 'esports']
  };

  classifyUniversalIntent(text: string, entities: ExtractedEntity[]): UniversalAction {
    const lowerText = text.toLowerCase();
    
    // Detect action type
    const actionType = this.detectActionType(lowerText);
    
    // Detect domain
    const domain = this.detectDomain(lowerText, entities);
    
    // Calculate confidence
    const confidence = this.calculateConfidence(lowerText, actionType, domain);
    
    // Generate suggestion and action
    const suggestion = this.generateSuggestion(actionType, domain, text);
    const action = this.generateAction(actionType, domain);
    const icon = this.getIcon(actionType, domain);
    
    return {
      actionType,
      domain,
      confidence,
      suggestion,
      action,
      icon
    };
  }

  private detectActionType(text: string): 'create' | 'schedule' | 'learn' | 'communicate' | 'analyze' | 'organize' {
    let maxScore = 0;
    let bestAction: 'create' | 'schedule' | 'learn' | 'communicate' | 'analyze' | 'organize' = 'create';
    
    for (const [action, keywords] of Object.entries(this.actionPatterns)) {
      const score = keywords.reduce((sum, keyword) => {
        return sum + (text.includes(keyword) ? 1 : 0);
      }, 0);
      
      if (score > maxScore) {
        maxScore = score;
        bestAction = action as typeof bestAction;
      }
    }
    
    return bestAction;
  }

  private detectDomain(text: string, entities: ExtractedEntity[]): string {
    let maxScore = 0;
    let bestDomain = 'general';
    
    // Check entity topics first
    const topicEntities = entities.filter(e => e.type === 'topic');
    if (topicEntities.length > 0) {
      const entityTopic = topicEntities[0].value.toLowerCase();
      for (const [domain, keywords] of Object.entries(this.domainKeywords)) {
        if (keywords.some(keyword => entityTopic.includes(keyword))) {
          return domain;
        }
      }
    }
    
    // Check text for domain keywords
    for (const [domain, keywords] of Object.entries(this.domainKeywords)) {
      const score = keywords.reduce((sum, keyword) => {
        return sum + (text.includes(keyword) ? 1 : 0);
      }, 0);
      
      if (score > maxScore) {
        maxScore = score;
        bestDomain = domain;
      }
    }
    
    return bestDomain;
  }

  private calculateConfidence(text: string, actionType: string, domain: string): number {
    let confidence = 0.5; // Base confidence
    
    // Boost confidence based on keyword matches
    const actionKeywords = this.actionPatterns[actionType as keyof typeof this.actionPatterns] || [];
    const actionMatches = actionKeywords.filter(keyword => text.includes(keyword)).length;
    confidence += actionMatches * 0.1;
    
    if (domain !== 'general') {
      const domainKeywords = this.domainKeywords[domain as keyof typeof this.domainKeywords] || [];
      const domainMatches = domainKeywords.filter(keyword => text.includes(keyword)).length;
      confidence += domainMatches * 0.15;
    }
    
    return Math.min(confidence, 1.0);
  }

  private generateSuggestion(actionType: string, domain: string, originalText: string): string {
    const templates = {
      create: {
        general: 'Create new content',
        programming: 'Create new project',
        design: 'Create design concept',
        writing: 'Create written content',
        fitness: 'Create workout plan',
        cooking: 'Create recipe',
        music: 'Create music composition'
      },
      schedule: {
        general: 'Schedule new event',
        fitness: 'Schedule workout session',
        business: 'Schedule business meeting',
        medicine: 'Schedule appointment'
      },
      learn: {
        general: 'Start learning session',
        programming: 'Learn programming concepts',
        language: 'Learn new language',
        music: 'Learn musical skills'
      },
      communicate: {
        general: 'Send communication',
        business: 'Contact business partner',
        team: 'Update team members'
      },
      analyze: {
        general: 'Analyze information',
        data: 'Analyze data patterns',
        business: 'Analyze business metrics'
      },
      organize: {
        general: 'Organize content',
        files: 'Organize file system',
        schedule: 'Organize calendar'
      }
    };
    
    const actionTemplates = templates[actionType as keyof typeof templates] as any;
    return actionTemplates?.[domain] || actionTemplates?.general || `${actionType} ${domain} content`;
  }

  private generateAction(actionType: string, domain: string): string {
    return `🧠 COS: Universal ${actionType} system activated for ${domain}. Intelligent assistance ready.`;
  }

  private getIcon(actionType: string, domain: string): string {
    const actionIcons = {
      create: '🛠️',
      schedule: '📅',
      learn: '📚',
      communicate: '💬',
      analyze: '🔍',
      organize: '📋'
    };
    
    const domainIcons = {
      programming: '💻',
      design: '🎨',
      fitness: '💪',
      cooking: '👨‍🍳',
      music: '🎵',
      sports: '⚽',
      travel: '✈️',
      photography: '📸',
      medicine: '⚕️',
      finance: '💰'
    };
    
    return domainIcons[domain as keyof typeof domainIcons] || actionIcons[actionType as keyof typeof actionIcons] || '🧠';
  }
}