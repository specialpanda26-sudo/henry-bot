// ============================================
//   Command: .imagine [text] - Create styled text image
//   (Text-only version - no canvas required)
// ============================================

module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const text = args.full;

  if (!text) {
    return sock.sendMessage(from, {
      text: '❌ Provide text.\nExample: `.imagine Good vibes only ✨`'
    }, { quoted: msg });
  }

  try {
    const border = '═'.repeat(30);
    const styled = `
╔${border}╗
║
║   🎨 *Henry Bot - Image Text*
║
╠${border}╣
║
║   ✨ ${text}
║
╚${border}╝
`.trim();

    await sock.sendMessage(from, { text: styled }, { quoted: msg });

  } catch (err) {
    console.error('Imagine error:', err.message);
    await sock.sendMessage(from, { text: '❌ Failed to create image text.' }, { quoted: msg });
  }
};

