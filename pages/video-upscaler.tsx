import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Check, Zap, Shield, Video, Volume2, Monitor, Film, Smartphone } from 'lucide-react';
import { voiceManager } from '../lib/core/VoiceManager';

export default function VideoUpscalerPage() {
  useEffect(() => {
    voiceManager.speak("You are on the Video Upscaler Page. Click the speaker icon to listen to the tool features.");
  }, []);

  const readPageContent = () => {
    const text = `
      Upscale Video to 4K Resolution. Restore details, remove noise, and enhance video quality using next-generation neural networks. No credit card required.
      
      Why use an AI Upscaler? 
      1. Convert HD to Ultra HD for large screens.
      2. Restore old home movies and low-quality phone footage.
      3. Remove compression artifacts and digital noise.
      4. Sharpen edges without creating 'ringing' artifacts.
      
      Professional Features include:
      Fast Processing via GPU. 
      Private and Secure files never uploaded.
      Universal Format support for MP4, MOV, AVI, and MKV.
      
      Video Upscaling FAQ.
      Does this work on mobile? Yes! Our player and processor are optimized for mobile browsers.
      Is it really free? Yes, basic upscaling and filtering are free.
    `;
    voiceManager.speak(text, true);
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Media Forge Video Upscaler",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "featureList": "4K Upscaling, Noise Reduction, Frame Interpolation",
    "description": "Free online AI Video Upscaler. Convert 720p and 1080p video to 4K resolution instantly in your browser."
  };

  return (
    <>
      <Head>
        <title>Free AI Video Upscaler | Convert 1080p to 4K Online</title>
        <meta name="description" content="Upscale video to 4K online for free with Media Forge. Our AI Video Enhancer improves quality, removes noise, and sharpens details without downloading software." />
        <meta name="keywords" content="video upscaler, 4k video converter, ai video enhancer, upscale video online free, improve video quality, 1080p to 4k, video restoration ai" />
        <meta property="og:title" content="AI Video Upscaler | Media Forge" />
        <meta property="og:description" content="Turn old, blurry videos into crisp 4K footage using our browser-based AI engine." />
        <meta property="og:url" content="https://mediaforge-official.vercel.app/video-upscaler" />
        <link rel="canonical" href="https://mediaforge-official.vercel.app/video-upscaler" />
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
                         className="absolute top-0 right-0 md:relative md:top-auto md:right-auto md:inline-flex md:float-right p-2 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition-all mb-4"
                         title="Read Page"
                    >
                         <Volume2 size={20} />
                    </button>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-500/20">
                        <Video size={14} /> AI Powered
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight text-slate-900 dark:text-white">
                      Upscale Video to <span className="text-blue-600 dark:text-blue-500">4K Resolution</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                      Restore details, remove noise, and enhance video quality using next-generation neural networks. No credit card required.
                    </p>
                    <Link href="/studio/video" className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1">
                      Upscale Video Now
                    </Link>
                </div>

                <div className="flex-1 w-full relative">
                    {/* Interactive-looking graphic - Video Style */}
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 aspect-video bg-white dark:bg-[#1e293b] flex items-center justify-center group">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-50 blur-sm group-hover:blur-none transition-all duration-700"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-100 dark:from-[#0f172a] via-transparent to-transparent"></div>
                        
                        <div className="relative z-10 bg-white/80 dark:bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 shadow-lg">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                    <Video size={24} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white">4K Rendering</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-300">WASM Engine v3.0</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 bg-slate-200 dark:bg-white/20 rounded-full w-48 overflow-hidden">
                                    <div className="h-full bg-blue-500 dark:bg-blue-400 w-3/4 animate-pulse"></div>
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-300">
                                    <span>Upscaling...</span>
                                    <span>2160p</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Use Cases Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
                <div className="p-6 bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-colors shadow-sm">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-slate-900 dark:text-white"><Monitor size={20} className="text-blue-500 dark:text-blue-400"/> 4K Streaming</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Convert HD content to Ultra HD for modern large screens and TVs.</p>
                </div>
                <div className="p-6 bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-colors shadow-sm">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-slate-900 dark:text-white"><Film size={20} className="text-purple-500 dark:text-purple-400"/> Restoration</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Restore old home movies and remove compression artifacts from low-quality footage.</p>
                </div>
                <div className="p-6 bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-colors shadow-sm">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-slate-900 dark:text-white"><Smartphone size={20} className="text-green-500 dark:text-green-400"/> Social Content</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Sharpen phone footage and upscale vertical videos for high-quality Reels.</p>
                </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 rounded-3xl p-12 text-center border border-blue-200 dark:border-white/10 mb-20 shadow-sm">
                <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Ready to upgrade your video quality?</h2>
                <Link href="/studio/video" className="inline-block px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-md">
                    Open Video Studio
                </Link>
            </div>
          </div>

          {/* Features Grid */}
          <section className="py-20 container mx-auto px-4 border-t border-slate-200 dark:border-white/5">
              <h2 className="text-3xl font-bold text-center mb-16 text-slate-900 dark:text-white">Professional Features</h2>
              <div className="grid md:grid-cols-3 gap-8">
                  <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                      <Zap className="text-yellow-500 dark:text-yellow-400 mb-4" size={32} />
                      <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Fast Processing</h3>
                      <p className="text-slate-600 dark:text-slate-400">Uses your device's GPU via WebGPU/WASM or our T4 cloud clusters for rapid rendering.</p>
                  </div>
                  <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                      <Shield className="text-green-500 dark:text-green-400 mb-4" size={32} />
                      <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Private & Secure</h3>
                      <p className="text-slate-600 dark:text-slate-400">Files processed locally are never uploaded. Cloud processing uses ephemeral encrypted containers.</p>
                  </div>
                  <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                      <Video className="text-purple-500 dark:text-purple-400 mb-4" size={32} />
                      <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Universal Formats</h3>
                      <p className="text-slate-600 dark:text-slate-400">Support for MP4, MOV, AVI, MKV, and WEBM input formats. Output to H.264 or H.265.</p>
                  </div>
              </div>
          </section>

          {/* FAQ */}
          <section className="bg-slate-50 dark:bg-[#1e293b] py-20 border-t border-slate-200 dark:border-white/5">
              <div className="container mx-auto px-4 max-w-3xl">
                  <h2 className="text-3xl font-bold text-center mb-10 text-slate-900 dark:text-white">Video Upscaling FAQ</h2>
                  <div className="space-y-6">
                      <div className="bg-white dark:bg-[#0f172a] p-6 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                          <h4 className="font-bold text-slate-900 dark:text-white mb-2">Does this work on mobile?</h4>
                          <p className="text-slate-600 dark:text-slate-400">Yes! Our player and processor are optimized for mobile browsers, though desktop is recommended for 4K rendering speeds.</p>
                      </div>
                      <div className="bg-white dark:bg-[#0f172a] p-6 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                          <h4 className="font-bold text-slate-900 dark:text-white mb-2">Is it really free?</h4>
                          <p className="text-slate-600 dark:text-slate-400">Yes, basic upscaling and filtering are free. We support the site through enterprise API partnerships.</p>
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