import express from 'express';
import ModelClient, { isUnexpected } from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';
import dotenv from 'dotenv';

dotenv.config();

// Validate configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_ENDPOINT = process.env.GITHUB_ENDPOINT || 'https://models.github.ai/inference';
const MODEL_NAME = 'openai/gpt-4.1';

if (!GITHUB_TOKEN) {
  console.error('❌ Missing GITHUB_TOKEN in environment');
  process.exit(1);
}

// Initialize Azure ModelClient
const client = ModelClient(
  GITHUB_ENDPOINT,
  new AzureKeyCredential(GITHUB_TOKEN)
);

/**
 * Sends a chat completion request to GitHub's OpenAI endpoint and parses JSON.
 */
async function queryGithubAI(disasterDescription) {
  const systemMessage = {
    role: 'system',
    content: `You are an emergency-response assistant for urban Australia. When given a user's disaster report, you MUST return exactly one JSON object with exactly two keys:\n  "steps": an array of concise, numbered next actions,\n  "contact": the emergency phone number as a string.\nUse valid JSON only; no extra text, markdown, or code fences.`
  };
  const userMessage = { role: 'user', content: `User report: "${disasterDescription}"` };

  const response = await client.path('/chat/completions').post({
    body: {
      model: MODEL_NAME,
      messages: [systemMessage, userMessage],
      temperature: 0.1,
      top_p: 0.9
    }
  });

  if (isUnexpected(response)) {
    throw new Error(`Model error: ${response.body.error.message}`);
  }

  const choice = response.body.choices?.[0]?.message?.content;
  if (!choice) {
    throw new Error('No content returned from model');
  }
  const raw = choice.trim();

  // Extract JSON between first '{' and last '}'
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  let jsonText = raw;
  if (start !== -1 && end !== -1 && end > start) {
    jsonText = raw.substring(start, end + 1);
  }

  try {
    return JSON.parse(jsonText);
  } catch (e) {
    console.warn('JSON parse failed; returning raw as single step:', e);
    return { steps: [raw], contact: '000' };
  }
}

// Setup Express server
const app = express();
app.use(express.json());

/**
 * POST /api/advice
 * Expects { eventDescription: string }
 * Returns { steps: string[], contact: string }
 */
app.post('/api/advice', async (req, res) => {
  try {
    const { eventDescription } = req.body;
    const advice = await queryGithubAI(eventDescription);
    res.json(advice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
