import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import os from 'os';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { jobId } = req.query;
  if (!jobId || typeof jobId !== 'string') return res.status(400).json({ error: 'Missing Job ID' });

  const tempDir = os.tmpdir();
  const jobFile = path.join(tempDir, `${jobId}.json`);

  try {
    if (!fs.existsSync(jobFile)) return res.status(404).json({ error: 'Job not found' });
    const jobData = JSON.parse(fs.readFileSync(jobFile, 'utf8'));
    
    if (jobData.status !== 'completed') return res.status(400).json({ error: 'Job not ready' });
    
    const outputPath = jobData.outputPath;
    if (!fs.existsSync(outputPath)) return res.status(404).json({ error: 'Output file missing' });

    const stat = fs.statSync(outputPath);
    const readStream = fs.createReadStream(outputPath);

    // Determine MIME
    const ext = path.extname(outputPath).toLowerCase();
    const mime = 
        ext === '.mp4' ? 'video/mp4' : 
        ext === '.webm' ? 'video/webm' : 
        ext === '.png' ? 'image/png' : 
        ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 
        ext === '.webp' ? 'image/webp' :
        ext === '.mov' ? 'video/quicktime' :
        ext === '.avi' ? 'video/x-msvideo' :
        'application/octet-stream';

    res.setHeader('Content-Type', mime);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Disposition', `attachment; filename="processed_${path.basename(outputPath)}"`);
    
    readStream.pipe(res);

  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}