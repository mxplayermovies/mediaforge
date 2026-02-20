// import React, { useState, useRef, useEffect } from 'react';
// import Head from 'next/head';
// import Link from 'next/link';
// import Header from '../../components/Header';
// import { useMediaProcessor } from '../../hooks/useMediaProcessor';
// import { voiceManager } from '../../lib/core/VoiceManager';
// import { 
//   ArrowLeft, Image as ImageIcon, Download, Sliders, Wand2, UploadCloud, 
//   Loader2, Cpu, Palette, Settings, RefreshCcw,
//   Monitor, Eye, EyeOff, Globe, X, Layout, AlertTriangle, Volume2
// } from 'lucide-react';

// type TargetResolution = 'original' | '720p' | '1080p' | '4k' | '8k';
// type TargetAspectRatio = 'original' | '1:1' | '16:9' | '9:16' | '4:5' | '3:4';
// type FilterPreset = 'none' | 'vintage' | 'kodachrome' | 'technicolor' | 'polaroid' | 'cool' | 'warm' | 'grayscale' | 'sepia' | 'hdr' | 'cinematic' | 'drama' | 'noir' | 'matrix' | 'vivid';
// type OutputFormat = 'original' | 'png' | 'jpg' | 'webp';

// export default function ImageStudio() {
//   const [inputType, setInputType] = useState<'file' | 'url'>('file');
//   const [urlInput, setUrlInput] = useState('');
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [loadingPreview, setLoadingPreview] = useState(false);

//   const [enhance, setEnhance] = useState(false);
//   const [denoise, setDenoise] = useState(false);
//   const [brightness, setBrightness] = useState(0); 
//   const [contrast, setContrast] = useState(1);     
//   const [saturation, setSaturation] = useState(1); 
//   const [effect, setEffect] = useState<FilterPreset>('none');
  
//   const [showOriginal, setShowOriginal] = useState(false);
//   const [format, setFormat] = useState<OutputFormat>('original');
//   const [targetResolution, setTargetResolution] = useState<TargetResolution>('original');
//   const [aspectRatio, setAspectRatio] = useState<TargetAspectRatio>('original');

//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const { processFile, status, progress, error, resultUrl, reset: resetProcessor } = useMediaProcessor();
//   const [dragActive, setDragActive] = useState(false);

//   useEffect(() => {
//     voiceManager.speak("Pro Image Studio Loaded. To hear a detailed guide on how to use this tool, click the speaker icon in the top header.");
//   }, []);

//   const readPageGuide = () => {
//     const text = `
//       Guide to Pro Image Studio.
      
//       Step 1: Select Input. On the left sidebar (or bottom panel on mobile), choose 'Upload File' to select an image from your device, or 'URL' to paste a link from the web.
      
//       Step 2: AI Enhancements. Under AI Tools, check 'Smart Enhance' to upscale your image resolution using deep learning, or 'Denoise' to remove grain and smooth out details.
      
//       Step 3: Fine Tuning. Use the sliders to adjust Brightness, Contrast, and Saturation. You can also apply creative filters like Cinematic, HDR, or Vintage from the grid below.
      
//       Step 4: Export Settings. Configure your output. Select 'Target Resolution' to scale up to 4K or 8K. Choose an 'Aspect Ratio' to crop or fit, and select your preferred file format like PNG or WebP.
      
//       Step 5: Process. Click the 'Process' button in the top right corner. The engine will process your image locally or via our cloud cluster.
      
//       Step 6: Preview and Save. Once finished, hold the 'Compare' button on the image to see the before and after. Finally, click 'Save' to download.
//     `;
//     voiceManager.speak(text, true);
//   };

//   const handleVoiceFeedback = (text: string) => {
//     if (typeof window !== 'undefined' && voiceManager) {
//         voiceManager.speak(text, true);
//     }
//   };

//   const resetSettings = () => {
//       setEnhance(false);
//       setDenoise(false);
//       setBrightness(0);
//       setContrast(1);
//       setSaturation(1);
//       setEffect('none');
//       setFormat('original');
//       setTargetResolution('original');
//       setAspectRatio('original');
//       setShowOriginal(false);
//   };

//   const handleReset = () => {
//       resetSettings();
//       resetProcessor();
//       setPreviewUrl(null);
//       setSelectedFile(null);
//       setUrlInput('');
//       setInputType('file');
//       handleVoiceFeedback("Project reset.");
//   };

//   const handleFile = (file: File) => {
//     // Lenient Type Check
//     const validExtensions = /\.(jpg|jpeg|png|webp|avif|gif|tiff|bmp|svg)$/i;
//     if (!file.type.startsWith('image/') && !file.name.match(validExtensions)) {
//       handleVoiceFeedback("Invalid file format. Please upload a valid image.");
//       alert("Invalid file format. Please upload an image.");
//       return;
//     }
    
//     resetSettings();
//     resetProcessor();

//     setSelectedFile(file);
//     setPreviewUrl(URL.createObjectURL(file));
//     handleVoiceFeedback("Image loaded successfully.");
//   };

//   const fetchBlobFromUrl = async (url: string): Promise<Blob> => {
//       try {
//         const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
//         const res = await fetch(proxyUrl);
        
//         if (res.status === 404) {
//             throw new Error("The image is not found.");
//         }
        
//         if (!res.ok) {
//             throw new Error(`Failed to load image (Status ${res.status}).`);
//         }
        
//         return await res.blob();
//       } catch (e: any) { 
//         console.error("Fetch failed", e);
//         throw e;
//       }
//   };

//   const handleUrlSubmit = async () => {
//     if (!urlInput) return;
    
//     handleVoiceFeedback("Fetching image from URL.");
//     setLoadingPreview(true);

//     try {
//         const blob = await fetchBlobFromUrl(urlInput);
        
//         let mimeType = blob.type;
//         if (!mimeType || mimeType === 'application/octet-stream' || mimeType === 'text/plain') {
//              const lowerUrl = urlInput.toLowerCase();
//              if (lowerUrl.includes('.png')) mimeType = 'image/png';
//              else if (lowerUrl.includes('.webp')) mimeType = 'image/webp';
//              else if (lowerUrl.includes('.gif')) mimeType = 'image/gif';
//              else mimeType = 'image/jpeg';
//         }

//         const ext = mimeType.split('/')[1] || 'jpg';
//         const fileName = `web-image.${ext}`;
//         const file = new File([blob], fileName, { type: mimeType });
        
//         resetSettings();
//         resetProcessor();
//         setInputType('file');
        
//         setSelectedFile(file);
//         setPreviewUrl(URL.createObjectURL(file));
//         handleVoiceFeedback("Image downloaded and loaded successfully.");
        
//     } catch (err: any) {
//         console.error("Fetch failed:", err);
//         const msg = err.message || "Could not load image.";
//         alert(msg);
//         handleVoiceFeedback("Failed to load image. It may not exist.");
//     } finally {
//         setLoadingPreview(false);
//     }
//   };

