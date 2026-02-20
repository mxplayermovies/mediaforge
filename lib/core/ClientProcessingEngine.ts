import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export interface ProcessOptions {
  type: 'video' | 'image';
  resolution?: '4k' | '2k' | '1080p';
  enhance?: boolean;
  denoise?: boolean;
  filters?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    grayscale?: boolean;
    sepia?: boolean;
    preset?: string;
  };
  resize?: {
    targetResolution?: 'original' | '720p' | '1080p' | '4k' | '8k';
    scale?: number;
  };
  format?: 'png' | 'jpg' | 'webp';
  targetSizePreset?: 'best' | 'high' | 'medium' | 'low' | 'tiny';
}

class ClientEngine {
  private ffmpeg: FFmpeg | null = null;
  private loaded = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.ffmpeg = new FFmpeg();
    }
  }

  public async load() {
    if (this.loaded && this.ffmpeg) return;

    if (!this.ffmpeg) {
        this.ffmpeg = new FFmpeg();
    }

    try {
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
        await this.ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        this.loaded = true;
        console.log('FFmpeg WASM Engine Loaded');
    } catch (error) {
        console.error('Engine Load Failed:', error);
        throw new Error('Browser engine failed to initialize. Please reload.');
    }
  }

  public async processFile(
    input: File | string, 
    options: ProcessOptions, 
    onProgress: (progress: number) => void
  ): Promise<string> {
    if (!this.loaded || !this.ffmpeg) {
        await this.load();
    }
    
    const ffmpeg = this.ffmpeg!;
    const isVideo = options.type === 'video';
    
    // File Setup
    const inputName = 'input_file';
    let inputData: Uint8Array;

    try {
        inputData = await fetchFile(input);
    } catch (e) {
        throw new Error("Failed to read input file.");
    }

    // Output Setup
    let outputExt = isVideo ? 'mp4' : (options.format || 'png');
    if (outputExt === 'jpeg') outputExt = 'jpg';
    const outputName = `output.${outputExt}`;
    const outputMime = isVideo ? 'video/mp4' : `image/${outputExt}`;

    // Write to MEMFS
    await ffmpeg.writeFile(inputName, inputData);

    // Build FFmpeg Command
    const args = ['-i', inputName];
    const filters: string[] = [];

    // 1. Denoise (First step)
    if (options.denoise) {
        filters.push('hqdn3d=1.5:1.5:6:6');
    }

    // 2. Color / EQ
    if (options.filters) {
        const { brightness = 0, contrast = 1, saturation = 1, preset, sepia, grayscale } = options.filters;
        
        // Manual EQ
        if (brightness !== 0 || contrast !== 1 || saturation !== 1) {
            filters.push(`eq=brightness=${brightness}:contrast=${contrast}:saturation=${saturation}`);
        }

        // Presets
        if (preset === 'vintage') {
            filters.push('colorchannelmixer=.9:.1:0:0:.1:.8:.1:0:0:.1:.9:0');
            filters.push('eq=contrast=0.9:saturation=0.8');
        } else if (preset === 'kodachrome') {
            filters.push('eq=contrast=1.3:saturation=1.4');
            filters.push('colorchannelmixer=1.1:-0.1:0:0:-0.1:1.1:0:0:0:0:1:0');
        } else if (preset === 'technicolor') {
             filters.push('colorchannelmixer=1:0:0:0:0:1:0:0:0:0:1:0');
             filters.push('eq=saturation=1.5:contrast=1.1');
        } else if (preset === 'polaroid') {
             filters.push('eq=contrast=1.1:brightness=0.05:saturation=0.9');
             filters.push('colorchannelmixer=1:0:0:0:0:1:0:0:0:0:1.1:0');
        } else if (preset === 'cool') {
             filters.push('colorchannelmixer=1:0:0:0:0:1:0:0:-0.1:0:1.1:0');
        } else if (preset === 'warm') {
             filters.push('colorchannelmixer=1.1:0:-0.1:0:0:1:0:0:0:0:1:0');
        }

        if (sepia) filters.push('colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131');
        if (grayscale) filters.push('hue=s=0');
    }

    // 3. Scaling / Resolution
    let scaleString = '';
    if (options.resize?.targetResolution && options.resize.targetResolution !== 'original') {
        switch(options.resize.targetResolution) {
            case '8k': scaleString = 'scale=-1:4320:flags=lanczos'; break;
            case '4k': scaleString = 'scale=-1:2160:flags=lanczos'; break;
            case '1080p': scaleString = 'scale=-1:1080:flags=lanczos'; break;
            case '720p': scaleString = 'scale=-1:720:flags=lanczos'; break;
        }
    } else if (options.enhance) {
        scaleString = 'scale=iw*2:ih*2:flags=lanczos';
    }
    
    if (scaleString) filters.push(scaleString);

    // 4. Sharpening (Must be after scale)
    if (options.enhance) {
        filters.push('unsharp=5:5:1.0:5:5:0.0');
    }

    // Apply Filters
    if (filters.length > 0) {
        args.push('-vf', filters.join(','));
    }

    // 5. Output Settings
    if (outputExt === 'jpg') {
        let q = '5';
        if (options.targetSizePreset === 'best') q = '2';
        if (options.targetSizePreset === 'tiny') q = '31';
        args.push('-q:v', q);
    } else if (outputExt === 'webp') {
        let q = '80';
        if (options.targetSizePreset === 'best') q = '100';
        args.push('-quality', q);
    } else if (outputExt === 'png') {
        args.push('-compression_level', '5');
    }

    args.push(outputName);

    // Execution
    ffmpeg.on('progress', ({ progress }) => {
        onProgress(Math.max(0, Math.min(100, Math.round(progress * 100))));
    });

    console.log('Running FFmpeg WASM:', args.join(' '));
    await ffmpeg.exec(args);

    // Read & Return
    const data = await ffmpeg.readFile(outputName);
    
    // Cleanup
    try {
        await ffmpeg.deleteFile(inputName);
        await ffmpeg.deleteFile(outputName);
    } catch(e) { /* ignore */ }

    // CRITICAL FIX: Cast data to any or Uint8Array to satisfy Blob constructor strict types
    return URL.createObjectURL(new Blob([data as any], { type: outputMime }));
  }
}

export const clientEngine = new ClientEngine();