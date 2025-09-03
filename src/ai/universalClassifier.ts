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
    const startTime = performance.now();
    const lowerText = text.toLowerCase();
    
    // Ultra-fast parallel detection
    const [actionType, domain] = this.fastParallelDetection(lowerText, entities);
    
    // Quick confidence calculation
    const confidence = this.fastConfidence(lowerText, actionType, domain);
    
    // Pre-cached suggestions
    const suggestion = this.getCachedSuggestion(actionType, domain);
    const action = `🧠 COS: ${actionType} system ready for ${domain}`;
    const icon = this.getIcon(actionType, domain);
    
    const endTime = performance.now();
    console.log(`⚡ Classification: ${(endTime - startTime).toFixed(1)}ms`);
    
    return {
      actionType,
      domain,
      confidence,
      suggestion,
      action,
      icon
    };
  }

  private fastParallelDetection(text: string, entities: ExtractedEntity[]): ['create' | 'schedule' | 'learn' | 'communicate' | 'analyze' | 'organize', string] {
    // Ultra-fast keyword matching with early exit
    let actionType: 'create' | 'schedule' | 'learn' | 'communicate' | 'analyze' | 'organize' = 'create';
    let domain = 'general';
    
    // Priority keywords for instant detection
    if (text.includes('email') || text.includes('message') || text.includes('call')) {
      actionType = 'communicate';
    } else if (text.includes('schedule') || text.includes('plan') || text.includes('meeting')) {
      actionType = 'schedule';
    } else if (text.includes('study') || text.includes('learn') || text.includes('research')) {
      actionType = 'learn';
    } else if (text.includes('create') || text.includes('make') || text.includes('build')) {
      actionType = 'create';
    } else if (text.includes('analyze') || text.includes('review') || text.includes('check')) {
      actionType = 'analyze';
    } else if (text.includes('organize') || text.includes('sort') || text.includes('manage')) {
      actionType = 'organize';
    }
    
    // Fast domain detection with entity priority
    const topicEntity = entities.find(e => e.type === 'topic');
    if (topicEntity) {
      domain = this.fastDomainMatch(topicEntity.value.toLowerCase());
    } else {
      domain = this.fastDomainMatch(text);
    }
    
    return [actionType, domain];
  }

  private fastDomainMatch(text: string): string {
    // Ultra-fast domain detection with priority matching
    const priorityDomains = {
      'programming': ['code', 'javascript', 'python', 'react', 'api'],
      'fitness': ['workout', 'exercise', 'gym', 'training'],
      'cooking': ['recipe', 'food', 'kitchen', 'meal'],
      'music': ['song', 'instrument', 'band', 'concert'],
      'sports': ['game', 'team', 'match', 'tournament'],
      'design': ['design', 'logo', 'ui', 'graphics'],
      'business': ['business', 'startup', 'company', 'strategy'],
      'travel': ['travel', 'trip', 'vacation', 'flight'],
      'photography': ['photo', 'camera', 'picture', 'image']
    };
    
    for (const [domain, keywords] of Object.entries(priorityDomains)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return domain;
      }
    }
    
    return 'general';
  }

  private fastConfidence(text: string, actionType: string, domain: string): number {
    // Ultra-fast confidence calculation
    let confidence = 0.7; // Higher base confidence
    
    if (domain !== 'general') confidence += 0.2;
    if (text.length > 10) confidence += 0.1;
    
    return Math.min(confidence, 0.95);
  }
  
  private getCachedSuggestion(actionType: string, domain: string): string {
    // Pre-cached suggestions for instant response
    const suggestions = {
      'create_programming': 'Create new coding project',
      'create_fitness': 'Create workout plan',
      'create_cooking': 'Create recipe plan',
      'learn_programming': 'Start coding tutorial',
      'learn_fitness': 'Learn exercise techniques',
      'schedule_general': 'Schedule new event',
      'communicate_general': 'Send message',
      'analyze_general': 'Analyze information',
      'organize_general': 'Organize content'
    };
    
    const key = `${actionType}_${domain}`;
    return suggestions[key as keyof typeof suggestions] || `${actionType} ${domain} content`;
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