//   const handleProcess = async () => {
//     if (!selectedFile) {
//         handleVoiceFeedback("No image selected.");
//         return;
//     }
    
//     handleVoiceFeedback("Starting processing.");

//     processFile(selectedFile, {
//         type: 'image',
//         enhance,
//         denoise,
//         filters: {
//             brightness,
//             contrast,
//             saturation,
//             preset: effect !== 'none' && effect !== 'grayscale' && effect !== 'sepia' ? effect : undefined,
//             grayscale: effect === 'grayscale',
//             sepia: effect === 'sepia'
//         },
//         resize: { targetResolution },
//         aspectRatio: aspectRatio,
//         format: format === 'original' ? undefined : format
//     });
//   };

//   const handleClearImage = () => {
//       handleReset();
//       handleVoiceFeedback("Image cleared.");
//   };

//   const onDrag = (e: React.DragEvent) => {
//     e.preventDefault(); e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
//     else if (e.type === "dragleave") setDragActive(false);
//   };

//   const onDrop = (e: React.DragEvent) => {
//     e.preventDefault(); e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//         setInputType('file');
//         handleFile(e.dataTransfer.files[0]);
//     }
//   };

//   const getCssFilter = () => {
//     if (showOriginal) return 'none';
//     let base = `brightness(${1 + brightness}) contrast(${contrast}) saturate(${saturation})`;
//     switch(effect) {
//         case 'grayscale': return `${base} grayscale(100%)`;
//         case 'sepia': return `${base} sepia(100%)`;
//         case 'vintage': return `${base} sepia(50%) contrast(85%) brightness(90%)`;
//         case 'kodachrome': return `${base} contrast(120%) saturate(130%)`;
//         case 'technicolor': return `${base} saturate(150%) contrast(110%) hue-rotate(-10deg)`;
//         case 'polaroid': return `${base} brightness(110%) contrast(90%) grayscale(20%)`;
//         case 'cool': return `${base} hue-rotate(30deg) saturate(90%)`;
//         case 'warm': return `${base} sepia(30%) saturate(110%)`;
//         case 'hdr': return `${base} contrast(125%) saturate(130%) brightness(105%)`;
//         case 'cinematic': return `${base} contrast(110%) saturate(110%) sepia(20%) hue-rotate(180deg)`;
//         case 'drama': return `${base} contrast(140%) saturate(60%) brightness(90%)`;
//         case 'noir': return `${base} grayscale(100%) contrast(150%) brightness(90%)`;
//         case 'matrix': return `${base} hue-rotate(90deg) contrast(120%)`;
//         case 'vivid': return `${base} saturate(180%) contrast(115%)`;
//         default: return base;
//     }
//   };

//   return (
//     <>
//       <Head>
//         <title>Pro Image Studio | Media Processor</title>
//         <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
//       </Head>

//       <div className="fixed inset-0 bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white flex flex-col font-sans transition-colors duration-300">
//         <Header />
        
//         <div className="flex-1 flex flex-col pt-20 md:pt-24 h-full w-full overflow-hidden">
//             <div className="h-14 bg-white dark:bg-dark-900 border-b border-slate-200 dark:border-white/5 flex items-center px-4 justify-between z-40 shadow-sm shrink-0">
//               <div className="flex items-center gap-4">
//                 <Link href="/studio" className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white transition-colors" onClick={() => handleVoiceFeedback("Returning to studio hub")}>
//                   <ArrowLeft size={18} />
//                 </Link>
//                 <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden sm:block"></div>
//                 <h1 className="font-bold text-sm md:text-base flex items-center gap-2">
//                   <ImageIcon className="text-purple-600 dark:text-purple-500" size={18} />
//                   <span className="hidden xs:inline">Pro Image Studio</span> 
//                   <span className="text-[10px] bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-500/20 whitespace-nowrap">WASM CORE</span>
//                 </h1>
//                 <button 
//                   onClick={readPageGuide}
//                   className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full hover:bg-purple-500 hover:text-white transition-all ml-2"
//                   title="Play Guide"
//                 >
//                   <Volume2 size={18} />
//                 </button>
//               </div>
              
//               <div className="flex items-center gap-4">
//                  {status === 'PROCESSING' && (
//                     <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-purple-600 dark:text-purple-400 animate-pulse">
//                        <Cpu size={14} /> PROCESSING... {progress}%
//                     </div>
//                  )}
//                  <button 
//                     onClick={handleProcess}
//                     disabled={status === 'PROCESSING' || (!selectedFile && !urlInput)}
//                     className="px-4 md:px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-full shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
//                  >
//                     {status === 'PROCESSING' ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
//                     PROCESS
//                  </button>
//               </div>
//             </div>

//             {/* Mobile: Column layout (Preview top, Controls bottom). Desktop: Row layout. */}
//             <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
              
//               {/* Sidebar / Controls */}
//               {/* Order 2 on Mobile (Bottom), Order 1 on Desktop (Left) */}
//               <div className="order-2 md:order-1 w-full md:w-[320px] lg:w-[360px] bg-white dark:bg-dark-900 border-t md:border-t-0 md:border-r border-slate-200 dark:border-white/5 flex flex-col z-20 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 transition-colors flex-1 md:flex-none">
                
//                 <div className="p-5 border-b border-slate-200 dark:border-white/5">
//                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><UploadCloud size={12}/> Input Source</h3>
//                   <div className="flex bg-slate-100 dark:bg-dark-950 p-1 rounded-lg mb-4 border border-slate-200 dark:border-white/5">
//                      <button onClick={() => { setInputType('file'); handleVoiceFeedback("File upload mode"); }} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${inputType === 'file' ? 'bg-white dark:bg-purple-600 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-0' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Upload File</button>
//                      <button onClick={() => { setInputType('url'); handleVoiceFeedback("URL input mode"); }} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${inputType === 'url' ? 'bg-white dark:bg-purple-600 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-0' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>URL</button>
//                   </div>

//                   {inputType === 'file' ? (
//                     <div 
//                       onClick={() => fileInputRef.current?.click()}
//                       className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 hover:border-purple-500/50 transition-all group bg-slate-50/50 dark:bg-transparent"
//                     >
//                       <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
//                       <p className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate font-medium">{selectedFile ? selectedFile.name : "Click to Browse"}</p>
//                     </div>
//                   ) : (
//                     <div className="flex flex-col gap-2">
//                        <div className="relative">
//                           <input 
//                             type="text" 
//                             value={urlInput}
//                             onChange={(e) => setUrlInput(e.target.value)}
//                             placeholder="https://site.com/image.jpg"
//                             className="w-full bg-white dark:bg-dark-950 border border-slate-300 dark:border-white/10 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-sm"
//                           />
//                           <Globe size={14} className="absolute right-3 top-2.5 text-slate-400"/>
//                        </div>
//                        <button 
//                          onClick={handleUrlSubmit} 
//                          disabled={loadingPreview || !urlInput}
//                          className="w-full py-2 bg-slate-800 dark:bg-dark-800 text-white dark:text-slate-200 text-xs font-bold rounded-lg hover:bg-slate-700 dark:hover:bg-dark-700 transition-colors shadow-sm flex items-center justify-center gap-2 border border-slate-700 dark:border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
//                        >
//                          {loadingPreview ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14}/>}
//                          {loadingPreview ? 'Fetching...' : 'Load Image'}
//                        </button>
//                     </div>
//                   )}
//                 </div>

