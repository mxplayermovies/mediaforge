// import { NextApiRequest, NextApiResponse } from 'next';
// import fs from 'fs';
// import path from 'path';
// import os from 'os';
// import crypto from 'crypto';
// import ytdl from '@distube/ytdl-core';

// export const config = {
//   api: {
//     responseLimit: false,
//   },
// };

// const MAX_SIZE = 1073741824; // 1GB

// // Helper to delete old player script files from project root
// function cleanupPlayerScripts() {
//   const rootDir = process.cwd();
//   fs.readdir(rootDir, (err, files) => {
//     if (err) return;
//     files.forEach(file => {
//       if (file.match(/^\d+-player-script\.js$/)) {
//         fs.unlink(path.join(rootDir, file), (err) => {
//           if (err) console.error('Failed to delete player script:', err);
//         });
//       }
//     });
//   });
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const { url } = req.query;
//   if (!url || typeof url !== 'string') {
//     return res.status(400).json({ error: 'Missing url parameter' });
//   }

//   try {
//     // Clean up old player scripts before processing (optional)
//     cleanupPlayerScripts();

//     if (!ytdl.validateURL(url)) {
//       return res.status(400).json({ error: 'Invalid YouTube URL' });
//     }

//     const info = await ytdl.getInfo(url);
//     const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
//     if (!format) throw new Error('No suitable format found');

//     // Check size from contentLength if available
//     const contentLength = parseInt(format.contentLength);
//     if (contentLength && contentLength > MAX_SIZE) {
//       return res.status(413).json({ error: 'Video exceeds 1GB limit' });
//     }

//     const tempDir = os.tmpdir();
//     const fileName = `video_${crypto.randomBytes(8).toString('hex')}.${format.container || 'mp4'}`;
//     const filePath = path.join(tempDir, fileName);

//     // Download with size limit
//     const writeStream = fs.createWriteStream(filePath);
//     const downloadStream = ytdl(url, { format });

//     let downloadedBytes = 0;
//     downloadStream.on('data', (chunk) => {
//       downloadedBytes += chunk.length;
//       if (downloadedBytes > MAX_SIZE) {
//         downloadStream.destroy();
//         writeStream.destroy();
//         fs.unlink(filePath, () => {});
//         throw new Error('Download exceeded 1GB limit');
//       }
//     });

//     downloadStream.pipe(writeStream);

//     await new Promise<void>((resolve, reject) => {
//       writeStream.on('finish', () => resolve()); // FIXED: wrap resolve in a function
//       writeStream.on('error', reject);
//       downloadStream.on('error', reject);
//     });

//     // Stream the file back to client
//     res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
//     res.setHeader('Content-Type', format.mimeType || 'video/mp4');

//     const fileStream = fs.createReadStream(filePath);
//     fileStream.pipe(res);

//     // Delete temp file after sending
//     fileStream.on('end', () => {
//       fs.unlink(filePath, (err) => {
//         if (err) console.error('Error deleting temp file:', err);
//       });
//       // Also clean up any player scripts that might have been left
//       cleanupPlayerScripts();
//     });

//     fileStream.on('error', (err) => {
//       console.error('Error streaming file:', err);
//       fs.unlink(filePath, () => {}); // try to delete anyway
//     });

//   } catch (error: any) {
//     console.error('Fetch video error:', error);
//     // Clean up player scripts even on error
//     cleanupPlayerScripts();
//     res.status(500).json({ error: error.message });
//   }
// }





import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import ytdl from '@distube/ytdl-core';
import https from 'https';

export const config = {
  api: {
    responseLimit: false,
  },
};

const MAX_SIZE = 1073741824; // 1GB

function cleanupPlayerScripts() {
  const rootDir = process.cwd();
  fs.readdir(rootDir, (err, files) => {
    if (err) return;
    files.forEach(file => {
      if (file.match(/^\d+-player-script\.js$/)) {
        fs.unlink(path.join(rootDir, file), () => {});
      }
    });
  });
}

// Base headers that mimic a real browser (used for consent cookie)
const baseHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Connection': 'keep-alive',
};

// Mobile headers for Android client (used for actual video requests)
const androidHeaders = {
  'User-Agent': 'com.google.android.youtube/19.09.37 (Linux; U; Android 11) gzip',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'X-YouTube-Client-Name': '3', // 3 = Android
  'X-YouTube-Client-Version': '19.09.37',
  'Connection': 'keep-alive',
};

