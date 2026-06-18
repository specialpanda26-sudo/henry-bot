// ============================================
//   Command: .status - Show feature states
// ============================================

const state = require('../lib/state');

module.exports = async (sock, msg) => {
  const from = msg.key.remoteJid;
  const on = '✅ ON';
  const off = '❌ OFF';
  const f = state.features;

  const text = `
📊 *Feature Status*

👁️ Auto View Status: ${f.AUTO_VIEW_STATUS ? on : off}
❤️ Auto Like Status: ${f.AUTO_LIKE_STATUS ? on : off}
🌐 Always Online:    ${f.ALWAYS_ONLINE ? on : off}
📖 Auto Read:        ${f.AUTO_READ ? on : off}
📝 Auto Bio:         ${f.AUTO_BIO ? on : off}
🚫 Anti-Call:        ${f.ANTI_CALL ? on : off}
✅ Auto Blue Ticks:  ${f.AUTO_BLUE_TICKS ? on : off}
`.trim();

  await sock.sendMessage(from, { text }, { quoted: msg });
};
