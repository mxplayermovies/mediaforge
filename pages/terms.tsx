import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { voiceManager } from '../lib/core/VoiceManager';
import { Volume2 } from 'lucide-react';

export default function TermsPage() {
  useEffect(() => {
    voiceManager.speak("You are on the Terms of Service Page. Click the speaker icon to listen to the terms.");
  }, []);

  const readPageContent = () => {
    const text = `
      Terms of Service. Last Updated October 2023.
      
      1. Acceptance of Terms. By accessing or using Media Forge, you agree to be bound by these Terms of Service.
      
      2. Use License. Permission is granted to use Media Forge for personal and commercial file processing. You may not: Reverse engineer the WebAssembly modules. Use the service for illegal activities or to process illegal content. Attempt to overwhelm our infrastructure.
      
      3. Disclaimer. The materials on Media Forge are provided on an 'as is' basis. We make no warranties, expressed or implied, regarding the reliability or accuracy of the processing results.
      
      4. Limitations. In no event shall Media Forge or its suppliers be liable for any damages arising out of the use or inability to use the materials on Media Forge.
      
      5. Governing Law. These terms and conditions are governed by and construed in accordance with the laws of California.
    `;
    voiceManager.speak(text, true);
  };

  return (
    <>
      <Head>
        <title>Terms of Service | Media Forge</title>
        <meta name="description" content="Terms of Service for Media Forge." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>

      <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans transition-colors duration-300">
        <Header />
        
        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4 max-w-3xl relative">
            <button 
                 onClick={readPageContent}
                 className="absolute top-0 right-4 p-2 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition-all"
                 title="Read Terms"
            >
                 <Volume2 size={20} />
            </button>
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900 dark:text-white">Terms of Service</h1>
            
            <div className="prose prose-lg dark:prose-invert prose-slate max-w-none">
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">Last Updated: October 2023</p>

              <h3>1. Acceptance of Terms</h3>
              <p>By accessing or using Media Forge, you agree to be bound by these Terms of Service.</p>

              <h3>2. Use License</h3>
              <p>Permission is granted to use Media Forge for personal and commercial file processing. You may not:</p>
              <ul>
                <li>Reverse engineer the WebAssembly modules.</li>
                <li>Use the service for illegal activities or to process illegal content.</li>
                <li>Attempt to overwhelm our infrastructure (DDoS).</li>
              </ul>

              <h3>3. Disclaimer</h3>
              <p>The materials on Media Forge are provided on an 'as is' basis. We make no warranties, expressed or implied, regarding the reliability or accuracy of the processing results.</p>

              <h3>4. Limitations</h3>
              <p>In no event shall Media Forge or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the materials on Media Forge.</p>

              <h3>5. Governing Law</h3>
              <p>These terms and conditions are governed by and construed in accordance with the laws of California and you irrevocably submit to the exclusive jurisdiction of the courts in that State.</p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}