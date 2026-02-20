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

// Clean up old player scripts (optional)
function cleanupPlayerScripts() {
  const rootDir = process.cwd();
  fs.readdir(rootDir, (err, files) => {
    if (err) return;
    files.forEach(file => {
      if (file.match(/^\d+-player-script\.js$/)) {
        fs.unlink(path.join(rootDir, file), (err) => {
          if (err) console.error('Failed to delete player script:', err);
        });
      }
    });
  });
}

// Realistic browser headers
const defaultHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Connection': 'keep-alive',
};

// Fetch a fresh CONSENT cookie from YouTube
async function getConsentCookie(): Promise<string> {
  return new Promise((resolve) => {
    const options = {
      hostname: 'www.youtube.com',
      port: 443,
      path: '/',
      method: 'GET',
      headers: defaultHeaders,
      timeout: 5000,
    };

    const req = https.get(options, (res) => {
      const cookies = res.headers['set-cookie'];
      if (cookies) {
        const consentCookie = cookies.find(c => c.startsWith('CONSENT='));
        if (consentCookie) {
          resolve(consentCookie.split(';')[0]);
        } else {
          // Fallback: widely used consent cookie (works for many age‑restricted videos)
          resolve('CONSENT=YES+cb.20250101-00-p0.en+FX+123');
        }
      } else {
        resolve('CONSENT=YES+cb.20250101-00-p0.en+FX+123');
      }
      res.destroy();
    });

    req.on('error', (err) => {
      console.warn('Failed to fetch consent cookie, using default fallback.', err.message);
      resolve('CONSENT=YES+cb.20250101-00-p0.en+FX+123');
    });

    req.on('timeout', () => {
      req.destroy();
      console.warn('Timeout fetching consent cookie, using default fallback.');
      resolve('CONSENT=YES+cb.20250101-00-p0.en+FX+123');
    });

    req.end();
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    cleanupPlayerScripts();

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // Get consent cookie
    const consentCookie = await getConsentCookie();
    console.log(`[ytdl] Using cookie: ${consentCookie}`);

    // Try multiple clients – correct way: pass `clients` array
    const clientsToTry = ['android', 'ios', 'web'];
    let info: ytdl.videoInfo | null = null;
    let lastError: any = null;

    for (const client of clientsToTry) {
      try {
        console.log(`[ytdl] Trying client: ${client}`);
        info = await ytdl.getInfo(url, {
          requestOptions: {
            headers: {
              ...defaultHeaders,
              Cookie: consentCookie,
            },
          },
          // The correct option is `clients` (array) – but the type definition may be outdated.
          // We use a type assertion to bypass TypeScript.
          ...({ clients: [client] } as any),
        });
        console.log(`[ytdl] Client ${client} succeeded.`);
        break;
      } catch (err: any) {
        lastError = err;
        console.warn(`[ytdl] Client "${client}" failed:`, err.message);
      }
    }

    if (!info) {
      console.error('[ytdl] All clients failed. Last error:', lastError);
      throw new Error('Unable to fetch video information. The video may be private, age‑restricted beyond consent, or a live stream.');
    }

    // Choose format: prefer video+audio, then video-only
    let format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'audioandvideo' });
    if (!format) {
      format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
    }
    if (!format) throw new Error('No suitable format found');

    // Check size
    const contentLength = parseInt(format.contentLength);
    if (contentLength && contentLength > MAX_SIZE) {
      return res.status(413).json({ error: 'Video exceeds 1GB limit' });
    }

    const tempDir = os.tmpdir();
    const fileName = `video_${crypto.randomBytes(8).toString('hex')}.${format.container || 'mp4'}`;
    const filePath = path.join(tempDir, fileName);

    // Download with size limit
    const writeStream = fs.createWriteStream(filePath);
    const downloadStream = ytdl(url, {
      format,
      requestOptions: {
        headers: {
          ...defaultHeaders,
          Cookie: consentCookie,
        },
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

    // Stream back
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', format.mimeType || 'video/mp4');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    fileStream.on('end', () => {
      fs.unlink(filePath, () => {});
      cleanupPlayerScripts();
    });

    fileStream.on('error', (err) => {
      console.error('Error streaming file:', err);
      fs.unlink(filePath, () => {});
    });

  } catch (error: any) {
    console.error('Fetch video error:', error);
    cleanupPlayerScripts();

    // User‑friendly messages for common failures
    let message = 'Failed to download video. Please try a different video or use the file upload option.';
    if (error.message.includes('private') || error.message.includes('Private video')) {
      message = 'This video is private and cannot be downloaded.';
    } else if (error.message.includes('live') || error.message.includes('Live stream')) {
      message = 'Live streams cannot be downloaded.';
    } else if (error.message.includes('age') || error.message.includes('restricted')) {
      message = 'This video is age‑restricted and cannot be downloaded without a YouTube account.';
    }

    res.status(500).json({ error: message });
  }
}