//                 {/* AI & Adjustments */}
//                 <div className="p-5 border-b border-slate-200 dark:border-white/5">
//                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Cpu size={12}/> AI Tools</h3>
//                    <div className="space-y-3">
//                       <label className="flex items-center justify-between group cursor-pointer">
//                          <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Smart Enhance</span>
//                          <div className={`w-10 h-5 rounded-full relative transition-colors ${enhance ? 'bg-purple-600' : 'bg-slate-300 dark:bg-dark-950 border border-slate-400 dark:border-white/10'}`}>
//                             <input type="checkbox" className="opacity-0 w-full h-full cursor-pointer absolute z-10" checked={enhance} onChange={(e) => { setEnhance(e.target.checked); handleVoiceFeedback(e.target.checked ? "Smart Enhance Enabled" : "Smart Enhance Disabled"); }} />
//                             <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${enhance ? 'left-6' : 'left-1'}`}></div>
//                          </div>
//                       </label>
//                       <label className="flex items-center justify-between group cursor-pointer">
//                          <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Denoise & Smooth</span>
//                          <div className={`w-10 h-5 rounded-full relative transition-colors ${denoise ? 'bg-purple-600' : 'bg-slate-300 dark:bg-dark-950 border border-slate-400 dark:border-white/10'}`}>
//                             <input type="checkbox" className="opacity-0 w-full h-full cursor-pointer absolute z-10" checked={denoise} onChange={(e) => { setDenoise(e.target.checked); handleVoiceFeedback(e.target.checked ? "Denoise Enabled" : "Denoise Disabled"); }} />
//                             <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${denoise ? 'left-6' : 'left-1'}`}></div>
//                          </div>
//                       </label>
//                    </div>
//                 </div>

//                 <div className="p-5 border-b border-slate-200 dark:border-white/5">
//                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Sliders size={12}/> Adjustments</h3>
//                    <div className="space-y-4">
//                       <div>
//                         <div className="flex justify-between text-xs mb-1"><span className="text-slate-500 dark:text-slate-400">Brightness</span> <span className="text-slate-700 dark:text-slate-500">{brightness.toFixed(1)}</span></div>
//                         <input type="range" min="-1" max="1" step="0.1" value={brightness} onChange={(e) => setBrightness(parseFloat(e.target.value))} onMouseUp={() => handleVoiceFeedback(`Brightness set to ${brightness.toFixed(1)}`)} className="w-full h-1 bg-slate-200 dark:bg-dark-950 rounded-lg appearance-none cursor-pointer accent-purple-500" />
//                       </div>
//                       <div>
//                         <div className="flex justify-between text-xs mb-1"><span className="text-slate-500 dark:text-slate-400">Contrast</span> <span className="text-slate-700 dark:text-slate-500">{contrast.toFixed(1)}</span></div>
//                         <input type="range" min="0" max="2" step="0.1" value={contrast} onChange={(e) => setContrast(parseFloat(e.target.value))} onMouseUp={() => handleVoiceFeedback(`Contrast set to ${contrast.toFixed(1)}`)} className="w-full h-1 bg-slate-200 dark:bg-dark-950 rounded-lg appearance-none cursor-pointer accent-purple-500" />
//                       </div>
//                       <div>
//                         <div className="flex justify-between text-xs mb-1"><span className="text-slate-500 dark:text-slate-400">Saturation</span> <span className="text-slate-700 dark:text-slate-500">{saturation.toFixed(1)}</span></div>
//                         <input type="range" min="0" max="3" step="0.1" value={saturation} onChange={(e) => setSaturation(parseFloat(e.target.value))} onMouseUp={() => handleVoiceFeedback(`Saturation set to ${saturation.toFixed(1)}`)} className="w-full h-1 bg-slate-200 dark:bg-dark-950 rounded-lg appearance-none cursor-pointer accent-purple-500" />
//                       </div>
//                    </div>
//                 </div>

//                 {/* Filters */}
//                 <div className="p-5 border-b border-slate-200 dark:border-white/5">
//                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Palette size={12}/> Creative Filters</h3>
//                    <div className="grid grid-cols-3 gap-2">
//                       {[
//                         { id: 'none', label: 'Normal' }, { id: 'hdr', label: 'HDR' }, { id: 'cinematic', label: 'Cinema' },
//                         { id: 'vivid', label: 'Vivid' }, { id: 'drama', label: 'Drama' }, { id: 'noir', label: 'Noir' },
//                         { id: 'matrix', label: 'Matrix' }, { id: 'grayscale', label: 'B&W' }, { id: 'sepia', label: 'Sepia' },
//                         { id: 'vintage', label: 'Vintage' }, { id: 'kodachrome', label: 'Koda' }, { id: 'technicolor', label: 'Techni' },
//                         { id: 'polaroid', label: 'Polar' }, { id: 'cool', label: 'Cool' }, { id: 'warm', label: 'Warm' }
//                       ].map((f) => (
//                         <button key={f.id} onClick={() => { setEffect(f.id as FilterPreset); handleVoiceFeedback(f.id === 'none' ? "Filter removed" : `${f.label} filter applied`); }} className={`py-2 px-1 text-[10px] font-bold uppercase rounded border transition-all truncate ${effect === f.id ? 'bg-purple-600 border-purple-500 text-white shadow-md' : 'bg-slate-100 dark:bg-dark-950 border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'}`}>{f.label}</button>
//                       ))}
//                    </div>
//                 </div>

