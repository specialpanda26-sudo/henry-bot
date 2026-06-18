// ============================================
//   Feature: Save View-Once Images (Auto)
//   ⚠️ For personal/testing use only
// ============================================

/**
 * When a view-once image/video arrives, Baileys receives the full
 * media before the "view once" flag is enforced in the UI.
 * This intercepts it and saves/forwards it to the owner.
 */

const config = require('../config');

module.exports = async (sock, msg) => {
  try {
    const m = msg.message;
    if (!m) return;

    // Detect view-once message types
    const viewOnceMsg =
      m.viewOnceMessage?.message ||
      m.viewOnceMessageV2?.message ||
      m.viewOnceMessageV2Extension?.message;

    if (!viewOnceMsg) return;

    const ownerJid = `${config.OWNER_NUMBER}@s.whatsapp.net`;
    const sender = msg.key.remoteJid;
    const senderNum = sender.replace('@s.whatsapp.net', '').replace('@g.us', '');

    // Image
    if (viewOnceMsg.imageMessage) {
      const imgMsg = viewOnceMsg.imageMessage;
      const buffer = await sock.downloadMediaMessage(
        { message: { imageMessage: imgMsg }, key: msg.key },
        'buffer'
      );

      await sock.sendMessage(ownerJid, {
        image: buffer,
        caption: `👁️ *View-Once Image*\nFrom: +${senderNum}`,
        mimetype: 'image/jpeg',
      });
    }

    // Video
    if (viewOnceMsg.videoMessage) {
      const vidMsg = viewOnceMsg.videoMessage;
      const buffer = await sock.downloadMediaMessage(
        { message: { videoMessage: vidMsg }, key: msg.key },
        'buffer'
      );

      await sock.sendMessage(ownerJid, {
        video: buffer,
        caption: `👁️ *View-Once Video*\nFrom: +${senderNum}`,
        mimetype: 'video/mp4',
      });
    }

  } catch (err) {
    console.error('ViewOnce error:', err.message);
  }
};
