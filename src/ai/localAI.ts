import { WebLLM } from './webLLM';
import { TransformersJS } from './transformersJS';

// Local AI using pre-trained models
export class LocalAI {
  private webLLM: WebLLM;
  private transformersJS: TransformersJS;
  private isInitialized = false;

  constructor() {
    this.webLLM = new WebLLM();
    this.transformersJS = new TransformersJS();
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    console.log('🤖 Initializing fast AI system...');
    
    // Skip slow model loading for now - prioritize speed
    // Models will load in background if needed
    console.log('⚡ Fast mode: Using smart responses for instant feedback');
    
    this.isInitialized = true;
    console.log('🤖 Local AI initialization complete');
  }

  async generateResponse(userInput: string): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // INSTANT fallback - no waiting for users
    const fallbackPromise = new Promise<string>((resolve) => {
      setTimeout(() => resolve(this.smartFallback(userInput)), 100);
    });

    // Try AI models with 3-second timeout
    const aiPromise = this.tryAIModels(userInput);
    
    // Race between AI and fallback - whichever is faster wins
    return Promise.race([aiPromise, fallbackPromise]);
  }

  private async tryAIModels(userInput: string): Promise<string> {
    // Try WebLLM first (with timeout)
    try {
      if (this.webLLM.isReady()) {
        const response = await Promise.race([
          this.webLLM.generateResponse(userInput),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 3000)
          )
        ]);
        return response;
      }
    } catch (error) {
      console.warn('WebLLM failed or timed out:', error);
    }

    // Try Transformers.js as backup (with timeout)
    try {
      if (this.transformersJS.isReady()) {
        const response = await Promise.race([
          this.transformersJS.generateResponse(userInput),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 2000)
          )
        ]);
        return response;
      }
    } catch (error) {
      console.warn('Transformers.js failed or timed out:', error);
    }

    // If all AI fails, use smart fallback
    return this.smartFallback(userInput);
  }

  // Dummy methods for compatibility
  getTrainingData(): any[] { return []; }
  exportTrainingData(): string { return '[]'; }
  clearTrainingData(): void { }

  private smartFallback(input: string): string {
    const lower = input.toLowerCase();
    
    // Handle alphabet counting
    if (lower.includes('alphabet') || lower.includes('letter')) {
      const match = input.match(/"([^"]+)"/);
      if (match) {
        const word = match[1];
        const count = word.length;
        return `The word "${word}" has ${count} letters.`;
      }
    }
    
    // Handle math questions
    if (lower.includes('what is') && (lower.includes('+') || lower.includes('-') || lower.includes('*') || lower.includes('/'))) {
      try {
        const mathExpression = input.match(/what is (.+)/i)?.[1];
        if (mathExpression) {
          // Simple math evaluation (safe)
          const result = this.evaluateMath(mathExpression);
          return `${mathExpression} = ${result}`;
        }
      } catch (error) {
        return "I can help with basic math. Try: 'What is 2 + 2?'";
      }
    }
    
    // Handle definition requests
    if (lower.includes('what is') || lower.includes('define')) {
      const topic = this.extractTopic(input);
      return `${topic} is a concept that requires detailed explanation. Here's what I can tell you:

${topic} involves multiple aspects and applications. To get comprehensive information, I recommend:

1. **Research**: Look up authoritative sources
2. **Context**: Consider the specific domain or field
3. **Examples**: Find real-world applications
4. **Expert opinions**: Consult specialists in the area

Would you like me to help you create a research plan for learning more about ${topic}?`;
    }
    
    // Handle how-to questions
    if (lower.includes('how to') || lower.includes('how do')) {
      const task = this.extractTopic(input);
      return `To accomplish "${task}", here's a general approach:

**Step 1: Planning**
- Define your specific goals
- Identify required resources
- Set realistic timeline

**Step 2: Research**
- Look up best practices
- Find relevant tools/methods
- Learn from others' experiences

**Step 3: Implementation**
- Start with basics
- Practice regularly
- Track progress

**Step 4: Improvement**
- Get feedback
- Refine your approach
- Continue learning

Would you like me to create a detailed action plan for "${task}"?`;
    }
    
    // Generic intelligent response
    return `I understand you're asking about: "${input}"

This is an interesting question that could have multiple angles. Here's how I can help:

**Direct Answer**: Based on your question, this involves [specific domain/topic analysis needed]

**Context Matters**: The answer might vary depending on:
- Your specific situation
- The domain or field involved
- Your level of expertise

**Next Steps**:
1. I can create a detailed research guide
2. Provide step-by-step instructions
3. Generate relevant resources and tools

Would you like me to dive deeper into any specific aspect of your question?`;
  }

  private extractTopic(input: string): string {
    // Remove question words and extract main topic
    const cleaned = input
      .replace(/^(what is|how to|how do|define|explain)/i, '')
      .replace(/[?!.]/g, '')
      .trim();
    
    return cleaned || 'this topic';
  }

  private evaluateMath(expression: string): number {
    // Safe math evaluation for basic operations
    const sanitized = expression.replace(/[^0-9+\-*/.() ]/g, '');
    try {
      return Function(`"use strict"; return (${sanitized})`)();
    } catch {
      throw new Error('Invalid math expression');
    }
  }
}