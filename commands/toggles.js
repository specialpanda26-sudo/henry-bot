// ============================================
//   Owner Toggle Commands
// ============================================

const state = require('../lib/state');
const config = require('../config');

/**
 * Generic toggle handler
 */
async function toggle(sock, msg, featureKey, label) {
  const from = msg.key.remoteJid;
  const isOn = state.toggle(featureKey);
  await sock.sendMessage(from, {
    text: `${isOn ? '✅' : '❌'} *${label}* is now *${isOn ? 'ON' : 'OFF'}*`
  }, { quoted: msg });
  return isOn;
}

// ── Auto View Status ─────────────────────────
async function autoStatus(sock, msg) {
  await toggle(sock, msg, 'AUTO_VIEW_STATUS', 'Auto View Status');
}

// ── Auto Like Status ─────────────────────────
async function autoLike(sock, msg) {
  await toggle(sock, msg, 'AUTO_LIKE_STATUS', 'Auto Like Status');
}

// ── Always Online ────────────────────────────
async function alwaysOnline(sock, msg) {
  const isOn = await toggle(sock, msg, 'ALWAYS_ONLINE', 'Always Online');
  if (isOn) {
    // Send presence available every 30 seconds
    sock._alwaysOnlineInterval = setInterval(async () => {
      await sock.sendPresenceUpdate('available').catch(() => {});
    }, 30000);
  } else {
    clearInterval(sock._alwaysOnlineInterval);
  }
}

// ── Auto Read Messages ───────────────────────
async function autoRead(sock, msg) {
  await toggle(sock, msg, 'AUTO_READ', 'Auto Read Messages');
}

// ── Auto Bio Rotation ────────────────────────
async function autoBio(sock, msg) {
  const isOn = await toggle(sock, msg, 'AUTO_BIO', 'Auto Bio Rotation');
  if (isOn) {
    let bioIndex = 0;
    state.autoBioInterval = setInterval(async () => {
      const bios = config.AUTO_BIO_MESSAGES;
      await sock.updateProfileStatus(bios[bioIndex % bios.length]).catch(() => {});
      bioIndex++;
    }, config.AUTO_BIO_INTERVAL);
  } else {
    clearInterval(state.autoBioInterval);
  }
}

// ── Anti-Call ────────────────────────────────
async function antiCall(sock, msg) {
  await toggle(sock, msg, 'ANTI_CALL', 'Anti-Call');
}

// ── Auto React ───────────────────────────────
async function autoReact(sock, msg) {
  // Auto-react uses a simple in-memory flag outside the state features map
  sock._autoReact = !sock._autoReact;
  const isOn = sock._autoReact;
  await sock.sendMessage(msg.key.remoteJid, {
    text: `${isOn ? '✅' : '❌'} *Auto React* is now *${isOn ? 'ON' : 'OFF'}*`
  }, { quoted: msg });
}

// ── Auto Blue Ticks ──────────────────────────
async function autoBlueTicks(sock, msg) {
  await toggle(sock, msg, 'AUTO_BLUE_TICKS', 'Auto Blue Ticks');
}

module.exports = { autoStatus, autoLike, alwaysOnline, autoRead, autoBio, antiCall, autoReact, autoBlueTicks };
