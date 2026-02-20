import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Wand2, Download, Sliders, Layers, Volume2 } from 'lucide-react';
import { voiceManager } from '../lib/core/VoiceManager';

export default function ImageEnhancerPage() {
  useEffect(() => {
    voiceManager.speak("You are on the Image Enhancer Page. Click the speaker icon to listen to the tool details.");
  }, []);

  const readPageContent = () => {
    const text = `
      Fix Blurry Photos with AI Precision. Recover details from low-resolution images. Perfect for ecommerce, real estate, and restoring old family memories.
      
      Common Use Cases:
      1. E-Commerce. Upscale product photos to meet marketplace requirements without reshooting.
      2. Old Photos. Remove scratches and sharpen faces in scanned vintage photographs.
      3. Social Media. Convert low-res phone snaps into crisp, high-engagement posts.
      
      Ready to enhance your photos? Open the Image Studio to start instantly.
    `;
    voiceManager.speak(text, true);
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Media Forge Image Enhancer",
    "applicationCategory": "PhotoEditor",
    "operatingSystem": "Web",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": "AI Denoise, Face Restoration, Color Correction",
    "description": "Free online AI Image Enhancer. Fix blurry photos, remove noise, and upscale resolution instantly."
  };

  return (
    <>
      <Head>
        <title>Free AI Image Enhancer | Unblur & Restore Photos Online</title>
        <meta name="description" content="Enhance image quality instantly with AI. Remove noise, fix blur, and upscale photos for free with Media Forge's online editor." />
        <meta name="keywords" content="image enhancer, photo restorer, unblur image, ai photo editor, remove noise from photo, upscale image online, ai photo restoration" />
        <meta property="og:title" content="AI Image Enhancer | Media Forge" />
        <meta property="og:description" content="Fix blurry images and upscale resolution with a single click using Artificial Intelligence." />
        <meta property="og:url" content="https://mediaforge-official.vercel.app/image-enhancer" />
        <link rel="canonical" href="https://mediaforge-official.vercel.app/image-enhancer" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      </Head>

      <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans transition-colors duration-300">
        <Header />
        
        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4">
            
            {/* Split Hero */}
            <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
                <div className="flex-1 text-center md:text-left relative">
                    <button 
                         onClick={readPageContent}
                         className="absolute top-0 right-0 md:relative md:top-auto md:right-auto md:inline-flex md:float-right p-2 bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full hover:bg-purple-500 hover:text-white transition-all mb-4"
                         title="Read Page"
                    >
                         <Volume2 size={20} />
                    </button>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-widest mb-6 border border-purple-500/20">
                        <Wand2 size={14} /> Magic Restore
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight text-slate-900 dark:text-white">
                        Fix Blurry Photos with <span className="text-purple-600 dark:text-purple-500">AI Precision</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                        Recover details from low-resolution images. Perfect for ecommerce, real estate, and restoring old family memories.
                    </p>
                    <Link href="/studio/image" className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-purple-500/30 transition-all transform hover:-translate-y-1">
                        Enhance Image Free
                    </Link>
                </div>
                
                <div className="flex-1 w-full relative">
                    {/* Interactive-looking graphic */}
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 aspect-square bg-white dark:bg-[#1e293b] flex items-center justify-center group">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-50 blur-sm group-hover:blur-none transition-all duration-700"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-100 dark:from-[#0f172a] via-transparent to-transparent"></div>
                        
                        <div className="relative z-10 bg-white/80 dark:bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-lg">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white">
                                    <Wand2 size={24} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white">Auto Enhance</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-300">AI Model v2.1</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 bg-slate-200 dark:bg-white/20 rounded-full w-48 overflow-hidden">
                                    <div className="h-full bg-purple-500 dark:bg-purple-400 w-3/4 animate-pulse"></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-300">
                                    <span>Denoising...</span>
                                    <span>75%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Use Cases */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
                <div className="p-6 bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-white/5 hover:border-purple-500/30 transition-colors shadow-sm">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-slate-900 dark:text-white"><Layers size={20} className="text-purple-500 dark:text-purple-400"/> E-Commerce</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Upscale product photos to meet marketplace requirements without reshooting.</p>
                </div>
                <div className="p-6 bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-white/5 hover:border-purple-500/30 transition-colors shadow-sm">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-slate-900 dark:text-white"><Sliders size={20} className="text-blue-500 dark:text-blue-400"/> Old Photos</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Remove scratches and sharpen faces in scanned vintage photographs.</p>
                </div>
                <div className="p-6 bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-white/5 hover:border-purple-500/30 transition-colors shadow-sm">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-slate-900 dark:text-white"><Download size={20} className="text-green-500 dark:text-green-400"/> Social Media</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Convert low-res phone snaps into crisp, high-engagement posts.</p>
                </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 rounded-3xl p-12 text-center border border-purple-200 dark:border-white/10 shadow-sm">
                <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Ready to enhance your photos?</h2>
                <Link href="/studio/image" className="inline-block px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-md">
                    Open Image Studio
                </Link>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}