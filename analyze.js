import { Configuration, OpenAIApi } from 'openai';

const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(config);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { entry } = req.body;

  const prompt = \`Analyze the following trade journal entry. Identify:
- Ticker mentioned
- Bias score from 0 (neutral) to 10 (very biased)
- Conviction level (Low, Medium, High)
- One-sentence summary of tone

Entry: "\${entry}"\`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }]
    });

    const response = completion.data.choices[0].message.content;
    const [tickerLine, biasLine, convictionLine, summaryLine] = response.split('\n').map(line => line.replace(/^[-*]\s*/, '').trim());

    res.status(200).json({
      ticker: tickerLine.split(':')[1]?.trim(),
      bias_score: biasLine.split(':')[1]?.trim(),
      conviction: convictionLine.split(':')[1]?.trim(),
      summary: summaryLine.split(':')[1]?.trim()
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to analyze entry.' });
  }
}