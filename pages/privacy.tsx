import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { voiceManager } from '../lib/core/VoiceManager';
import { Volume2 } from 'lucide-react';

export default function PrivacyPage() {
  useEffect(() => {
    voiceManager.speak("You are on the Privacy Policy Page. Click the speaker icon to listen to our data policies.");
  }, []);

  const readPageContent = () => {
    const text = `
      Privacy Policy. Last Updated October 2023.
      
      1. Overview. Media Forge respects your privacy. This Privacy Policy describes how we handle data when you use our website and services.
      
      2. Data Processing. Unlike traditional cloud converters, Media Forge is designed with a Local-First architecture. This means:
         - Local Processing: When you use our tools, the file processing happens directly within your web browser using WebAssembly.
         - No File Uploads: Your media files are not uploaded to our servers for processing. They remain on your device.
         - Hybrid AI: For certain AI-enhanced features, we may use a secure, ephemeral cloud tunnel. In these cases, files are processed in RAM and deleted immediately upon completion. We do not store your files.
         
      3. Information We Collect. We may collect minimal anonymous usage data to improve our service, such as browser type, device type, and error logs for debugging.
      
      4. Cookies. We use cookies solely for essential functionality like remembering your dark mode preference. We do not use third-party tracking cookies.
      
      5. Contact Us. If you have questions about this policy, please contact us at privacy at mediaforge dot ai.
    `;
    voiceManager.speak(text, true);
  };

  return (
    <>
      <Head>
        <title>Privacy Policy | Media Forge</title>
        <meta name="description" content="Privacy Policy for Media Forge." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>

      <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans transition-colors duration-300">
        <Header />
        
        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4 max-w-3xl relative">
            <button 
                 onClick={readPageContent}
                 className="absolute top-0 right-4 p-2 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition-all"
                 title="Read Policy"
            >
                 <Volume2 size={20} />
            </button>
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900 dark:text-white">Privacy Policy</h1>
            
            <div className="prose prose-lg dark:prose-invert prose-slate max-w-none">
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">Last Updated: October 2023</p>

              <h3>1. Overview</h3>
              <p>Media Forge ("we", "us", or "our") respects your privacy. This Privacy Policy describes how we handle data when you use our website and services.</p>

              <h3>2. Data Processing</h3>
              <p>Unlike traditional cloud converters, Media Forge is designed with a "Local-First" architecture. This means:</p>
              <ul>
                <li><strong>Local Processing:</strong> When you use our tools, the file processing (transcoding, editing, filtering) happens directly within your web browser using WebAssembly (WASM).</li>
                <li><strong>No File Uploads:</strong> Your media files are not uploaded to our servers for processing. They remain on your device.</li>
                <li><strong>Hybrid AI:</strong> For certain AI-enhanced features (like 4K upscaling), we may use a secure, ephemeral cloud tunnel. In these cases, files are processed in RAM and deleted immediately upon completion. We do not store your files.</li>
              </ul>

              <h3>3. Information We Collect</h3>
              <p>We may collect minimal anonymous usage data to improve our service, such as:</p>
              <ul>
                <li>Browser type and version</li>
                <li>Device type (Mobile/Desktop)</li>
                <li>Error logs (for debugging purposes)</li>
              </ul>

              <h3>4. Cookies</h3>
              <p>We use cookies solely for essential functionality (like remembering your dark mode preference). We do not use third-party tracking cookies.</p>

              <h3>5. Contact Us</h3>
              <p>If you have questions about this policy, please contact us at privacy@mediaforge.ai.</p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}