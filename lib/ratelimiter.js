// ============================================
//   Henry Bot - Rate Limiter & Anti-Ban
//   Adds human-like delays between actions
// ============================================

class RateLimiter {
  constructor() {
    // Track message counts per chat
    this.messageCounts = new Map();
    // Track last message time per chat
    this.lastMessageTime = new Map();
    // Global message counter
    this.globalCount = 0;
    this.globalResetTime = Date.now();
  }

  /**
   * Random delay between min and max milliseconds
   * Makes bot behave more human-like
   */
  async randomDelay(min = 500, max = 2000) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise(r => setTimeout(r, delay));
  }

  /**
   * Typing simulation delay based on text length
   */
  async typingDelay(text = '') {
    // Simulate human typing speed (50-100 chars per second)
    const baseDelay = Math.min(text.length * 30, 3000);
    const delay = baseDelay + Math.floor(Math.random() * 500);
    await new Promise(r => setTimeout(r, delay));
  }

  /**
   * Check if we should throttle this chat
   * Max 10 messages per minute per chat
   */
  shouldThrottle(jid) {
    const now = Date.now();
    const count = this.messageCounts.get(jid) || 0;
    const lastTime = this.lastMessageTime.get(jid) || 0;

    // Reset count if more than 1 minute has passed
    if (now - lastTime > 60000) {
      this.messageCounts.set(jid, 0);
      return false;
    }

    // Throttle if more than 10 messages in 1 minute
    if (count >= 10) {
      console.log(`[RateLimit] Throttling chat ${jid} — too many messages`);
      return true;
    }

    return false;
  }

  /**
   * Record a message sent to a chat
   */
  recordMessage(jid) {
    const count = this.messageCounts.get(jid) || 0;
    this.messageCounts.set(jid, count + 1);
    this.lastMessageTime.set(jid, Date.now());

    // Track global count
    const now = Date.now();
    if (now - this.globalResetTime > 60000) {
      this.globalCount = 0;
      this.globalResetTime = now;
    }
    this.globalCount++;
  }

  /**
   * Check global rate limit
   * Max 30 messages per minute globally
   */
  isGloballyThrottled() {
    const now = Date.now();
    if (now - this.globalResetTime > 60000) {
      this.globalCount = 0;
      this.globalResetTime = now;
      return false;
    }
    return this.globalCount >= 30;
  }

  /**
   * Safe send message with rate limiting and delays
   */
  async safeSend(sock, jid, content, options = {}) {
    try {
      // Check global throttle
      if (this.isGloballyThrottled()) {
        console.log('[RateLimit] Global limit reached, waiting 10 seconds...');
        await new Promise(r => setTimeout(r, 10000));
      }

      // Check per-chat throttle
      if (this.shouldThrottle(jid)) {
        await new Promise(r => setTimeout(r, 5000));
      }

      // Add human-like delay before sending
      await this.randomDelay(300, 1500);

      // Simulate typing for text messages
      if (content.text) {
        await sock.sendPresenceUpdate('composing', jid);
        await this.typingDelay(content.text);
        await sock.sendPresenceUpdate('paused', jid);
      }

      // Send the message
      const result = await sock.sendMessage(jid, content, options);

      // Record the message
      this.recordMessage(jid);

      return result;

    } catch (err) {
      console.error('[RateLimit] Send error:', err.message);
      throw err;
    }
  }
}

module.exports = new RateLimiter();
