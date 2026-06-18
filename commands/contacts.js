// ============================================
//   Command: .savecontacts - Save group contacts
// ============================================

module.exports = async (sock, msg) => {
  const from = msg.key.remoteJid;

  // Only works in groups
  if (!from.endsWith('@g.us')) {
    return sock.sendMessage(from, {
      text: '❌ This command only works in groups.'
    }, { quoted: msg });
  }

  try {
    await sock.sendMessage(from, { text: '📇 Fetching group members...' }, { quoted: msg });

    const metadata = await sock.groupMetadata(from);
    const participants = metadata.participants;

    // Build vCard list
    const vcards = participants.map(p => {
      const number = p.id.replace('@s.whatsapp.net', '');
      return `BEGIN:VCARD\nVERSION:3.0\nFN:+${number}\nTEL;type=CELL;type=VOICE;waid=${number}:+${number}\nEND:VCARD`;
    });

    // Send each contact (WhatsApp supports sending contacts)
    for (const vcard of vcards.slice(0, 10)) { // Limit to 10 to avoid spam
      await sock.sendMessage(from, {
        contacts: {
          displayName: 'Group Contacts',
          contacts: [{ vcard }]
        }
      });
      await new Promise(r => setTimeout(r, 500)); // Small delay between sends
    }

    await sock.sendMessage(from, {
      text: `✅ Saved *${Math.min(participants.length, 10)}* contacts!\n_(Max 10 per command to avoid spam)_`
    }, { quoted: msg });

  } catch (err) {
    console.error('Contacts error:', err.message);
    await sock.sendMessage(from, { text: '❌ Failed to fetch contacts.' }, { quoted: msg });
  }
};
