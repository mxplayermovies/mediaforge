// import React from 'react';

// const featureList = [
//   {
//     icon: (
//       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//       </svg>
//     ),
//     title: "Video Upscaling",
//     desc: "Convert standard definition footage into crisp 4K using temporal coherent AI models."
//   },
//   {
//     icon: (
//       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//       </svg>
//     ),
//     title: "Image Enhancement",
//     desc: "Restore old photos, remove noise, and correct colors with a single click."
//   },
//   {
//     icon: (
//       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
//       </svg>
//     ),
//     title: "Smart Compression",
//     desc: "Reduce file sizes by up to 80% without perceptible loss in visual quality."
//   },
//   {
//     icon: (
//       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//       </svg>
//     ),
//     title: "GPU Acceleration",
//     desc: "Leverage cloud-based NVIDIA T4 GPUs for lightning-fast batch processing."
//   },
//   {
//     icon: (
//       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//       </svg>
//     ),
//     title: "Privacy First",
//     desc: "Files are processed in ephemeral containers and automatically deleted after 1 hour."
//   },
//   {
//     icon: (
//       <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
//       </svg>
//     ),
//     title: "Batch Mode",
//     desc: "Queue up to 50 files at once. Perfect for content creators and photographers."
//   }
// ];

// export default function Features() {
//   return (
//     <section id="features" className="py-24 bg-dark-900 relative">
//       <div className="container mx-auto px-4">
//         <div className="text-center max-w-3xl mx-auto mb-16">
//           <h2 className="text-sm font-bold text-primary-400 uppercase tracking-widest mb-3">Capabilities</h2>
//           <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">Built for High-Performance Workflows</h3>
//           <p className="text-slate-400 text-lg">
//             Stop struggling with complex desktop software. MediaForge brings studio-quality tools directly to your browser.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {featureList.map((feature, idx) => (
//             <div key={idx} className="group p-8 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary-500/30 transition-all duration-300">
//               <div className="w-12 h-12 rounded-lg bg-primary-500/20 text-primary-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
//                 {feature.icon}
//               </div>
//               <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
//               <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
import React from 'react';

const featureList = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Video Upscaling",
    desc: "Convert standard definition footage into crisp 4K using temporal coherent AI models."
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Image Enhancement",
    desc: "Restore old photos, remove noise, and correct colors with a single click."
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: "Smart Compression",
    desc: "Reduce file sizes by up to 80% without perceptible loss in visual quality."
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "GPU Acceleration",
    desc: "Leverage cloud-based NVIDIA T4 GPUs for lightning-fast batch processing."
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Privacy First",
    desc: "Files are processed in ephemeral containers and automatically deleted after 1 hour."
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    title: "Batch Mode",
    desc: "Queue up to 50 files at once. Perfect for content creators and photographers."
  }
];

export default function Features() {
  return (
    <section id="features" className="py-16 md:py-24 bg-[#0f172a] relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <h2 className="text-xs md:text-sm font-bold text-blue-400 uppercase tracking-widest mb-3">Capabilities</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">Built for Performance</h3>
          <p className="text-slate-400 text-base md:text-lg">
            Stop struggling with complex desktop software. MediaForge brings studio-quality tools directly to your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featureList.map((feature, idx) => (
            <div key={idx} className="group p-6 md:p-8 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h4 className="text-lg md:text-xl font-bold text-white mb-3">{feature.title}</h4>
              <p className="text-slate-400 leading-relaxed text-sm md:text-base">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}