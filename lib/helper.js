// ============================================
//   WhatsApp Bot - Helper Utilities
// ============================================

const config = require('../config');

/**
 * Extract text from a WhatsApp message object
 */
function getMessageText(msg) {
  const m = msg.message;
  if (!m) return '';
  return (
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    ''
  );
}

/**
 * Check if sender is the bot owner
 */
function isOwner(msg) {
  const sender = msg.key.remoteJid.replace('@s.whatsapp.net', '');
  return sender === config.OWNER_NUMBER;
}

/**
 * Parse command and args from message text
 * Example: ".play Shape of You" => { cmd: 'play', args: ['Shape', 'of', 'You'], full: 'Shape of You' }
 */
function parseCommand(text) {
  if (!text.startsWith(config.PREFIX)) return null;
  const parts = text.slice(config.PREFIX.length).trim().split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);
  return { cmd, args, full: args.join(' ') };
}

/**
 * Format milliseconds to mm:ss
 */
function formatDuration(ms) {
  const totalSecs = Math.floor(ms / 1000);
  const mins = Math.floor(totalSecs / 60);
  const secs = totalSecs % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Build a styled reply text with bot header
 */
function buildMenu(title, items) {
  const line = '─'.repeat(30);
  let menu = `╔${line}╗\n`;
  menu += `║  🤖 ${config.BOT_NAME} - ${title}\n`;
  menu += `╠${line}╣\n`;
  items.forEach(item => {
    menu += `║  ${item}\n`;
  });
  menu += `╚${line}╝`;
  return menu;
}

module.exports = { getMessageText, isOwner, parseCommand, formatDuration, buildMenu };
