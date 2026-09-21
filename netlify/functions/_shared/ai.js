const DEFAULT_CLAUDE_MODEL = 'claude-haiku-4-5-20251001';
const CLAUDE_MODELS = [DEFAULT_CLAUDE_MODEL, 'claude-haiku-4-5'];

function extractJsonObject(text) {
  const match = String(text || '').match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

function extractText(data) {
  if (!data) return '';
  if (typeof data === 'string') return data;
  const blocks = data.content;
  if (Array.isArray(blocks)) {
    return blocks
      .filter((b) => b?.type === 'text' && b.text)
      .map((b) => b.text)
      .join('\n');
  }
  return (
    data?.result?.response ||
    data?.result?.message ||
    data?.response ||
    (typeof data?.result === 'string' ? data.result : '') ||
    JSON.stringify(data?.result || data)
  );
}

async function callClaude(prompt, options = {}) {
  const apiKey = process.env.CLAUDE_ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  const preferred = process.env.ANTHROPIC_MODEL_ID || DEFAULT_CLAUDE_MODEL;
  const models = [...new Set([preferred, ...CLAUDE_MODELS])];
  let lastError = '';

  for (const model of models) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: options.maxTokens || 400,
        system:
          options.system ||
          "You are FreshLink Detroit's ordering assistant. Reply with a JSON object only.",
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      return { source: 'claude', text: extractText(data) };
    }
    lastError = data?.error?.message || data?.message || `HTTP ${res.status}`;
    if (!/model/i.test(lastError)) break;
  }
  console.warn('[ai] Claude error', lastError);
  return null;
}

async function callCloudflare(prompt) {
  const token = process.env.API_TOKEN;
  const url = process.env.CLOUDFLARE_URL;
  if (!token || !url) return null;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) {
    console.warn('[ai] Cloudflare error', res.status, await res.text());
    return null;
  }
  const data = await res.json();
  return { source: 'cloudflare', text: extractText(data) };
}

/**
 * Production (Netlify): CLAUDE_ANTHROPIC_API_KEY → Anthropic Messages API.
 * Local/dev: CLOUDFLARE_URL + API_TOKEN → Cloudflare Workers AI.
 * Cursor is not used as the app AI backend.
 */
async function completePrompt(prompt, options) {
  if (process.env.CLAUDE_ANTHROPIC_API_KEY) {
    const claude = await callClaude(prompt, options);
    if (claude) return claude;
  }
  return callCloudflare(prompt);
}

module.exports = {
  completePrompt,
  extractJsonObject,
};
