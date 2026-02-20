// import { useState, useCallback, useRef } from 'react';
// import { voiceManager } from '../lib/core/VoiceManager';

// export interface ProcessOptions {
//   type: 'video' | 'image';
//   resolution?: '4k' | '2k' | '1080p';
//   enhance?: boolean;
//   denoise?: boolean;
//   filters?: {
//     brightness?: number;
//     contrast?: number;
//     saturation?: number;
//     grayscale?: boolean;
//     sepia?: boolean;
//     preset?: string;
//   };
//   resize?: {
//     targetResolution?: 'original' | '720p' | '1080p' | '2k' | '4k' | '8k';
//     scale?: number;
//   };
//   aspectRatio?: 'original' | '1:1' | '16:9' | '9:16' | '4:5' | '3:4';
//   format?: 'png' | 'jpg' | 'webp' | 'mp4' | 'webm' | 'original';
//   endpoint?: string;
// }

// export interface ProcessMetadata {
//   size: string;
//   resolution?: string;
//   type: string;
// }

// export interface ProcessingDetails {
//   phase: 'UPLOADING' | 'QUEUED' | 'PROCESSING' | 'FINALIZING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
//   progress: number;
//   timeElapsed: string;
// }

// type ProcessingState = 'IDLE' | 'LOADING_ENGINE' | 'PROCESSING' | 'COMPLETED' | 'ERROR';

// interface UseMediaProcessorReturn {
//   processFile: (file: File, options: ProcessOptions) => Promise<void>;
//   status: ProcessingState;
//   progress: number;
//   error: string | null;
//   resultUrl: string | null;
//   metadata: ProcessMetadata | null;
//   processingDetails: ProcessingDetails | null;
//   reset: () => void;
// }

// const formatBytes = (bytes: number, decimals = 2) => {
//     if (!+bytes) return '0 Bytes';
//     const k = 1024;
//     const dm = decimals < 0 ? 0 : decimals;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
// };

// export function useMediaProcessor(): UseMediaProcessorReturn {
//   const [status, setStatus] = useState<ProcessingState>('IDLE');
//   const [progress, setProgress] = useState(0);
//   const [error, setError] = useState<string | null>(null);
//   const [resultUrl, setResultUrl] = useState<string | null>(null);
//   const [metadata, setMetadata] = useState<ProcessMetadata | null>(null);
//   const [processingDetails, setProcessingDetails] = useState<ProcessingDetails | null>(null);
  
//   const startTimeRef = useRef<number>(0);
//   const pollIntervalRef = useRef<any>(null);
//   const abortControllerRef = useRef<AbortController | null>(null);

//   const cleanup = () => {
//       if (pollIntervalRef.current) {
//           clearInterval(pollIntervalRef.current);
//           pollIntervalRef.current = null;
//       }
//   };

//   const processFile = useCallback(async (file: File, options: ProcessOptions) => {
//     setStatus('PROCESSING');
//     setError(null);
//     setProgress(0);
//     setResultUrl(null);
//     setMetadata(null);
//     startTimeRef.current = Date.now();
    
//     // Initialize AbortController for this request
//     if (abortControllerRef.current) abortControllerRef.current.abort();
//     abortControllerRef.current = new AbortController();
    
//     if (voiceManager) {
//         voiceManager.reset();
//         voiceManager.speak("Uploading media for processing.");
//     }

//     setProcessingDetails({
//         phase: 'UPLOADING',
//         progress: 0,
//         timeElapsed: '0s'
//     });

//     try {
//         const processingOptions = { ...options, originalName: file.name };
        
//         // 1. Upload & Initialize Job
//         const endpoint = options.type === 'image' ? '/api/imageprocess' : '/api/videoprocess';
        
//         const response = await fetch(endpoint, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/octet-stream', 
//                 'x-process-options': JSON.stringify(processingOptions)
//             },
//             body: file,
//             signal: abortControllerRef.current.signal
//         });

//         if (!response.ok) {
//             const errJson = await response.json().catch(() => ({}));
//             throw new Error(errJson.error || `Upload failed with status ${response.status}`);
//         }

//         const { jobId } = await response.json();
//         if (!jobId) throw new Error("Server returned no Job ID");

//         // 2. Poll for Status
//         if (voiceManager) voiceManager.speak("Processing started. Please wait.");
        
//         pollIntervalRef.current = setInterval(async () => {
//             if (abortControllerRef.current?.signal.aborted) {
//                 cleanup();
//                 return;
//             }

