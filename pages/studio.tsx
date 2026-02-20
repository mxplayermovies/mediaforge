import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Image, Video, ArrowRight, Wand2, Zap, Shield, Volume2 } from 'lucide-react';
import { voiceManager } from '../lib/core/VoiceManager';

export default function StudioHub() {
  useEffect(() => {
    voiceManager.speak("You are on the Studio Hub. Click the speaker icon to hear your workflow options.");
  }, []);

  const readPageContent = () => {
    const text = `
      Select Workflow. Choose a specialized environment for your specific media processing needs.
      
      Option 1: Image Lab. Features include: Smart Enhance 2x, Denoise and Sharpen, and Filters and FX. Launch Editor.
      
      Option 2: Video Forge. Features include: 4K Upscaling, Format Conversion, and Secure WASM Engine. Open Studio.
      
      Security Note: All workflows run locally on your device. Zero data upload policy.
    `;
    voiceManager.speak(text, true);
  };

  return (
    <>
      <Head>
        <title>Studio Hub | Media Forge</title>
        <meta name="description" content="Select your professional media workflow: Image Enhancement or Video Upscaling." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>

      <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans flex flex-col transition-colors duration-300">
        <Header />
        
        <main className="flex-1 pt-28 pb-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16 relative">
              <button 
                 onClick={readPageContent}
                 className="absolute top-0 right-0 md:-right-12 p-2 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition-all"
                 title="Read Options"
               >
                 <Volume2 size={20} />
               </button>
              <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6">Select Workflow</h1>
              <p className="text-slate-600 dark:text-slate-400 text-base md:text-xl">
                Choose a specialized environment for your specific media processing needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
              {/* Image Workstation Card */}
              <Link href="/studio/image" className="group relative bg-white dark:bg-[#1e293b] rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-white/5 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1 shadow-sm">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Image size={100} className="text-slate-900 dark:text-white"/>
                </div>
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 md:mb-8 border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <Wand2 size={24} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4">Image Lab</h2>
                <ul className="space-y-3 mb-8 text-slate-600 dark:text-slate-400 text-sm md:text-base">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>Smart Enhance (2x)</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>Denoise & Sharpen</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>Filters & FX</li>
                </ul>
                <div className="flex items-center text-purple-600 dark:text-purple-400 font-bold group-hover:text-purple-500 dark:group-hover:text-purple-300">
                  Launch Editor <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Video Workstation Card */}
              <Link href="/studio/video" className="group relative bg-white dark:bg-[#1e293b] rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-white/5 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 shadow-sm">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Video size={100} className="text-slate-900 dark:text-white"/>
                </div>
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 md:mb-8 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Zap size={24} />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4">Video Forge</h2>
                <ul className="space-y-3 mb-8 text-slate-600 dark:text-slate-400 text-sm md:text-base">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>4K Upscaling</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Format Conversion</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Secure WASM Engine</li>
                </ul>
                <div className="flex items-center text-blue-600 dark:text-blue-400 font-bold group-hover:text-blue-500 dark:group-hover:text-blue-300">
                  Open Studio <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>

            {/* Security Note */}
            <div className="mt-16 flex justify-center">
               <div className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-[#1e293b] border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 text-xs md:text-sm max-w-sm text-center">
                 <Shield size={16} className="text-green-500 shrink-0" />
                 <span>All workflows run locally on your device. Zero data upload policy.</span>
               </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}