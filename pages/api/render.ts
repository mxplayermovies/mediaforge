import { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { jobId } = req.body;
  if (!jobId) return res.status(400).json({ error: 'Missing Job ID' });

  const tempDir = os.tmpdir();
  const jobFile = path.join(tempDir, `${jobId}.json`);

  try {
    if (!fs.existsSync(jobFile)) throw new Error('Job not found');
    const jobData = JSON.parse(fs.readFileSync(jobFile, 'utf8'));
    
    const options = jobData.options;
    const inputPath = jobData.inputPath;
    
    // Determine Output Filename and Format
    let outputExt = options.format || 'mp4';
    if (options.type === 'video' && !options.format) outputExt = 'mp4';
    if (options.type === 'image' && !options.format) outputExt = 'png';
    if (outputExt === 'jpeg') outputExt = 'jpg';
    
    const outputPath = path.join(tempDir, `${jobId}_out.${outputExt}`);

    // Update Status
    jobData.status = 'processing';
    jobData.outputPath = outputPath;
    fs.writeFileSync(jobFile, JSON.stringify(jobData));

    // Get Duration for Video Progress Tracking (Skip for images)
    let duration = 0;
    if (options.type === 'video') {
        duration = await getVideoDuration(inputPath);
    }

    // Start FFmpeg in background
    startFFmpeg(inputPath, outputPath, options, jobId, duration, tempDir);

    res.status(200).json({ status: 'started' });

  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}

function getVideoDuration(inputPath: string): Promise<number> {
    return new Promise((resolve) => {
        const ffprobe = spawn('ffprobe', [
            '-v', 'error',
            '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1',
            inputPath
        ]);
        let raw = '';
        ffprobe.stdout.on('data', d => raw += d.toString());
        ffprobe.on('close', () => {
            const val = parseFloat(raw.trim());
            resolve(isNaN(val) ? 0 : val);
        });
    });
}

function startFFmpeg(input: string, output: string, options: any, jobId: string, duration: number, tempDir: string) {
    const jobFile = path.join(tempDir, `${jobId}.json`);
    const args = ['-y', '-i', input];
    let filterComplex = '';

    // --- A. Filters & Resolution Enforcement ---

    // Denoise (Pre-processing)
    const denoiseFilter = options.denoise ? 'hqdn3d=1.5:1.5:6:6,' : '';

    // Resolution & Aspect Ratio Logic
    const targetRes = options.resize?.targetResolution || options.resolution || 'original';
    const aspectRatio = options.aspectRatio || 'original';
    const scaleFlags = 'flags=spline+accurate_rnd+full_chroma_int';

    // 1. Determine Max Long Edge based on Resolution
    let maxLongEdge = 0;
    if (targetRes === '8k') maxLongEdge = 7680;
    else if (targetRes === '4k') maxLongEdge = 3840;
    else if (targetRes === '2k') maxLongEdge = 2560;
    else if (targetRes === '1080p') maxLongEdge = 1920;
    else if (targetRes === '720p') maxLongEdge = 1280;
    
    // Default fallback if resizing requested via aspect ratio but no res specified
    if (maxLongEdge === 0 && aspectRatio !== 'original') maxLongEdge = 1920; 

    // 2. Build Filter based on combination
    if (aspectRatio === 'original') {
        if (maxLongEdge > 0) {
            filterComplex = `[0:v]${denoiseFilter}scale=w=${maxLongEdge}:h=${maxLongEdge}:force_original_aspect_ratio=decrease:${scaleFlags}[out]`;
        } else {
             // Ensure even dimensions for video codecs if not resizing
             if (options.type === 'video') {
                filterComplex = `[0:v]${denoiseFilter}scale=trunc(iw/2)*2:trunc(ih/2)*2[out]`;
             } else {
                filterComplex = options.denoise ? `[0:v]${denoiseFilter}null[out]` : '';
             }
        }
    } else {
        // --- SOCIAL MEDIA SMART FIT LOGIC (Restored) ---
        // Handles 9:16 (TikTok/Reels), 1:1 (Insta), 4:5 (Portrait)
        const arMap: any = { '1:1': 1.0, '16:9': 1.7778, '9:16': 0.5625, '4:5': 0.8, '3:4': 0.75 };
        const targetRatioVal = arMap[aspectRatio] || 1.7778;
        let targetW = 0, targetH = 0;

        if (maxLongEdge > 0) {
            if (targetRatioVal >= 1) { 
                 targetW = maxLongEdge; targetH = Math.round(maxLongEdge / targetRatioVal);
            } else { 
                 targetH = maxLongEdge; targetW = Math.round(maxLongEdge * targetRatioVal);
            }
        } else {
            // Default reference if no res specified
            targetW = 1920; targetH = 1080;
        }

        // Ensure even dimensions
        targetW = Math.floor(targetW / 2) * 2;
        targetH = Math.floor(targetH / 2) * 2;
        
        // Blurred Background Effect for Aspect Ratio Filling
        filterComplex = `[0:v]split=2[bg_in][fg_in];` +
                        `[bg_in]scale=w=${targetW}:h=${targetH}:force_original_aspect_ratio=increase,crop=${targetW}:${targetH},boxblur=40:5,eq=brightness=-0.1[bg];` +
                        `[fg_in]${denoiseFilter}scale=w=${targetW}:h=${targetH}:force_original_aspect_ratio=decrease:${scaleFlags}[fg];` +
                        `[bg][fg]overlay=(W-w)/2:(H-h)/2[out]`;
    }
    
    // --- B. Creative Filter Logic ---
    let postFilters = '';
    
    if (options.enhance) {
       postFilters += ',unsharp=5:5:1.0:5:5:0.0';
    }

    if (options.filters) {
      const { brightness, contrast, saturation, preset, grayscale, sepia } = options.filters;
      
      // 1. Basic Adjustments
      if (brightness || contrast !== 1 || saturation !== 1) {
         postFilters += `,eq=brightness=${brightness || 0}:contrast=${contrast || 1}:saturation=${saturation || 1}`;
      }

      // 2. Advanced Presets (Complete List)
      if (grayscale) {
          postFilters += ',hue=s=0';
      } else if (sepia) {
          postFilters += ',colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131';
      } else if (preset) {
          switch (preset) {
              case 'vintage': postFilters += ',curves=vintage,eq=contrast=0.9:saturation=0.8'; break;
              case 'kodachrome': postFilters += ',eq=contrast=1.2:saturation=1.2,colorbalance=rs=.1:gs=.1:bs=-.1'; break;
              case 'technicolor': postFilters += ',colorchannelmixer=r=1.35:g=1.1:b=0.5:ra=0.25:ga=0.25:ba=0.25,eq=saturation=1.3'; break;
              case 'polaroid': postFilters += ',colorbalance=bs=0.1,eq=contrast=0.95:brightness=0.05'; break;
              case 'cool': postFilters += ',colorbalance=bs=0.2:rs=-0.1'; break;
              case 'warm': postFilters += ',colorbalance=rs=0.2:bs=-0.15'; break;
              case 'hdr': postFilters += ',unsharp=5:5:1.5:5:5:0.0,eq=saturation=1.3:contrast=1.15'; break;
              case 'cinematic': postFilters += ',colorbalance=rs=0.15:gs=-0.05:bs=-0.15:rm=0.0:gm=0.0:bm=0.1:rh=0.05:gh=0.05:bh=0.0,eq=saturation=1.1:contrast=1.1'; break;
              case 'drama': postFilters += ',hue=s=0.6,eq=contrast=1.4:brightness=-0.05'; break;
              case 'noir': postFilters += ',hue=s=0,eq=contrast=1.6:brightness=-0.1'; break;
              case 'matrix': postFilters += ',colorbalance=gs=0.3:rs=-0.1:bs=-0.1,eq=contrast=1.2'; break;
              case 'vivid': postFilters += ',eq=saturation=1.6:contrast=1.15'; break;
          }
      }
    }
    
    if (postFilters) {
        if (filterComplex) {
             // Inject into [out] chain
             filterComplex = filterComplex.replace('[out]', `[pre_out];[pre_out]${postFilters.substring(1)}[out]`);
        } else {
             // Create chain if none exists
             filterComplex = `[0:v]${postFilters.substring(1)}[out]`;
        }
    }

    if (filterComplex) {
        args.push('-filter_complex', filterComplex);
        args.push('-map', '[out]');
    }

    // --- C. Audio & Encoding Settings ---

    if (options.type === 'video') {
        args.push('-map', '0:a?');
        args.push('-c:a', 'aac', '-b:a', '192k');
    }

    const outputExt = path.extname(output).toLowerCase().replace('.', '');

    // High Quality Encoding Settings
    if (outputExt === 'jpg') {
        args.push('-c:v', 'mjpeg', '-q:v', '2', '-pix_fmt', 'yuvj444p', '-color_range', 'pc'); 
    } else if (outputExt === 'png') {
        args.push('-compression_level', '3');
    } else if (outputExt === 'webp') {
        args.push('-c:v', 'libwebp', '-lossless', '1', '-quality', '100');
    } else if (outputExt === 'mp4') {
        args.push('-c:v', 'libx264', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart');
    } else if (outputExt === 'webm') {
        args.push('-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0');
    }

    args.push(output);

    console.log('Spawning FFmpeg:', args.join(' '));

    const ffmpeg = spawn('ffmpeg', args);

    ffmpeg.stderr.on('data', (data) => {
        // Progress Parsing
        const str = data.toString();
        
        // Video Progress (Time based)
        if (options.type === 'video' && duration > 0) {
            const timeMatch = str.match(/time=(\d{2}):(\d{2}):(\d{2}\.\d{2})/);
            if (timeMatch) {
                const hours = parseFloat(timeMatch[1]);
                const mins = parseFloat(timeMatch[2]);
                const secs = parseFloat(timeMatch[3]);
                const currentSeconds = (hours * 3600) + (mins * 60) + secs;
                const progress = Math.min(99, Math.round((currentSeconds / duration) * 100));
                updateJobProgress(jobFile, progress);
            }
        }
    });

    ffmpeg.on('close', (code) => {
        updateJobStatus(jobFile, code === 0 ? 'completed' : 'error');
    });
}

function updateJobProgress(jobFile: string, progress: number) {
    try {
        if (fs.existsSync(jobFile)) {
            const data = JSON.parse(fs.readFileSync(jobFile, 'utf8'));
            data.progress = progress;
            fs.writeFileSync(jobFile, JSON.stringify(data));
        }
    } catch(e) {}
}

function updateJobStatus(jobFile: string, status: string) {
    try {
        if (fs.existsSync(jobFile)) {
            const data = JSON.parse(fs.readFileSync(jobFile, 'utf8'));
            data.status = status;
            data.progress = status === 'completed' ? 100 : data.progress;
            fs.writeFileSync(jobFile, JSON.stringify(data));
        }
    } catch(e) {}
}