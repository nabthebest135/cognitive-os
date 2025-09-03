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
    
    // High-confidence keyword detection
    if (lower.includes('learn') || lower.includes('study')) {
      return {
        category: 'research',
        confidence: 0.94,
        suggestion: 'Download study plan & resources',
        action: '⚡ COS: Learning mode activated',
        icon: '📚',
        entities
      };
    }
    
    if (lower.includes('email') || lower.includes('message') || lower.includes('call')) {
      return {
        category: 'communication',
        confidence: 0.96,
        suggestion: 'Open email draft',
        action: '⚡ COS: Communication ready',
        icon: '💬',
        entities
      };
    }
    
    if (lower.includes('schedule') || lower.includes('plan') || lower.includes('meeting')) {
      return {
        category: 'planning',
        confidence: 0.93,
        suggestion: 'Download calendar event',
        action: '⚡ COS: Planning activated',
        icon: '📅',
        entities
      };
    }
    
    if (lower.includes('code') || lower.includes('program') || lower.includes('develop')) {
      return {
        category: 'coding',
        confidence: 0.95,
        suggestion: 'Download project setup',
        action: '⚡ COS: Development ready',
        icon: '💻',
        entities
      };
    }
    
    if (lower.includes('design') || lower.includes('create') || lower.includes('make')) {
      return {
        category: 'creative',
        confidence: 0.91,
        suggestion: 'Download creative brief',
        action: '⚡ COS: Creative mode ready',
        icon: '🎨',
        entities
      };
    }
    
    // Default
    return {
      category: 'general',
      confidence: 0.82,
      suggestion: 'Generate helpful content',
      action: '⚡ COS: Ready to assist',
      icon: '🧠',
      entities
    };
  }

}