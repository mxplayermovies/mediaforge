import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AlertTriangle, Home, Loader2 } from 'lucide-react';

export default function Custom404() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    // Redirect after 3 seconds
    const redirect = setTimeout(() => {
      router.replace('/');
    }, 3000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [router]);

  return (
    <>
      <Head>
        <title>Page Not Found | Media Forge</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Head>

      <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white font-sans flex flex-col transition-colors duration-300">
        <Header />
        
        <main className="flex-1 flex flex-col items-center justify-center pt-20 pb-20 px-4">
            <div className="max-w-md w-full text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 mb-6 shadow-sm border border-red-200 dark:border-red-500/20">
                    <AlertTriangle size={40} />
                </div>
                
                <h1 className="text-6xl font-black mb-2 tracking-tighter text-slate-900 dark:text-white">404</h1>
                <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-200">Page Not Found</h2>
                
                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                    Oops! The page you are looking for has vanished or does not exist. We are sending you back to safety.
                </p>

                <div className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-white/5 shadow-xl mb-8 transform transition-all hover:scale-105">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 size={24} className="text-blue-600 dark:text-blue-400 animate-spin" />
                        <p className="font-bold text-slate-700 dark:text-slate-200">
                            Redirecting in <span className="text-blue-600 dark:text-blue-400 text-xl">{countdown}</span> seconds...
                        </p>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mt-4 overflow-hidden">
                        <div 
                            className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-1000 ease-linear"
                            style={{ width: `${((3 - countdown) / 3) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <button 
                    onClick={() => router.replace('/')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20"
                >
                    <Home size={18} /> Go Home Now
                </button>
            </div>
        </main>

        <Footer />
      </div>
    </>
  );
}