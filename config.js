// ============================================
//   WhatsApp Bot - Configuration
// ============================================

module.exports = {
  // Bot prefix for commands
  PREFIX: '.',

  // Your WhatsApp number (with country code, no + or spaces)
  // Example: '27831234567' for South Africa
  OWNER_NUMBER: 'YOUR_NUMBER_HERE',

  // OpenAI API Key for ChatGPT/AI features
  // Get one at: https://platform.openai.com/api-keys
  OPENAI_API_KEY: 'YOUR_OPENAI_KEY_HERE',

  // Bot name shown in menus
  BOT_NAME: 'Henry Bot',

  // Session folder name
  SESSION_NAME: 'auth',

  // Auto-bio messages (rotates every 30 mins if enabled)
  AUTO_BIO_MESSAGES: [
    '🤖 Powered by Henry Bot',
    '⚡ Henry Bot is Online & Ready',
    '🔥 Henry Bot is Active',
  ],

  // Auto-bio interval in milliseconds (default: 30 minutes)
  AUTO_BIO_INTERVAL: 30 * 60 * 1000,

  // Features toggle (true = enabled by default on startup)
  FEATURES: {
    AUTO_VIEW_STATUS: false,
    AUTO_LIKE_STATUS: false,
    ALWAYS_ONLINE: false,
    AUTO_READ: false,
    AUTO_BIO: false,
    ANTI_CALL: false,
    AUTO_BLUE_TICKS: false,
  },
};
