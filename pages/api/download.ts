// import { NextApiRequest, NextApiResponse } from 'next';
// import fs from 'fs';
// import path from 'path';
// import os from 'os';

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { jobId } = req.query;
//   if (!jobId || typeof jobId !== 'string') return res.status(400).json({ error: 'Missing Job ID' });

//   const tempDir = os.tmpdir();
//   const jobFile = path.join(tempDir, `${jobId}.json`);

//   try {
//     if (!fs.existsSync(jobFile)) return res.status(404).json({ error: 'Job not found' });
//     const jobData = JSON.parse(fs.readFileSync(jobFile, 'utf8'));
    
//     if (jobData.status !== 'completed') return res.status(400).json({ error: 'Job not ready' });
    
//     const outputPath = jobData.outputPath;
//     if (!fs.existsSync(outputPath)) return res.status(404).json({ error: 'Output file missing' });

//     const stat = fs.statSync(outputPath);
//     const readStream = fs.createReadStream(outputPath);

//     // Determine MIME
//     const ext = path.extname(outputPath).toLowerCase();
//     const mime = 
//         ext === '.mp4' ? 'video/mp4' : 
//         ext === '.webm' ? 'video/webm' : 
//         ext === '.png' ? 'image/png' : 
//         ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 
//         ext === '.webp' ? 'image/webp' :
//         ext === '.mov' ? 'video/quicktime' :
//         ext === '.avi' ? 'video/x-msvideo' :
//         'application/octet-stream';

//     res.setHeader('Content-Type', mime);
//     res.setHeader('Content-Length', stat.size);
//     res.setHeader('Content-Disposition', `attachment; filename="processed_${path.basename(outputPath)}"`);
    
//     readStream.pipe(res);

//   } catch (e: any) {
//     res.status(500).json({ error: e.message });
//   }
// }





import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const config = {
  api: {
    responseLimit: false,
  },
};

// Map file extensions to MIME types
const mimeTypes: Record<string, string> = {
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.avi': 'video/x-msvideo',
  '.mkv': 'video/x-matroska',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { jobId } = req.query;
  if (!jobId || typeof jobId !== 'string') {
    return res.status(400).json({ error: 'Missing Job ID' });
  }

  const tempDir = os.tmpdir();
  const jobFile = path.join(tempDir, `${jobId}.json`);

  try {
    // 1. Check job file exists
    if (!fs.existsSync(jobFile)) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // 2. Read job data
    const jobData = JSON.parse(fs.readFileSync(jobFile, 'utf8'));

    // 3. Verify job is completed
    if (jobData.status !== 'completed') {
      return res.status(400).json({ error: 'Job not ready' });
    }

    const outputPath = jobData.outputPath;
    if (!fs.existsSync(outputPath)) {
      return res.status(404).json({ error: 'Output file missing' });
    }

    // 4. Determine MIME type
    const ext = path.extname(outputPath).toLowerCase();
    const mime = mimeTypes[ext] || 'application/octet-stream';

    // 5. Set headers
    const stat = fs.statSync(outputPath);
    res.setHeader('Content-Type', mime);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Disposition', `attachment; filename="processed_${jobId}${ext}"`);

    // 6. Stream the file
    const readStream = fs.createReadStream(outputPath);
    readStream.pipe(res);

    // 7. Clean up after streaming
    const cleanup = () => {
      fs.unlink(outputPath, (err) => {
        if (err) console.error('Error deleting output file:', err);
      });
      fs.unlink(jobFile, (err) => {
        if (err) console.error('Error deleting job file:', err);
      });
    };

    readStream.on('end', cleanup);
    readStream.on('error', (err) => {
      console.error('Stream error:', err);
      cleanup();
      if (!res.headersSent) {
        res.status(500).json({ error: 'File streaming failed' });
      }
    });

    // 8. Handle client disconnect
    req.on('close', () => {
      readStream.destroy();
      cleanup();
    });

  } catch (e: any) {
    console.error('Download error:', e);
    res.status(500).json({ error: e.message });
  }
}