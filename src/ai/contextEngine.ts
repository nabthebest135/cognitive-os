import { Intent, ExtractedEntity } from '../types';

export interface ContextData {
  recentInputs: string[];
  currentSession: {
    startTime: Date;
    interactions: number;
    dominantCategory: string;
  };
  userPatterns: {
    preferredTimes: string[];
    commonTopics: string[];
    workflowSequences: string[][];
  };
  environmentContext: {
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    dayOfWeek: string;
    isWeekend: boolean;
  };
}

export class ContextEngine {
  private context: ContextData;

  constructor() {
    this.context = this.initializeContext();
    this.updateEnvironmentContext();
  }

  private initializeContext(): ContextData {
    const saved = localStorage.getItem('cos-context');
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.currentSession = {
        startTime: new Date(),
        interactions: 0,
        dominantCategory: 'general'
      };
      return parsed;
    }

    return {
      recentInputs: [],
      currentSession: {
        startTime: new Date(),
        interactions: 0,
        dominantCategory: 'general'
      },
      userPatterns: {
        preferredTimes: [],
        commonTopics: [],
        workflowSequences: []
      },
      environmentContext: {
        timeOfDay: 'morning',
        dayOfWeek: 'Monday',
        isWeekend: false
      }
    };
  }

  private updateEnvironmentContext(): void {
    const now = new Date();
    const hour = now.getHours();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    let timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    if (hour < 12) timeOfDay = 'morning';
    else if (hour < 17) timeOfDay = 'afternoon';
    else if (hour < 21) timeOfDay = 'evening';
    else timeOfDay = 'night';

    this.context.environmentContext = {
      timeOfDay,
      dayOfWeek,
      isWeekend: [0, 6].includes(now.getDay())
    };
  }

  updateContext(input: string, intent: Intent): void {
    // Update recent inputs
    this.context.recentInputs.unshift(input);
    if (this.context.recentInputs.length > 10) {
      this.context.recentInputs.pop();
    }

    // Update session
    this.context.currentSession.interactions++;
    this.updateDominantCategory(intent.category);

    // Update patterns
    this.updateUserPatterns(input, intent);

    // Save context
    this.saveContext();
  }

  private updateDominantCategory(category: string): void {
    // Simple logic to determine dominant category in session
    const categories = this.context.recentInputs.map(input => 
      this.classifyQuickCategory(input)
    );
    
    const categoryCount = categories.reduce((acc, cat) => {
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dominant = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (dominant) {
      this.context.currentSession.dominantCategory = dominant[0];
    }
  }

  private classifyQuickCategory(input: string): string {
    const lower = input.toLowerCase();
    if (lower.includes('study') || lower.includes('learn') || lower.includes('research')) return 'research';
    if (lower.includes('schedule') || lower.includes('meeting') || lower.includes('plan')) return 'planning';
    if (lower.includes('code') || lower.includes('program') || lower.includes('develop')) return 'coding';
    if (lower.includes('email') || lower.includes('call') || lower.includes('message')) return 'communication';
    if (lower.includes('design') || lower.includes('create') || lower.includes('art')) return 'creative';
    return 'general';
  }

  private updateUserPatterns(input: string, intent: Intent): void {
    // Update common topics
    const topics = intent.entities?.filter(e => e.type === 'topic').map(e => e.value) || [];
    topics.forEach(topic => {
      if (!this.context.userPatterns.commonTopics.includes(topic)) {
        this.context.userPatterns.commonTopics.push(topic);
      }
    });

    // Keep only top 20 topics
    if (this.context.userPatterns.commonTopics.length > 20) {
      this.context.userPatterns.commonTopics = this.context.userPatterns.commonTopics.slice(0, 20);
    }
  }

  getContextualSuggestions(): string[] {
    const suggestions: string[] = [];
    const { timeOfDay, isWeekend } = this.context.environmentContext;
    const { dominantCategory } = this.context.currentSession;
    const { commonTopics } = this.context.userPatterns;

    // Time-based suggestions
    if (timeOfDay === 'morning' && !isWeekend) {
      suggestions.push('plan today\'s tasks', 'check calendar for meetings', 'review daily goals');
    } else if (timeOfDay === 'evening') {
      suggestions.push('review today\'s progress', 'plan tomorrow', 'study session');
    }

    // Category-based suggestions
    if (dominantCategory === 'research' && commonTopics.length > 0) {
      suggestions.push(`continue studying ${commonTopics[0]}`, `research advanced ${commonTopics[0]} topics`);
    }

    // Pattern-based suggestions
    if (this.context.recentInputs.some(input => input.includes('exam'))) {
      suggestions.push('create exam study schedule', 'find practice problems', 'review weak topics');
    }

    return suggestions.slice(0, 5); // Return top 5 suggestions
  }

  getSmartDefaults(intent: Intent): Partial<Intent> {
    const enhancements: Partial<Intent> = {};

    // Enhance based on context
    if (intent.category === 'planning' && this.context.environmentContext.timeOfDay === 'morning') {
      enhancements.suggestion = intent.suggestion + ' (optimal morning planning time)';
    }

    if (intent.category === 'research' && this.context.userPatterns.commonTopics.length > 0) {
      const relatedTopic = this.context.userPatterns.commonTopics.find(topic =>
        intent.entities?.some(e => e.value.toLowerCase().includes(topic.toLowerCase()))
      );
      if (relatedTopic) {
        enhancements.suggestion = intent.suggestion + ` (building on your ${relatedTopic} knowledge)`;
      }
    }

    return enhancements;
  }

  private saveContext(): void {
    localStorage.setItem('cos-context', JSON.stringify(this.context));
  }

  getContext(): ContextData {
    return { ...this.context };
  }

  clearContext(): void {
    localStorage.removeItem('cos-context');
    this.context = this.initializeContext();
  }
}