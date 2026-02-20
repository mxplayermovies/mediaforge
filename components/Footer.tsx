// import React from 'react';
// import Link from 'next/link';

// export default function Footer() {
//   return (
//     <footer className="bg-dark-900 border-t border-white/5 pt-20 pb-10">
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
//           <div className="col-span-1 md:col-span-1">
//             <Link href="/" className="flex items-center gap-2 mb-6">
//               <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                 </svg>
//               </div>
//               <span className="font-bold text-xl text-white">Media<span className="text-primary-400">Processor</span></span>
//             </Link>
//             <p className="text-slate-500 text-sm leading-relaxed mb-6">
//               The premier destination for AI-powered media transformation. 
//               We build tools that empower creators to achieve professional results instantly.
//             </p>
//           </div>

//           <div>
//             <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Product</h4>
//             <ul className="space-y-3 text-sm text-slate-400">
//               <li><Link href="/features" className="hover:text-primary-400 transition-colors">Video Upscaler</Link></li>
//               <li><Link href="/features" className="hover:text-primary-400 transition-colors">Image Enhancer</Link></li>
//               <li><Link href="/studio" className="hover:text-primary-400 transition-colors">Converter Studio</Link></li>
//               <li><Link href="/api" className="hover:text-primary-400 transition-colors">API for Developers</Link></li>
//             </ul>
//           </div>

//           <div>
//             <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Company</h4>
//             <ul className="space-y-3 text-sm text-slate-400">
//               <li><Link href="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
//               <li><Link href="/how-it-works" className="hover:text-primary-400 transition-colors">How It Works</Link></li>
//               <li><Link href="/careers" className="hover:text-primary-400 transition-colors">Careers</Link></li>
//               <li><Link href="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
//             </ul>
//           </div>

//           <div>
//             <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Support</h4>
//             <ul className="space-y-3 text-sm text-slate-400">
//               <li><Link href="/faq" className="hover:text-primary-400 transition-colors">FAQ / Help Center</Link></li>
//               <li><Link href="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link></li>
//               <li><Link href="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link></li>
//               <li><Link href="/cookie-policy" className="hover:text-primary-400 transition-colors">Cookie Policy</Link></li>
//             </ul>
//           </div>
//         </div>

//         <div className="border-t border-white/5 pt-8 text-center flex flex-col md:flex-row justify-between items-center gap-4">
//           <p className="text-slate-600 text-sm">
//             © {new Date().getFullYear()} Media Processor Pro. All rights reserved.
//           </p>
//           <div className="flex items-center gap-2 text-xs text-slate-600">
//             <span className="w-2 h-2 rounded-full bg-green-500"></span>
//             System Status: Operational
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-[#0f172a] border-t border-slate-200 dark:border-white/5 pt-12 md:pt-20 pb-10 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 md:mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-white">Media<span className="text-blue-600 dark:text-blue-500">Forge</span></span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              The premier destination for AI-powered media transformation. 
              We build tools that empower creators to achieve professional results instantly.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-3 md:grid-cols-3">
              <div>
                <h4 className="text-slate-900 dark:text-white font-bold mb-4 md:mb-6 text-sm uppercase tracking-wider">Product</h4>
                <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                  <li><Link href="/video-upscaler" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 block">Video Upscaler</Link></li>
                  <li><Link href="/image-enhancer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 block">Image Enhancer</Link></li>
                  <li><Link href="/studio" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 block">Converter Studio</Link></li>
                  <li><Link href="/developers" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 block">API for Developers</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-slate-900 dark:text-white font-bold mb-4 md:mb-6 text-sm uppercase tracking-wider">Company</h4>
                <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                  <li><Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 block">About Us</Link></li>
                  <li><Link href="/how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 block">How It Works</Link></li>
                  <li><Link href="/careers" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 block">Careers</Link></li>
                  <li><Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 block">Contact</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-slate-900 dark:text-white font-bold mb-4 md:mb-6 text-sm uppercase tracking-wider">Support</h4>
                <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
                  <li><Link href="/faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 block">FAQ / Help Center</Link></li>
                  <li><Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 block">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 block">Terms of Service</Link></li>
                  <li><Link href="/cookie-policy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-1 block">Cookie Policy</Link></li>
                </ul>
              </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-white/5 pt-8 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} MediaForge. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            System Status: Operational
          </div>
        </div>
      </div>
    </footer>
  );
}