//                 {/* Export */}
//                 <div className="p-5 pb-24 md:pb-20">
//                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Settings size={12}/> Export Settings</h3>
//                    <div className="space-y-5">
//                       <div>
//                         <div className="text-[10px] text-slate-400 mb-1.5 font-bold flex items-center gap-1"><Layout size={10}/> RATIO</div>
//                         <div className="grid grid-cols-3 gap-2">
//                            {['original', '1:1', '16:9', '9:16', '4:5', '3:4'].map((ratio) => (
//                                <button key={ratio} onClick={() => { setAspectRatio(ratio as TargetAspectRatio); handleVoiceFeedback(`Aspect ratio set to ${ratio === 'original' ? 'Original' : ratio}`); }} className={`py-1.5 text-[10px] font-bold uppercase rounded border transition-all ${aspectRatio === ratio ? 'bg-purple-600 border-purple-500 text-white shadow-md' : 'bg-slate-100 dark:bg-dark-950 border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:border-purple-400'}`}>{ratio === 'original' ? 'Fit' : ratio}</button>
//                            ))}
//                         </div>
//                       </div>
//                       <div>
//                          <div className="text-[10px] text-slate-400 mb-1.5 font-bold flex items-center gap-1"><Monitor size={10}/> OUTPUT QUALITY</div>
//                          <div className="grid grid-cols-3 gap-2">
//                            {['original', '720p', '1080p', '4k', '8k'].map((res) => (
//                              <button key={res} onClick={() => { setTargetResolution(res as TargetResolution); handleVoiceFeedback(`Target resolution set to ${res}`); }} className={`py-1.5 text-[10px] font-bold uppercase rounded border transition-all ${targetResolution === res ? 'bg-purple-600 border-purple-500 text-white shadow-md' : 'bg-slate-100 dark:bg-dark-950 border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:border-purple-400'}`}>{res}</button>
//                            ))}
//                          </div>
//                       </div>
//                       <div>
//                         <div className="text-[10px] text-slate-400 mb-1.5 font-bold">FORMAT</div>
//                         <div className="flex gap-2">
//                             {['original', 'png', 'jpg', 'webp'].map((fmt) => (
//                             <button key={fmt} onClick={() => { setFormat(fmt as OutputFormat); handleVoiceFeedback(`Format set to ${fmt}`); }} className={`flex-1 py-1.5 text-xs font-bold uppercase rounded border ${format === fmt ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-100 dark:bg-dark-950 border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400'}`}>{fmt}</button>
//                             ))}
//                         </div>
//                       </div>
//                    </div>
//                 </div>
//               </div>

//               {/* Main Preview */}
//               {/* Order 1 on Mobile (Top), Order 2 on Desktop (Right) */}
//               <div className="order-1 md:order-2 bg-slate-200 dark:bg-[#0b0f19] relative flex flex-col items-center justify-center p-4 transition-colors border-b md:border-b-0 border-slate-300 dark:border-white/5 h-[40vh] md:h-full shrink-0 flex-1">
//                 {status === 'ERROR' && (
//                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-slide-up border border-red-400">
//                      <AlertTriangle size={20} /> <span className="text-sm font-bold">{error}</span>
//                      <button onClick={handleReset} className="ml-2 bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs font-bold uppercase">Reset</button>
//                    </div>
//                 )}

//                 <div className="w-full h-full max-w-5xl bg-[#f0f0f0] dark:bg-dark-950/50 rounded-xl md:rounded-2xl border border-slate-300 dark:border-white/5 relative overflow-hidden flex flex-col shadow-2xl">
//                    <div className="h-8 md:h-10 bg-slate-100 dark:bg-dark-900 border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-3 md:px-4 transition-colors shrink-0">
//                       <span className="text-[10px] md:text-xs font-bold text-slate-500 flex items-center gap-2"><ImageIcon size={12}/> CANVAS PREVIEW</span>
//                       <div className="flex items-center gap-3">
//                          {selectedFile ? <span className="text-[10px] md:text-xs text-slate-500 truncate max-w-[100px] md:max-w-none">{selectedFile.name}</span> : urlInput && <span className="text-[10px] md:text-xs text-slate-500 max-w-[100px] truncate">{urlInput}</span>}
//                          {(selectedFile || previewUrl) && !resultUrl && (
//                              <button onClick={handleClearImage} className="text-slate-400 hover:text-red-500 transition-colors" title="Clear Image"><X size={16} /></button>
//                          )}
//                       </div>
//                    </div>

//                    <div className="flex-1 relative flex items-center justify-center overflow-hidden"
//                      style={{
//                         backgroundColor: '#e5e5f7',
//                         backgroundImage: 'linear-gradient(45deg, #dcdcdc 25%, transparent 25%), linear-gradient(-45deg, #dcdcdc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #dcdcdc 75%), linear-gradient(-45deg, transparent 75%, #dcdcdc 75%)',
//                         backgroundSize: '20px 20px',
//                         backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
//                      }}>
//                       {!previewUrl && !resultUrl && !status.includes('PROCESSING') && (
//                          <div onDragEnter={onDrag} onDragLeave={onDrag} onDragOver={onDrag} onDrop={onDrop} className={`text-center p-6 md:p-10 rounded-3xl border-2 border-dashed transition-all bg-white/50 backdrop-blur-sm ${dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-slate-400 dark:border-white/20 hover:border-slate-500'}`}>
//                             <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-200 dark:bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600 dark:text-purple-500"><UploadCloud size={24} className="md:w-8 md:h-8"/></div>
//                             <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-2">Drag & Drop Image</h3>
//                             <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm font-medium">or use controls</p>
//                          </div>
//                       )}

//                       {(status === 'LOADING_ENGINE' || status === 'PROCESSING') && (
//                          <div className="absolute inset-0 z-50 bg-white/90 dark:bg-dark-900/80 backdrop-blur-md flex flex-col items-center justify-center transition-colors">
//                             <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center mb-4 md:mb-6 relative">
//                                <Loader2 size={32} className="text-purple-600 dark:text-purple-500 animate-spin absolute md:w-12 md:h-12" />
//                                <div className="text-xs md:text-sm font-bold text-purple-900 dark:text-white">{progress}%</div>
//                             </div>
//                             <h2 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mb-2">Processing</h2>
//                             <div className="w-48 md:w-64 h-1.5 bg-slate-200 dark:bg-dark-800 rounded-full mt-4 overflow-hidden">
//                                 <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300" style={{width: `${progress}%`}}></div>
//                             </div>
//                          </div>
//                       )}

//                       {previewUrl && !resultUrl && status !== 'PROCESSING' && (
//                          <div className="relative w-full h-full flex items-center justify-center p-2 md:p-6">
//                              {/* eslint-disable-next-line @next/next/no-img-element */}
//                              <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain shadow-2xl transition-all" style={{ filter: getCssFilter() }} />
//                              <button 
//                                 onMouseDown={() => { setShowOriginal(true); handleVoiceFeedback("Showing original."); }} 
//                                 onMouseUp={() => { setShowOriginal(false); handleVoiceFeedback("Showing preview."); }} 
//                                 onMouseLeave={() => setShowOriginal(false)} 
//                                 onTouchStart={() => { setShowOriginal(true); handleVoiceFeedback("Showing original."); }} 
//                                 onTouchEnd={() => { setShowOriginal(false); handleVoiceFeedback("Showing preview."); }} 
//                                 className="absolute bottom-4 right-4 md:bottom-6 md:right-6 px-3 py-1.5 md:px-4 md:py-2 bg-black/60 backdrop-blur text-white text-[10px] md:text-xs font-bold rounded-full border border-white/20 hover:bg-black/80 transition-all select-none z-40 flex items-center gap-2"
//                              >
//                                {showOriginal ? <EyeOff size={14}/> : <Eye size={14}/>} <span className="hidden sm:inline">{showOriginal ? 'SHOWING ORIGINAL' : 'HOLD TO COMPARE'}</span>
//                              </button>
//                          </div>
//                       )}

