import { NextApiRequest, NextApiResponse } from 'next';
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

const readRawBody = (req: NextApiRequest): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const stream = req as any; 
    stream.on('data', (chunk: any) => chunks.push(Buffer.from(chunk)));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', (err: any) => reject(err));
  });
};

// Helper: Get Image Dimensions via FFprobe
function getImageDimensions(filePath: string): Promise<{ width: number, height: number }> {
    return new Promise((resolve) => {
        const args = [
            '-v', 'error',
            '-select_streams', 'v:0',
            '-show_entries', 'stream=width,height',
            '-of', 'csv=s=x:p=0',
            filePath
        ];
        const proc = spawn('ffprobe', args);
        let output = '';
        proc.stdout.on('data', (data) => output += data.toString());
        proc.on('close', (code) => {
            if (code !== 0) {
                console.warn("FFprobe failed, defaulting to 1920x1080");
                resolve({ width: 1920, height: 1080 });
                return;
            }
            const [w, h] = output.trim().split('x').map(Number);
            resolve({ width: w || 1920, height: h || 1080 });
        });
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const jobId = crypto.randomBytes(8).toString('hex');
  const tempDir = os.tmpdir();

  try {
    const optionsHeader = (req as any).headers['x-process-options'];
    if (!optionsHeader) throw new Error('Missing configuration header');
    const options = JSON.parse(optionsHeader);

    // Setup Paths
    const originalName = options.originalName || 'file.png';
    const inputExt = path.extname(originalName).toLowerCase();
    const inputPath = path.join(tempDir, `${jobId}_in${inputExt}`);

    // Write Input
    const fileBuffer = await readRawBody(req);
    if (fileBuffer.length === 0) throw new Error('Empty file received');
    await fs.promises.writeFile(inputPath, fileBuffer);

    // Determine Output Format
    let outputExt = options.format;
    if (!outputExt || outputExt === 'original') {
        outputExt = inputExt.replace('.', '') || 'png';
    }
    if (outputExt === 'jpeg') outputExt = 'jpg';
    
    const outputPath = path.join(tempDir, `${jobId}_out.${outputExt}`);

    // Create Job
    const jobFile = path.join(tempDir, `${jobId}.json`);
    const jobData = {
        id: jobId,
        status: 'queued',
        progress: 0,
        type: 'image',
        createdAt: Date.now(),
        outputPath: outputPath,
        options: options
    };
    await fs.promises.writeFile(jobFile, JSON.stringify(jobData));

    // Spawn Async Processing
    processImageAsync(inputPath, outputPath, options, jobFile, outputExt);

    res.status(200).json({ jobId, status: 'queued' });

  } catch (error: any) {
    console.error('Image Queue Error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function processImageAsync(inputPath: string, outputPath: string, options: any, jobFile: string, outputExt: string) {
    try {
        updateJob(jobFile, { status: 'processing', progress: 10 });

        // 1. Analyze Input
        const { width: inputW, height: inputH } = await getImageDimensions(inputPath);
        
        // 2. Determine Target Maximum Dimension
        const targetRes = options.resize?.targetResolution || options.resolution || 'original';
        let maxDim = 0;

        if (targetRes === 'original') {
            // CRITICAL FIX: Use Input Dimensions for Original
            maxDim = Math.max(inputW, inputH);
        } else if (targetRes === '8k') maxDim = 7680;
        else if (targetRes === '4k') maxDim = 3840;
        else if (targetRes === '2k') maxDim = 2560;
        else if (targetRes === '1080p') maxDim = 1920;
        else if (targetRes === '720p') maxDim = 1280;
        
        // Safety Fallback
        if (maxDim === 0) maxDim = 1920;

        // 3. Calculate Exact Dimensions based on Aspect Ratio
        const aspectRatio = options.aspectRatio || 'original';
        const aspectRatios: Record<string, number> = {
            '1:1': 1, '16:9': 1.7778, '9:16': 0.5625, '4:5': 0.8, '3:4': 0.75
        };
        const targetRatio = aspectRatios[aspectRatio];

        let finalW = inputW;
        let finalH = inputH;
        let filterComplex = '';
        const scaleFlags = 'flags=lanczos+accurate_rnd+full_chroma_int';

        if (aspectRatio !== 'original' && targetRatio) {
            // STRETCH TO FIT Logic: Force exact dimensions based on MaxDim and Ratio
            if (targetRatio >= 1) { 
                // Landscape or Square
                finalW = maxDim;
                finalH = Math.round(maxDim / targetRatio);
            } else {
                // Portrait
                finalH = maxDim;
                finalW = Math.round(maxDim * targetRatio);
            }
            // Ensure even dimensions for compatibility
            finalW = Math.floor(finalW / 2) * 2;
            finalH = Math.floor(finalH / 2) * 2;

            // Direct Scale (Stretch)
            filterComplex = `[0:v]scale=${finalW}:${finalH}:${scaleFlags}[out]`;
        } else {
            // Original Ratio Logic
            // Scale if MaxDim is different from Input, maintaining aspect ratio
            if (targetRes !== 'original') {
                // Use standard scale fit
                 filterComplex = `[0:v]scale=w='if(gt(iw,ih),${maxDim},-2)':h='if(gt(iw,ih),-2,${maxDim})':${scaleFlags}[out]`;
                 // We don't know exact finalW/H easily here without complex calculation, but FFmpeg handles it.
                 // We assume MaxDim is the dominant constraint for quality calculations.
                 finalW = maxDim; 
                 finalH = maxDim; 
            } else {
                // No scaling needed, just pass through (or apply filters)
                filterComplex = `[0:v]null[out]`;
                finalW = inputW;
                finalH = inputH;
            }
        }

        const totalPixels = finalW * finalH;

        // 4. Filters
        let postFilters = '';
        if (options.denoise) postFilters += ',hqdn3d=1.5:1.5:6:6';
        if (options.enhance) postFilters += ',unsharp=5:5:1.0:5:5:0.0';

        if (options.filters) {
            const { brightness, contrast, saturation, preset, grayscale, sepia } = options.filters;
            
            if (brightness || contrast !== 1 || saturation !== 1) {
                postFilters += `,eq=brightness=${brightness || 0}:contrast=${contrast || 1}:saturation=${saturation || 1}`;
            }

            if (grayscale) postFilters += ',hue=s=0';
            else if (sepia) postFilters += ',colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131';
            else if (preset === 'vintage') postFilters += ',curves=vintage,eq=contrast=0.9:saturation=0.8';
            else if (preset === 'hdr') postFilters += ',unsharp=5:5:1.5:5:5:0.0,eq=saturation=1.3:contrast=1.15';
            else if (preset === 'noir') postFilters += ',hue=s=0,eq=contrast=1.6:brightness=-0.1';
            // ... (add other presets as needed)
        }

        if (postFilters) {
            filterComplex = filterComplex.replace('[out]', `[pre];[pre]${postFilters.substring(1)}[out]`);
        }

        // 5. Build FFmpeg Command
        const args = ['-y', '-i', inputPath];
        args.push('-filter_complex', filterComplex);
        args.push('-map', '[out]');

        // 6. Professional Encoding Parameters
        // Varies based on Resolution (totalPixels) and Format
        
        const IS_HI_RES = totalPixels >= 3686400; // > 1440p (2560x1440) roughly

        if (outputExt === 'jpg' || outputExt === 'jpeg') {
            args.push('-c:v', 'mjpeg', '-pix_fmt', 'yuvj444p', '-color_range', 'pc');
            if (IS_HI_RES) {
                // Highest Quality for 2K/4K/8K
                args.push('-q:v', '1', '-qmin', '1', '-qmax', '1'); 
            } else {
                // Excellent Quality for standard
                args.push('-q:v', '2');
            }
        } 
        else if (outputExt === 'png') {
            args.push('-c:v', 'png');
            args.push('-pred', 'mixed'); // Better compression for graphics
            // For huge images, speed up compression slightly. For small, max compression.
            if (totalPixels >= 8300000) { // 4K+
                args.push('-compression_level', '3'); // Faster save, slightly larger
            } else {
                args.push('-compression_level', '9'); // Max compression
            }
        } 
        else if (outputExt === 'webp') {
            args.push('-c:v', 'libwebp');
            if (IS_HI_RES) {
                args.push('-quality', '100', '-compression_level', '4');
            } else {
                args.push('-quality', '90', '-compression_level', '6');
            }
        }

        args.push(outputPath);

        // Execute
        await new Promise<void>((resolve, reject) => {
            const proc = spawn('ffmpeg', args);
            proc.on('close', (code) => {
                if (code === 0) resolve();
                else reject(new Error(`FFmpeg exited with code ${code}`));
            });
        });

        // Cleanup
        try { await fs.promises.unlink(inputPath); } catch (e) {}
        
        updateJob(jobFile, { status: 'completed', progress: 100 });

    } catch (e: any) {
        console.error("Async Process Failed", e);
        updateJob(jobFile, { status: 'failed', error: e.message });
    }
}

function updateJob(jobFile: string, updates: any) {
    try {
        if (fs.existsSync(jobFile)) {
            const current = JSON.parse(fs.readFileSync(jobFile, 'utf8'));
            const updated = { ...current, ...updates };
            fs.writeFileSync(jobFile, JSON.stringify(updated));
        }
    } catch (e) { console.error("Job update failed", e); }
}