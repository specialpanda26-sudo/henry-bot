// ============================================
//   WhatsApp Bot - Global State Manager
// ============================================

const config = require('../config');

const state = {
  // Feature toggles (runtime)
  features: { ...config.FEATURES },

  // Auto-bio interval reference
  autoBioInterval: null,

  // Toggle a feature on/off
  toggle(feature) {
    if (this.features[feature] === undefined) return false;
    this.features[feature] = !this.features[feature];
    return this.features[feature];
  },

  // Check if feature is on
  isOn(feature) {
    return !!this.features[feature];
  },
};

module.exports = state;
