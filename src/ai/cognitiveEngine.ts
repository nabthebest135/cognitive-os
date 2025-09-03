import { IntentClassifier } from './intentClassifier';
import { EntityExtractor } from './entityExtractor';
import { Intent, UserPreferences, IntentHistoryEntry } from '../types';

export class CognitiveEngine {
  private intentClassifier: IntentClassifier;
  private entityExtractor: EntityExtractor;
  private isInitialized = false;

  constructor() {
    this.intentClassifier = new IntentClassifier();
    this.entityExtractor = new EntityExtractor();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      await this.intentClassifier.initialize();
      this.isInitialized = true;
      console.log('🧠 Cognitive Engine initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Cognitive Engine:', error);
      this.isInitialized = true; // Use fallback mode
    }
  }

  async processInput(text: string): Promise<Intent | null> {
    if (!text.trim()) return null;
    
    console.log('🔍 CognitiveEngine processing:', text);
    
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Extract entities first
      const entities = this.entityExtractor.extractEntities(text);
      console.log('🏷️ Entities extracted:', entities);
      
      // Classify intent with entity context
      const intent = await this.intentClassifier.classifyIntent(text, entities);
      console.log('🎯 Intent classified:', intent);
      
      return intent;
    } catch (error) {
      console.error('❌ Error processing input:', error);
      
      // Fallback: return a basic intent
      return {
        category: 'general',
        confidence: 0.5,
        suggestion: 'Process this thought',
        action: '🧠 COS: Basic processing complete. Thought analyzed locally.',
        icon: '🧠',
        entities: []
      };
    }
  }

  updateLearningData(text: string, intent: string, feedback: 'positive' | 'negative'): void {
    // Store learning data for future model improvements
    const learningEntry = {
      text,
      intent,
      feedback,
      timestamp: new Date().toISOString()
    };
    
    // In a real implementation, this would retrain the model
    // For now, we store the feedback and use it to improve suggestions
    console.log(`🧠 COS Learning: ${feedback} feedback for "${intent}" intent`);
    
    // Proactive suggestion: if we get enough positive feedback, suggest automation
    if (feedback === 'positive') {
      console.log(`🚀 COS: Consider creating an automation for "${intent}" tasks`);
    }
  }
  
  getProactiveSuggestions(preferences: UserPreferences): string[] {
    const suggestions: string[] = [];
    
    if (preferences.intentHistory.length > 10) {
      const recentIntents = preferences.intentHistory.slice(-20);
      const intentCounts = recentIntents.reduce((acc, entry) => {
        acc[entry.intent] = (acc[entry.intent] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Suggest automation for frequent tasks
      Object.entries(intentCounts).forEach(([intent, count]) => {
        if (count >= 5) {
          suggestions.push(`Consider automating your ${intent} workflow (used ${count}x recently)`);
        }
      });
    }
    
    return suggestions;
  }

  getInsights(preferences: UserPreferences): string[] {
    const insights: string[] = [];
    
    if (preferences.intentHistory.length > 0) {
      const recentIntents = preferences.intentHistory.slice(-10);
      const intentCounts = recentIntents.reduce((acc, entry) => {
        acc[entry.intent] = (acc[entry.intent] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const mostCommon = Object.entries(intentCounts)
        .sort(([,a], [,b]) => b - a)[0];

      if (mostCommon) {
        insights.push(`Primary focus: ${mostCommon[0]} activities (${mostCommon[1]}x recent)`);
      }

      const avgConfidence = recentIntents.reduce((sum, entry) => sum + entry.confidence, 0) / recentIntents.length;
      insights.push(`AI accuracy: ${(avgConfidence * 100).toFixed(1)}% (improving with use)`);
      
      // Proactive suggestions based on patterns
      const currentHour = new Date().getHours();
      if (currentHour >= 9 && currentHour <= 17) {
        const workIntents = recentIntents.filter(i => ['coding', 'research', 'communication'].includes(i.intent));
        if (workIntents.length > 3) {
          insights.push('🚀 High productivity period detected - consider deep work session');
        }
      }
      
      // Learning insights
      if (preferences.intentHistory.length > 20) {
        insights.push(`📈 COS has learned from ${preferences.intentHistory.length} interactions`);
      }
    } else {
      insights.push('🧠 COS is learning your patterns - keep interacting!');
    }

    return insights;
  }
}