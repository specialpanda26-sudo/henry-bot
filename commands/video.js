// ============================================
//   Command: .video [name/url] - Download Video
// ============================================

const ytSearch = require('yt-search');
const ytdl = require('ytdl-core');

module.exports = async (sock, msg, args) => {
  const from = msg.key.remoteJid;
  const query = args.full;

  if (!query) {
    return sock.sendMessage(from, {
      text: '❌ Provide a video name or URL.\nExample: `.video Funny cats`'
    }, { quoted: msg });
  }

  await sock.sendMessage(from, { text: `🔍 Searching: *${query}*...` }, { quoted: msg });

  try {
    let videoUrl = query;

    // If not a URL, search for it
    if (!query.includes('youtube.com') && !query.includes('youtu.be')) {
      const results = await ytSearch(query);
      const video = results.videos[0];
      if (!video) return sock.sendMessage(from, { text: '❌ No results found.' }, { quoted: msg });
      videoUrl = video.url;
      await sock.sendMessage(from, {
        text: `📽️ Found: *${video.title}*\n⬇️ Downloading...`
      }, { quoted: msg });
    } else {
      await sock.sendMessage(from, { text: '⬇️ Downloading video...' }, { quoted: msg });
    }

    const stream = ytdl(videoUrl, {
      filter: 'videoandaudio',
      quality: 'lowest', // Keep small for WhatsApp
    });

    const chunks = [];
    await new Promise((resolve, reject) => {
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('end', resolve);
      stream.on('error', reject);
    });

    const buffer = Buffer.concat(chunks);

    await sock.sendMessage(from, {
      video: buffer,
      mimetype: 'video/mp4',
      caption: '📽️ Here is your video!',
    }, { quoted: msg });

  } catch (err) {
    console.error('Video error:', err.message);
    await sock.sendMessage(from, {
      text: '❌ Failed to download. Note: Very long videos may fail due to size limits.'
    }, { quoted: msg });
  }
};
