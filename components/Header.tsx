import React, { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, Sun, Moon, Download } from 'lucide-react';

// Export Context to be used in _app.tsx
export const ThemeContext = createContext({
  isDarkMode: true,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [mobileMenuOpen]);

  const isActive = (path: string) => router.pathname === path;

  // --- DYNAMIC CLASSES ---
  const headerBgClass =
    isScrolled || mobileMenuOpen || router.pathname.includes('/studio')
      ? 'bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-white/5 py-2'
      : 'bg-white/5 dark:bg-black/20 backdrop-blur-sm py-4';

  const textClass = 'text-slate-900 dark:text-white';
  const logoTextClass = isScrolled || mobileMenuOpen || router.pathname.includes('/studio')
    ? textClass
    : `${textClass} drop-shadow-md`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${headerBgClass}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 md:gap-3 group z-[101] relative"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 md:h-6 md:w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className={`font-bold text-lg md:text-xl tracking-tight leading-none ${logoTextClass}`}>
                  Media<span className="text-blue-500">Forge</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-widest uppercase leading-none mt-0.5">
                  Studio
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link
                href="/features"
                className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                  isActive('/features') ? 'text-blue-500' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Features
              </Link>
              <Link
                href="/how-it-works"
                className={`text-sm font-medium transition-colors hover:text-blue-500 ${
                  isActive('/how-it-works') ? 'text-blue-500' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                How it Works
              </Link>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-300"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <a
                href="https://median.co/share/bnlerow"
                target="_blank"
                download
                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white text-sm font-bold hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/10"
              >
                <Download size={16} />
                <span className="hidden lg:inline">Get App</span>
              </a>

              <Link
                href="/studio"
                className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/30"
              >
                Launch Studio
              </Link>
            </nav>

            {/* Mobile Actions */}
            <div className="flex items-center gap-3 md:hidden z-[101]">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-colors ${textClass} hover:bg-slate-100 dark:hover:bg-white/10`}
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                className={`p-2 rounded-full transition-colors ${textClass}`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - FIXED for dark mode visibility */}
      <div
        className={`fixed inset-0 bg-white/95 dark:bg-[#0f172a] backdrop-blur-xl z-[90] transition-all duration-300 md:hidden flex flex-col pt-24 px-6 ${
          mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <nav className="flex flex-col gap-6 items-center w-full">
          <Link
            href="/features"
            className="text-2xl font-bold text-slate-800 dark:text-white hover:text-blue-500 py-2 drop-shadow-md dark:drop-shadow-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            href="/how-it-works"
            className="text-2xl font-bold text-slate-800 dark:text-white hover:text-blue-500 py-2 drop-shadow-md dark:drop-shadow-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            How it Works
          </Link>
          <Link
            href="/faq"
            className="text-2xl font-bold text-slate-800 dark:text-white hover:text-blue-500 py-2 drop-shadow-md dark:drop-shadow-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            FAQ
          </Link>

          <a
            href="https://median.co/share/bnlerow"
            target="_blank"
            download
            className="flex items-center gap-2 text-xl font-bold text-slate-600 dark:text-white hover:text-blue-500 py-2 drop-shadow-md dark:drop-shadow-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Download size={24} className="dark:text-white" /> Download APK
          </a>

          <div className="w-20 h-1 bg-slate-200 dark:bg-slate-700 rounded-full my-4"></div>

          <Link
            href="/studio"
            className="w-full max-w-xs py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xl font-bold text-center shadow-xl shadow-blue-500/20 active:scale-95 transition-transform"
            onClick={() => setMobileMenuOpen(false)}
          >
            Launch Studio
          </Link>
        </nav>
      </div>
    </>
  );
}