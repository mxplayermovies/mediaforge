import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { voiceManager } from '../lib/core/VoiceManager';
import { Volume2 } from 'lucide-react';

export default function AboutPage() {
  useEffect(() => {
    voiceManager.speak("You are on the About Page. Click the speaker icon to listen to our full story and technology stack.");
  }, []);

  const readPageContent = () => {
    const text = `
      About Media Forge. Democratizing Professional Media Tools.
      
      Our Story. We believe high-fidelity video upscaling and image restoration shouldn't be locked behind expensive subscriptions or require $3,000 graphics cards.
      
      Privacy First Architecture. In an era of data breaches, we took a radical approach. By leveraging WebAssembly and WebGPU, Media Forge runs the heavy lifting directly on your device. Your personal photos and videos stay local, ensuring absolute privacy.
      
      Sustainable Tech. Cloud rendering consumes massive amounts of energy in data centers. By distributing the workload to edge devices, which means your computer, we significantly reduce the carbon footprint associated with media processing.
      
      Our Technology Stack. We utilize a hybrid stack that combines the speed of C++ via FFmpeg with the accessibility of the modern web. The core technologies are: WebAssembly, WebGL 2.0, TensorFlow JS, and Next JS.
      
      Ready to build with us? We are always looking for talented engineers and researchers to help us push the boundaries of what's possible in a browser.
    `;
    voiceManager.speak(text, true);
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Media Forge",
    "url": "https://mediaforge-official.vercel.app",
    "logo": "https://mediaforge-official.vercel.app/logo.png",
    "sameAs": [
      "https://twitter.com/mediaforge",
      "https://github.com/mediaforge"
    ],
    "description": "Media Forge is a leading provider of browser-based AI media processing tools, specializing in video upscaling and image enhancement technology using WebAssembly.",
    "foundingDate": "2023",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@mediaforge.ai",
      "contactType": "customer support"
    }
  };

  return (
    <>
      <Head>
        <title>About Media Forge | Pioneering Web-Based AI Media Processing</title>
        <meta name="description" content="Learn about Media Forge's mission to democratize professional media tools using WebAssembly (WASM) and Edge AI. We are building the future of private, fast, and secure media processing." />
        <meta name="keywords" content="Media Forge, About Us, WebAssembly Video Editor, AI Company, Browser-based FFmpeg, Media Processing Technology" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="About Media Forge | The Future of Web Media" />
        <meta property="og:description" content="We utilize local-first architecture to ensure your files never leave your device while delivering studio-quality results." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
      </Head>

      <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans transition-colors duration-300">
        <Header />
        
        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-16 relative">
               <button 
                 onClick={readPageContent}
                 className="absolute top-0 right-0 md:-right-12 p-2 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition-all"
                 title="Read Full Content"
               >
                 <Volume2 size={20} />
               </button>
               <span className="text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase text-sm mb-4 block">Our Story</span>
               <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight text-slate-900 dark:text-white">
                 Democratizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Professional Media Tools</span>
               </h1>
               <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                 We believe high-fidelity video upscaling and image restoration shouldn't be locked behind expensive subscriptions or require $3,000 graphics cards.
               </p>
            </div>
            
            <div className="prose prose-lg mx-auto dark:prose-invert">
              <div className="grid md:grid-cols-2 gap-12 my-16 not-prose">
                <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-blue-500/30 transition-colors shadow-sm">
                  <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Privacy First Architecture</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    In an era of data breaches, we took a radical approach. By leveraging <strong>WebAssembly (WASM)</strong> and <strong>WebGPU</strong>, Media Forge runs the heavy lifting directly on your device. Your personal photos and videos stay local, ensuring absolute privacy.
                  </p>
                </div>
                <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-purple-500/30 transition-colors shadow-sm">
                  <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Sustainable Tech</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Cloud rendering consumes massive amounts of energy in data centers. By distributing the workload to edge devices (your computer), we significantly reduce the carbon footprint associated with media processing.
                  </p>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-center mb-8 text-slate-900 dark:text-white">Our Technology Stack</h2>
              <p className="text-slate-600 dark:text-slate-300 text-center mb-12">
                We utilize a hybrid stack that combines the speed of C++ (via FFmpeg) with the accessibility of the modern web.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 not-prose mb-20">
                 {['WebAssembly', 'WebGL 2.0', 'TensorFlow.js', 'Next.js'].map((tech) => (
                    <div key={tech} className="p-4 bg-white dark:bg-slate-900 rounded-lg text-center font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5 shadow-sm">
                        {tech}
                    </div>
                 ))}
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-10 rounded-3xl border border-blue-200 dark:border-blue-500/20 text-center shadow-sm">
                <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white m-0">Ready to build with us?</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-xl mx-auto">
                  We are always looking for talented engineers and researchers to help us push the boundaries of what's possible in a browser.
                </p>
                <div className="flex justify-center gap-4">
                    <a href="/careers" className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/30">View Careers</a>
                    <a href="/contact" className="px-8 py-3 bg-white dark:bg-transparent border border-slate-200 dark:border-white/20 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">Contact Us</a>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}