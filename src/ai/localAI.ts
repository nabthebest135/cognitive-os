// Temporary AI for Training Data Collection
export class LocalAI {
  private isInitialized = false;
  private trainingData: Array<{input: string, output: string, timestamp: string}> = [];

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;
    console.log('🤖 Training data collection system ready');
    
    // Load existing training data
    const stored = localStorage.getItem('cos-training-data');
    if (stored) {
      this.trainingData = JSON.parse(stored);
      console.log(`📊 Loaded ${this.trainingData.length} training examples`);
    }
  }

  async generateResponse(userInput: string): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Try Hugging Face API (free tier)
      const response = await this.callHuggingFaceAPI(userInput);
      
      // Store for training data
      this.storeTrainingExample(userInput, response);
      
      return response;
    } catch (error) {
      console.warn('AI API failed, using fallback:', error);
      const fallback = this.smartFallback(userInput);
      this.storeTrainingExample(userInput, fallback);
      return fallback;
    }
  }

  private async callHuggingFaceAPI(input: string): Promise<string> {
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Using free tier - no API key needed for basic usage
      },
      body: JSON.stringify({
        inputs: input,
        parameters: {
          max_length: 200,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API failed: ${response.status}`);
    }

    const data = await response.json();
    return data[0]?.generated_text || this.smartFallback(input);
  }

  private storeTrainingExample(input: string, output: string): void {
    const example = {
      input: input.trim(),
      output: output.trim(),
      timestamp: new Date().toISOString()
    };
    
    this.trainingData.push(example);
    
    // Keep only last 1000 examples
    if (this.trainingData.length > 1000) {
      this.trainingData = this.trainingData.slice(-1000);
    }
    
    // Save to localStorage
    localStorage.setItem('cos-training-data', JSON.stringify(this.trainingData));
    
    console.log(`📊 Training data: ${this.trainingData.length} examples collected`);
  }

  getTrainingData(): Array<{input: string, output: string, timestamp: string}> {
    return this.trainingData;
  }

  exportTrainingData(): string {
    return JSON.stringify(this.trainingData, null, 2);
  }

  clearTrainingData(): void {
    this.trainingData = [];
    localStorage.removeItem('cos-training-data');
    console.log('🗑️ Training data cleared');
  }

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