
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// WARNING: Hardcoding API keys in source code is not recommended for security reasons.
// Your API key will be exposed if you share or publish this code.
// It is recommended to use environment variables instead.
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";

if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
  // This check is to prevent running the app with the placeholder key.
  // Replace "YOUR_GEMINI_API_KEY_HERE" with your actual key.
  throw new Error(
    'Please replace "YOUR_GEMINI_API_KEY_HERE" with your actual Gemini API key in src/ai/genkit.ts. You can get a key from Google AI Studio (https://aistudio.google.com/app/apikey).'
  );
}


export const ai = genkit({
  plugins: [googleAI({apiKey: GEMINI_API_KEY})],
  model: 'googleai/gemini-2.5-flash',
});
