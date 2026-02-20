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
    if (!fs.existsSync(jobFile)) {
        return res.status(404).json({ error: 'Job not found' });
    }
    
    const jobData = JSON.parse(fs.readFileSync(jobFile, 'utf8'));
    
    res.status(200).json({
        id: jobData.id,
        state: jobData.status,
        progress: jobData.progress,
        error: jobData.error
    });

  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}