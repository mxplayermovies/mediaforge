import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { voiceManager } from '../lib/core/VoiceManager';
import { Volume2 } from 'lucide-react';

export default function CookiePolicyPage() {
  useEffect(() => {
    voiceManager.speak("You are on the Cookie Policy Page. Click the speaker icon to listen to our policy.");
  }, []);

  const readPageContent = () => {
    const text = `
      Cookie Policy. 
      
      What are cookies? Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently.
      
      How we use cookies. We use a strictly minimal set of cookies:
      1. Theme. This stores your preference for Dark Mode versus Light Mode.
      2. Session ID. This is a temporary identifier for processing queue management if applicable.
      
      Third-Party Cookies. We do not use Google Analytics, Facebook Pixels, or other third-party tracking cookies. Your privacy is paramount.
      
      Managing Cookies. You can control and or delete cookies as you wish via your browser settings. However, disabling cookies may affect your ability to use features like dark mode.
    `;
    voiceManager.speak(text, true);
  };

  return (
    <>
      <Head>
        <title>Cookie Policy | Media Forge</title>
        <meta name="description" content="Cookie Policy for Media Forge." />
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
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900 dark:text-white">Cookie Policy</h1>
            
            <div className="prose prose-lg dark:prose-invert prose-slate max-w-none">
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                This Cookie Policy explains how Media Forge uses cookies and similar technologies.
              </p>

              <h3>What are cookies?</h3>
              <p>Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.</p>

              <h3>How we use cookies</h3>
              <p>We use a strictly minimal set of cookies:</p>
              <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-white/5 my-6 not-prose shadow-sm">
                <ul className="space-y-4">
                  <li className="flex gap-4">
                    <span className="font-bold text-blue-600 dark:text-blue-400 w-32 shrink-0">theme</span>
                    <span className="text-slate-600 dark:text-slate-300">Stores your preference for Dark Mode vs Light Mode.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="font-bold text-blue-600 dark:text-blue-400 w-32 shrink-0">session_id</span>
                    <span className="text-slate-600 dark:text-slate-300">Temporary identifier for processing queue management (if applicable).</span>
                  </li>
                </ul>
              </div>

              <h3>Third-Party Cookies</h3>
              <p>We do not use Google Analytics, Facebook Pixels, or other third-party tracking cookies. Your privacy is paramount.</p>

              <h3>Managing Cookies</h3>
              <p>You can control and/or delete cookies as you wish via your browser settings. However, disabling cookies may affect your ability to use the dark mode feature.</p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}