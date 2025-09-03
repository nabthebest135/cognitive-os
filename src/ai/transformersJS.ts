// Transformers.js - Runs Hugging Face models directly in browser
export class TransformersJS {
  private pipeline: any = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      // Use Transformers.js - runs HF models in browser
      const { pipeline } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2');
      
      // Load a small, fast model for text generation
      this.pipeline = await pipeline('text-generation', 'Xenova/gpt2', {
        quantized: true, // Smaller model size
        progress_callback: (progress: any) => {
          if (progress.status === 'downloading') {
            console.log(`🤖 Downloading model: ${Math.round(progress.progress)}%`);
          }
        }
      });
      
      this.isInitialized = true;
      console.log('🤖 Transformers.js model loaded successfully');
    } catch (error) {
      console.warn('Transformers.js failed to load:', error);
      this.isInitialized = false;
    }
  }

  async generateResponse(input: string): Promise<string> {
    if (!this.isInitialized || !this.pipeline) {
      throw new Error('Model not initialized');
    }

    try {
      const result = await this.pipeline(input, {
        max_new_tokens: 100,
        temperature: 0.7,
        do_sample: true,
        pad_token_id: 50256
      });

      // Extract just the new generated text
      const generated = result[0].generated_text;
      const newText = generated.replace(input, '').trim();
      
      return newText || "I understand your question. Let me help you with that.";
    } catch (error) {
      console.error('Generation failed:', error);
      throw error;
    }
  }

  isReady(): boolean {
    return this.isInitialized && this.pipeline !== null;
  }
}