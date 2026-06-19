// ============================================
//   WhatsApp Bot - Main Entry Point
//   Built with @whiskeysockets/baileys
// ============================================

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  jidDecode,
} = require('@whiskeysockets/baileys');

const pino = require('pino');
const config = require('./config');
const state = require('./lib/state');
const { getMessageText, isOwner, parseCommand } = require('./lib/helper');

// ── Import Commands ───────────────────────────
const menuCmd       = require('./commands/menu');
const pingCmd       = require('./commands/ping');
const statusCmd     = require('./commands/status');
const gptCmd        = require('./commands/gpt');
const playCmd       = require('./commands/play');
const videoCmd      = require('./commands/video');
const imagineCmd    = require('./commands/imagine');
const contactsCmd   = require('./commands/contacts');
const { downloadIG, downloadFB } = require('./commands/social');
const { fakeTyping, fakeRecording } = require('./commands/fake');
const {
  autoStatus, autoLike, alwaysOnline,
  autoRead, autoBio, antiCall, autoReact, autoBlueTicks
} = require('./commands/toggles');
const viewOnceHandler          = require('./commands/viewonce');
const { cacheMessage, handleDelete } = require('./commands/antidelete');
const rateLimiter = require('./lib/ratelimiter');

// ── Auto React Emojis Pool ────────────────────
const REACT_EMOJIS = ['❤️', '🔥', '😂', '👍', '🎉', '💯', '😍', '🙌'];

// ── Start Bot ─────────────────────────────────
async function startBot() {
  const { state: authState, saveCreds } = await useMultiFileAuthState(config.SESSION_NAME);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: authState,
    logger: pino({ level: 'silent' }), // Set to 'debug' for verbose logs
    printQRInTerminal: true,
    browser: ['MyBot', 'Chrome', '1.0'],
  });

  // Save credentials on update
  sock.ev.on('creds.update', saveCreds);

