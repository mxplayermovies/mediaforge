import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import Link from 'next/link';
import { voiceManager } from '../lib/core/VoiceManager';
import { Volume2 } from 'lucide-react';

export default function Home() {
  useEffect(() => {
    voiceManager.speak("Welcome to Media Forge. The #1 AI Video Upscaler and Image Enhancer. Scroll down and click the speaker icon to hear about our professional tools.");
  }, []);

  const readPageContent = () => {
    const text = `
      Media Forge. Professional Tools for Everyone.
      
      We provide a suite of AI-powered capabilities directly in your browser.
      
      1. Features Overview. Explore our full suite of AI tools including upscaling, denoising, and frame interpolation. View Features.
      
      2. How It Works. Understand our secure pipeline and how we protect your data using WebAssembly and ephemeral processing. Learn More.
      
      3. Launch Studio. Jump straight into our professional editor interface to start processing files immediately. Open App.
    `;
    voiceManager.speak(text, true);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Media Forge",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web",
    "description": "Professional AI-powered video upscaler and image enhancer. Convert 1080p to 4K, restore old photos, and process media securely.",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": "4K Upscaling, AI Denoising, Photo Restoration, Secure Processing"
  };

  return (
    <>
      <Head>
        <title>Media Forge | Free Media Processor Enhancer.</title>
        <meta name="description" content="Use Media Forge to upscale video to 4K, enhance images, and restore old photos using AI. Free, secure, and runs in your browser with no file uploads." />
        <meta name="keywords" content="ai video upscaler, free video enhancer, 4k video converter, image upscaler, photo restoration, online video editor, 1080p to 4k, video denoise" />
        <meta property="og:title" content="Media Forge | AI Video Upscaler & Image Enhancer" />
        <meta property="og:description" content="Professional grade AI media tools in your browser. Upscale video to 4K and restore photos instantly." />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mediaforge-official.vercel.app/" />
        <link rel="canonical" href="https://mediaforge-official.vercel.app/" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </Head>

      <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans overflow-x-hidden transition-colors duration-300">
        <Header />
        
        <main>
          <Hero />
          
          <section className="py-16 md:py-24 bg-white dark:bg-[#1e293b] border-t border-slate-200 dark:border-none transition-colors relative">
            <div className="container mx-auto px-4 text-center relative">
              <button 
                 onClick={readPageContent}
                 className="absolute top-0 right-4 md:right-0 p-2 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition-all z-10"
                 title="Read Overview"
               >
                 <Volume2 size={20} />
               </button>
              <h2 className="text-3xl md:text-5xl font-bold mb-10 text-slate-900 dark:text-white">Professional Tools for Everyone</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                <div className="p-8 bg-slate-50 dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-500 transition-all shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Features Overview</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">Explore our full suite of AI tools including upscaling, denoising, and frame interpolation.</p>
                  <Link href="/features" className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-500 dark:hover:text-blue-300 text-sm">View Features &rarr;</Link>
                </div>
                <div className="p-8 bg-slate-50 dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-500 transition-all shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">How It Works</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">Understand our secure pipeline and how we protect your data while processing.</p>
                  <Link href="/how-it-works" className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-500 dark:hover:text-blue-300 text-sm">Learn More &rarr;</Link>
                </div>
                <div className="p-8 bg-slate-50 dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-500 transition-all shadow-sm">
                  <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Launch Studio</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">Jump straight into our professional editor interface to start processing files.</p>
                  <Link href="/studio" className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-500 dark:hover:text-blue-300 text-sm">Open App &rarr;</Link>
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