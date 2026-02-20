import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { voiceManager } from '../lib/core/VoiceManager';
import { Volume2 } from 'lucide-react';

export default function FAQPage() {
  useEffect(() => {
    voiceManager.speak("You are on the FAQ Page. Click the speaker icon to hear the questions and answers.");
  }, []);

  const faqData = [
    { q: "Is Media Forge free?", a: "Yes, standard processing is completely free. All processing happens in your browser." },
    { q: "Do you store my files?", a: "No. We utilize a secure client-side architecture. Files never leave your device." },
    { q: "What is the maximum file size?", a: "Since we process locally, the limit depends on your device's memory. We generally recommend under 2GB for stability." },
    { q: "Why is the processing slower on 4K files?", a: "Upscaling to 4K requires generating 4x the pixels of 1080p. This is computationally intensive for your browser." },
  ];

  const readPageContent = () => {
    let text = "Frequently Asked Questions. ";
    faqData.forEach((item, index) => {
        text += `Question ${index + 1}: ${item.q} Answer: ${item.a} `;
    });
    voiceManager.speak(text, true);
  };

  const structuredFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  };

  return (
    <>
      <Head>
        <title>FAQ | Media Forge</title>
        <meta name="description" content="Frequently Asked Questions about Media Forge." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredFAQ) }} />
      </Head>

      <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans transition-colors duration-300">
        <Header />
        
        <main className="pt-20">
          <section className="py-16 md:py-24 bg-white dark:bg-[#1e293b] border-b border-slate-200 dark:border-white/5">
            <div className="container mx-auto px-4 max-w-3xl relative">
              <button 
                 onClick={readPageContent}
                 className="absolute top-0 right-4 p-2 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition-all"
                 title="Read FAQs"
               >
                 <Volume2 size={20} />
               </button>
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-slate-900 dark:text-white">Frequently Asked Questions</h1>
              <div className="space-y-6">
                {faqData.map((faq, i) => (
                  <div key={i} className="bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-xl p-6 md:p-8 hover:border-blue-500/30 transition-colors shadow-sm">
                    <h3 className="font-bold text-lg md:text-xl mb-3 md:mb-4 text-blue-600 dark:text-blue-400">{faq.q}</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}