//                       {resultUrl && (
//                          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
//                             {/* eslint-disable-next-line @next/next/no-img-element */}
//                             <img src={resultUrl} alt="Result" className="max-w-full max-h-full object-contain shadow-2xl border-4 border-white dark:border-dark-800 rounded-lg" />
//                             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3 bg-white dark:bg-dark-800 p-2 rounded-xl shadow-2xl border border-slate-200 dark:border-white/10 animate-slide-up z-40">
//                                  <button onClick={handleReset} className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-3 bg-slate-100 dark:bg-dark-700 text-slate-700 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-dark-600 transition-colors">
//                                    <RefreshCcw size={16} /> <span className="hidden sm:inline">New</span>
//                                  </button>
//                                  <div className="w-px h-6 bg-slate-300 dark:bg-white/10"></div>
//                                  <a href={resultUrl} download={`processed_image.${format === 'original' ? 'png' : format}`} className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500 transition-colors shadow-lg shadow-green-600/30" onClick={() => handleVoiceFeedback("Saving file.")}>
//                                     <Download size={18}/> <span>Save</span>
//                                  </a>
//                             </div>
//                          </div>
//                       )}
//                    </div>
//                 </div>
//               </div>
//             </div>
//         </div>
//       </div>
//     </>
//   );
// }
import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import { useMediaProcessor } from '../../hooks/useMediaProcessor';
import { voiceManager } from '../../lib/core/VoiceManager';
import { 
  ArrowLeft, Image as ImageIcon, Download, Sliders, Wand2, UploadCloud, 
  Loader2, Cpu, Palette, Settings, RefreshCcw,
  Monitor, Eye, EyeOff, Globe, X, Layout, AlertTriangle, Volume2
} from 'lucide-react';

type TargetResolution = 'original' | '720p' | '1080p' | '4k' | '8k';
type TargetAspectRatio = 'original' | '1:1' | '16:9' | '9:16' | '4:5' | '3:4';
type FilterPreset = 'none' | 'vintage' | 'kodachrome' | 'technicolor' | 'polaroid' | 'cool' | 'warm' | 'grayscale' | 'sepia' | 'hdr' | 'cinematic' | 'drama' | 'noir' | 'matrix' | 'vivid';
type OutputFormat = 'original' | 'png' | 'jpg' | 'webp';

