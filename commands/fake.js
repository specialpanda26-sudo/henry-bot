// ============================================
//   Commands: .faketyping / .fakerecording
// ============================================

/**
 * Simulate typing for 10 seconds
 */
async function fakeTyping(sock, msg) {
  const from = msg.key.remoteJid;
  await sock.sendPresenceUpdate('composing', from);
  await sock.sendMessage(from, { text: '✍️ Simulating typing for 10 seconds...' }, { quoted: msg });

  setTimeout(async () => {
    await sock.sendPresenceUpdate('paused', from);
    await sock.sendMessage(from, { text: '✅ Fake typing stopped.' });
  }, 10000);
}

/**
 * Simulate voice recording for 10 seconds
 */
async function fakeRecording(sock, msg) {
  const from = msg.key.remoteJid;
  await sock.sendPresenceUpdate('recording', from);
  await sock.sendMessage(from, { text: '🎙️ Simulating recording for 10 seconds...' }, { quoted: msg });

  setTimeout(async () => {
    await sock.sendPresenceUpdate('paused', from);
    await sock.sendMessage(from, { text: '✅ Fake recording stopped.' });
  }, 10000);
}

module.exports = { fakeTyping, fakeRecording };
