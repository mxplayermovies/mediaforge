import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { ThemeContext } from '../components/Header';
import Header from '../components/Header';
import { voiceManager } from '../lib/core/VoiceManager';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: any;
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Check local storage or preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // --- GOOGLE TRANSLATE & VOICE MANAGER SETUP ---
  useEffect(() => {
    // 1. Define the initialization function globally
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            layout: window.google.translate.TranslateElement.InlineLayout.VERTICAL,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    // 2. Check if already loaded (navigation case)
    if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }

    // 3. Language Detection for VoiceManager
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
          const newLang = document.documentElement.lang;
          if (newLang) {
            // console.log('Detected language change:', newLang);
            voiceManager.setLanguage(newLang);
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
    });

    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <>
        <Head>
          {/* <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" /> */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/logo.png" type="image/png" />      
        </Head>
        
        {/* Google Translate Script */}
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />

        {/* Fixed Floating Widget */}
        <div 
          id="google_translate_element" 
          className="fixed bottom-4 right-4 z-[9999] bg-white dark:bg-slate-800 p-2 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700"
          style={{ minHeight: '40px', minWidth: '160px' }}
        />
  {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-BBGH82VEE4"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-BBGH82VEE4');
            `,
          }}
        />
        <Header />
        <Component {...pageProps} />
      </>
    </ThemeContext.Provider>
  );
}