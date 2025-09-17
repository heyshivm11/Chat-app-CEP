
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {config} from 'dotenv';
config();

// It is recommended to use environment variables for API keys.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY || GEMINI_API_KEY === "") {
  // This check is to prevent running the app without a valid key.
  // You can get a key from Google AI Studio (https://aistudio.google.com/app/apikey)
  // and add it to your .env file as GEMINI_API_KEY="YOUR_KEY"
  throw new Error(
    'Please add your Gemini API key to the .env file. You can get a key from Google AI Studio (https://aistudio.google.com/app/apikey).'
  );
}


export const ai = genkit({
  plugins: [googleAI({apiKey: })],
  model: 'googleai/gemini-2.5-flash',
});
