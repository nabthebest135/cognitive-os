export interface Intent {
  category: string;
  confidence: number;
  suggestion: string;
  action: string;
  icon: string;
  entities?: ExtractedEntity[];
  domain?: string;
}

export interface ExtractedEntity {
  type: 'person' | 'date' | 'time' | 'place' | 'topic' | 'file';
  value: string;
  normalized?: string;
}

export interface UserPreferences {
  intentHistory: IntentHistoryEntry[];
  lastActivity: string;
  learningData: LearningData[];
}

export interface IntentHistoryEntry {
  text: string;
  intent: string;
  confidence: number;
  timestamp: string;
  entities: ExtractedEntity[];
}

export interface LearningData {
  text: string;
  intent: string;
  feedback: 'positive' | 'negative';
  timestamp: string;
}