import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import { useMediaProcessor } from '../../hooks/useMediaProcessor';
import { voiceManager } from '../../lib/core/VoiceManager';
import {
  ArrowLeft, Video as VideoIcon, Download, Wand2, UploadCloud,
  AlertTriangle, Loader2, Cpu, Palette, Settings, RefreshCcw,
  Monitor, Eye, EyeOff, X, Play, Pause, Volume2, VolumeX, Layout, Clock, Activity, Trash2, Sliders
} from 'lucide-react';

type TargetResolution = 'original' | '720p' | '1080p' | '4k' | '8k';
type TargetAspectRatio = 'original' | '1:1' | '16:9' | '9:16' | '4:5' | '3:4';
type FilterPreset = 'none' | 'vintage' | 'kodachrome' | 'technicolor' | 'polaroid' | 'cool' | 'warm' | 'grayscale' | 'sepia' | 'hdr' | 'cinematic' | 'drama' | 'noir' | 'matrix' | 'vivid';
type OutputFormat = 'original' | 'mp4' | 'webm';

export default function VideoStudio() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [enhance, setEnhance] = useState(false);
  const [denoise, setDenoise] = useState(false);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(1);
  const [saturation, setSaturation] = useState(1);
  const [effect, setEffect] = useState<FilterPreset>('none');

  const [showOriginal, setShowOriginal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [format, setFormat] = useState<OutputFormat>('original');
  const [targetResolution, setTargetResolution] = useState<TargetResolution>('original');
  const [aspectRatio, setAspectRatio] = useState<TargetAspectRatio>('original');
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { processFile, status, progress, error, resultUrl, reset: resetProcessor, processingDetails } = useMediaProcessor();

  useEffect(() => {
    voiceManager.speak("Video Forge Studio Loaded. To hear a detailed guide on how to use this PRO Video tool, click the speaker icon in the top header.");
  }, []);

  const readPageGuide = () => {
    const text = `
      Guide to Video Forge Studio.
      Step 1: Select Input. Upload a video file. Max file size is 1 Gigabyte.
      Step 2: AI Enhancements. Check Upscale to increase resolution, or Denoise to clean up footage.
      Step 3: Color Grading. Adjust Brightness, Contrast, and Saturation, or apply filters.
      Step 4: Export Settings. Select Quality and Format.
      Step 5: Process. Click the Process button.
    `;
    voiceManager.speak(text, true);
  };

  const handleVoiceFeedback = (text: string) => {
    if (typeof window !== 'undefined' && voiceManager) {
      voiceManager.speak(text, true);
    }
  };

  const resetSettings = () => {
    setEnhance(false);
    setDenoise(false);
    setBrightness(0);
    setContrast(1);
    setSaturation(1);
    setEffect('none');
    setFormat('original');
    setTargetResolution('original');
    setAspectRatio('original');
    setShowOriginal(false);
  };

  const handleReset = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = "";
    }
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    resetProcessor();
    resetSettings();
    setPreviewUrl(null);
    setSelectedFile(null);
    handleVoiceFeedback("Operation cancelled. Workspace cleared.");
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      handleVoiceFeedback("Invalid file type. Please upload a video.");
      return;
    }
    const MAX_SIZE = 1073741824;
    if (file.size > MAX_SIZE) {
      handleVoiceFeedback("Error. File too large. Maximum allowed size is 1 Gigabyte.");
      alert("Error: File limit exceeded. Maximum file size is 1GB.");
      return;
    }
    handleReset();
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    handleVoiceFeedback("Video loaded successfully.");
  };

  const handleProcess = () => {
    if (!selectedFile) {
      handleVoiceFeedback("No video loaded.");
      return;
    }
    handleVoiceFeedback("Starting processing.");
    processFile(selectedFile, {
      type: 'video',
      enhance,
      denoise,
      filters: {
        brightness,
        contrast,
        saturation,
        preset: effect !== 'none' ? effect : undefined,
        grayscale: effect === 'grayscale',
        sepia: effect === 'sepia'
      },
      resize: { targetResolution },
      aspectRatio,
      format: format === 'original' ? undefined : format
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const getFilterStyle = () => {
    if (showOriginal) return 'none';
    const base = `brightness(${1 + brightness}) contrast(${contrast}) saturate(${saturation})`;
    let extra = '';

    if (effect === 'grayscale') extra = 'grayscale(100%)';
    else if (effect === 'sepia') extra = 'sepia(100%)';
    else if (effect === 'vintage') extra = 'sepia(50%) contrast(85%) brightness(90%)';
    else if (effect === 'kodachrome') extra = 'contrast(120%) saturate(130%)';
    else if (effect === 'technicolor') extra = 'saturate(150%) contrast(110%) hue-rotate(-10deg)';
    else if (effect === 'polaroid') extra = 'brightness(110%) contrast(90%) grayscale(20%)';
    else if (effect === 'cool') extra = 'hue-rotate(30deg) saturate(90%)';
    else if (effect === 'warm') extra = 'sepia(30%) saturate(110%)';
    else if (effect === 'hdr') extra = 'contrast(125%) saturate(130%) brightness(105%)';
    else if (effect === 'cinematic') extra = 'contrast(110%) saturate(110%) sepia(20%) hue-rotate(180deg)';
    else if (effect === 'drama') extra = 'contrast(140%) saturate(60%) brightness(90%)';
    else if (effect === 'noir') extra = 'grayscale(100%) contrast(150%) brightness(90%)';
    else if (effect === 'matrix') extra = 'hue-rotate(90deg) contrast(120%)';
    else if (effect === 'vivid') extra = 'saturate(180%) contrast(115%)';

    return `${base} ${extra}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        handleVoiceFeedback("Paused");
      } else {
        videoRef.current.play();
        handleVoiceFeedback("Playing");
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      handleVoiceFeedback(isMuted ? "Unmuted" : "Muted");
      setIsMuted(!isMuted);
    }
  };

  const handleClear = () => {
    handleReset();
  };

  const processingDisabled = status === 'PROCESSING' || !selectedFile;

  return (
    <>
      <Head>
        <title>Video Forge | AI Video Upscaling Studio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="description" content="Professional AI Video Upscaling Studio. Convert SD to 4K, denoise, and enhance video quality in your browser." />
      </Head>

      <div className="fixed inset-0 bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white flex flex-col font-sans transition-colors duration-300">
        <Header />

        <div className="flex-1 flex flex-col pt-20 md:pt-24 h-full w-full overflow-hidden">
          {/* Top Studio Bar */}
          <div className="h-14 bg-white dark:bg-dark-900 border-b border-slate-200 dark:border-white/5 flex items-center px-4 justify-between shrink-0 z-40 shadow-sm">
            <div className="flex items-center gap-3">
              <Link href="/studio" className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white transition-colors" onClick={() => handleVoiceFeedback("Returning to studio hub")}>
                <ArrowLeft size={18} />
              </Link>
              <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden sm:block"></div>
              <h1 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <VideoIcon className="text-blue-600 dark:text-blue-500" size={18} />
                <span className="hidden xs:inline">Video Forge</span>
                <span className="hidden sm:inline-block text-[10px] bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-500/20">PRO Video </span>
              </h1>
              <button
                onClick={readPageGuide}
                className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition-all ml-2"
                title="Play Guide"
              >
                <Volume2 size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {status === 'PROCESSING' && (
                <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-blue-600 dark:text-blue-400">
                  <span className="flex items-center gap-1.5"><Activity size={14} className="animate-pulse" /> {processingDetails?.phase || 'PROCESSING'}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {processingDetails?.timeElapsed || '0s'}</span>
                </div>
              )}
              <button
                onClick={handleProcess}
                disabled={processingDisabled}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {status === 'PROCESSING' ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                <span>PROCESS</span>
              </button>
            </div>
          </div>

          {/* Workspace */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

            {/* Sidebar */}
            <div className="order-2 md:order-1 w-full md:w-[320px] lg:w-[360px] bg-white dark:bg-dark-900 border-t md:border-t-0 md:border-r border-slate-200 dark:border-white/5 flex flex-col z-20 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 transition-colors flex-1 md:flex-none">

              <div className="p-5 border-b border-slate-200 dark:border-white/5">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2"><UploadCloud size={12} /> Input Source</h3>
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                  <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{selectedFile ? selectedFile.name : "Tap to Browse"}</p>
                </div>
              </div>

              {/* AI Tools */}
              <div className="p-5 border-b border-slate-200 dark:border-white/5">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2"><Cpu size={12} /> AI Tools</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between group cursor-pointer">
                    <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Video Upscale</span>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${enhance ? 'bg-blue-600' : 'bg-slate-300 dark:bg-dark-950 border border-slate-400 dark:border-white/10'}`}>
                      <input type="checkbox" className="opacity-0 w-full h-full cursor-pointer absolute z-10" checked={enhance} onChange={(e) => { setEnhance(e.target.checked); handleVoiceFeedback(e.target.checked ? "Upscale enabled" : "Upscale disabled"); }} />
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${enhance ? 'left-6' : 'left-1'}`}></div>
                    </div>
                  </label>
                  <label className="flex items-center justify-between group cursor-pointer">
                    <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Temporal Denoise</span>
                    <div className={`w-10 h-5 rounded-full relative transition-colors ${denoise ? 'bg-blue-600' : 'bg-slate-300 dark:bg-dark-950 border border-slate-400 dark:border-white/10'}`}>
                      <input type="checkbox" className="opacity-0 w-full h-full cursor-pointer absolute z-10" checked={denoise} onChange={(e) => { setDenoise(e.target.checked); handleVoiceFeedback(e.target.checked ? "Denoise enabled" : "Denoise disabled"); }} />
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${denoise ? 'left-6' : 'left-1'}`}></div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Adjustments */}
              <div className="p-5 border-b border-slate-200 dark:border-white/5">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2"><Sliders size={12} /> Color Grading</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1"><span className="text-slate-500 dark:text-slate-400">Brightness</span> <span className="text-slate-700 dark:text-slate-500">{brightness.toFixed(1)}</span></div>
                    <input type="range" min={-0.5} max={0.5} step={0.1} value={brightness} onChange={(e) => setBrightness(parseFloat(e.target.value))} onMouseUp={() => handleVoiceFeedback(`Brightness set to ${brightness.toFixed(1)}`)} className="w-full h-1.5 bg-slate-200 dark:bg-dark-950 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1"><span className="text-slate-500 dark:text-slate-400">Contrast</span> <span className="text-slate-700 dark:text-slate-500">{contrast.toFixed(1)}</span></div>
                    <input type="range" min={0.5} max={1.5} step={0.1} value={contrast} onChange={(e) => setContrast(parseFloat(e.target.value))} onMouseUp={() => handleVoiceFeedback(`Contrast set to ${contrast.toFixed(1)}`)} className="w-full h-1.5 bg-slate-200 dark:bg-dark-950 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1"><span className="text-slate-500 dark:text-slate-400">Saturation</span> <span className="text-slate-700 dark:text-slate-500">{saturation.toFixed(1)}</span></div>
                    <input type="range" min={0} max={2} step={0.1} value={saturation} onChange={(e) => setSaturation(parseFloat(e.target.value))} onMouseUp={() => handleVoiceFeedback(`Saturation set to ${saturation.toFixed(1)}`)} className="w-full h-1.5 bg-slate-200 dark:bg-dark-950 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="p-5 border-b border-slate-200 dark:border-white/5">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2"><Palette size={12} /> Creative Filters</h3>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'none', label: 'Normal' }, { id: 'hdr', label: 'HDR' }, { id: 'cinematic', label: 'Cinema' },
                    { id: 'vivid', label: 'Vivid' }, { id: 'drama', label: 'Drama' }, { id: 'noir', label: 'Noir' },
                    { id: 'matrix', label: 'Matrix' }, { id: 'grayscale', label: 'B&W' }, { id: 'sepia', label: 'Sepia' },
                    { id: 'vintage', label: 'Vintage' }, { id: 'kodachrome', label: 'Koda' }, { id: 'technicolor', label: 'Techni' },
                    { id: 'polaroid', label: 'Polar' }, { id: 'cool', label: 'Cool' }, { id: 'warm', label: 'Warm' }
                  ].map((f) => (
                    <button key={f.id} onClick={() => { setEffect(f.id as FilterPreset); handleVoiceFeedback(f.id === 'none' ? "Filter removed" : `${f.label} filter applied`); }} className={`py-2 px-1 text-[10px] font-bold uppercase rounded border truncate transition-all ${effect === f.id ? 'bg-blue-600 border-blue-500 text-white shadow-md' : 'bg-slate-50 dark:bg-dark-950 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'}`}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Export */}
              <div className="p-5 pb-24 md:pb-20">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2"><Settings size={12} /> Export Settings</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-[10px] text-slate-400 mb-1.5 font-bold flex items-center gap-1"><Layout size={10} /> RATIO</div>
                    <div className="grid grid-cols-3 gap-2">
                      {['original', '1:1', '16:9', '9:16', '4:5', '3:4'].map(r => (
                        <button key={r} onClick={() => { setAspectRatio(r as TargetAspectRatio); handleVoiceFeedback(`Aspect ratio ${r}`); }} className={`py-1.5 text-[10px] font-bold uppercase rounded border transition-all ${aspectRatio === r ? 'bg-blue-600 border-blue-500 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-blue-400'}`}>{r === 'original' ? 'Fit' : r}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 mb-1.5 font-bold flex items-center gap-1"><Monitor size={10} /> RESOLUTION</div>
                    <div className="grid grid-cols-3 gap-2">
                      {['original', '720p', '1080p', '4k', '8k'].map(r => (
                        <button key={r} onClick={() => { setTargetResolution(r as TargetResolution); handleVoiceFeedback(`Resolution ${r}`); }} className={`py-1.5 text-[10px] font-bold uppercase rounded border transition-all ${targetResolution === r ? 'bg-blue-600 border-blue-500 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-blue-400'}`}>{r}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 mb-1.5 font-bold">FORMAT</div>
                    <div className="flex gap-2">
                      {['original', 'mp4', 'webm'].map(f => (
                        <button key={f} onClick={() => { setFormat(f as OutputFormat); handleVoiceFeedback(`Format ${f}`); }} className={`flex-1 py-1.5 text-xs font-bold uppercase rounded border transition-all ${format === f ? 'bg-blue-600 border-blue-500 text-white' : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-blue-400'}`}>{f}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Canvas */}
            <div className="order-1 md:order-2 flex-1 relative flex flex-col bg-black lg:bg-slate-200 lg:dark:bg-[#0b0f19] border-b md:border-b-0 border-slate-300 dark:border-white/5 z-10 h-[40vh] md:h-full shrink-0">

              {status === 'ERROR' && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 text-xs font-bold w-[90%] justify-center border border-red-400">
                  <AlertTriangle size={16} /> <span className="truncate">{error}</span>
                  <button onClick={handleReset} className="bg-white/20 px-2 py-0.5 rounded ml-2 hover:bg-white/30 uppercase text-[10px]">Reset</button>
                </div>
              )}

              <div className="w-full h-full lg:p-6 flex flex-col">
                <div className="w-full h-full bg-black lg:bg-[#f0f0f0] lg:dark:bg-dark-950/50 lg:rounded-2xl lg:border lg:border-slate-300 lg:dark:border-white/5 relative overflow-hidden flex flex-col lg:shadow-2xl justify-center items-center">

                  {/* Mobile Canvas Header */}
                  <div className="h-8 lg:h-10 bg-slate-100 dark:bg-dark-900 border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-3 lg:px-4 transition-colors shrink-0 w-full lg:hidden">
                    <span className="text-[10px] lg:text-xs font-bold text-slate-500 flex items-center gap-2"><VideoIcon size={12} /> CANVAS</span>
                    <div className="flex items-center gap-3">
                      {(selectedFile || previewUrl) && !resultUrl && (
                        <button onClick={handleClear} className="text-slate-400 hover:text-red-500" title="Clear"><X size={14} /></button>
                      )}
                    </div>
                  </div>

                  {/* Canvas Content */}
                  <div
                    className="flex-1 w-full relative flex items-center justify-center overflow-hidden"
                    style={{
                      backgroundColor: '#000',
                      backgroundImage: 'linear-gradient(45deg, #111 25%, transparent 25%), linear-gradient(-45deg, #111 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #111 75%), linear-gradient(-45deg, transparent 75%, #111 75%)',
                      backgroundSize: '20px 20px'
                    }}
                  >
                    {!previewUrl && !resultUrl && status !== 'PROCESSING' && (
                      <div
                        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                        className={`flex flex-col items-center justify-center text-center p-6 ${dragActive ? 'scale-110' : ''}`}
                      >
                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-3 text-blue-500 border border-blue-500/20">
                          <VideoIcon size={24} className="lg:w-8 lg:h-8" />
                        </div>
                        <h3 className="text-sm lg:text-xl font-bold text-white">Upload Video</h3>
                      </div>
                    )}

                    {status === 'PROCESSING' && (
                      <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
                        <Loader2 size={32} className="text-blue-500 animate-spin mb-4" />
                        <h2 className="text-sm lg:text-xl font-bold text-white mb-2">{processingDetails?.phase || 'Processing'}</h2>
                        <div className="w-48 lg:w-64 h-2 bg-slate-800 rounded-full mt-2 overflow-hidden mb-6">
                          <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                        <button
                          onClick={handleReset}
                          className="px-6 py-2.5 bg-red-600/20 text-red-500 border border-red-500/50 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 shadow-lg shadow-red-900/20"
                        >
                          <X size={14} /> Cancel Processing
                        </button>
                      </div>
                    )}

                    {previewUrl && !resultUrl && status !== 'PROCESSING' && (
                      <div className="relative w-full h-full flex items-center justify-center bg-black group">
                        <button
                          onClick={handleClear}
                          className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white/70 hover:bg-red-600 hover:text-white rounded-full transition-all backdrop-blur-md hidden lg:flex"
                          title="Delete/Clear Video"
                        >
                          <Trash2 size={16} />
                        </button>
                        <video
                          ref={videoRef}
                          src={previewUrl}
                          className="max-w-full max-h-full object-contain"
                          style={{ filter: getFilterStyle() }}
                          autoPlay={isPlaying}
                          loop
                          muted={isMuted}
                          playsInline
                        />
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 lg:gap-6 bg-black/60 backdrop-blur px-4 py-2 lg:px-6 lg:py-3 rounded-full border border-white/10 z-40 shadow-xl">
                          <button onClick={togglePlay} className="text-white hover:text-blue-400">
                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                          </button>
                          <button onClick={toggleMute} className="text-white hover:text-blue-400">
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                          </button>
                          <div className="w-px h-6 bg-white/20 self-center"></div>
                          <button
                            onMouseDown={() => { setShowOriginal(true); handleVoiceFeedback("Showing original"); }}
                            onMouseUp={() => { setShowOriginal(false); handleVoiceFeedback("Showing preview"); }}
                            onTouchStart={() => { setShowOriginal(true); handleVoiceFeedback("Showing original"); }}
                            onTouchEnd={() => { setShowOriginal(false); handleVoiceFeedback("Showing preview"); }}
                            className="text-[10px] lg:text-xs font-bold text-white flex items-center gap-2 select-none uppercase tracking-wider"
                          >
                            {showOriginal ? <EyeOff size={16} className="text-blue-400" /> : <Eye size={16} />}
                            <span className="hidden sm:inline">{showOriginal ? 'ORIGINAL' : 'COMPARE'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {resultUrl && (
                      <div className="relative w-full h-full flex items-center justify-center bg-black">
                        <video src={resultUrl} controls playsInline className="max-w-full max-h-full object-contain" />
                        <div className="absolute bottom-4 lg:bottom-8 flex items-center gap-2 bg-white dark:bg-dark-800 p-2 rounded-xl shadow-2xl border border-slate-200 dark:border-white/10 animate-slide-up z-40">
                          <button onClick={handleReset} className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-3 bg-slate-100 dark:bg-dark-700 text-slate-700 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-dark-600 transition-colors">
                            <RefreshCcw size={16} /> <span className="hidden sm:inline">New Project</span>
                          </button>
                          <div className="w-px h-6 bg-slate-300 dark:bg-white/10"></div>
                          <a href={resultUrl} download={`processed.${format === 'original' ? 'mp4' : format}`} className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-green-600 text-white rounded-lg font-bold text-xs hover:bg-green-500 transition-colors shadow-lg shadow-green-600/30" onClick={() => handleVoiceFeedback("Downloading result")}>
                            <Download size={14} /> Save
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}