// ============================================
//   Commands: .ig / .fb - Download Social Videos
// ============================================

const axios = require('axios');

/**
 * Download Instagram video/reel using a public scraper API
 */
async function downloadIG(sock, msg, args) {
  const from = msg.key.remoteJid;
  const url = args.full;

  if (!url || !url.includes('instagram.com')) {
    return sock.sendMessage(from, {
      text: '❌ Provide a valid Instagram URL.\nExample: `.ig https://www.instagram.com/reel/xxxx`'
    }, { quoted: msg });
  }

  await sock.sendMessage(from, { text: '⬇️ Fetching Instagram content...' }, { quoted: msg });

  try {
    // Using a public Instagram downloader API
    const apiUrl = `https://api.instagram.com/oembed?url=${encodeURIComponent(url)}`;
    
    // Note: For full video download, use a dedicated service or RapidAPI
    // This example uses a free endpoint that returns metadata
    const { data } = await axios.get(
      `https://www.saveig.app/api/?url=${encodeURIComponent(url)}`,
      { timeout: 15000 }
    );

    if (data && data.url) {
      const videoRes = await axios.get(data.url, { responseType: 'arraybuffer', timeout: 30000 });
      const buffer = Buffer.from(videoRes.data);

      await sock.sendMessage(from, {
        video: buffer,
        mimetype: 'video/mp4',
        caption: '📸 Downloaded from Instagram!',
      }, { quoted: msg });
    } else {
      throw new Error('No video URL found');
    }

  } catch (err) {
    console.error('IG error:', err.message);
    await sock.sendMessage(from, {
      text: '❌ Could not download. Make sure the post is public.\n\n💡 Tip: Use a RapidAPI Instagram downloader for better results.'
    }, { quoted: msg });
  }
}

/**
 * Download Facebook video
 */
async function downloadFB(sock, msg, args) {
  const from = msg.key.remoteJid;
  const url = args.full;

  if (!url || !url.includes('facebook.com')) {
    return sock.sendMessage(from, {
      text: '❌ Provide a valid Facebook URL.\nExample: `.fb https://www.facebook.com/watch?v=xxxx`'
    }, { quoted: msg });
  }

  await sock.sendMessage(from, { text: '⬇️ Fetching Facebook video...' }, { quoted: msg });

  try {
    const { data } = await axios.get(
      `https://facebook-downloader-api.vercel.app/api?url=${encodeURIComponent(url)}`,
      { timeout: 15000 }
    );

    if (data && data.sd) {
      const videoRes = await axios.get(data.sd, { responseType: 'arraybuffer', timeout: 30000 });
      const buffer = Buffer.from(videoRes.data);

      await sock.sendMessage(from, {
        video: buffer,
        mimetype: 'video/mp4',
        caption: '📘 Downloaded from Facebook!',
      }, { quoted: msg });
    } else {
      throw new Error('No video URL in response');
    }

  } catch (err) {
    console.error('FB error:', err.message);
    await sock.sendMessage(from, {
      text: '❌ Could not download. Make sure the video is public.'
    }, { quoted: msg });
  }
}

module.exports = { downloadIG, downloadFB };
