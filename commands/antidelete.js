// ============================================
//   Feature: See Deleted Messages (Anti-Delete)
//   ⚠️ For personal/testing use only
// ============================================

const config = require('../config');

// In-memory cache of recent messages (last 200)
const messageCache = new Map();
const MAX_CACHE = 200;

/**
 * Call this on every incoming message to cache it
 */
function cacheMessage(msg) {
  if (!msg.message || msg.key.fromMe) return;

  const key = msg.key.id;
  const text =
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.imageMessage?.caption ||
    msg.message?.videoMessage?.caption ||
    null;

  messageCache.set(key, {
    from: msg.key.remoteJid,
    sender: msg.key.participant || msg.key.remoteJid,
    text,
    hasMedia: !!(
      msg.message?.imageMessage ||
      msg.message?.videoMessage ||
      msg.message?.audioMessage ||
      msg.message?.documentMessage
    ),
    mediaMsg: msg, // Keep full msg for media re-download
    timestamp: Date.now(),
  });

  // Trim cache if too large
  if (messageCache.size > MAX_CACHE) {
    const oldestKey = messageCache.keys().next().value;
    messageCache.delete(oldestKey);
  }
}

/**
 * Called when a message deletion event fires
 */
async function handleDelete(sock, deletedKey) {
  try {
    const cached = messageCache.get(deletedKey.id);
    if (!cached) return; // Not in cache (too old or bot didn't see it)

    const ownerJid = `${config.OWNER_NUMBER}@s.whatsapp.net`;
    const senderNum = cached.sender
      .replace('@s.whatsapp.net', '')
      .replace('@g.us', '');

    const header = `🗑️ *Deleted Message*\nFrom: +${senderNum}\nIn: ${cached.from}`;

    // Text message
    if (cached.text) {
      await sock.sendMessage(ownerJid, {
        text: `${header}\n\n💬 *Message:*\n${cached.text}`,
      });
    }

    // Media message — attempt to re-forward
    if (cached.hasMedia && cached.mediaMsg) {
      try {
        const m = cached.mediaMsg.message;

        if (m?.imageMessage) {
          const buffer = await sock.downloadMediaMessage(cached.mediaMsg, 'buffer');
          await sock.sendMessage(ownerJid, {
            image: buffer,
            caption: `${header}\n\n🖼️ *(Deleted Image)*`,
          });
        } else if (m?.videoMessage) {
          const buffer = await sock.downloadMediaMessage(cached.mediaMsg, 'buffer');
          await sock.sendMessage(ownerJid, {
            video: buffer,
            caption: `${header}\n\n📹 *(Deleted Video)*`,
          });
        } else if (m?.audioMessage) {
          const buffer = await sock.downloadMediaMessage(cached.mediaMsg, 'buffer');
          await sock.sendMessage(ownerJid, {
            audio: buffer,
            mimetype: 'audio/mpeg',
            caption: `${header}\n\n🎵 *(Deleted Audio)*`,
          });
        } else {
          await sock.sendMessage(ownerJid, {
            text: `${header}\n\n📎 *(Deleted media — could not recover)*`,
          });
        }
      } catch {
        await sock.sendMessage(ownerJid, {
          text: `${header}\n\n📎 *(Deleted media — could not re-download)*`,
        });
      }
    }

    // Remove from cache after reporting
    messageCache.delete(deletedKey.id);

  } catch (err) {
    console.error('AntiDelete error:', err.message);
  }
}

module.exports = { cacheMessage, handleDelete };
