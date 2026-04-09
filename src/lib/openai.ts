import OpenAI from 'openai';

// Lazy initialization to avoid crashing if key is missing
let openaiClient: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!openaiClient) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_OPENAI_API_KEY is missing. Please add it to your environment variables.');
    }
    openaiClient = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // Since we are in a client-side environment for now
    });
  }
  return openaiClient;
}

export const OPENAI_MODEL = 'gpt-4o';