//             try {
//                 const statusRes = await fetch(`/api/status?jobId=${jobId}`);
//                 if (!statusRes.ok) throw new Error("Failed to check status");
                
//                 const jobStatus = await statusRes.json();
//                 const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);

//                 if (jobStatus.state === 'failed' || jobStatus.state === 'error') {
//                      throw new Error(jobStatus.error || "Processing failed on server");
//                 }

//                 if (jobStatus.state === 'completed') {
//                     cleanup();
                    
//                     // 3. Download / Link
//                     const downloadUrl = `/api/download?jobId=${jobId}`;
//                     setResultUrl(downloadUrl);
                    
//                     // Fetch head to get metadata size
//                     try {
//                         const head = await fetch(downloadUrl, { method: 'HEAD' });
//                         const size = head.headers.get('content-length');
//                         if (size) {
//                             setMetadata({
//                                 size: formatBytes(parseInt(size)),
//                                 resolution: options.resize?.targetResolution?.toUpperCase() || 'SMART-STRETCH',
//                                 type: options.type.toUpperCase()
//                             });
//                         }
//                     } catch (e) { console.warn("Metadata fetch error", e); }

//                     setProgress(100);
//                     setStatus('COMPLETED');
//                     setProcessingDetails({
//                         phase: 'COMPLETED',
//                         progress: 100,
//                         timeElapsed: `${elapsed}s`
//                     });
//                     if (voiceManager) voiceManager.speak("Processing complete.");
//                 } else {
//                     // Update Progress
//                     const currentProgress = jobStatus.progress || 0;
//                     setProgress(currentProgress);
//                     setProcessingDetails({
//                         phase: 'PROCESSING',
//                         progress: currentProgress,
//                         timeElapsed: `${elapsed}s`
//                     });
//                 }
//             } catch (pollErr: any) {
//                 cleanup();
//                 console.error("Polling Error:", pollErr);
//                 setStatus('ERROR');
//                 setError(pollErr.message);
//                 if (voiceManager) voiceManager.speak("Error during processing.");
//             }
//         }, 1000);

//     } catch (err: any) {
//       cleanup();
//       if (err.name === 'AbortError') {
//           console.log('Operation aborted by user');
//           setStatus('IDLE');
//           setProcessingDetails(null);
//           return;
//       }
//       console.error("Hook Error:", err);
//       setStatus('ERROR');
//       setError(err.message || "Processing failed");
//       if (voiceManager) voiceManager.speak("Error processing file.");
//     }
//   }, []);

//   const reset = useCallback(() => {
//     if (abortControllerRef.current) {
//         abortControllerRef.current.abort();
//         abortControllerRef.current = null;
//     }
//     cleanup();
//     setStatus('IDLE');
//     setProgress(0);
//     setError(null);
//     setResultUrl(null);
//     setMetadata(null);
//     setProcessingDetails(null);
//     if (voiceManager) voiceManager.reset();
//   }, []);

//   return { processFile, status, progress, error, resultUrl, metadata, processingDetails, reset };
// }






import { useState, useCallback, useRef } from 'react';
import { voiceManager } from '../lib/core/VoiceManager';

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
    targetResolution?: 'original' | '720p' | '1080p' | '2k' | '4k' | '8k';
    scale?: number;
  };
  aspectRatio?: 'original' | '1:1' | '16:9' | '9:16' | '4:5' | '3:4';
  format?: 'png' | 'jpg' | 'webp' | 'mp4' | 'webm' | 'original';
  endpoint?: string;
}

export interface ProcessMetadata {
  size: string;
  resolution?: string;
  type: string;
}

export interface ProcessingDetails {
  phase: 'UPLOADING' | 'QUEUED' | 'PROCESSING' | 'FINALIZING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  progress: number;
  timeElapsed: string;
}

type ProcessingState = 'IDLE' | 'LOADING_ENGINE' | 'PROCESSING' | 'COMPLETED' | 'ERROR';

interface UseMediaProcessorReturn {
  processFile: (file: File, options: ProcessOptions) => Promise<void>;
  status: ProcessingState;
  progress: number;
  error: string | null;
  resultUrl: string | null;
  metadata: ProcessMetadata | null;
  processingDetails: ProcessingDetails | null;
  reset: () => void;
}

