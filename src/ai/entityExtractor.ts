import { ExtractedEntity } from '../types';

export class EntityExtractor {
  extractEntities(text: string): ExtractedEntity[] {
    const entities: ExtractedEntity[] = [];

    try {
      // Simple pattern-based entity extraction
      
      // Extract people (capitalized words that might be names)
      const namePattern = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g;
      const nameMatches = text.match(namePattern) || [];
      nameMatches.forEach(name => {
        if (this.isLikelyName(name)) {
          entities.push({
            type: 'person',
            value: name,
            normalized: name.toLowerCase()
          });
        }
      });

      // Extract dates
      const datePatterns = [
        /\b(tomorrow|today|yesterday)\b/gi,
        /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi,
        /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}\b/gi,
        /\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/g
      ];
      
      datePatterns.forEach(pattern => {
        const matches = text.match(pattern) || [];
        matches.forEach(date => {
          entities.push({
            type: 'date',
            value: date,
            normalized: date.toLowerCase()
          });
        });
      });

      // Extract times
      const timePattern = /\b\d{1,2}(:\d{2})?(\s*(am|pm|AM|PM))?\b/g;
      const timeMatches = text.match(timePattern) || [];
      timeMatches.forEach(time => {
        entities.push({
          type: 'time',
          value: time,
          normalized: time.toLowerCase()
        });
      });

      // Extract topics (important nouns)
      const topicWords = ['react', 'typescript', 'javascript', 'python', 'project', 'api', 'database', 'frontend', 'backend', 'design', 'logo', 'startup', 'meeting', 'research', 'algorithm', 'machine', 'learning', 'ai'];
      topicWords.forEach(topic => {
        if (text.toLowerCase().includes(topic)) {
          entities.push({
            type: 'topic',
            value: topic,
            normalized: topic.toLowerCase()
          });
        }
      });

      // Extract file extensions
      const filePattern = /\.(js|ts|py|html|css|md|txt|pdf|doc|xlsx?|json|xml|sql|sh|yml|yaml)\b/gi;
      const fileMatches = text.match(filePattern) || [];
      fileMatches.forEach(file => {
        entities.push({
          type: 'file',
          value: file,
          normalized: file.toLowerCase()
        });
      });

    } catch (error) {
      console.warn('Entity extraction error:', error);
    }

    return entities;
  }

  private isLikelyName(word: string): boolean {
    const commonWords = ['React', 'JavaScript', 'TypeScript', 'Python', 'API', 'HTML', 'CSS'];
    return !commonWords.includes(word) && word.length > 2;
  }
}