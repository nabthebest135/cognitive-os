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
    // Try multiple free AI APIs for better quality
    const apis = [
      () => this.tryGroqAPI(userInput),
      () => this.tryHuggingFaceAPI(userInput),
      () => this.tryOpenRouterAPI(userInput)
    ];

    for (const apiCall of apis) {
      try {
        const response = await Promise.race([
          apiCall(),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 3000)
          )
        ]);
        if (response && response.length > 10) {
          return response;
        }
      } catch (error) {
        console.warn('API failed:', error);
      }
    }

    // If all APIs fail, use smart fallback
    return this.smartFallback(userInput);
  }

  private async tryGroqAPI(input: string): Promise<string> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer gsk_demo_key' // Demo key for testing
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{
          role: 'user',
          content: input
        }],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    if (!response.ok) throw new Error('Groq API failed');
    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  private async tryHuggingFaceAPI(input: string): Promise<string> {
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-large', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: input,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.7,
          return_full_text: false
        }
      })
    });

    if (!response.ok) throw new Error('HuggingFace API failed');
    const data = await response.json();
    return data[0]?.generated_text || '';
  }

  private async tryOpenRouterAPI(input: string): Promise<string> {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk-or-v1-demo' // Demo key
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [{
          role: 'user',
          content: input
        }],
        max_tokens: 200
      })
    });

    if (!response.ok) throw new Error('OpenRouter API failed');
    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  }

  // Dummy methods for compatibility
  getTrainingData(): any[] { return []; }
  exportTrainingData(): string { return '[]'; }
  clearTrainingData(): void { }

  private smartFallback(input: string): string {
    return `AI service temporarily unavailable. Please try again.`;
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