// import React from 'react';
// import Link from 'next/link';

// export default function Hero() {
//   return (
//     <section className="relative min-h-[95vh] flex items-center justify-center pt-24 pb-20 overflow-hidden bg-[#0f172a]">
//       {/* Dynamic Background with Mesh Gradient and Noise */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary-600/10 blur-[120px] animate-pulse-slow"></div>
//         <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-accent-600/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
//         <div className="absolute top-[30%] left-[50%] transform -translate-x-1/2 w-[40vw] h-[40vw] rounded-full bg-indigo-500/10 blur-[90px]"></div>
        
//         {/* Animated Grid Pattern */}
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
//       </div>

//       <div className="container mx-auto px-4 relative z-10 text-center">
//         {/* Trust Badge */}
//         <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in hover:bg-white/10 transition-colors cursor-default backdrop-blur-md shadow-[0_0_15px_rgba(56,189,248,0.1)]">
//           <span className="relative flex h-2.5 w-2.5">
//             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//             <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
//           </span>
//           <span className="text-xs font-bold text-slate-200 tracking-widest uppercase">System Online</span>
//         </div>

//         {/* Main Title with Gradient */}
//         <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 animate-slide-up leading-[1.1] md:leading-[1.05]">
//           <span className="block text-white drop-shadow-2xl">
//             MEDIA
//           </span>
//           <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-cyan-300 to-accent-400 animate-gradient-x bg-[length:200%_auto]">
//             PROCESSOR
//           </span>
//         </h1>

//         {/* Subtitle / Value Proposition */}
//         <p className="max-w-3xl mx-auto text-lg md:text-2xl text-slate-300 mb-12 leading-relaxed animate-slide-up px-4 font-light" style={{ animationDelay: '0.1s' }}>
//           The professional standard for <strong className="text-white font-semibold">AI Upscaling</strong>, <strong className="text-white font-semibold">Video Restoration</strong>, and <strong className="text-white font-semibold">4K Conversion</strong>. 
//           <br className="hidden md:block" /> Secure, high-performance media processing.
//         </p>

//         {/* CTA Buttons */}
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up px-4" style={{ animationDelay: '0.2s' }}>
//           <Link 
//             href="/studio" 
//             className="group relative w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-dark-900 font-bold text-xl shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all transform hover:-translate-y-1 overflow-hidden"
//           >
//             <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-slate-200 to-transparent transform -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
//             <span className="relative flex items-center justify-center gap-3">
//               Launch Studio 
//               <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//               </svg>
//             </span>
//           </Link>
//           <Link 
//             href="/how-it-works" 
//             className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold text-xl hover:bg-white/10 transition-all backdrop-blur-sm hover:border-primary-500/30 flex items-center justify-center gap-2"
//           >
//             How it Works
//           </Link>
//         </div>

//         {/* Tech Stack */}
//         <div className="mt-24 pt-10 border-t border-white/5 animate-fade-in max-w-6xl mx-auto" style={{ animationDelay: '0.4s' }}>
//           <p className="text-slate-500 text-sm font-semibold uppercase tracking-widest mb-8">Professional Capabilities</p>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//             {[
//               { label: 'Technology', value: 'AI Powered' },
//               { label: 'Quality', value: 'Up to 4K' },
//               { label: 'Privacy', value: 'Secure Core' },
//               { label: 'Speed', value: 'Accelerated' },
//             ].map((stat, idx) => (
//               <div key={idx} className="flex flex-col items-center p-4 rounded-xl transition-colors hover:bg-white/5">
//                 <span className="text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">{stat.value}</span>
//                 <span className="text-xs text-primary-400 uppercase tracking-widest font-bold">{stat.label}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
import React from 'react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center pt-28 pb-12 md:pb-20 overflow-hidden bg-slate-50 dark:bg-[#0f172a] transition-colors duration-300">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] rounded-full bg-blue-500/5 dark:bg-blue-600/10 blur-[80px] md:blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[80vw] rounded-full bg-purple-500/5 dark:bg-purple-600/10 blur-[80px] md:blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] md:bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center flex flex-col items-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-6 md:mb-8 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors cursor-default backdrop-blur-md shadow-sm">
          <span className="relative flex h-2 w-2 md:h-2.5 md:w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-green-500"></span>
          </span>
          <span className="text-[10px] md:text-xs font-bold text-slate-600 dark:text-slate-200 tracking-widest uppercase">System Online</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-6 md:mb-8 leading-[1.1] md:leading-[1.05] w-full max-w-5xl">
          <span className="block text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-2xl transition-colors">
            MEDIA
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 animate-gradient-x bg-[length:200%_auto] pb-2">
            PROCESSOR
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-xl md:max-w-3xl mx-auto text-base md:text-2xl text-slate-600 dark:text-slate-300 mb-10 md:mb-12 leading-relaxed px-4 font-light transition-colors">
          The professional standard for <strong className="text-slate-900 dark:text-white font-semibold">AI Upscaling Video/Images</strong>, <strong className="text-slate-900 dark:text-white font-semibold">Video Restoration/Conversion</strong>, and <strong className="text-slate-900 dark:text-white font-semibold">Image Conversion easily</strong>.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full max-w-md sm:max-w-none">
          <Link 
            href="/studio" 
            className="group relative w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 rounded-2xl bg-blue-600 dark:bg-white text-white dark:text-slate-900 font-bold text-lg md:text-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] dark:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] dark:hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-all transform hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative flex items-center justify-center gap-3">
              Launch Studio 
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Link>
          <Link 
            href="/how-it-works" 
            className="w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-semibold text-lg md:text-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all backdrop-blur-sm flex items-center justify-center gap-2 shadow-sm"
          >
            How it Works
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="mt-16 md:mt-24 w-full max-w-4xl pt-8 md:pt-10 border-t border-slate-200 dark:border-white/5 transition-colors">
          <p className="text-slate-500 dark:text-slate-500 text-xs md:text-sm font-semibold uppercase tracking-widest mb-6">Capabilities</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { label: 'Technology', value: 'Images' },
              { label: 'Privacy', value: 'Local Run' },
              { label: 'Quality', value: 'Up to 4K' },
              { label: 'Format', value: 'Any Codec' },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-transparent shadow-sm dark:shadow-none transition-colors">
                <span className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</span>
                <span className="text-[10px] md:text-xs text-blue-600 dark:text-blue-400 uppercase tracking-widest font-bold">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}