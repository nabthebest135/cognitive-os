import { Intent, ExtractedEntity } from '../types';

export class IntentClassifier {
  private isInitialized = false;

  async initialize(): Promise<void> {
    // Lightweight initialization - no TensorFlow needed
    this.isInitialized = true;
    console.log('⚡ Lightweight classifier ready');
  }

  async classifyIntent(text: string, entities: ExtractedEntity[]): Promise<Intent> {
    // Ultra-lightweight classification
    return this.lightweightClassification(text, entities);
  }

  private lightweightClassification(text: string, entities: ExtractedEntity[]): Intent {
    const lower = text.toLowerCase();
    
    // Ultra-fast keyword detection
    if (lower.includes('learn') || lower.includes('study')) {
      return {
        category: 'research',
        confidence: 0.9,
        suggestion: 'Start learning session',
        action: '⚡ COS: Learning mode activated',
        icon: '📚',
        entities
      };
    }
    
    if (lower.includes('email') || lower.includes('message') || lower.includes('call')) {
      return {
        category: 'communication',
        confidence: 0.9,
        suggestion: 'Send communication',
        action: '⚡ COS: Communication ready',
        icon: '💬',
        entities
      };
    }
    
    if (lower.includes('schedule') || lower.includes('plan') || lower.includes('meeting')) {
      return {
        category: 'planning',
        confidence: 0.9,
        suggestion: 'Create schedule',
        action: '⚡ COS: Planning activated',
        icon: '📅',
        entities
      };
    }
    
    if (lower.includes('code') || lower.includes('program') || lower.includes('develop')) {
      return {
        category: 'coding',
        confidence: 0.9,
        suggestion: 'Start coding session',
        action: '⚡ COS: Development ready',
        icon: '💻',
        entities
      };
    }
    
    if (lower.includes('design') || lower.includes('create') || lower.includes('make')) {
      return {
        category: 'creative',
        confidence: 0.9,
        suggestion: 'Begin creative work',
        action: '⚡ COS: Creative mode ready',
        icon: '🎨',
        entities
      };
    }
    
    // Default
    return {
      category: 'general',
      confidence: 0.7,
      suggestion: 'Process this thought',
      action: '⚡ COS: Ready to assist',
      icon: '🧠',
      entities
    };
  }

}