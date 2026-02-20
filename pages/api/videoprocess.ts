import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import { Buffer } from 'buffer';

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

const MAX_SIZE = 1024 * 1024 * 1024; // 1GB

const readRawBody = (req: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let totalSize = 0;
    const stream = req;
    stream.on('data', (chunk: any) => {
      totalSize += chunk.length;
      if (totalSize > MAX_SIZE) {
        stream.destroy();
        reject(new Error('File size exceeds the 1GB limit.'));
        return;
      }
      chunks.push(Buffer.from(chunk));
    });
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
};

function getVideoMetadata(filePath: string): Promise<{ width: number; height: number; duration: number }> {
  return new Promise((resolve, reject) => {
    const args = [
      '-v', 'error',
      '-select_streams', 'v:0',
      '-show_entries', 'stream=width,height,duration',
      '-of', 'default=noprint_wrappers=1:nokey=1',
      filePath,
    ];
    const proc = spawn('ffprobe', args);
    let output = '';
    proc.stdout.on('data', (data) => (output += data.toString()));
    proc.stderr.on('data', (data) => console.error('ffprobe stderr:', data.toString()));
    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`ffprobe exited with code ${code}`));
        return;
      }
      const lines = output.trim().split('\n');
      const width = parseInt(lines[0]) || 1920;
      const height = parseInt(lines[1]) || 1080;
      const duration = parseFloat(lines[2]) || 0;
      resolve({ width, height, duration });
    });
  });
}

function updateJob(jobFile: string, updates: any) {
  try {
    if (fs.existsSync(jobFile)) {
      const current = JSON.parse(fs.readFileSync(jobFile, 'utf8'));
      const updated = { ...current, ...updates };
      fs.writeFileSync(jobFile, JSON.stringify(updated));
    }
  } catch (e) {
    console.error('Job update failed', e);
  }
}

