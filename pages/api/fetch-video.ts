import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import ytdl from '@distube/ytdl-core';

export const config = {
  api: {
    responseLimit: false,
  },
};

const MAX_SIZE = 1073741824; // 1GB

// Helper to delete old player script files from project root
function cleanupPlayerScripts() {
  const rootDir = process.cwd(); // project root
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    // Clean up old player scripts before processing (optional)
    cleanupPlayerScripts();

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
    if (!format) throw new Error('No suitable format found');

    // Check size from contentLength if available
    const contentLength = parseInt(format.contentLength);
    if (contentLength && contentLength > MAX_SIZE) {
      return res.status(413).json({ error: 'Video exceeds 1GB limit' });
    }

    const tempDir = os.tmpdir();
    const fileName = `video_${crypto.randomBytes(8).toString('hex')}.${format.container || 'mp4'}`;
    const filePath = path.join(tempDir, fileName);

    // Download with size limit
    const writeStream = fs.createWriteStream(filePath);
    const downloadStream = ytdl(url, { format });

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

    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
      downloadStream.on('error', reject);
    });

    // Stream the file back to client
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', format.mimeType || 'video/mp4');
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Delete temp file after sending
    fileStream.on('end', () => {
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting temp file:', err);
      });
      // Also clean up any player scripts that might have been left
      cleanupPlayerScripts();
    });

  } catch (error: any) {
    console.error('Fetch video error:', error);
    // Clean up player scripts even on error
    cleanupPlayerScripts();
    res.status(500).json({ error: error.message });
  }
}