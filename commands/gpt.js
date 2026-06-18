// ============================================
//   Command: .gpt [question] - Ask ChatGPT
// ============================================

const { OpenAI } = require('openai');
const config = require('../config');

const openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });

module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const question = args.full;

  if (!question) {
    return sock.sendMessage(from, {
      text: '❌ Please provide a question.\nExample: `.gpt What is the meaning of life?`'
    }, { quoted: msg });
  }

  await sock.sendMessage(from, { text: '🧠 Thinking...' }, { quoted: msg });

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: question }],
      max_tokens: 500,
    });

    const answer = response.choices[0].message.content.trim();
    await sock.sendMessage(from, { text: `🤖 *ChatGPT:*\n\n${answer}` }, { quoted: msg });

  } catch (err) {
    console.error('GPT error:', err.message);
    await sock.sendMessage(from, {
      text: '❌ GPT error. Check your API key in config.js'
    }, { quoted: msg });
  }
};
