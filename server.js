// ============================================
//   Henry Tech Bot - Web Server
//   Serves the beautiful dashboard
// ============================================

const express = require('express');
const path = require('path');
const app = express();

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', bot: 'Henry Tech' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Henry Tech Dashboard running on port ${PORT}`);
  console.log(`📱 Open: http://localhost:${PORT}`);
});
