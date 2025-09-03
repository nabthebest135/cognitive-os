import * as tf from '@tensorflow/tfjs';
import { Intent, ExtractedEntity } from '../types';
import { TRAINING_DATA, INTENT_LABELS, LABEL_TO_INDEX } from './trainingData';
import { MEGA_TRAINING_DATA, MEGA_DOMAINS, MEGA_ACTIONS } from './megaTrainingData';

export class IntentClassifier {
  private model: tf.LayersModel | null = null;
  private vocabulary: Map<string, number> = new Map();
  private intentLabels: string[] = ['planning', 'coding', 'research', 'communication', 'creative'];
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Create an advanced neural network for intent classification
      this.model = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [200], units: 128, activation: 'relu' }),
          tf.layers.batchNormalization(),
          tf.layers.dropout({ rate: 0.3 }),
          tf.layers.dense({ units: 64, activation: 'relu' }),
          tf.layers.batchNormalization(),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ units: 32, activation: 'relu' }),
          tf.layers.dense({ units: this.intentLabels.length, activation: 'softmax' })
        ]
      });

      this.model.compile({
        optimizer: 'adam',
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
      });

      // Initialize vocabulary with common words
      this.initializeVocabulary();
      
      // Train with synthetic data
      await this.trainWithSyntheticData();
      
      this.isInitialized = true;
    } catch (error) {
      console.warn('TensorFlow.js model initialization failed, falling back to rule-based classification:', error);
      this.isInitialized = true; // Still mark as initialized to use fallback
    }
  }

  async classifyIntent(text: string, entities: ExtractedEntity[]): Promise<Intent> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      if (this.model) {
        const prediction = await this.predictWithModel(text);
        return this.createIntentFromPrediction(prediction, text, entities);
      }
    } catch (error) {
      console.warn('Model prediction failed, using rule-based fallback:', error);
    }

    // Fallback to enhanced rule-based classification
    return this.ruleBasedClassification(text, entities);
  }

  private async predictWithModel(text: string): Promise<{ intent: string; confidence: number }> {
    const features = this.textToFeatures(text);
    const prediction = this.model!.predict(features) as tf.Tensor;
    const probabilities = await prediction.data();
    
    const maxIndex = probabilities.indexOf(Math.max(...Array.from(probabilities)));
    const confidence = probabilities[maxIndex];
    
    prediction.dispose();
    features.dispose();

    return {
      intent: this.intentLabels[maxIndex],
      confidence
    };
  }

  private textToFeatures(text: string): tf.Tensor {
    const words = text.toLowerCase().split(/\s+/);
    const features = new Array(200).fill(0);
    
    // Word presence features
    words.forEach(word => {
      const index = this.vocabulary.get(word);
      if (index !== undefined && index < 150) {
        features[index] = 1;
      }
    });
    
    // Additional features
    features[150] = words.length; // Text length
    features[151] = words.filter(w => w.includes('email')).length; // Email mentions
    features[152] = words.filter(w => w.includes('schedule')).length; // Schedule mentions
    features[153] = words.filter(w => w.includes('code')).length; // Code mentions
    features[154] = words.filter(w => w.includes('study')).length; // Study mentions
    features[155] = words.filter(w => w.includes('design')).length; // Design mentions
    
    // Normalize length feature
    features[150] = Math.min(features[150] / 10, 1);

    return tf.tensor2d([features]);
  }

  private ruleBasedClassification(text: string, entities: ExtractedEntity[]): Intent {
    const normalizedText = text.toLowerCase();
    
    // Enhanced keyword matching with entity context
    const planningKeywords = ['plan', 'schedule', 'meeting', 'calendar', 'appointment', 'event', 'remind', 'deadline'];
    const codingKeywords = ['code', 'project', 'github', 'programming', 'develop', 'build', 'debug', 'deploy'];
    const researchKeywords = ['research', 'paper', 'notes', 'study', 'learn', 'document', 'analyze', 'investigate'];
    const communicationKeywords = ['email', 'message', 'call', 'contact', 'reach', 'follow', 'discuss', 'send', 'notify', 'inform', 'update', 'team', 'client', 'manager'];
    const creativeKeywords = ['design', 'create', 'write', 'draft', 'brainstorm', 'ideate', 'sketch'];

    // Calculate scores based on keywords and entities
    const scores = {
      planning: this.calculateScore(normalizedText, planningKeywords, entities, ['person', 'date', 'time']),
      coding: this.calculateScore(normalizedText, codingKeywords, entities, ['file', 'topic']),
      research: this.calculateScore(normalizedText, researchKeywords, entities, ['topic', 'file']),
      communication: this.calculateScore(normalizedText, communicationKeywords, entities, ['person']),
      creative: this.calculateScore(normalizedText, creativeKeywords, entities, ['topic'])
    };

    const maxScore = Math.max(...Object.values(scores));
    const bestIntent = Object.keys(scores).find(key => scores[key as keyof typeof scores] === maxScore) || 'general';
    
    return this.createIntentFromCategory(bestIntent, maxScore, text, entities);
  }

  private calculateScore(text: string, keywords: string[], entities: ExtractedEntity[], relevantEntityTypes: string[]): number {
    let score = 0;
    
    // Keyword matching
    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 1;
      }
    });

    // Entity bonus
    entities.forEach(entity => {
      if (relevantEntityTypes.includes(entity.type)) {
        score += 0.5;
      }
    });

    return score;
  }

  private createIntentFromCategory(category: string, confidence: number, text: string, entities: ExtractedEntity[]): Intent {
    const suggestions = {
      planning: {
        suggestion: this.generatePlanningAction(entities),
        action: '🧠 COS: Smart calendar integration activated. Optimal scheduling suggestions prepared locally.',
        icon: '📅'
      },
      coding: {
        suggestion: this.generateCodingAction(entities),
        action: '🧠 COS: Intelligent dev environment ready. Dependencies and boilerplate auto-configured.',
        icon: '💻'
      },
      research: {
        suggestion: this.generateResearchAction(entities),
        action: '🧠 COS: Research ecosystem activated. Knowledge graph and note synthesis ready.',
        icon: '📚'
      },
      communication: {
        suggestion: this.generateCommunicationAction(entities),
        action: '🧠 COS: Communication assistant engaged. Context-aware messaging prepared.',
        icon: '💬'
      },
      creative: {
        suggestion: this.generateCreativeAction(entities),
        action: '🧠 COS: Creative intelligence activated. Inspiration synthesis and ideation tools ready.',
        icon: '🎨'
      }
    };

    const selected = suggestions[category as keyof typeof suggestions] || {
      suggestion: 'Analyze and contextualize this thought',
      action: '🧠 COS: Cognitive analysis complete. Thought patterns integrated into your personal knowledge graph.',
      icon: '🧠'
    };

    return {
      category,
      confidence: Math.min(confidence / 3, 1), // Normalize confidence
      suggestion: selected.suggestion,
      action: selected.action,
      icon: selected.icon,
      entities
    };
  }

  private generatePlanningAction(entities: ExtractedEntity[]): string {
    const people = entities.filter(e => e.type === 'person');
    const dates = entities.filter(e => e.type === 'date');
    const places = entities.filter(e => e.type === 'place');
    
    if (people.length > 0 && dates.length > 0 && places.length > 0) {
      return `Schedule ${people[0].value} meeting on ${dates[0].value} at ${places[0].value}`;
    } else if (people.length > 0 && dates.length > 0) {
      return `Schedule meeting with ${people[0].value} on ${dates[0].value}`;
    } else if (people.length > 0) {
      return `Create event with ${people[0].value} (suggest optimal time)`;
    } else if (dates.length > 0) {
      return `Set smart reminder for ${dates[0].value}`;
    }
    return 'Create intelligent calendar event';
  }

  private generateCodingAction(entities: ExtractedEntity[]): string {
    const topics = entities.filter(e => e.type === 'topic');
    const files = entities.filter(e => e.type === 'file');
    
    if (topics.length > 0 && files.length > 0) {
      return `Setup ${topics[0].value} project with ${files[0].value} boilerplate`;
    } else if (topics.length > 0) {
      return `Initialize ${topics[0].value} project (auto-detect framework)`;
    } else if (files.length > 0) {
      return `Create ${files[0].value} workspace with dependencies`;
    }
    return 'Setup intelligent development environment';
  }

  private generateResearchAction(entities: ExtractedEntity[]): string {
    const topics = entities.filter(e => e.type === 'topic');
    
    if (topics.length > 0) {
      return `Research ${topics[0].value}`;
    }
    return 'Start a new research session';
  }

  private generateCommunicationAction(entities: ExtractedEntity[]): string {
    const people = entities.filter(e => e.type === 'person');
    
    if (people.length > 0) {
      return `Draft message to ${people[0].value}`;
    }
    return 'Compose new message';
  }

  private generateCreativeAction(entities: ExtractedEntity[]): string {
    const topics = entities.filter(e => e.type === 'topic');
    
    if (topics.length > 0) {
      return `Create ${topics[0].value} concept`;
    }
    return 'Start creative session';
  }

  private initializeVocabulary(): void {
    const commonWords = [
      // Planning words (0-29)
      'plan', 'schedule', 'meeting', 'calendar', 'appointment', 'event', 'remind', 'deadline',
      'tomorrow', 'today', 'next', 'week', 'month', 'time', 'date', 'when', 'where',
      'book', 'organize', 'set', 'arrange', 'prepare', 'coordinate', 'manage', 'timeline',
      'agenda', 'venue', 'reservation', 'booking', 'session',
      
      // Coding words (30-59)
      'code', 'project', 'github', 'programming', 'develop', 'build', 'debug', 'deploy',
      'function', 'class', 'variable', 'api', 'database', 'frontend', 'backend', 'framework',
      'react', 'javascript', 'python', 'typescript', 'node', 'docker', 'kubernetes', 'git',
      'repository', 'commit', 'branch', 'merge', 'pull', 'push',
      
      // Research words (60-89)
      'research', 'paper', 'notes', 'study', 'learn', 'document', 'analyze', 'investigate',
      'article', 'book', 'source', 'reference', 'data', 'information', 'knowledge',
      'exam', 'test', 'quiz', 'homework', 'assignment', 'thesis', 'dissertation', 'report',
      'analysis', 'survey', 'experiment', 'observation', 'findings', 'conclusion', 'theory',
      
      // Communication words (90-119)
      'email', 'message', 'call', 'contact', 'reach', 'follow', 'discuss', 'talk',
      'send', 'reply', 'respond', 'communicate', 'chat', 'conversation', 'notify',
      'inform', 'update', 'team', 'client', 'manager', 'about', 'regarding',
      'newsletter', 'announcement', 'feedback', 'proposal', 'invoice', 'reminder', 'alert', 'notice',
      
      // Creative words (120-149)
      'design', 'create', 'write', 'draft', 'brainstorm', 'ideate', 'sketch', 'imagine',
      'concept', 'idea', 'inspiration', 'creative', 'art', 'story', 'content',
      'logo', 'brand', 'marketing', 'campaign', 'poster', 'flyer', 'brochure', 'website',
      'mockup', 'prototype', 'wireframe', 'layout', 'graphics', 'illustration', 'animation', 'video'
    ];

    commonWords.forEach((word, index) => {
      this.vocabulary.set(word, index);
    });
    
    console.log(`📚 Vocabulary initialized with ${commonWords.length} words`);
  }

  private async trainWithSyntheticData(): Promise<void> {
    if (!this.model) return;

    console.log('🎤 Training advanced model with 250 examples...');
    
    // Use comprehensive training data
    const xs = TRAINING_DATA.map(item => this.textToFeatures(item.text));
    const ys = TRAINING_DATA.map(item => {
      const label = new Array(this.intentLabels.length).fill(0);
      const intentIndex = LABEL_TO_INDEX[item.intent as keyof typeof LABEL_TO_INDEX];
      label[intentIndex] = 1;
      return label;
    });

    const xsTensor = tf.stack(xs.map(x => x.squeeze()));
    const ysTensor = tf.tensor2d(ys);

    // Train the model with better parameters
    await this.model.fit(xsTensor, ysTensor, {
      epochs: 100,
      batchSize: 8,
      validationSplit: 0.2,
      shuffle: true,
      verbose: 0,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (epoch % 20 === 0) {
            console.log(`🎤 Training epoch ${epoch}: accuracy = ${(logs?.acc * 100).toFixed(1)}%`);
          }
        }
      }
    });

    console.log('✅ Model training completed with 250 examples!');

    // Clean up tensors
    xs.forEach(x => x.dispose());
    xsTensor.dispose();
    ysTensor.dispose();
  }

}