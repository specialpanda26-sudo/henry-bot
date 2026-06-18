// ============================================
//   Command: .ping - Check bot response speed
// ============================================

module.exports = async (sock, msg) => {
  const from = msg.key.remoteJid;
  const start = Date.now();
  await sock.sendMessage(from, { text: '⏱️ Pinging...' }, { quoted: msg });
  const ping = Date.now() - start;
  await sock.sendMessage(from, { text: `🏓 Pong! *${ping}ms*` }, { quoted: msg });
};
