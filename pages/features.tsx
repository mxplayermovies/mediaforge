import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Features from '../components/Features';
import { voiceManager } from '../lib/core/VoiceManager';
import { Volume2 } from 'lucide-react';

export default function FeaturesPage() {
  useEffect(() => {
    voiceManager.speak("You are on the Features Page. Click the speaker icon to listen to our capabilities.");
  }, []);

  const readPageContent = () => {
    const text = `
      Powerful Capabilities. We combine traditional signal processing with state-of-the-art deep learning models to deliver professional results.
      
      Our core features include:
      1. Video Upscaling. Convert standard definition footage into crisp 4K using temporal coherent AI models.
      2. Image Enhancement. Restore old photos, remove noise, and correct colors with a single click.
      3. Smart Compression. Reduce file sizes by up to 80% without perceptible loss in visual quality.
      4. GPU Acceleration. Leverage cloud-based NVIDIA T4 GPUs for lightning-fast batch processing.
      5. Privacy First. Files are processed in ephemeral containers and automatically deleted after 1 hour.
      6. Batch Mode. Queue up to 50 files at once. Perfect for content creators and photographers.
      
      Why AI Upscaling Matters? Traditional bicubic interpolation simply stretches pixels, resulting in blurry edges. Our Generative Adversarial Networks hallucinate plausible details based on training data. This allows you to take 720p footage and upscale it to 4K for modern displays without the digital smear associated with old techniques.
    `;
    voiceManager.speak(text, true);
  };

  return (
    <>
      <Head>
        <title>Features | Media Forge</title>
        <meta name="description" content="Explore our complete set of features: AI Video Upscaling, Image Restoration, Noise Reduction, and Format Conversion." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>

      <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans transition-colors duration-300">
        <Header />
        
        <main className="pt-20">
          <div className="bg-white dark:bg-[#1e293b] py-16 border-b border-slate-200 dark:border-white/5 relative">
             <div className="container mx-auto px-4 text-center">
               <button 
                 onClick={readPageContent}
                 className="absolute top-8 right-8 p-2 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition-all"
                 title="Read Features"
               >
                 <Volume2 size={20} />
               </button>
               <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">Powerful Capabilities</h1>
               <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                 We combine traditional signal processing with state-of-the-art deep learning models to deliver professional results.
               </p>
             </div>
          </div>
          
          <Features />
          
          <section className="py-16 md:py-24 bg-slate-100 dark:bg-[#0f172a] transition-colors duration-300">
             <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-slate-900 dark:text-white">Why AI Upscaling Matters</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed text-sm md:text-base">
                      Traditional bicubic interpolation simply stretches pixels, resulting in blurry edges. Our Generative Adversarial Networks (GANs) hallucinate plausible details based on training data.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
                      This allows you to take 720p footage and upscale it to 4K for modern displays without the "digital smear" associated with old techniques.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-[#1e293b] rounded-xl p-4 md:p-6 border border-slate-200 dark:border-white/5 shadow-2xl">
                    <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden group">
                       <span className="text-slate-500 dark:text-white font-mono z-10 text-sm md:text-base">4K Comparison Demo</span>
                       <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors"></div>
                    </div>
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