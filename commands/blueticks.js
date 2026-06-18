// ============================================
//   Feature: Auto Blue Ticks
//   Automatically sends read receipts to all messages
// ============================================

module.exports = async (sock, msg) => {
  try {
    if (!msg.key) return;
    await sock.readMessages([msg.key]);
  } catch (err) {
    console.error('BlueTicks error:', err.message);
  }
};
