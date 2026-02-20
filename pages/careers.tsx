import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { voiceManager } from '../lib/core/VoiceManager';
import { Volume2 } from 'lucide-react';

export default function CareersPage() {
  useEffect(() => {
    voiceManager.speak("You are on the Careers Page. Click the speaker icon to hear our available positions.");
  }, []);

  const positions = [
    { title: 'Senior Graphics Engineer', dept: 'Engineering', loc: 'Remote', type: 'Full-time' },
    { title: 'Full Stack Developer (Next.js)', dept: 'Engineering', loc: 'Remote', type: 'Full-time' },
    { title: 'AI Research Scientist', dept: 'R&D', loc: 'San Francisco / Remote', type: 'Full-time' },
    { title: 'Product Designer', dept: 'Design', loc: 'Remote', type: 'Contract' },
  ];

  const readPageContent = () => {
    let text = "Join the Forge. Help us democratize creative tools. We're looking for passionate individuals to solve hard problems in video processing and AI. ";
    text += "Here are our current openings: ";
    positions.forEach((job, index) => {
        text += `Position ${index + 1}: ${job.title}. Department: ${job.dept}. Location: ${job.loc}. Type: ${job.type}. `;
    });
    text += "Don't see a role that fits? Contact us anyway.";
    voiceManager.speak(text, true);
  };

  // Generate JobPosting Schema for the first job as an example, or map all if needed
  const jobsSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": "Senior Graphics Engineer",
    "hiringOrganization": {
        "@type": "Organization",
        "name": "Media Forge",
        "sameAs": "https://mediaforge-official.vercel.app"
    },
    "jobLocation": {
        "@type": "Place",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "US"
        }
    },
    "description": "Help us build the next generation of WebAssembly media tools.",
    "employmentType": "FULL_TIME",
    "datePosted": "2023-10-01"
  };

  return (
    <>
      <Head>
        <title>Careers at Media Forge | Join our Engineering Team</title>
        <meta name="description" content="We are hiring! Join Media Forge and help build the next generation of AI-powered media tools." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jobsSchema) }} />
      </Head>

      <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans transition-colors duration-300">
        <Header />
        
        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-16 relative">
              <button 
                 onClick={readPageContent}
                 className="absolute top-0 right-0 md:-right-12 p-2 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition-all"
                 title="Read Careers"
               >
                 <Volume2 size={20} />
               </button>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">Join the Forge</h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Help us democratize creative tools. We're looking for passionate individuals to solve hard problems in video processing and AI.
              </p>
            </div>

            <div className="space-y-4">
              {positions.map((job, i) => (
                <div key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-white/5 hover:border-blue-500/50 transition-colors group cursor-pointer shadow-sm">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{job.title}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                      <span>{job.dept}</span>
                      <span>•</span>
                      <span>{job.loc}</span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className="px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 text-sm font-medium border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300">{job.type}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <p className="text-slate-600 dark:text-slate-400 mb-6">Don't see a role that fits?</p>
              <Link href="/contact" className="text-blue-600 dark:text-blue-400 font-bold hover:text-blue-500 dark:hover:text-blue-300">
                Contact us anyway &rarr;
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}