async function processVideoAsync(
  inputPath: string,
  outputPath: string,
  options: any,
  jobFile: string,
  outputExt: string
) {
  try {
    updateJob(jobFile, { status: 'processing', progress: 0 });

    const { width: inW, height: inH, duration } = await getVideoMetadata(inputPath);

    // ----- Target maximum dimension -----
    const targetRes = options.resize?.targetResolution || options.resolution || 'original';
    let maxDim = 0;
    if (targetRes === 'original') {
      maxDim = Math.max(inW, inH);
    } else if (targetRes === '8k') maxDim = 7680;
    else if (targetRes === '4k') maxDim = 3840;
    else if (targetRes === '2k') maxDim = 2560;
    else if (targetRes === '1080p') maxDim = 1920;
    else if (targetRes === '720p') maxDim = 1280;
    if (maxDim === 0) maxDim = 1920;

    // ----- Target aspect ratio -----
    const aspectRatio = options.aspectRatio || 'original';
    const aspectMap: Record<string, number> = {
      '1:1': 1,
      '16:9': 16 / 9,
      '9:16': 9 / 16,
      '4:5': 4 / 5,
      '3:4': 3 / 4,
    };
    const targetAspect = aspectMap[aspectRatio];

    // ----- Step 1: Scale to fit within maxDim while preserving original aspect -----
    let scaledW = inW;
    let scaledH = inH;
    if (targetRes !== 'original') {
      const scaleFactor = Math.min(maxDim / inW, maxDim / inH);
      scaledW = Math.round(inW * scaleFactor);
      scaledH = Math.round(inH * scaleFactor);
    }
    // Ensure even dimensions
    scaledW = Math.floor(scaledW / 2) * 2;
    scaledH = Math.floor(scaledH / 2) * 2;

    // ----- Step 2: Crop to target aspect ratio (if requested) -----
    let cropW = scaledW;
    let cropH = scaledH;
    if (targetAspect && aspectRatio !== 'original') {
      const currentAspect = scaledW / scaledH;
      if (currentAspect > targetAspect) {
        // Too wide → crop width
        cropW = Math.round(scaledH * targetAspect);
        cropH = scaledH;
      } else if (currentAspect < targetAspect) {
        // Too tall → crop height
        cropW = scaledW;
        cropH = Math.round(scaledW / targetAspect);
      } else {
        // Already matches
        cropW = scaledW;
        cropH = scaledH;
      }
      // Ensure even dimensions
      cropW = Math.floor(cropW / 2) * 2;
      cropH = Math.floor(cropH / 2) * 2;
    }

    // ----- Build filter chain -----
    const filters: string[] = [];

    // First scale to the intermediate size
    filters.push(`scale=${scaledW}:${scaledH}:flags=lanczos`);

    // Then crop (if needed)
    if (cropW !== scaledW || cropH !== scaledH) {
      // Center crop
      const x = Math.floor((scaledW - cropW) / 2);
      const y = Math.floor((scaledH - cropH) / 2);
      filters.push(`crop=${cropW}:${cropH}:${x}:${y}`);
    }

    // Additional filters
    if (options.denoise) filters.push('hqdn3d=1.5:1.5:6:6');
    if (options.enhance) filters.push('unsharp=5:5:1.0:5:5:0.0');

    if (options.filters) {
      const { brightness = 0, contrast = 1, saturation = 1, grayscale, sepia, preset } = options.filters;
      if (brightness !== 0 || contrast !== 1 || saturation !== 1) {
        filters.push(`eq=brightness=${brightness}:contrast=${contrast}:saturation=${saturation}`);
      }
      if (grayscale) filters.push('hue=s=0');
      else if (sepia) {
        filters.push('colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131');
      } else if (preset === 'vintage') {
        filters.push('curves=vintage,eq=contrast=0.9:saturation=0.8');
      }
    }

    const filterComplex = filters.join(',');

    // ----- Build FFmpeg command -----
    const ffmpegArgs = [
      '-y',
      '-i', inputPath,
      '-vf', filterComplex,
      '-map', '0:v',
      '-map', '0:a?',
    ];

    const isWebM = outputExt === 'webm';
    if (isWebM) {
      ffmpegArgs.push('-c:v', 'libvpx-vp9');
      ffmpegArgs.push('-c:a', 'libopus');
      ffmpegArgs.push('-preset', 'ultrafast');
      ffmpegArgs.push('-b:a', '128k');
      ffmpegArgs.push('-crf', '30');
      ffmpegArgs.push('-b:v', '0'); // CRF mode
      ffmpegArgs.push('-pix_fmt', 'yuv420p');
    } else {
      ffmpegArgs.push('-c:v', 'libx264');
      ffmpegArgs.push('-preset', 'ultrafast');
      ffmpegArgs.push('-c:a', 'aac');
      ffmpegArgs.push('-b:a', '192k');
      const totalPixels = cropW * cropH;
      if (totalPixels >= 3840 * 2160) {
        ffmpegArgs.push('-b:v', '20M', '-maxrate', '25M', '-bufsize', '30M');
      } else if (totalPixels >= 1920 * 1080) {
        ffmpegArgs.push('-b:v', '5M', '-maxrate', '7M', '-bufsize', '10M');
      } else {
        ffmpegArgs.push('-b:v', '2M', '-maxrate', '3M', '-bufsize', '4M');
      }
      ffmpegArgs.push('-pix_fmt', 'yuv420p');
      ffmpegArgs.push('-movflags', '+faststart');
    }

    ffmpegArgs.push(outputPath);

    // ----- Execute -----
    await new Promise<void>((resolve, reject) => {
      const proc = spawn('ffmpeg', ffmpegArgs);
      let stderr = '';

      proc.stderr.on('data', (data) => {
        const chunk = data.toString();
        stderr += chunk;
        if (duration > 0) {
          const match = chunk.match(/time=(\d{2}):(\d{2}):(\d{2}\.\d{2})/);
          if (match) {
            const sec = parseFloat(match[1]) * 3600 + parseFloat(match[2]) * 60 + parseFloat(match[3]);
            const pct = Math.min(99, Math.round((sec / duration) * 100));
            updateJob(jobFile, { progress: pct });
          }
        }
      });

      proc.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          console.error('FFmpeg error (stderr):', stderr);
          reject(new Error(`FFmpeg exited with code ${code}. Check server logs for details.`));
        }
      });

      proc.on('error', (err) => {
        reject(new Error(`Failed to start FFmpeg: ${err.message}`));
      });
    });

    // Cleanup input file
    try {
      await fs.promises.unlink(inputPath);
    } catch (e) {
      console.warn('Failed to delete input file:', e);
    }

    updateJob(jobFile, { status: 'completed', progress: 100 });
  } catch (e: any) {
    console.error('Video Async Failed', e);
    updateJob(jobFile, { status: 'failed', error: e.message });
  }
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const jobId = crypto.randomBytes(8).toString('hex');
  const tempDir = os.tmpdir();

  try {
    const optionsHeader = req.headers['x-process-options'];
    if (!optionsHeader) throw new Error('Missing configuration header');
    const options = JSON.parse(optionsHeader);

    const originalName = options.originalName || 'video.mp4';
    const inputExt = path.extname(originalName).toLowerCase();
    const inputPath = path.join(tempDir, `${jobId}_in${inputExt}`);

    const fileBuffer = await readRawBody(req);
    if (fileBuffer.length === 0) throw new Error('Empty file received');
    await fs.promises.writeFile(inputPath, fileBuffer);

    let outputExt = options.format;
    if (!outputExt || outputExt === 'original') {
      outputExt = inputExt.replace('.', '') || 'mp4';
    }
    // Normalize extensions: only webm is special, everything else becomes mp4
    if (outputExt === 'webm') outputExt = 'webm';
    else outputExt = 'mp4';

    const outputPath = path.join(tempDir, `${jobId}_out.${outputExt}`);

    const jobFile = path.join(tempDir, `${jobId}.json`);
    const jobData = {
      id: jobId,
      status: 'queued',
      progress: 0,
      type: 'video',
      createdAt: Date.now(),
      outputPath,
      options,
    };
    await fs.promises.writeFile(jobFile, JSON.stringify(jobData));

    // Spawn async processing
    processVideoAsync(inputPath, outputPath, options, jobFile, outputExt).catch((err) => {
      console.error('Unhandled error in processVideoAsync:', err);
    });

    res.status(200).json({ jobId, status: 'queued' });
  } catch (error: any) {
    console.error('Video Queue Error:', error);
    const status = error.message.includes('1GB limit') ? 413 : 500;
    res.status(status).json({ error: error.message });
  }
}