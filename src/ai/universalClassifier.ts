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
    // INSTANT single-pass detection
    let actionType: 'create' | 'schedule' | 'learn' | 'communicate' | 'analyze' | 'organize';
    
    // Instant action detection
    if (text.includes('learn')) actionType = 'learn';
    else if (text.includes('email') || text.includes('message')) actionType = 'communicate';
    else if (text.includes('schedule') || text.includes('plan')) actionType = 'schedule';
    else if (text.includes('create') || text.includes('make')) actionType = 'create';
    else if (text.includes('analyze') || text.includes('review')) actionType = 'analyze';
    else if (text.includes('organize') || text.includes('sort')) actionType = 'organize';
    else actionType = 'create'; // default
    
    // Instant domain detection
    const domain = this.fastDomainMatch(text);
    
    return [actionType, domain];
  }

  private fastDomainMatch(text: string): string {
    // INSTANT domain detection - single pass
    if (text.includes('guitar') || text.includes('piano') || text.includes('music') || text.includes('song')) return 'music';
    if (text.includes('code') || text.includes('programming') || text.includes('javascript')) return 'programming';
    if (text.includes('workout') || text.includes('fitness') || text.includes('gym')) return 'fitness';
    if (text.includes('recipe') || text.includes('cooking') || text.includes('food')) return 'cooking';
    if (text.includes('photo') || text.includes('camera') || text.includes('picture')) return 'photography';
    if (text.includes('travel') || text.includes('trip') || text.includes('vacation')) return 'travel';
    if (text.includes('design') || text.includes('logo') || text.includes('ui')) return 'design';
    if (text.includes('business') || text.includes('startup') || text.includes('company')) return 'business';
    if (text.includes('game') || text.includes('gaming') || text.includes('esports')) return 'gaming';
    if (text.includes('health') || text.includes('wellness') || text.includes('medical')) return 'health';
    
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
    // INSTANT pre-cached suggestions
    if (actionType === 'learn' && domain === 'music') return 'Start guitar learning session';
    if (actionType === 'learn' && domain === 'programming') return 'Begin coding tutorial';
    if (actionType === 'create' && domain === 'fitness') return 'Create workout plan';
    if (actionType === 'schedule') return 'Schedule new event';
    if (actionType === 'communicate') return 'Send message';
    if (actionType === 'analyze') return 'Analyze information';
    if (actionType === 'organize') return 'Organize content';
    
    return `${actionType} ${domain} content`;
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