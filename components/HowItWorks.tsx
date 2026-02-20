// import React from 'react';

// export default function HowItWorks() {
//   return (
//     <section id="how-it-works" className="py-24 bg-gradient-to-b from-dark-900 to-dark-800">
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
//           Optimized Workflow in <span className="text-primary-400">3 Steps</span>
//         </h2>

//         <div className="grid md:grid-cols-3 gap-12 relative">
//           {/* Connector Line */}
//           <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>

//           {[
//             { step: '01', title: 'Upload Media', desc: 'Drag & drop video or image files. Supports MP4, MOV, PNG, JPG, and WebP.' },
//             { step: '02', title: 'Select AI Model', desc: 'Choose from specialized models for Upscaling, Denoising, or Frame Interpolation.' },
//             { step: '03', title: 'Process & Download', desc: 'Our GPU cluster handles the heavy lifting. Preview results and download instantly.' }
//           ].map((item, idx) => (
//             <div key={idx} className="relative flex flex-col items-center text-center z-10">
//               <div className="w-24 h-24 rounded-full bg-dark-800 border-4 border-dark-900 shadow-xl flex items-center justify-center mb-6 relative group">
//                  <div className="absolute inset-0 rounded-full bg-primary-500 opacity-20 blur-lg group-hover:opacity-40 transition-opacity"></div>
//                  <span className="text-2xl font-bold text-white">{item.step}</span>
//               </div>
//               <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
//               <p className="text-slate-400 max-w-xs">{item.desc}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
import React from 'react';

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-gradient-to-b from-[#1e293b] to-[#0f172a]">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-10 md:mb-16">
          Optimized Workflow in <span className="text-blue-400">3 Steps</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

          {[
            { step: '01', title: 'Upload Media', desc: 'Drag & drop video or image files. Supports MP4, MOV, PNG, JPG, and WebP.' },
            { step: '02', title: 'Select AI Model', desc: 'Choose from specialized models for Upscaling, Denoising, or Frame Interpolation.' },
            { step: '03', title: 'Process & Download', desc: 'Our GPU cluster handles the heavy lifting. Preview results and download instantly.' }
          ].map((item, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center z-10">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#0f172a] border-4 border-[#1e293b] shadow-xl flex items-center justify-center mb-4 md:mb-6 relative group">
                 <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 blur-lg group-hover:opacity-40 transition-opacity"></div>
                 <span className="text-xl md:text-2xl font-bold text-white">{item.step}</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">{item.title}</h3>
              <p className="text-slate-400 max-w-xs text-sm md:text-base">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}