const agent = new https.Agent({ keepAlive: true });

async function getConsentCookie(): Promise<string> {
  return new Promise((resolve) => {
    const options = {
      hostname: 'www.youtube.com',
      port: 443,
      path: '/',
      method: 'GET',
      headers: baseHeaders,
      agent,
      timeout: 5000,
    };

    const req = https.get(options, (res) => {
      const cookies = res.headers['set-cookie'];
      if (cookies) {
        const consentCookie = cookies.find(c => c.startsWith('CONSENT='));
        if (consentCookie) {
          resolve(consentCookie.split(';')[0]);
        } else {
          resolve('CONSENT=YES+cb.20250101-00-p0.en+FX+123');
        }
      } else {
        resolve('CONSENT=YES+cb.20250101-00-p0.en+FX+123');
      }
      res.destroy();
    });

    req.on('error', () => resolve('CONSENT=YES+cb.20250101-00-p0.en+FX+123'));
    req.on('timeout', () => {
      req.destroy();
      resolve('CONSENT=YES+cb.20250101-00-p0.en+FX+123');
    });
    req.end();
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { url } = req.query;
  if (!url || typeof url !== 'string') return res.status(400).json({ error: 'Missing url parameter' });

  try {
    cleanupPlayerScripts();

    if (!ytdl.validateURL(url)) return res.status(400).json({ error: 'Invalid YouTube URL' });

    const consentCookie = await getConsentCookie();

    // Try clients in order: android, ios, web
    const clients = [
      { name: 'android', headers: androidHeaders },
      { name: 'ios', headers: { ...baseHeaders, 'User-Agent': 'com.google.ios.youtube/19.09.37 (iPhone; U; CPU iOS 15_0 like Mac OS X)' } },
      { name: 'web', headers: baseHeaders },
    ];

    let info: ytdl.videoInfo | null = null;
    let lastError: any = null;

    for (const { name, headers } of clients) {
      try {
        info = await ytdl.getInfo(url, {
          requestOptions: {
            headers: {
              ...headers,
              Cookie: consentCookie,
            },
            agent,
          },
          ...({ clients: [name] } as any), // Type assertion for clients array
        });
        console.log(`Client ${name} succeeded.`);
        break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Client ${name} failed:`, err.message);
      }
    }

    if (!info) {
      console.error('All clients failed:', lastError);
      return res.status(403).json({
        error: 'YouTube is currently blocking downloads. Please try a different video or use the file upload option.',
      });
    }

    // Choose format: prefer video+audio, fallback to video-only
    let format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'audioandvideo' });
    if (!format) format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
    if (!format) throw new Error('No suitable format found');

    const contentLength = parseInt(format.contentLength);
    if (contentLength && contentLength > MAX_SIZE) return res.status(413).json({ error: 'Video exceeds 1GB limit' });

    const tempDir = os.tmpdir();
    const fileName = `video_${crypto.randomBytes(8).toString('hex')}.${format.container || 'mp4'}`;
    const filePath = path.join(tempDir, fileName);

    // Download
    const writeStream = fs.createWriteStream(filePath);
    const downloadStream = ytdl(url, {
      format,
      requestOptions: {
        headers: {
          ...baseHeaders,
          Cookie: consentCookie,
        },
        agent,
      },
    });

    let downloadedBytes = 0;
    downloadStream.on('data', (chunk) => {
      downloadedBytes += chunk.length;
      if (downloadedBytes > MAX_SIZE) {
        downloadStream.destroy();
        writeStream.destroy();
        fs.unlink(filePath, () => {});
        throw new Error('Download exceeded 1GB limit');
      }
    });

    downloadStream.pipe(writeStream);

    await new Promise<void>((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
      downloadStream.on('error', reject);
    });

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', format.mimeType || 'video/mp4');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      fs.unlink(filePath, () => {});
      cleanupPlayerScripts();
    });

    fileStream.on('error', (err) => {
      console.error('Stream error:', err);
      fs.unlink(filePath, () => {});
    });

  } catch (error: any) {
    console.error('Fetch error:', error);
    cleanupPlayerScripts();
    res.status(500).json({ error: 'Failed to download video. Please try a different video or use the file upload option.' });
  }
}