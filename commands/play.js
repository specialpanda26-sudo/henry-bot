// ============================================
//   Command: .play [song name] - Download Song
// ============================================

const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');
const { formatDuration } = require('../lib/helper');

module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const query = args.full;

  if (!query) {
    return sock.sendMessage(from, {
      text: '❌ Provide a song name.\nExample: `.play Shape of You`'
    }, { quoted: msg });
  }

  await sock.sendMessage(from, { text: `🔍 Searching for: *${query}*...` }, { quoted: msg });

  try {
    // Search YouTube
    const results = await ytSearch(query);
    const video = results.videos[0];

    if (!video) {
      return sock.sendMessage(from, { text: '❌ No results found.' }, { quoted: msg });
    }

    await sock.sendMessage(from, {
      text: `🎧 Found: *${video.title}*\n⏱️ Duration: ${video.timestamp}\n⬇️ Downloading...`
    }, { quoted: msg });

    // Stream audio from YouTube
    const stream = ytdl(video.url, {
      filter: 'audioonly',
      quality: 'highestaudio',
    });

    // Collect stream into buffer
    const chunks = [];
    await new Promise((resolve, reject) => {
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('end', resolve);
      stream.on('error', reject);
    });

    const buffer = Buffer.concat(chunks);

    await sock.sendMessage(from, {
      audio: buffer,
      mimetype: 'audio/mpeg',
      fileName: `${video.title}.mp3`,
      ptt: false,
    }, { quoted: msg });

  } catch (err) {
    console.error('Play error:', err.message);
    await sock.sendMessage(from, {
      text: '❌ Failed to download song. Try again or use a different name.'
    }, { quoted: msg });
  }
};