const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export function useMediaProcessor(): UseMediaProcessorReturn {
  const [status, setStatus] = useState<ProcessingState>('IDLE');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ProcessMetadata | null>(null);
  const [processingDetails, setProcessingDetails] = useState<ProcessingDetails | null>(null);
  
  const startTimeRef = useRef<number>(0);
  const pollIntervalRef = useRef<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const cleanup = () => {
      if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
      }
  };

  const processFile = useCallback(async (file: File, options: ProcessOptions) => {
    setStatus('PROCESSING');
    setError(null);
    setProgress(0);
    setResultUrl(null);
    setMetadata(null);
    startTimeRef.current = Date.now();
    
    // Initialize AbortController for this request
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    
    if (voiceManager) {
        voiceManager.reset();
        voiceManager.speak("Uploading media for processing.");
    }

    setProcessingDetails({
        phase: 'UPLOADING',
        progress: 0,
        timeElapsed: '0s'
    });

    try {
        const processingOptions = { ...options, originalName: file.name };
        
        // 1. Upload & Initialize Job
        const endpoint = options.type === 'image' ? '/api/imageprocess' : '/api/videoprocess';
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream', 
                'x-process-options': JSON.stringify(processingOptions)
            },
            body: file,
            signal: abortControllerRef.current.signal
        });

        if (!response.ok) {
            const errJson = await response.json().catch(() => ({}));
            throw new Error(errJson.error || `Upload failed with status ${response.status}`);
        }

        const { jobId } = await response.json();
        if (!jobId) throw new Error("Server returned no Job ID");

        // 2. Poll for Status
        if (voiceManager) voiceManager.speak("Processing started. Please wait.");
        
        pollIntervalRef.current = setInterval(async () => {
            if (abortControllerRef.current?.signal.aborted) {
                cleanup();
                return;
            }

            try {
                const statusRes = await fetch(`/api/status?jobId=${jobId}`);
                if (!statusRes.ok) throw new Error("Failed to check status");
                
                const jobStatus = await statusRes.json();
                const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);

                if (jobStatus.state === 'failed' || jobStatus.state === 'error') {
                     throw new Error(jobStatus.error || "Processing failed on server");
                }

                if (jobStatus.state === 'completed') {
                    cleanup();
                    
                    // 3. Download / Link
                    const downloadUrl = `/api/download?jobId=${jobId}`;
                    setResultUrl(downloadUrl);
                    
                    // Fetch head to get metadata size
                    try {
                        const head = await fetch(downloadUrl, { method: 'HEAD' });
                        const size = head.headers.get('content-length');
                        if (size) {
                            setMetadata({
                                size: formatBytes(parseInt(size)),
                                resolution: options.resize?.targetResolution?.toUpperCase() || 'SMART-STRETCH',
                                type: options.type.toUpperCase()
                            });
                        }
                    } catch (e) { console.warn("Metadata fetch error", e); }

                    setProgress(100);
                    setStatus('COMPLETED');
                    setProcessingDetails({
                        phase: 'COMPLETED',
                        progress: 100,
                        timeElapsed: `${elapsed}s`
                    });
                    if (voiceManager) voiceManager.speak("Processing complete.");
                } else {
                    // Update Progress
                    const currentProgress = jobStatus.progress || 0;
                    setProgress(currentProgress);
                    setProcessingDetails({
                        phase: 'PROCESSING',
                        progress: currentProgress,
                        timeElapsed: `${elapsed}s`
                    });
                    
                    // Announce progress using VoiceManager
                    if (voiceManager) {
                        voiceManager.announceProgress(currentProgress);
                    }
                }
            } catch (pollErr: any) {
                cleanup();
                console.error("Polling Error:", pollErr);
                setStatus('ERROR');
                setError(pollErr.message);
                if (voiceManager) voiceManager.speak("Error during processing.");
            }
        }, 1000);

    } catch (err: any) {
      cleanup();
      if (err.name === 'AbortError') {
          console.log('Operation aborted by user');
          setStatus('IDLE');
          setProcessingDetails(null);
          return;
      }
      console.error("Hook Error:", err);
      setStatus('ERROR');
      setError(err.message || "Processing failed");
      if (voiceManager) voiceManager.speak("Error processing file.");
    }
  }, []);

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
    }
    cleanup();
    setStatus('IDLE');
    setProgress(0);
    setError(null);
    setResultUrl(null);
    setMetadata(null);
    setProcessingDetails(null);
    if (voiceManager) voiceManager.reset();
  }, []);

  return { processFile, status, progress, error, resultUrl, metadata, processingDetails, reset };
}