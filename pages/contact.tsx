import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Mail, MessageSquare, MapPin, Volume2 } from 'lucide-react';
import { voiceManager } from '../lib/core/VoiceManager';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    voiceManager.speak("You are on the Contact Page. Click the speaker icon to hear our support details.");
  }, []);

  const readPageContent = () => {
    const text = `
      Get in touch. Have questions about our API, Enterprise or Business plans, or just want to say hello? We'd love to hear from you.
      
      Here are our contact channels:
      Email. General support at support at media forge official at the rate protonmail dot com. Business inquiries at  media forge official at the rate protonmail dot com.
      
      Live Chat. Our team is available Monday to Friday, from 9 AM to 5 PM Pacific Standard Time.
      
      Office Location. We are located at 123 Tech Plaza, Suite 400, San Francisco, California, zip code 94107.
    `;
    voiceManager.speak(text, true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    voiceManager.speak("Message sent! We'll get back to you within 24 hours.", true);
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Media Forge",
    "image": "https://mediaforge-official.vercel.app/logo.png",
    "email": "support@mediaforge.ai",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Tech Plaza, Suite 400",
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "postalCode": "94107",
      "addressCountry": "US"
    },
    "url": "https://mediaforge-official.vercel.app/contact"
  };

  return (
    <>
      <Head>
        <title>Contact Us | Media Forge Support</title>
        <meta name="description" content="Get in touch with the Media Forge team for API support, enterprise sales, or general inquiries." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />
      </Head>

      <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans transition-colors duration-300">
        <Header />
        
        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
              
              {/* Contact Info */}
              <div className="relative">
                <button 
                 onClick={readPageContent}
                 className="absolute top-0 right-0 p-2 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition-all"
                 title="Read Contact Info"
                >
                 <Volume2 size={20} />
                </button>
                <h1 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">Get in touch</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-12">
                  Have questions about our API, Enterprise or Business plans, or just want to say hello? We'd love to hear from you.
                </p>

                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">Email</h3>
                      <p className="text-slate-600 dark:text-slate-400">mediaforgeofficial@protonmail.com</p>
                    
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400">
                      <MessageSquare size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">Live Chat</h3>
                      <p className="text-slate-600 dark:text-slate-400">Available Mon-Fri, 9am - 5pm PST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">Office</h3>
                      <p className="text-slate-600 dark:text-slate-400">123 Tech Plaza, Suite 400<br />San Francisco, CA 94107</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                {submitted ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                      <Mail size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Message Sent!</h3>
                    <p className="text-slate-600 dark:text-slate-400">We'll get back to you within 24 hours.</p>
                    <button onClick={() => setSubmitted(false)} className="mt-8 text-blue-600 dark:text-blue-400 hover:text-blue-500 font-bold">Send another</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Name</label>
                      <input type="text" className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="John Doe" required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                      <input type="email" className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="john@example.com" required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                      <select className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors">
                        <option>General Inquiry</option>
                        <option>Technical Support</option>
                        <option>Enterprise Sales</option>
                        <option>Partnership</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Message</label>
                      <textarea className="w-full bg-slate-50 dark:bg-[#0f172a] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors h-32" placeholder="How can we help?" required></textarea>
                    </div>
                    <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all transform active:scale-95">
                      Send Message
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}