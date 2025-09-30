
const functions = require('firebase-functions');
const fetch = require('node-fetch');

exports.openaiProxy = functions.https.onRequest(async (req, res) => {
  const OPENAI_KEY = functions.config().openai.key; // set with firebase CLI
  const { message, userState } = req.body;

  if (!OPENAI_KEY) return res.status(500).send('OpenAI key not set');

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are Ritvana, a calm, encouraging life coach. No medical advice.' },
          { role: 'user', content: message }
        ],
        max_tokens: 200
      })
    });
    const data = await resp.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error contacting OpenAI');
  }
});
