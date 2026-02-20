import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Terminal, Code, Cpu, Shield, Volume2 } from 'lucide-react';
import { voiceManager } from '../lib/core/VoiceManager';

export default function DevelopersPage() {
  useEffect(() => {
    voiceManager.speak("You are on the Developers API Page. Click the speaker icon to listen to the API documentation.");
  }, []);

  const readPageContent = () => {
    const text = `
      Build with Media Forge API. Access the same powerful FFmpeg WASM and Cloud GPU clusters that power our studio. 
      Process video and images programmatically.
      
      API Reference Endpoint. POST request to /api/imageprocess. 
      Submit an image for processing via raw binary body with configuration headers.
      
      Key Features:
      1. Simple Integration. RESTful endpoints that fit into any stack. No complex SDKs required.
      2. GPU Acceleration. Jobs are routed to T4 instances for rapid inference and encoding.
      3. Secure Pipeline. Ephemeral processing containers. Data is wiped immediately after delivery.
    `;
    voiceManager.speak(text, true);
  };

  return (
    <>
      <Head>
        <title>Developers API | Media Forge</title>
        <meta name="description" content="Integrate Media Forge's AI processing engine directly into your applications." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>

      <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans transition-colors duration-300">
        <Header />
        
        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 relative">
              <button 
                 onClick={readPageContent}
                 className="absolute top-0 right-0 md:-right-12 p-2 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition-all"
                 title="Read Overview"
               >
                 <Volume2 size={20} />
               </button>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 border border-blue-500/20">
                <Code size={14} /> Developer Preview
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">Build with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Media Forge API</span></h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                Access the same powerful FFmpeg WASM and Cloud GPU clusters that power our studio. 
                Process video and images programmatically.
              </p>
            </div>

            {/* API Reference */}
            <div className="max-w-4xl mx-auto space-y-12">
              
              {/* Endpoint 1 */}
              <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden shadow-sm">
                <div className="p-6 md:p-8 border-b border-slate-200 dark:border-white/5">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-green-500/10 text-green-600 dark:text-green-400 font-mono text-sm font-bold rounded">POST</span>
                    <h3 className="text-xl font-bold font-mono text-slate-900 dark:text-white">/api/imageprocess</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
                    Submit an image for processing. Accepts raw binary body with configuration headers.
                  </p>
                </div>
                
                <div className="bg-slate-50 dark:bg-[#0b0f19] p-6 md:p-8 overflow-x-auto">
                  <pre className="text-sm font-mono text-slate-700 dark:text-slate-300">
{`curl -X POST https://mediaforge-official.vercel.app/api/imageprocess \\
  -H "Content-Type: application/octet-stream" \\
  -H 'x-process-options: {"type":"image", "enhance":true, "format":"png"}' \\
  --data-binary @input.jpg`}
                  </pre>
                </div>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                  <Terminal className="text-blue-500 dark:text-blue-400 mb-4" size={24} />
                  <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Simple Integration</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">RESTful endpoints that fit into any stack. No complex SDKs required.</p>
                </div>
                <div className="p-6 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                  <Cpu className="text-purple-500 dark:text-purple-400 mb-4" size={24} />
                  <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">GPU Acceleration</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Jobs are routed to T4 instances for rapid inference and encoding.</p>
                </div>
                <div className="p-6 bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200 dark:border-white/5 shadow-sm">
                  <Shield className="text-green-500 dark:text-green-400 mb-4" size={24} />
                  <h4 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Secure Pipeline</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">Ephemeral processing containers. Data is wiped immediately after delivery.</p>
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