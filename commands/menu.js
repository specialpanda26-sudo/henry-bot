// ============================================
//   Command: .menu - Show all commands
// ============================================

const { buildMenu } = require('../lib/helper');
const config = require('../config');
const p = config.PREFIX;

module.exports = async (sock, msg) => {
  const from = msg.key.remoteJid;

  const menu = `
╔══════════════════════════════╗
║   🤖 *${config.BOT_NAME} - Command Menu*
╠══════════════════════════════╣
║
║  📥 *DOWNLOADS*
║  ${p}play [song]    - Download song
║  ${p}video [name]   - Download YT video
║  ${p}ig [url]       - Download IG content
║  ${p}fb [url]       - Download FB video
║  ${p}yt [url]       - Download YT video
║
║  🤖 *AI & TOOLS*
║  ${p}gpt [question] - Ask ChatGPT
║  ${p}imagine [text] - Generate image w/ text
║  ${p}sticker        - Convert image to sticker
║
║  ⚙️ *AUTO FEATURES (Owner)*
║  ${p}autostatus     - Toggle auto view status
║  ${p}autolike       - Toggle auto like status
║  ${p}alwaysonline   - Toggle always online
║  ${p}autoread       - Toggle auto read msgs
║  ${p}autobio        - Toggle auto bio rotation
║  ${p}anticall       - Toggle anti-call
║  ${p}autoreact      - Toggle auto react
║  ${p}autoblueticks  - Toggle auto blue ticks
║
║  🎭 *FUN TRICKS*
║  ${p}faketyping     - Simulate typing for 10s
║  ${p}fakerecording  - Simulate recording for 10s
║
║  📇 *CONTACTS*
║  ${p}savecontacts   - Save all group contacts
║
║  ℹ️ *INFO*
║  ${p}ping           - Check bot speed
║  ${p}status         - Show feature status
║  ${p}menu           - Show this menu
║
╚══════════════════════════════╝
`.trim();

  await sock.sendMessage(from, { text: menu }, { quoted: msg });
};