export default function ImageStudio() {
  const [inputType, setInputType] = useState<'file' | 'url'>('file');
  const [urlInput, setUrlInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const [enhance, setEnhance] = useState(false);
  const [denoise, setDenoise] = useState(false);
  const [brightness, setBrightness] = useState(0); 
  const [contrast, setContrast] = useState(1);     
  const [saturation, setSaturation] = useState(1); 
  const [effect, setEffect] = useState<FilterPreset>('none');
  
  const [showOriginal, setShowOriginal] = useState(false);
  const [format, setFormat] = useState<OutputFormat>('original');
  const [targetResolution, setTargetResolution] = useState<TargetResolution>('original');
  const [aspectRatio, setAspectRatio] = useState<TargetAspectRatio>('original');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { processFile, status, progress, error, resultUrl, reset: resetProcessor } = useMediaProcessor();
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    voiceManager.speak("Video Forge Studio Loaded. To hear a detailed guide on how to use this Pro Image tool, click the speaker icon in the top header.");
  }, []);

  const readPageGuide = () => {
    const text = `
      Guide to Pro Image Studio.
      
      Step 1: Select Input. On the left sidebar (or bottom panel on mobile), choose 'Upload File' to select an image from your device, or 'URL' to paste a link from the web.
      
      Step 2: AI Enhancements. Under AI Tools, check 'Smart Enhance' to upscale your image resolution using deep learning, or 'Denoise' to remove grain and smooth out details.
      
      Step 3: Fine Tuning. Use the sliders to adjust Brightness, Contrast, and Saturation. You can also apply creative filters like Cinematic, HDR, or Vintage from the grid below.
      
      Step 4: Export Settings. Configure your output. Select 'Target Resolution' to scale up to 4K or 8K. Choose an 'Aspect Ratio' to crop or fit, and select your preferred file format like PNG or WebP.
      
      Step 5: Process. Click the 'Process' button in the top right corner. The engine will process your image locally or via our cloud cluster.
      
      Step 6: Preview and Save. Once finished, hold the 'Compare' button on the image to see the before and after. Finally, click 'Save' to download.
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
      resetSettings();
      resetProcessor();
      
      // Memory Cleanup
      if (previewUrl && previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl);
      }
      
      setPreviewUrl(null);
      setSelectedFile(null);
      setUrlInput('');
      setInputType('file');
      handleVoiceFeedback("Project reset and memory cleared.");
  };

  const handleFile = (file: File) => {
    // Lenient Type Check
    const validExtensions = /\.(jpg|jpeg|png|webp|avif|gif|tiff|bmp|svg)$/i;
    if (!file.type.startsWith('image/') && !file.name.match(validExtensions)) {
      handleVoiceFeedback("Invalid file format. Please upload a valid image.");
      alert("Invalid file format. Please upload an image.");
      return;
    }
    
    resetSettings();
    resetProcessor();

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    handleVoiceFeedback("Image loaded successfully.");
  };

  const fetchBlobFromUrl = async (url: string): Promise<Blob> => {
      try {
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
        const res = await fetch(proxyUrl);
        
        if (res.status === 404) {
            throw new Error("The image is not found.");
        }
        
        if (!res.ok) {
            throw new Error(`Failed to load image (Status ${res.status}).`);
        }
        
        return await res.blob();
      } catch (e: any) { 
        console.error("Fetch failed", e);
        throw e;
      }
  };

  const handleUrlSubmit = async () => {
    if (!urlInput) return;
    
    handleVoiceFeedback("Fetching image from URL.");
    setLoadingPreview(true);

    try {
        const blob = await fetchBlobFromUrl(urlInput);
        
        let mimeType = blob.type;
        if (!mimeType || mimeType === 'application/octet-stream' || mimeType === 'text/plain') {
             const lowerUrl = urlInput.toLowerCase();
             if (lowerUrl.includes('.png')) mimeType = 'image/png';
             else if (lowerUrl.includes('.webp')) mimeType = 'image/webp';
             else if (lowerUrl.includes('.gif')) mimeType = 'image/gif';
             else mimeType = 'image/jpeg';
        }

        const ext = mimeType.split('/')[1] || 'jpg';
        const fileName = `web-image.${ext}`;
        const file = new File([blob], fileName, { type: mimeType });
        
        resetSettings();
        resetProcessor();
        setInputType('file');
        
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        handleVoiceFeedback("Image downloaded and loaded successfully.");
        
    } catch (err: any) {
        console.error("Fetch failed:", err);
        const msg = err.message || "Could not load image.";
        alert(msg);
        handleVoiceFeedback("Failed to load image. It may not exist.");
    } finally {
        setLoadingPreview(false);
    }
  };

  const handleProcess = async () => {
    if (!selectedFile) {
        handleVoiceFeedback("No image selected.");
        return;
    }
    
    handleVoiceFeedback("Starting processing.");

    processFile(selectedFile, {
        type: 'image',
        enhance,
        denoise,
        filters: {
            brightness,
            contrast,
            saturation,
            preset: effect !== 'none' && effect !== 'grayscale' && effect !== 'sepia' ? effect : undefined,
            grayscale: effect === 'grayscale',
            sepia: effect === 'sepia'
        },
        resize: { targetResolution },
        aspectRatio: aspectRatio,
        format: format === 'original' ? undefined : format
    });
  };

  const handleClearImage = () => {
      handleReset();
      handleVoiceFeedback("Image cleared.");
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        setInputType('file');
        handleFile(e.dataTransfer.files[0]);
    }
  };

  const getCssFilter = () => {
    if (showOriginal) return 'none';
    let base = `brightness(${1 + brightness}) contrast(${contrast}) saturate(${saturation})`;
    switch(effect) {
        case 'grayscale': return `${base} grayscale(100%)`;
        case 'sepia': return `${base} sepia(100%)`;
        case 'vintage': return `${base} sepia(50%) contrast(85%) brightness(90%)`;
        case 'kodachrome': return `${base} contrast(120%) saturate(130%)`;
        case 'technicolor': return `${base} saturate(150%) contrast(110%) hue-rotate(-10deg)`;
        case 'polaroid': return `${base} brightness(110%) contrast(90%) grayscale(20%)`;
        case 'cool': return `${base} hue-rotate(30deg) saturate(90%)`;
        case 'warm': return `${base} sepia(30%) saturate(110%)`;
        case 'hdr': return `${base} contrast(125%) saturate(130%) brightness(105%)`;
        case 'cinematic': return `${base} contrast(110%) saturate(110%) sepia(20%) hue-rotate(180deg)`;
        case 'drama': return `${base} contrast(140%) saturate(60%) brightness(90%)`;
        case 'noir': return `${base} grayscale(100%) contrast(150%) brightness(90%)`;
        case 'matrix': return `${base} hue-rotate(90deg) contrast(120%)`;
        case 'vivid': return `${base} saturate(180%) contrast(115%)`;
        default: return base;
    }
  };

  return (
    <>
      <Head>
        <title>Pro Image Studio | Media Processor</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </Head>

      <div className="fixed inset-0 bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white flex flex-col font-sans transition-colors duration-300">
        <Header />
        
        <div className="flex-1 flex flex-col pt-20 md:pt-24 h-full w-full overflow-hidden">
            <div className="h-14 bg-white dark:bg-dark-900 border-b border-slate-200 dark:border-white/5 flex items-center px-4 justify-between z-40 shadow-sm shrink-0">
              <div className="flex items-center gap-4">
                <Link href="/studio" className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white transition-colors" onClick={() => handleVoiceFeedback("Returning to studio hub")}>
                  <ArrowLeft size={18} />
                </Link>
                <div className="h-6 w-px bg-slate-200 dark:bg-white/10 hidden sm:block"></div>
                <h1 className="font-bold text-sm md:text-base flex items-center gap-2">
                  <ImageIcon className="text-purple-600 dark:text-purple-500" size={18} />
                  <span className="hidden xs:inline">Pro Image Studio</span> 
                  <span className="text-[10px] bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-500/20 whitespace-nowrap">PRO Image </span>
                </h1>
                <button 
                  onClick={readPageGuide}
                  className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full hover:bg-purple-500 hover:text-white transition-all ml-2"
                  title="Play Guide"
                >
                  <Volume2 size={18} />
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                 {status === 'PROCESSING' && (
                    <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-purple-600 dark:text-purple-400 animate-pulse">
                       <Cpu size={14} /> PROCESSING... {progress}%
                    </div>
                 )}
                 <button 
                    onClick={handleProcess}
                    disabled={status === 'PROCESSING' || (!selectedFile && !urlInput)}
                    className="px-4 md:px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-full shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                 >
                    {status === 'PROCESSING' ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                    PROCESS
                 </button>
              </div>
            </div>

            {/* Mobile: Column layout (Preview top, Controls bottom). Desktop: Row layout. */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
              
              {/* Sidebar / Controls */}
              {/* Order 2 on Mobile (Bottom), Order 1 on Desktop (Left) */}
              <div className="order-2 md:order-1 w-full md:w-[320px] lg:w-[360px] bg-white dark:bg-dark-900 border-t md:border-t-0 md:border-r border-slate-200 dark:border-white/5 flex flex-col z-20 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 transition-colors flex-1 md:flex-none">
                
                <div className="p-5 border-b border-slate-200 dark:border-white/5">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><UploadCloud size={12}/> Input Source</h3>
                  <div className="flex bg-slate-100 dark:bg-dark-950 p-1 rounded-lg mb-4 border border-slate-200 dark:border-white/5">
                     <button onClick={() => { setInputType('file'); handleVoiceFeedback("File upload mode"); }} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${inputType === 'file' ? 'bg-white dark:bg-purple-600 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-0' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Upload File</button>
                     <button onClick={() => { setInputType('url'); handleVoiceFeedback("URL input mode"); }} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${inputType === 'url' ? 'bg-white dark:bg-purple-600 text-slate-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-0' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>URL</button>
                  </div>

                  {inputType === 'file' ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 dark:border-white/20 rounded-xl p-4 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 hover:border-purple-500/50 transition-all group bg-slate-50/50 dark:bg-transparent"
                    >
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files && handleFile(e.target.files[0])} />
                      <p className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate font-medium">{selectedFile ? selectedFile.name : "Click to Browse"}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                       <div className="relative">
                          <input 
                            type="text" 
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            placeholder="https://site.com/image.jpg"
                            className="w-full bg-white dark:bg-dark-950 border border-slate-300 dark:border-white/10 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-sm"
                          />
                          <Globe size={14} className="absolute right-3 top-2.5 text-slate-400"/>
                       </div>
                       <button 
                         onClick={handleUrlSubmit} 
                         disabled={loadingPreview || !urlInput}
                         className="w-full py-2 bg-slate-800 dark:bg-dark-800 text-white dark:text-slate-200 text-xs font-bold rounded-lg hover:bg-slate-700 dark:hover:bg-dark-700 transition-colors shadow-sm flex items-center justify-center gap-2 border border-slate-700 dark:border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         {loadingPreview ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14}/>}
                         {loadingPreview ? 'Fetching...' : 'Load Image'}
                       </button>
                    </div>
                  )}
                </div>

                {/* AI & Adjustments */}
                <div className="p-5 border-b border-slate-200 dark:border-white/5">
                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Cpu size={12}/> AI Tools</h3>
                   <div className="space-y-3">
                      <label className="flex items-center justify-between group cursor-pointer">
                         <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Smart Enhance</span>
                         <div className={`w-10 h-5 rounded-full relative transition-colors ${enhance ? 'bg-purple-600' : 'bg-slate-300 dark:bg-dark-950 border border-slate-400 dark:border-white/10'}`}>
                            <input type="checkbox" className="opacity-0 w-full h-full cursor-pointer absolute z-10" checked={enhance} onChange={(e) => { setEnhance(e.target.checked); handleVoiceFeedback(e.target.checked ? "Smart Enhance Enabled" : "Smart Enhance Disabled"); }} />
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${enhance ? 'left-6' : 'left-1'}`}></div>
                         </div>
                      </label>
                      <label className="flex items-center justify-between group cursor-pointer">
                         <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Denoise & Smooth</span>
                         <div className={`w-10 h-5 rounded-full relative transition-colors ${denoise ? 'bg-purple-600' : 'bg-slate-300 dark:bg-dark-950 border border-slate-400 dark:border-white/10'}`}>
                            <input type="checkbox" className="opacity-0 w-full h-full cursor-pointer absolute z-10" checked={denoise} onChange={(e) => { setDenoise(e.target.checked); handleVoiceFeedback(e.target.checked ? "Denoise Enabled" : "Denoise Disabled"); }} />
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${denoise ? 'left-6' : 'left-1'}`}></div>
                         </div>
                      </label>
                   </div>
                </div>

                <div className="p-5 border-b border-slate-200 dark:border-white/5">
                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Sliders size={12}/> Adjustments</h3>
                   <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span className="text-slate-500 dark:text-slate-400">Brightness</span> <span className="text-slate-700 dark:text-slate-500">{brightness.toFixed(1)}</span></div>
                        <input type="range" min="-1" max="1" step="0.1" value={brightness} onChange={(e) => setBrightness(parseFloat(e.target.value))} onMouseUp={() => handleVoiceFeedback(`Brightness set to ${brightness.toFixed(1)}`)} className="w-full h-1 bg-slate-200 dark:bg-dark-950 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span className="text-slate-500 dark:text-slate-400">Contrast</span> <span className="text-slate-700 dark:text-slate-500">{contrast.toFixed(1)}</span></div>
                        <input type="range" min="0" max="2" step="0.1" value={contrast} onChange={(e) => setContrast(parseFloat(e.target.value))} onMouseUp={() => handleVoiceFeedback(`Contrast set to ${contrast.toFixed(1)}`)} className="w-full h-1 bg-slate-200 dark:bg-dark-950 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1"><span className="text-slate-500 dark:text-slate-400">Saturation</span> <span className="text-slate-700 dark:text-slate-500">{saturation.toFixed(1)}</span></div>
                        <input type="range" min="0" max="3" step="0.1" value={saturation} onChange={(e) => setSaturation(parseFloat(e.target.value))} onMouseUp={() => handleVoiceFeedback(`Saturation set to ${saturation.toFixed(1)}`)} className="w-full h-1 bg-slate-200 dark:bg-dark-950 rounded-lg appearance-none cursor-pointer accent-purple-500" />
                      </div>
                   </div>
                </div>

                {/* Filters */}
                <div className="p-5 border-b border-slate-200 dark:border-white/5">
                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Palette size={12}/> Creative Filters</h3>
                   <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'none', label: 'Normal' }, { id: 'hdr', label: 'HDR' }, { id: 'cinematic', label: 'Cinema' },
                        { id: 'vivid', label: 'Vivid' }, { id: 'drama', label: 'Drama' }, { id: 'noir', label: 'Noir' },
                        { id: 'matrix', label: 'Matrix' }, { id: 'grayscale', label: 'B&W' }, { id: 'sepia', label: 'Sepia' },
                        { id: 'vintage', label: 'Vintage' }, { id: 'kodachrome', label: 'Koda' }, { id: 'technicolor', label: 'Techni' },
                        { id: 'polaroid', label: 'Polar' }, { id: 'cool', label: 'Cool' }, { id: 'warm', label: 'Warm' }
                      ].map((f) => (
                        <button key={f.id} onClick={() => { setEffect(f.id as FilterPreset); handleVoiceFeedback(f.id === 'none' ? "Filter removed" : `${f.label} filter applied`); }} className={`py-2 px-1 text-[10px] font-bold uppercase rounded border transition-all truncate ${effect === f.id ? 'bg-purple-600 border-purple-500 text-white shadow-md' : 'bg-slate-100 dark:bg-dark-950 border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/20'}`}>{f.label}</button>
                      ))}
                   </div>
                </div>

                {/* Export */}
                <div className="p-5 pb-24 md:pb-20">
                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2"><Settings size={12}/> Export Settings</h3>
                   <div className="space-y-5">
                      <div>
                        <div className="text-[10px] text-slate-400 mb-1.5 font-bold flex items-center gap-1"><Layout size={10}/> RATIO</div>
                        <div className="grid grid-cols-3 gap-2">
                           {['original', '1:1', '16:9', '9:16', '4:5', '3:4'].map((ratio) => (
                               <button key={ratio} onClick={() => { setAspectRatio(ratio as TargetAspectRatio); handleVoiceFeedback(`Aspect ratio set to ${ratio === 'original' ? 'Original' : ratio}`); }} className={`py-1.5 text-[10px] font-bold uppercase rounded border transition-all ${aspectRatio === ratio ? 'bg-purple-600 border-purple-500 text-white shadow-md' : 'bg-slate-100 dark:bg-dark-950 border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:border-purple-400'}`}>{ratio === 'original' ? 'Fit' : ratio}</button>
                           ))}
                        </div>
                      </div>
                      <div>
                         <div className="text-[10px] text-slate-400 mb-1.5 font-bold flex items-center gap-1"><Monitor size={10}/> OUTPUT QUALITY</div>
                         <div className="grid grid-cols-3 gap-2">
                           {['original', '720p', '1080p', '4k', '8k'].map((res) => (
                             <button key={res} onClick={() => { setTargetResolution(res as TargetResolution); handleVoiceFeedback(`Target resolution set to ${res}`); }} className={`py-1.5 text-[10px] font-bold uppercase rounded border transition-all ${targetResolution === res ? 'bg-purple-600 border-purple-500 text-white shadow-md' : 'bg-slate-100 dark:bg-dark-950 border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:border-purple-400'}`}>{res}</button>
                           ))}
                         </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 mb-1.5 font-bold">FORMAT</div>
                        <div className="flex gap-2">
                            {['original', 'png', 'jpg', 'webp'].map((fmt) => (
                            <button key={fmt} onClick={() => { setFormat(fmt as OutputFormat); handleVoiceFeedback(`Format set to ${fmt}`); }} className={`flex-1 py-1.5 text-xs font-bold uppercase rounded border ${format === fmt ? 'bg-purple-600 border-purple-500 text-white' : 'bg-slate-100 dark:bg-dark-950 border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400'}`}>{fmt}</button>
                            ))}
                        </div>
                      </div>
                   </div>
                </div>
              </div>

              {/* Main Preview */}
              {/* Order 1 on Mobile (Top), Order 2 on Desktop (Right) */}
              <div className="order-1 md:order-2 bg-slate-200 dark:bg-[#0b0f19] relative flex flex-col items-center justify-center p-4 transition-colors border-b md:border-b-0 border-slate-300 dark:border-white/5 h-[40vh] md:h-full shrink-0 flex-1">
                {status === 'ERROR' && (
                   <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-slide-up border border-red-400">
                     <AlertTriangle size={20} /> <span className="text-sm font-bold">{error}</span>
                     <button onClick={handleReset} className="ml-2 bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs font-bold uppercase">Reset</button>
                   </div>
                )}

                <div className="w-full h-full max-w-5xl bg-[#f0f0f0] dark:bg-dark-950/50 rounded-xl md:rounded-2xl border border-slate-300 dark:border-white/5 relative overflow-hidden flex flex-col shadow-2xl">
                   <div className="h-8 md:h-10 bg-slate-100 dark:bg-dark-900 border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-3 md:px-4 transition-colors shrink-0">
                      <span className="text-[10px] md:text-xs font-bold text-slate-500 flex items-center gap-2"><ImageIcon size={12}/> CANVAS PREVIEW</span>
                      <div className="flex items-center gap-3">
                         {selectedFile ? <span className="text-[10px] md:text-xs text-slate-500 truncate max-w-[100px] md:max-w-none">{selectedFile.name}</span> : urlInput && <span className="text-[10px] md:text-xs text-slate-500 max-w-[100px] truncate">{urlInput}</span>}
                         {(selectedFile || previewUrl) && !resultUrl && (
                             <button onClick={handleClearImage} className="text-slate-400 hover:text-red-500 transition-colors" title="Clear Image"><X size={16} /></button>
                         )}
                      </div>
                   </div>

                   <div className="flex-1 relative flex items-center justify-center overflow-hidden"
                     style={{
                        backgroundColor: '#e5e5f7',
                        backgroundImage: 'linear-gradient(45deg, #dcdcdc 25%, transparent 25%), linear-gradient(-45deg, #dcdcdc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #dcdcdc 75%), linear-gradient(-45deg, transparent 75%, #dcdcdc 75%)',
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                     }}>
                      {!previewUrl && !resultUrl && !status.includes('PROCESSING') && (
                         <div onDragEnter={onDrag} onDragLeave={onDrag} onDragOver={onDrag} onDrop={onDrop} className={`text-center p-6 md:p-10 rounded-3xl border-2 border-dashed transition-all bg-white/50 backdrop-blur-sm ${dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-slate-400 dark:border-white/20 hover:border-slate-500'}`}>
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-200 dark:bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-600 dark:text-purple-500"><UploadCloud size={24} className="md:w-8 md:h-8"/></div>
                            <h3 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-2">Drag & Drop Image</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm font-medium">or use controls</p>
                         </div>
                      )}

                      {(status === 'LOADING_ENGINE' || status === 'PROCESSING') && (
                         <div className="absolute inset-0 z-50 bg-white/90 dark:bg-dark-900/80 backdrop-blur-md flex flex-col items-center justify-center transition-colors">
                            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center mb-4 md:mb-6 relative">
                               <Loader2 size={32} className="text-purple-600 dark:text-purple-500 animate-spin absolute md:w-12 md:h-12" />
                               <div className="text-xs md:text-sm font-bold text-purple-900 dark:text-white">{progress}%</div>
                            </div>
                            <h2 className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mb-2">Processing</h2>
                            <div className="w-48 md:w-64 h-1.5 bg-slate-200 dark:bg-dark-800 rounded-full mt-4 overflow-hidden mb-6">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300" style={{width: `${progress}%`}}></div>
                            </div>
                            <button onClick={handleReset} className="px-5 py-2 bg-red-500/10 text-red-500 rounded-full text-xs font-bold border border-red-500/30 hover:bg-red-500 hover:text-white transition-all">Cancel Processing</button>
                         </div>
                      )}

                      {previewUrl && !resultUrl && status !== 'PROCESSING' && (
                         <div className="relative w-full h-full flex items-center justify-center p-2 md:p-6">
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                             <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain shadow-2xl transition-all" style={{ filter: getCssFilter() }} />
                             <button 
                                onMouseDown={() => { setShowOriginal(true); handleVoiceFeedback("Showing original."); }} 
                                onMouseUp={() => { setShowOriginal(false); handleVoiceFeedback("Showing preview."); }} 
                                onMouseLeave={() => setShowOriginal(false)} 
                                onTouchStart={() => { setShowOriginal(true); handleVoiceFeedback("Showing original."); }} 
                                onTouchEnd={() => { setShowOriginal(false); handleVoiceFeedback("Showing preview."); }} 
                                className="absolute bottom-4 right-4 md:bottom-6 md:right-6 px-3 py-1.5 md:px-4 md:py-2 bg-black/60 backdrop-blur text-white text-[10px] md:text-xs font-bold rounded-full border border-white/20 hover:bg-black/80 transition-all select-none z-40 flex items-center gap-2"
                             >
                               {showOriginal ? <EyeOff size={14}/> : <Eye size={14}/>} <span className="hidden sm:inline">{showOriginal ? 'SHOWING ORIGINAL' : 'HOLD TO COMPARE'}</span>
                             </button>
                         </div>
                      )}

                      {resultUrl && (
                         <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={resultUrl} alt="Result" className="max-w-full max-h-full object-contain shadow-2xl border-4 border-white dark:border-dark-800 rounded-lg" />
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3 bg-white dark:bg-dark-800 p-2 rounded-xl shadow-2xl border border-slate-200 dark:border-white/10 animate-slide-up z-40">
                                 <button onClick={handleReset} className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-3 bg-slate-100 dark:bg-dark-700 text-slate-700 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-dark-600 transition-colors">
                                   <RefreshCcw size={16} /> <span className="hidden sm:inline">New</span>
                                 </button>
                                 <div className="w-px h-6 bg-slate-300 dark:bg-white/10"></div>
                                 <a href={resultUrl} download={`processed_image.${format === 'original' ? 'png' : format}`} className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-500 transition-colors shadow-lg shadow-green-600/30" onClick={() => handleVoiceFeedback("Saving file.")}>
                                    <Download size={18}/> <span>Save</span>
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
    </>
  );
}