sock.ev.on('connection.update', ({ qr }) => {
  if (qr) {
    try {
      const qrcode = require('qrcode-terminal');
      qrcode.generate(qr, { small: true });
    } catch(e) {}
    const http = require('http');
    const encoded = encodeURIComponent(qr);
    const server = http.createServer((req, res) => {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end('<h2>Henry Bot</h2><img src="https://api.qrserver.com/v1/create-qr-code/?data=' + encoded + '&size=300x300">');
    });
    server.listen(process.env.PORT || 3000);
    console.log('QR IMAGE: https://api.qrserver.com/v1/create-qr-code/?data=' + encoded + '&size=300x300');
  }
});

  // ── Connection Updates ──────────────────────
  sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (connection === 'open') {
      console.log('\n✅ Bot connected successfully!\n');
    }

    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = code !== DisconnectReason.loggedOut;
      console.log(`❌ Disconnected. Reason: ${code}. Reconnecting: ${shouldReconnect}`);
      if (shouldReconnect) startBot();
    }
  });

  // ── Handle Incoming Messages ────────────────
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      if (!msg.message || msg.key.fromMe) continue;

      const from = msg.key.remoteJid;
      const text = getMessageText(msg);

      // ── Auto Read ────────────────────────────
      if (state.isOn('AUTO_READ')) {
        await sock.readMessages([msg.key]).catch(() => {});
      }

      // ── Auto Blue Ticks ──────────────────────
      if (state.isOn('AUTO_BLUE_TICKS')) {
        await sock.readMessages([msg.key]).catch(() => {});
      }

      // ── Auto React ───────────────────────────
      if (sock._autoReact && text) {
        const emoji = REACT_EMOJIS[Math.floor(Math.random() * REACT_EMOJIS.length)];
        await rateLimiter.randomDelay(500, 2000);
        await sock.sendMessage(from, {
          react: { text: emoji, key: msg.key }
        }).catch(() => {});
      }

      // ── Rate limit check before commands ─────
      if (rateLimiter.shouldThrottle(from)) {
        await rateLimiter.safeSend(sock, from, {
          text: '⚠️ Slow down! Too many commands. Please wait a moment.'
        }, { quoted: msg });
        continue;
      }
      const parsed = parseCommand(text);
      if (!parsed) continue;

      const { cmd, args } = parsed;
      const argsObj = { args, full: args.join(' ') };

      // Owner-only commands check
      const ownerCmds = [
        'autostatus', 'autolike', 'alwaysonline',
        'autoread', 'autobio', 'anticall', 'autoreact', 'autoblueticks'
      ];
      if (ownerCmds.includes(cmd) && !isOwner(msg)) {
        await sock.sendMessage(from, { text: '🔒 This command is for the bot owner only.' }, { quoted: msg });
        continue;
      }

      // Route commands
      switch (cmd) {
        case 'menu':        await menuCmd(sock, msg); break;
        case 'ping':        await pingCmd(sock, msg); break;
        case 'status':      await statusCmd(sock, msg); break;
        case 'gpt':         await gptCmd(sock, msg, argsObj); break;
        case 'play':        await playCmd(sock, msg, argsObj); break;
        case 'video':
        case 'yt':          await videoCmd(sock, msg, argsObj); break;
        case 'ig':          await downloadIG(sock, msg, argsObj); break;
        case 'fb':          await downloadFB(sock, msg, argsObj); break;
        case 'imagine':     await imagineCmd(sock, msg, argsObj); break;
        case 'savecontacts':await contactsCmd(sock, msg); break;
        case 'faketyping':  await fakeTyping(sock, msg); break;
        case 'fakerecording': await fakeRecording(sock, msg); break;
        // Owner toggles
        case 'autostatus':  await autoStatus(sock, msg); break;
        case 'autolike':    await autoLike(sock, msg); break;
        case 'alwaysonline':await alwaysOnline(sock, msg); break;
        case 'autoread':    await autoRead(sock, msg); break;
        case 'autobio':     await autoBio(sock, msg); break;
        case 'anticall':    await antiCall(sock, msg); break;
        case 'autoreact':   await autoReact(sock, msg); break;
        case 'autoblueticks': await autoBlueTicks(sock, msg); break;
        default:
          // Unknown command - silently ignore or uncomment to reply:
          // await sock.sendMessage(from, { text: `❓ Unknown command. Try ${config.PREFIX}menu` }, { quoted: msg });
          break;
      }
    }
  });

  // ── Auto View & Like Status Updates ────────
  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const msg of messages) {
      // Cache every message for anti-delete
      cacheMessage(msg);

      // Handle view-once interception
      await viewOnceHandler(sock, msg);

      if (msg.key.remoteJid === 'status@broadcast') {
        if (state.isOn('AUTO_VIEW_STATUS')) {
          await sock.readMessages([msg.key]).catch(() => {});
        }
        if (state.isOn('AUTO_LIKE_STATUS')) {
          await sock.sendMessage(msg.key.remoteJid, {
            react: { text: '❤️', key: msg.key }
          }).catch(() => {});
        }
      }
    }
  });

  // ── Anti-Delete: Catch deleted messages ──────
  sock.ev.on('messages.update', async (updates) => {
    for (const update of updates) {
      // A deletion is a message update with no content (revoke)
      if (update.update?.messageStubType === 1 || update.key?.id) {
        await handleDelete(sock, update.key).catch(() => {});
      }
    }
  });

  // ── Anti-Call ────────────────────────────────
  sock.ev.on('call', async (calls) => {
    if (!state.isOn('ANTI_CALL')) return;
    for (const call of calls) {
      if (call.status === 'offer') {
        await sock.rejectCall(call.id, call.from).catch(() => {});
        await sock.sendMessage(call.from, {
          text: '🚫 Auto-rejected. This bot does not accept calls.'
        }).catch(() => {});
      }
    }
  });

  return sock;
}

// ── Launch ────────────────────────────────────
console.log('🤖 Starting WhatsApp Bot...');
console.log('📱 Scan the QR code below with WhatsApp\n');

startBot().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
