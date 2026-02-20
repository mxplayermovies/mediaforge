import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HowItWorksSection from '../components/HowItWorks'; 
import { voiceManager } from '../lib/core/VoiceManager';
import { Volume2 } from 'lucide-react';

export default function HowItWorksPage() {
  useEffect(() => {
    voiceManager.speak("You are on the How it Works Page. Click the speaker icon to learn about our processing pipeline.");
  }, []);

  const readPageContent = () => {
    const text = `
      The Processing Pipeline. Transparent, Secure, and Fast. 
      Here is our optimized workflow in 3 steps: 
      Step 1. Upload Media. Drag and drop video or image files. We support MP4, MOV, PNG, JPG, and WebP.
      Step 2. Select AI Model. Choose from specialized models for Upscaling, Denoising, or Frame Interpolation.
      Step 3. Process and Download. Our GPU cluster handles the heavy lifting. Preview results and download instantly.
      
      Technical Architecture. 
      Phase 1: Ingestion and Analysis. Your file is analyzed for codecs, bitrate, and resolution locally in your browser.
      Phase 2: WASM Processing. We use FFmpeg compiled to WebAssembly to process frames directly on your device, utilizing your CPU and memory.
      Phase 3: Render. The processed file is re-encoded and saved to your device immediately.
    `;
    voiceManager.speak(text, true);
  };

  return (
    <>
      <Head>
        <title>How it Works | Media Forge</title>
        <meta name="description" content="Learn how Media Forge uses WebGPU and cloud acceleration to process your files securely and efficiently." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>

      <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans transition-colors duration-300">
        <Header />
        <main className="pt-20">
          <section className="py-12 md:py-16 bg-white dark:bg-[#1e293b] text-center px-4 relative border-b border-slate-200 dark:border-white/5">
            <button 
                 onClick={readPageContent}
                 className="absolute top-8 right-8 p-2 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition-all"
                 title="Read How it Works"
               >
                 <Volume2 size={20} />
            </button>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">The Processing Pipeline</h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">Transparent, Secure, and Fast.</p>
          </section>
          
          <HowItWorksSection />

          <section className="py-16 md:py-24 container mx-auto px-4 max-w-4xl">
             <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-slate-900 dark:text-white">Technical Architecture</h2>
             <div className="space-y-8">
               <div className="flex gap-4 md:gap-6 items-start">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold text-sm md:text-base">1</div>
                 <div>
                   <h3 className="text-lg md:text-xl font-bold mb-2 text-slate-900 dark:text-white">Ingestion & Analysis</h3>
                   <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">Your file is analyzed for codecs, bitrate, and resolution locally in your browser.</p>
                 </div>
               </div>
               <div className="flex gap-4 md:gap-6 items-start">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold text-sm md:text-base">2</div>
                 <div>
                   <h3 className="text-lg md:text-xl font-bold mb-2 text-slate-900 dark:text-white">WASM Processing</h3>
                   <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">We use FFmpeg compiled to WebAssembly to process frames directly on your device, utilizing your CPU and memory.</p>
                 </div>
               </div>
               <div className="flex gap-4 md:gap-6 items-start">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold text-sm md:text-base">3</div>
                 <div>
                   <h3 className="text-lg md:text-xl font-bold mb-2 text-slate-900 dark:text-white">Render</h3>
                   <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">The processed file is re-encoded and saved to your device immediately.</p>
                 </div>
               </div>
             </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}