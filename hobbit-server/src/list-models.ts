import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('No API key');
    return;
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  try {
    const models = await genAI.listModels();
    console.log('Available Models:');
    models.models.forEach((m: any) => console.log(`- ${m.name}`));
  } catch (err) {
    console.error('Failed to list models:', err);
  }
}

main();
