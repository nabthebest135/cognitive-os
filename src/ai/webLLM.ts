// Web LLM Integration - Uses pre-trained models directly in browser
export class WebLLM {
  private engine: any = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Use WebLLM - runs Llama models directly in browser
      const { CreateMLCEngine } = await import('https://esm.run/@mlc-ai/web-llm');
      
      this.engine = await CreateMLCEngine("Llama-3.2-1B-Instruct-q4f16_1", {
        initProgressCallback: (report: any) => {
          console.log(`🤖 Loading model: ${report.text}`);
        }
      });
      
      this.isInitialized = true;
      console.log('🤖 WebLLM model loaded successfully');
    } catch (error) {
      console.warn('WebLLM failed to load:', error);
      this.isInitialized = false;
    }
  }

  async generateResponse(input: string): Promise<string> {
    if (!this.isInitialized) {
      throw new Error('Model not initialized');
    }

    try {
      const messages = [
        { role: "system", content: "You are a helpful AI assistant. Give concise, accurate answers." },
        { role: "user", content: input }
      ];

      const reply = await this.engine.chat.completions.create({
        messages,
        temperature: 0.7,
        max_tokens: 256
      });

      return reply.choices[0].message.content;
    } catch (error) {
      console.error('Generation failed:', error);
      throw error;
    }
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}