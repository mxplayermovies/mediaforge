
// export class VoiceManager {
//   private synth: SpeechSynthesis | null = null;
//   private availableVoices: SpeechSynthesisVoice[] = []; // Eligible voices (Microsoft English, then any English)
//   private lastMilestone = -1;
//   private initialized = false;

//   constructor() {
//     if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
//       this.synth = window.speechSynthesis;
//       // Some browsers load voices asynchronously
//       if (this.synth.onvoiceschanged !== undefined) {
//         this.synth.onvoiceschanged = () => this.loadVoices();
//       }
//       this.loadVoices();
//     }
//   }

//   /**
//    * Loads and filters voices:
//    * 1. All Microsoft English voices (lang starts with 'en' and name includes 'Microsoft')
//    * 2. If none found, fallback to any English voice
//    */
//   private loadVoices() {
//     if (!this.synth) return;
//     const voices = this.synth.getVoices();

//     // Microsoft English voices (preferred)
//     const microsoftEnglish = voices.filter(
//       v => v.lang.startsWith('en') && v.name.includes('Microsoft')
//     );

//     // If Microsoft voices exist, use them; otherwise use any English voice
//     this.availableVoices = microsoftEnglish.length > 0
//       ? microsoftEnglish
//       : voices.filter(v => v.lang.startsWith('en'));

//     if (!this.initialized) {
//       console.log(`Voice engine initialized with ${this.availableVoices.length} eligible voices.`);
//       if (this.availableVoices.length > 0) {
//         console.log(`Sample voice: ${this.availableVoices[0].name}`);
//       }
//       this.initialized = true;
//     }
//   }

//   /**
//    * Returns a random voice from the available list.
//    * If the list is empty, attempts to reload voices and returns the first English voice (or null).
//    */
//   private getRandomVoice(): SpeechSynthesisVoice | null {
//     // Reload voices if none are available (sometimes needed after browser updates)
//     if (this.availableVoices.length === 0) {
//       this.loadVoices();
//     }

//     if (this.availableVoices.length === 0) {
//       console.warn('No English voices found. Speech will use default system voice.');
//       return null;
//     }

//     const randomIndex = Math.floor(Math.random() * this.availableVoices.length);
//     return this.availableVoices[randomIndex];
//   }

//   /**
//    * Speaks the given text using a randomly selected voice.
//    * @param text - The text to speak
//    * @param force - If true, cancels any ongoing speech before speaking
//    */
//   public speak(text: string, force: boolean = true) {
//     if (!this.synth) return;

//     if (force) {
//       this.synth.cancel();
//     }

//     const utterance = new SpeechSynthesisUtterance(text);
//     const selectedVoice = this.getRandomVoice();

//     if (selectedVoice) {
//       utterance.voice = selectedVoice;
//       console.log(`Speaking with voice: ${selectedVoice.name}`);
//     }

//     // Natural speech settings
//     utterance.rate = 1.0;
//     utterance.pitch = 1.0;
//     utterance.volume = 1.0;

//     this.synth.speak(utterance);
//   }

//   /**
//    * Announces progress milestones (e.g., 10%, 25%, 50%, 75%, 90%).
//    * Uses the same random voice selection.
//    */
//   public announceProgress(progress: number) {
//     const milestones = [10, 25, 50, 75, 90];
//     const crossedMilestone = milestones.find(m => progress >= m && this.lastMilestone < m);

//     if (crossedMilestone) {
//       this.speak(`${crossedMilestone}% processing completed.`);
//       this.lastMilestone = crossedMilestone;
//     }
//   }

//   /**
//    * Resets the milestone tracker and cancels any ongoing speech.
//    */
//   public reset() {
//     this.lastMilestone = -1;
//     if (this.synth) {
//       this.synth.cancel();
//     }
//   }
// }

// export const voiceManager = new VoiceManager();



























































// export class VoiceManager {
//   private synth: SpeechSynthesis | null = null;
//   private availableVoices: SpeechSynthesisVoice[] = []; 
//   private lastMilestone = -1;
//   private initialized = false;
//   private currentLang = 'en'; // Default to English

//   constructor() {
//     if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
//       this.synth = window.speechSynthesis;
//       // Some browsers load voices asynchronously
//       if (this.synth.onvoiceschanged !== undefined) {
//         this.synth.onvoiceschanged = () => this.loadVoices();
//       }
//       this.loadVoices();
//     }
//   }

//   /**
//    * Sets the current language for TTS (e.g., 'es', 'fr', 'zh-CN').
//    * Reloads voices to match the new language.
//    */
//   public setLanguage(lang: string) {
//     // Google Translate uses codes like 'zh-CN', 'es', etc.
//     // We normalize to match speech synthesis voice tags if needed.
//     this.currentLang = lang;
//     console.log(`VoiceManager: Language set to ${this.currentLang}`);
//     this.loadVoices();
//   }

//   /**
//    * Loads and filters voices based on the current language.
//    * 1. Tries to find voices matching the current language code.
//    * 2. Prioritizes 'Microsoft' or 'Google' voices for better quality if available.
//    */
//   private loadVoices() {
//     if (!this.synth) return;
//     const voices = this.synth.getVoices();

//     // Filter voices that start with the current language code (e.g., 'en', 'es', 'fr')
//     let langVoices = voices.filter(v => v.lang.startsWith(this.currentLang));

//     // If exact match fails (e.g. 'zh-CN' vs 'zh'), try broader match
//     if (langVoices.length === 0 && this.currentLang.includes('-')) {
//         const baseLang = this.currentLang.split('-')[0];
//         langVoices = voices.filter(v => v.lang.startsWith(baseLang));
//     }

//     // STRICT FALLBACK: If no voices found for the detected language, force English
//     if (langVoices.length === 0) {
//         console.warn(`No voices found for ${this.currentLang}, forcing fallback to English.`);
//         langVoices = voices.filter(v => v.lang.startsWith('en'));
//     }

//     // Priority: Microsoft > Google > Others
//     // The user specifically requested Microsoft Edge TTS priority or fallback to English
//     const microsoftVoices = langVoices.filter(v => v.name.includes('Microsoft'));
//     const googleVoices = langVoices.filter(v => v.name.includes('Google'));
    
//     if (microsoftVoices.length > 0) {
//         this.availableVoices = microsoftVoices;
//     } else if (googleVoices.length > 0) {
//         this.availableVoices = googleVoices;
//     } else {
//         this.availableVoices = langVoices;
//     }
    
//     // Final Safety Net: If somehow we still have no voices (e.g. even English failed), try to grab ANY English voice
//     if (this.availableVoices.length === 0) {
//          this.availableVoices = voices.filter(v => v.lang.startsWith('en'));
//     }

//     if (!this.initialized) {
//       console.log(`Voice engine initialized with ${this.availableVoices.length} eligible voices for ${this.currentLang}.`);
//       this.initialized = true;
//     }
//   }

//   /**
//    * Returns a random voice from the available list.
//    * If the list is empty, attempts to reload voices and returns the first available voice.
//    */
//   private getRandomVoice(): SpeechSynthesisVoice | null {
//     // Reload voices if none are available (sometimes needed after browser updates)
//     if (this.availableVoices.length === 0) {
//       this.loadVoices();
//     }

//     if (this.availableVoices.length === 0) {
//       console.warn('No suitable voices found. Speech will use default system voice.');
//       return null;
//     }

//     const randomIndex = Math.floor(Math.random() * this.availableVoices.length);
//     return this.availableVoices[randomIndex];
//   }

//   /**
//    * Speaks the given text using a randomly selected voice matching the current language.
//    * @param text - The text to speak
//    * @param force - If true, cancels any ongoing speech before speaking
//    */
//   public speak(text: string, force: boolean = true) {
//     if (!this.synth) return;

//     if (force) {
//       this.synth.cancel();
//     }

//     const utterance = new SpeechSynthesisUtterance(text);
//     const selectedVoice = this.getRandomVoice();

//     if (selectedVoice) {
//       utterance.voice = selectedVoice;
//       // console.log(`Speaking with voice: ${selectedVoice.name} (${selectedVoice.lang})`);
//     }

//     // Natural speech settings
//     utterance.rate = 1.0;
//     utterance.pitch = 1.0;
//     utterance.volume = 1.0;

//     this.synth.speak(utterance);
//   }

//   /**
//    * Announces progress milestones (e.g., 10%, 25%, 50%, 75%, 90%).
//    * Uses the same random voice selection.
//    */
//   public announceProgress(progress: number) {
//     const milestones = [10, 25, 50, 75, 90];
//     const crossedMilestone = milestones.find(m => progress >= m && this.lastMilestone < m);

//     if (crossedMilestone) {
//       this.speak(`${crossedMilestone}% processing completed.`);
//       this.lastMilestone = crossedMilestone;
//     }
//   }

//   /**
//    * Resets the milestone tracker and cancels any ongoing speech.
//    */
//   public reset() {
//     this.lastMilestone = -1;
//     if (this.synth) {
//       this.synth.cancel();
//     }
//   }
// }

// export const voiceManager = new VoiceManager();



























































// export class VoiceManager {
//   private synth: SpeechSynthesis | null = null;
//   private voice: SpeechSynthesisVoice | null = null;
//   private lastMilestone = -1;
//   private initialized = false;

//   constructor() {
//     if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
//       this.synth = window.speechSynthesis;
//       if (this.synth.onvoiceschanged !== undefined) {
//         this.synth.onvoiceschanged = () => this.loadVoices();
//       }
//       this.loadVoices();
//     }
//   }

//   private loadVoices() {
//     if (!this.synth) return;
//     const voices = this.synth.getVoices();
//     this.voice = voices.find(v => v.name.includes('Google') && v.lang.includes('en'))
//               || voices.find(v => v.lang.startsWith('en'))
//               || null;
//     this.initialized = true;
//   }

//   public speak(text: string, force: boolean = true) {
//     if (!this.synth) return;
//     if (!this.voice) this.loadVoices();
//     if (force) this.synth.cancel();

//     const utterance = new SpeechSynthesisUtterance(text);
//     if (this.voice) utterance.voice = this.voice;
//     this.synth.speak(utterance);
//   }

//   public reset() {
//     if (this.synth) this.synth.cancel();
//   }
// }

// export const voiceManager = new VoiceManager();











// export class VoiceManager {
//   private synth: SpeechSynthesis | null = null;
//   private availableVoices: SpeechSynthesisVoice[] = []; 
//   private lastMilestone = -1;
//   private initialized = false;
//   private currentLang = 'en'; // Default to English

//   constructor() {
//     if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
//       this.synth = window.speechSynthesis;
//       // Some browsers load voices asynchronously
//       if (this.synth.onvoiceschanged !== undefined) {
//         this.synth.onvoiceschanged = () => this.loadVoices();
//       }
//       this.loadVoices();
      
//       // Mobile Support: Retry loading voices as they might load asynchronously
//       setTimeout(() => this.loadVoices(), 500);
//     }
//   }

//   /**
//    * Sets the current language for TTS (e.g., 'es', 'fr', 'zh-CN').
//    * Reloads voices to match the new language.
//    */
//   public setLanguage(lang: string) {
//     // Google Translate uses codes like 'zh-CN', 'es', etc.
//     // We normalize to match speech synthesis voice tags if needed.
//     this.currentLang = lang;
//     console.log(`VoiceManager: Language set to ${this.currentLang}`);
//     this.loadVoices();
//   }

//   /**
//    * Loads and filters voices based on the current language.
//    * 1. Tries to find voices matching the current language code.
//    * 2. Prioritizes 'Microsoft' or 'Google' voices for better quality if available.
//    */
//   private loadVoices() {
//     if (!this.synth) return;
//     const voices = this.synth.getVoices();

//     if (voices.length === 0) return; // Mobile Support: Don't process if empty

//     // Filter voices that start with the current language code (e.g., 'en', 'es', 'fr')
//     let langVoices = voices.filter(v => v.lang.startsWith(this.currentLang));

//     // If exact match fails (e.g. 'zh-CN' vs 'zh'), try broader match
//     if (langVoices.length === 0 && this.currentLang.includes('-')) {
//         const baseLang = this.currentLang.split('-')[0];
//         langVoices = voices.filter(v => v.lang.startsWith(baseLang));
//     }

//     // STRICT FALLBACK: If no voices found for the detected language, force English
//     if (langVoices.length === 0) {
//         console.warn(`No voices found for ${this.currentLang}, forcing fallback to English.`);
//         langVoices = voices.filter(v => v.lang.startsWith('en'));
//     }

//     // Priority: Microsoft > Google > Others
//     // The user specifically requested Microsoft Edge TTS priority or fallback to English
//     const microsoftVoices = langVoices.filter(v => v.name.includes('Microsoft'));
//     const googleVoices = langVoices.filter(v => v.name.includes('Google'));
    
//     if (microsoftVoices.length > 0) {
//         this.availableVoices = microsoftVoices;
//     } else if (googleVoices.length > 0) {
//         this.availableVoices = googleVoices;
//     } else {
//         this.availableVoices = langVoices;
//     }
    
//     // Final Safety Net: If somehow we still have no voices (e.g. even English failed), try to grab ANY English voice
//     if (this.availableVoices.length === 0) {
//          this.availableVoices = voices.filter(v => v.lang.startsWith('en'));
//     }

//     if (!this.initialized) {
//       console.log(`Voice engine initialized with ${this.availableVoices.length} eligible voices for ${this.currentLang}.`);
//       this.initialized = true;
//     }
//   }

//   /**
//    * Returns a random voice from the available list.
//    * If the list is empty, attempts to reload voices and returns the first available voice.
//    */
//   private getRandomVoice(): SpeechSynthesisVoice | null {
//     // Reload voices if none are available (sometimes needed after browser updates)
//     if (this.availableVoices.length === 0) {
//       this.loadVoices();
//     }

//     if (this.availableVoices.length === 0) {
//       console.warn('No suitable voices found. Speech will use default system voice.');
//       return null;
//     }

//     const randomIndex = Math.floor(Math.random() * this.availableVoices.length);
//     return this.availableVoices[randomIndex];
//   }

//   /**
//    * Mobile Support: Unlock audio context
//    */
//   public unlock() {
//     if (this.synth) {
//         this.synth.resume();
//         this.loadVoices();
//     }
//   }

//   /**
//    * Speaks the given text using a randomly selected voice matching the current language.
//    * @param text - The text to speak
//    * @param force - If true, cancels any ongoing speech before speaking
//    */
//   public speak(text: string, force: boolean = true) {
//     if (!this.synth) return;

//     if (force) {
//       this.synth.cancel();
//     }

//     const utterance = new SpeechSynthesisUtterance(text);
//     const selectedVoice = this.getRandomVoice();

//     if (selectedVoice) {
//       utterance.voice = selectedVoice;
//       // Mobile Support: Explicitly set language for Android compatibility
//       utterance.lang = selectedVoice.lang;
//       // console.log(`Speaking with voice: ${selectedVoice.name} (${selectedVoice.lang})`);
//     }

//     // Natural speech settings
//     utterance.rate = 1.0;
//     utterance.pitch = 1.0;
//     utterance.volume = 1.0;

//     this.synth.speak(utterance);
//   }

//   /**
//    * Announces progress milestones (e.g., 10%, 25%, 50%, 75%, 90%).
//    * Uses the same random voice selection.
//    */
//   public announceProgress(progress: number) {
//     const milestones = [10, 25, 50, 75, 90];
//     const crossedMilestone = milestones.find(m => progress >= m && this.lastMilestone < m);

//     if (crossedMilestone) {
//       this.speak(`${crossedMilestone}% processing completed.`);
//       this.lastMilestone = crossedMilestone;
//     }
//   }

//   /**
//    * Resets the milestone tracker and cancels any ongoing speech.
//    */
//   public reset() {
//     this.lastMilestone = -1;
//     if (this.synth) {
//       this.synth.cancel();
//     }
//   }
// }

// export const voiceManager = new VoiceManager();















// export class VoiceManager {
//   private synth: SpeechSynthesis | null = null;
//   private availableVoices: SpeechSynthesisVoice[] = []; 
//   private lastMilestone = -1;
//   private initialized = false;
//   private currentLang = 'en'; // Default to English

//   constructor() {
//     if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
//       this.synth = window.speechSynthesis;
//       // Some browsers load voices asynchronously
//       if (this.synth.onvoiceschanged !== undefined) {
//         this.synth.onvoiceschanged = () => this.loadVoices();
//       }
//       this.loadVoices();
      
//       // Mobile Support: Retry loading voices as they might load asynchronously
//       setTimeout(() => this.loadVoices(), 500);
//     }
//   }

//   /**
//    * Sets the current language for TTS (e.g., 'es', 'fr', 'zh-CN').
//    * Reloads voices to match the new language.
//    */
//   public setLanguage(lang: string) {
//     // Google Translate uses codes like 'zh-CN', 'es', etc.
//     // We normalize to match speech synthesis voice tags if needed.
//     this.currentLang = lang;
//     console.log(`VoiceManager: Language set to ${this.currentLang}`);
//     this.loadVoices();
//   }

//   /**
//    * Loads and filters voices based on the current language.
//    * 1. Tries to find voices matching the current language code.
//    * 2. Prioritizes 'Microsoft' or 'Google' voices for better quality if available.
//    */
//   private loadVoices() {
//     if (!this.synth) return;
//     const voices = this.synth.getVoices();

//     if (voices.length === 0) return; // Mobile Support: Don't process if empty

//     // Filter voices that start with the current language code (e.g., 'en', 'es', 'fr')
//     let langVoices = voices.filter(v => v.lang.startsWith(this.currentLang));

//     // If exact match fails (e.g. 'zh-CN' vs 'zh'), try broader match
//     if (langVoices.length === 0 && this.currentLang.includes('-')) {
//         const baseLang = this.currentLang.split('-')[0];
//         langVoices = voices.filter(v => v.lang.startsWith(baseLang));
//     }

//     // STRICT FALLBACK: If no voices found for the detected language, force English
//     if (langVoices.length === 0) {
//         console.warn(`No voices found for ${this.currentLang}, forcing fallback to English.`);
//         langVoices = voices.filter(v => v.lang.startsWith('en'));
//     }

//     // Priority: Microsoft > Google > Others
//     // The user specifically requested Microsoft Edge TTS priority or fallback to English
//     const microsoftVoices = langVoices.filter(v => v.name.includes('Microsoft'));
//     const googleVoices = langVoices.filter(v => v.name.includes('Google'));
    
//     if (microsoftVoices.length > 0) {
//         this.availableVoices = microsoftVoices;
//     } else if (googleVoices.length > 0) {
//         this.availableVoices = googleVoices;
//     } else {
//         this.availableVoices = langVoices;
//     }
    
//     // Final Safety Net: If somehow we still have no voices (e.g. even English failed), try to grab ANY English voice
//     if (this.availableVoices.length === 0) {
//          this.availableVoices = voices.filter(v => v.lang.startsWith('en'));
//     }

//     if (!this.initialized) {
//       console.log(`Voice engine initialized with ${this.availableVoices.length} eligible voices for ${this.currentLang}.`);
//       this.initialized = true;
//     }
//   }

//   /**
//    * Returns a random voice from the available list.
//    * If the list is empty, attempts to reload voices and returns the first available voice.
//    */
//   private getRandomVoice(): SpeechSynthesisVoice | null {
//     // Reload voices if none are available (sometimes needed after browser updates)
//     if (this.availableVoices.length === 0) {
//       this.loadVoices();
//     }

//     if (this.availableVoices.length === 0) {
//       console.warn('No suitable voices found. Speech will use default system voice.');
//       return null;
//     }

//     const randomIndex = Math.floor(Math.random() * this.availableVoices.length);
//     return this.availableVoices[randomIndex];
//   }

//   /**
//    * Mobile Support: Unlock audio context
//    */
//   public unlock() {
//     if (this.synth) {
//         this.synth.resume();
//         this.loadVoices();
//     }
//   }

//   /**
//    * Speaks the given text using a randomly selected voice matching the current language.
//    * @param text - The text to speak
//    * @param force - If true, cancels any ongoing speech before speaking
//    */
//   public speak(text: string, force: boolean = true) {
//     if (!this.synth) return;

//     if (force) {
//       this.synth.cancel();
//     }

//     const utterance = new SpeechSynthesisUtterance(text);
//     const selectedVoice = this.getRandomVoice();

//     if (selectedVoice) {
//       utterance.voice = selectedVoice;
//       // Mobile Support: Explicitly set language for Android compatibility
//       utterance.lang = selectedVoice.lang;
//       // console.log(`Speaking with voice: ${selectedVoice.name} (${selectedVoice.lang})`);
//     }

//     // Natural speech settings
//     utterance.rate = 1.0;
//     utterance.pitch = 1.0;
//     utterance.volume = 1.0;

//     this.synth.speak(utterance);
//   }

//   /**
//    * Announces progress milestones (e.g., 10%, 25%, 50%, 75%, 90%).
//    * Uses the same random voice selection.
//    */
//   public announceProgress(progress: number) {
//     const milestones = [10, 25, 50, 75, 90];
//     const crossedMilestone = milestones.find(m => progress >= m && this.lastMilestone < m);

//     if (crossedMilestone) {
//       this.speak(`${crossedMilestone}% processing completed.`);
//       this.lastMilestone = crossedMilestone;
//     }
//   }

//   /**
//    * Resets the milestone tracker and cancels any ongoing speech.
//    */
//   public reset() {
//     this.lastMilestone = -1;
//     if (this.synth) {
//       this.synth.cancel();
//     }
//   }
// }

// export const voiceManager = new VoiceManager();























// export class VoiceManager {
//   private synth: SpeechSynthesis | null = null;
//   private availableVoices: SpeechSynthesisVoice[] = [];
//   private lastMilestone = -1;
//   private initialized = false;
//   private currentLang = 'en'; // Default to English

//   constructor() {
//     if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
//       this.synth = window.speechSynthesis;
//       // Some browsers load voices asynchronously
//       if (this.synth.onvoiceschanged !== undefined) {
//         this.synth.onvoiceschanged = () => this.loadVoices();
//       }
//       this.loadVoices();

//       // Mobile Support: Retry loading voices as they might load asynchronously
//       setTimeout(() => this.loadVoices(), 500);
//     }
//   }

//   /**
//    * Sets the current language for TTS (e.g., 'es', 'fr', 'zh-CN').
//    * Reloads voices to match the new language.
//    */
//   public setLanguage(lang: string) {
//     this.currentLang = lang;
//     console.log(`VoiceManager: Language set to ${this.currentLang}`);
//     this.loadVoices();
//   }

//   /**
//    * Loads and filters voices based on the current language.
//    * 1. Tries to find voices matching the current language code.
//    * 2. If none are found, falls back to English voices (but does NOT change this.currentLang).
//    * 3. Prioritizes 'Microsoft' or 'Google' voices for better quality if available.
//    */
//   private loadVoices() {
//     if (!this.synth) return;
//     const voices = this.synth.getVoices();

//     if (voices.length === 0) return; // Mobile Support: Don't process if empty

//     // Filter voices that start with the current language code (e.g., 'en', 'es', 'fr')
//     let langVoices = voices.filter(v => v.lang.startsWith(this.currentLang));

//     // If exact match fails (e.g. 'zh-CN' vs 'zh'), try broader match
//     if (langVoices.length === 0 && this.currentLang.includes('-')) {
//       const baseLang = this.currentLang.split('-')[0];
//       langVoices = voices.filter(v => v.lang.startsWith(baseLang));
//     }

//     // STRICT FALLBACK: If no voices found for the detected language, use English voices
//     // but do NOT change this.currentLang, so the system can later switch back if voices appear.
//     if (langVoices.length === 0) {
//       console.warn(`No voices found for ${this.currentLang}, falling back to English for this session.`);
//       langVoices = voices.filter(v => v.lang.startsWith('en'));

//       // OPTIONAL: Uncomment the next line if you want to permanently lock the language to English after a fallback.
//       // this.currentLang = 'en';
//     }

//     // Priority: Microsoft > Google > Others
//     const microsoftVoices = langVoices.filter(v => v.name.includes('Microsoft'));
//     const googleVoices = langVoices.filter(v => v.name.includes('Google'));

//     if (microsoftVoices.length > 0) {
//       this.availableVoices = microsoftVoices;
//     } else if (googleVoices.length > 0) {
//       this.availableVoices = googleVoices;
//     } else {
//       this.availableVoices = langVoices;
//     }

//     // Final Safety Net: If we somehow still have no voices (e.g., even English failed), try any English voice
//     if (this.availableVoices.length === 0) {
//       this.availableVoices = voices.filter(v => v.lang.startsWith('en'));
//     }

//     if (!this.initialized) {
//       console.log(`Voice engine initialized with ${this.availableVoices.length} eligible voices for ${this.currentLang}.`);
//       this.initialized = true;
//     }
//   }

//   /**
//    * Returns a random voice from the available list.
//    * If the list is empty, attempts to reload voices and returns the first available voice.
//    */
//   private getRandomVoice(): SpeechSynthesisVoice | null {
//     // Reload voices if none are available (sometimes needed after browser updates)
//     if (this.availableVoices.length === 0) {
//       this.loadVoices();
//     }

//     if (this.availableVoices.length === 0) {
//       console.warn('No suitable voices found. Speech will use default system voice.');
//       return null;
//     }

//     const randomIndex = Math.floor(Math.random() * this.availableVoices.length);
//     return this.availableVoices[randomIndex];
//   }

//   /**
//    * Mobile Support: Unlock audio context
//    */
//   public unlock() {
//     if (this.synth) {
//       this.synth.resume();
//       this.loadVoices();
//     }
//   }

//   /**
//    * Speaks the given text using a randomly selected voice matching the current language.
//    * @param text - The text to speak
//    * @param force - If true, cancels any ongoing speech before speaking
//    */
//   public speak(text: string, force: boolean = true) {
//     if (!this.synth) return;

//     if (force) {
//       this.synth.cancel();
//     }

//     const utterance = new SpeechSynthesisUtterance(text);
//     const selectedVoice = this.getRandomVoice();

//     if (selectedVoice) {
//       utterance.voice = selectedVoice;
//       // Mobile Support: Explicitly set language for Android compatibility
//       utterance.lang = selectedVoice.lang;
//     }

//     // Natural speech settings
//     utterance.rate = 1.0;
//     utterance.pitch = 1.0;
//     utterance.volume = 1.0;

//     this.synth.speak(utterance);
//   }

//   /**
//    * Announces progress milestones (e.g., 10%, 25%, 50%, 75%, 90%).
//    * Uses the same random voice selection.
//    */
//   public announceProgress(progress: number) {
//     const milestones = [10, 25, 50, 75, 90];
//     const crossedMilestone = milestones.find(m => progress >= m && this.lastMilestone < m);

//     if (crossedMilestone) {
//       this.speak(`${crossedMilestone}% processing completed.`);
//       this.lastMilestone = crossedMilestone;
//     }
//   }

//   /**
//    * Resets the milestone tracker and cancels any ongoing speech.
//    */
//   public reset() {
//     this.lastMilestone = -1;
//     if (this.synth) {
//       this.synth.cancel();
//     }
//   }
// }

// export const voiceManager = new VoiceManager();































// export class VoiceManager {
//   private synth: SpeechSynthesis | null = null;
//   private availableVoices: SpeechSynthesisVoice[] = [];
//   private lastMilestone = -1;
//   private initialized = false;
//   private currentLang = 'en'; // Default to English

//   constructor() {
//     if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
//       this.synth = window.speechSynthesis;
//       // Some browsers load voices asynchronously
//       if (this.synth.onvoiceschanged !== undefined) {
//         this.synth.onvoiceschanged = () => this.loadVoices();
//       }
//       this.loadVoices();

//       // Mobile Support: Retry loading voices as they might load asynchronously
//       setTimeout(() => this.loadVoices(), 500);
//     }
//   }

//   /**
//    * Sets the current language for TTS (e.g., 'es', 'fr', 'zh-CN').
//    * Reloads voices to match the new language.
//    */
//   public setLanguage(lang: string) {
//     this.currentLang = lang;
//     console.log(`VoiceManager: Language set to ${this.currentLang}`);
//     this.loadVoices();
//   }

//   /**
//    * Loads and filters voices based on the current language.
//    * 1. Tries to find voices matching the current language code.
//    * 2. If none are found, falls back to English voices (but does NOT change this.currentLang).
//    * 3. Now includes ALL voices matching the language – both male and female.
//    */
//   private loadVoices() {
//     if (!this.synth) return;
//     const voices = this.synth.getVoices();

//     if (voices.length === 0) return; // Mobile Support: Don't process if empty

//     // Filter voices that start with the current language code (e.g., 'en', 'es', 'fr')
//     let langVoices = voices.filter(v => v.lang.startsWith(this.currentLang));

//     // If exact match fails (e.g. 'zh-CN' vs 'zh'), try broader match
//     if (langVoices.length === 0 && this.currentLang.includes('-')) {
//       const baseLang = this.currentLang.split('-')[0];
//       langVoices = voices.filter(v => v.lang.startsWith(baseLang));
//     }

//     // STRICT FALLBACK: If no voices found for the detected language, use English voices
//     // but do NOT change this.currentLang, so the system can later switch back if voices appear.
//     if (langVoices.length === 0) {
//       console.warn(`No voices found for ${this.currentLang}, falling back to English for this session.`);
//       langVoices = voices.filter(v => v.lang.startsWith('en'));
//     }

//     // 🔥 FIX: Use ALL voices matching the language – this includes both male and female.
//     // No more prioritisation of Microsoft/Google – we want gender diversity.
//     this.availableVoices = langVoices;

//     // Final Safety Net: If we somehow still have no voices (e.g., even English failed), try any English voice
//     if (this.availableVoices.length === 0) {
//       this.availableVoices = voices.filter(v => v.lang.startsWith('en'));
//     }

//     if (!this.initialized) {
//       console.log(`Voice engine initialized with ${this.availableVoices.length} eligible voices for ${this.currentLang}.`);
//       this.initialized = true;
//     }
//   }

//   /**
//    * Returns a random voice from the available list.
//    * If the list is empty, attempts to reload voices and returns the first available voice.
//    */
//   private getRandomVoice(): SpeechSynthesisVoice | null {
//     // Reload voices if none are available (sometimes needed after browser updates)
//     if (this.availableVoices.length === 0) {
//       this.loadVoices();
//     }

//     if (this.availableVoices.length === 0) {
//       console.warn('No suitable voices found. Speech will use default system voice.');
//       return null;
//     }

//     const randomIndex = Math.floor(Math.random() * this.availableVoices.length);
//     return this.availableVoices[randomIndex];
//   }

//   /**
//    * Mobile Support: Unlock audio context
//    */
//   public unlock() {
//     if (this.synth) {
//       this.synth.resume();
//       this.loadVoices();
//     }
//   }

//   /**
//    * Speaks the given text using a randomly selected voice matching the current language.
//    * @param text - The text to speak
//    * @param force - If true, cancels any ongoing speech before speaking
//    */
//   public speak(text: string, force: boolean = true) {
//     if (!this.synth) return;

//     if (force) {
//       this.synth.cancel();
//     }

//     const utterance = new SpeechSynthesisUtterance(text);
//     const selectedVoice = this.getRandomVoice();

//     if (selectedVoice) {
//       utterance.voice = selectedVoice;
//       // Mobile Support: Explicitly set language for Android compatibility
//       utterance.lang = selectedVoice.lang;
//     }

//     // Natural speech settings
//     utterance.rate = 1.0;
//     utterance.pitch = 1.0;
//     utterance.volume = 1.0;

//     this.synth.speak(utterance);
//   }

//   /**
//    * Announces progress milestones (e.g., 10%, 25%, 50%, 75%, 90%).
//    * Uses the same random voice selection.
//    */
//   public announceProgress(progress: number) {
//     const milestones = [10, 25, 50, 75, 90];
//     const crossedMilestone = milestones.find(m => progress >= m && this.lastMilestone < m);

//     if (crossedMilestone) {
//       this.speak(`${crossedMilestone}% processing completed.`);
//       this.lastMilestone = crossedMilestone;
//     }
//   }

//   /**
//    * Resets the milestone tracker and cancels any ongoing speech.
//    */
//   public reset() {
//     this.lastMilestone = -1;
//     if (this.synth) {
//       this.synth.cancel();
//     }
//   }
// }

// export const voiceManager = new VoiceManager();

























// export class VoiceManager {
//   private synth: SpeechSynthesis | null = null;
//   private availableVoices: SpeechSynthesisVoice[] = [];
//   private lastMilestone = -1;
//   private initialized = false;
//   private currentLang = 'en'; // Default to English

//   constructor() {
//     if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
//       this.synth = window.speechSynthesis;
//       // Some browsers load voices asynchronously
//       if (this.synth.onvoiceschanged !== undefined) {
//         this.synth.onvoiceschanged = () => this.loadVoices();
//       }
//       this.loadVoices();

//       // Mobile Support: Retry loading voices as they might load asynchronously
//       setTimeout(() => this.loadVoices(), 500);
//     }
//   }

//   /**
//    * Sets the current language for TTS (e.g., 'hi', 'es', 'fr', 'zh-CN').
//    * Call this when the user changes language (e.g., via Google Translate).
//    * Reloads voices to match the new language.
//    */
//   public setLanguage(lang: string) {
//     this.currentLang = lang;
//     console.log(`VoiceManager: Language set to ${this.currentLang}`);
//     this.loadVoices();
//   }

//   /**
//    * Loads and filters voices based on the current language.
//    * 1. Tries to find voices matching the current language code.
//    * 2. If none are found, falls back to English voices (but does NOT change this.currentLang).
//    * 3. Prioritises Microsoft voices, then Google, then all others – because Microsoft Edge TTS is primary.
//    * 4. Includes ALL voices from the selected priority group, so both male and female voices are used if available.
//    */
//   private loadVoices() {
//     if (!this.synth) return;
//     const voices = this.synth.getVoices();

//     if (voices.length === 0) return; // Mobile Support: Don't process if empty

//     // Filter voices that start with the current language code (e.g., 'en', 'es', 'fr', 'hi')
//     let langVoices = voices.filter(v => v.lang.startsWith(this.currentLang));

//     // If exact match fails (e.g. 'zh-CN' vs 'zh'), try broader match
//     if (langVoices.length === 0 && this.currentLang.includes('-')) {
//       const baseLang = this.currentLang.split('-')[0];
//       langVoices = voices.filter(v => v.lang.startsWith(baseLang));
//     }

//     // STRICT FALLBACK: If no voices found for the detected language, use English voices
//     // but do NOT change this.currentLang, so the system can later switch back if voices appear.
//     if (langVoices.length === 0) {
//       console.warn(`No voices found for ${this.currentLang}, falling back to English for this session.`);
//       langVoices = voices.filter(v => v.lang.startsWith('en'));
//     }

//     // PRIORITY: Microsoft > Google > Others – because Microsoft Edge TTS is primary
//     const microsoftVoices = langVoices.filter(v => v.name.includes('Microsoft'));
//     const googleVoices = langVoices.filter(v => v.name.includes('Google'));

//     if (microsoftVoices.length > 0) {
//       // Use all Microsoft voices (may include both male and female)
//       this.availableVoices = microsoftVoices;
//     } else if (googleVoices.length > 0) {
//       this.availableVoices = googleVoices;
//     } else {
//       this.availableVoices = langVoices;
//     }

//     // Final Safety Net: If we somehow still have no voices (e.g., even English failed), try any English voice
//     if (this.availableVoices.length === 0) {
//       this.availableVoices = voices.filter(v => v.lang.startsWith('en'));
//     }

//     if (!this.initialized) {
//       console.log(`Voice engine initialized with ${this.availableVoices.length} eligible voices for ${this.currentLang}.`);
//       this.initialized = true;
//     }
//   }

//   /**
//    * Returns a random voice from the available list.
//    * If the list is empty, attempts to reload voices and returns the first available voice.
//    */
//   private getRandomVoice(): SpeechSynthesisVoice | null {
//     // Reload voices if none are available (sometimes needed after browser updates)
//     if (this.availableVoices.length === 0) {
//       this.loadVoices();
//     }

//     if (this.availableVoices.length === 0) {
//       console.warn('No suitable voices found. Speech will use default system voice.');
//       return null;
//     }

//     const randomIndex = Math.floor(Math.random() * this.availableVoices.length);
//     return this.availableVoices[randomIndex];
//   }

//   /**
//    * Mobile Support: Unlock audio context
//    */
//   public unlock() {
//     if (this.synth) {
//       this.synth.resume();
//       this.loadVoices();
//     }
//   }

//   /**
//    * Speaks the given text using a randomly selected voice matching the current language.
//    * @param text - The text to speak
//    * @param force - If true, cancels any ongoing speech before speaking
//    */
//   public speak(text: string, force: boolean = true) {
//     if (!this.synth) return;

//     if (force) {
//       this.synth.cancel();
//     }

//     const utterance = new SpeechSynthesisUtterance(text);
//     const selectedVoice = this.getRandomVoice();

//     if (selectedVoice) {
//       utterance.voice = selectedVoice;
//       // Mobile Support: Explicitly set language for Android compatibility
//       utterance.lang = selectedVoice.lang;
//     }

//     // Natural speech settings
//     utterance.rate = 1.0;
//     utterance.pitch = 1.0;
//     utterance.volume = 1.0;

//     this.synth.speak(utterance);
//   }

//   /**
//    * Announces progress milestones (e.g., 10%, 25%, 50%, 75%, 90%).
//    * Uses the same random voice selection.
//    */
//   public announceProgress(progress: number) {
//     const milestones = [10, 25, 50, 75, 90];
//     const crossedMilestone = milestones.find(m => progress >= m && this.lastMilestone < m);

//     if (crossedMilestone) {
//       this.speak(`${crossedMilestone}% processing completed.`);
//       this.lastMilestone = crossedMilestone;
//     }
//   }

//   /**
//    * Resets the milestone tracker and cancels any ongoing speech.
//    */
//   public reset() {
//     this.lastMilestone = -1;
//     if (this.synth) {
//       this.synth.cancel();
//     }
//   }
// }

// export const voiceManager = new VoiceManager();













export class VoiceManager {
  private synth: SpeechSynthesis | null = null;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private lastMilestone = -1;
  private initialized = false;
  private currentLang = 'en';
  private langObserver: MutationObserver | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;

      // Load voices synchronously (Chrome) and asynchronously (Firefox/Safari)
      this.loadVoices();
      this.synth.onvoiceschanged = () => this.loadVoices();

      // Mobile: voices may load late
      setTimeout(() => this.loadVoices(), 500);
      setTimeout(() => this.loadVoices(), 1500);

      // Sync with Google Translate: watch <html lang="..."> attribute changes
      this.observeGoogleTranslate();
    }
  }

  // ─── Google Translate Sync ────────────────────────────────────────────────

  /**
   * Observes the <html> element's `lang` attribute for changes made by
   * Google Translate (or any other translation tool).
   * When detected, updates the TTS language accordingly.
   */
  private observeGoogleTranslate() {
    if (typeof window === 'undefined') return;

    const htmlEl = document.documentElement;

    // Set initial language from <html lang>
    const initialLang = htmlEl.getAttribute('lang');
    if (initialLang) this.applyLangCode(initialLang);

    this.langObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
          const newLang = htmlEl.getAttribute('lang') || 'en';
          console.log(`VoiceManager: Detected language change via Google Translate → ${newLang}`);
          this.applyLangCode(newLang);
        }
      }
    });

    this.langObserver.observe(htmlEl, { attributes: true, attributeFilter: ['lang'] });
  }

  /**
   * Normalises a BCP-47 lang code coming from Google Translate
   * (e.g. "zh-CN", "pt-BR", "iw" → "he") and updates TTS language.
   */
  private applyLangCode(rawLang: string) {
    // Google Translate quirks: legacy codes
    const LEGACY_MAP: Record<string, string> = {
      iw: 'he',  // Hebrew
      ji: 'yi',  // Yiddish
      jw: 'jv',  // Javanese
      in: 'id',  // Indonesian
    };

    const base = rawLang.split('-')[0].toLowerCase();
    const normalised = LEGACY_MAP[base] ?? rawLang;

    if (normalised !== this.currentLang) {
      this.setLanguage(normalised);
    }
  }

  // ─── Public API ──────────────────────────────────────────────────────────

  /**
   * Manually set the TTS language (e.g. called from UI language picker).
   * Triggers a voice reload to match the new language.
   */
  public setLanguage(lang: string) {
    this.currentLang = lang;
    console.log(`VoiceManager: Language set to "${this.currentLang}"`);
    this.loadVoices();
  }

  /**
   * Mobile: unlock audio context after first user gesture.
   */
  public unlock() {
    if (this.synth) {
      this.synth.resume();
      this.loadVoices();
    }
  }

  /**
   * Speaks the given text using the best available voice for the current language.
   * @param text  - Text to speak
   * @param force - Cancel any ongoing speech first (default: true)
   */
  public speak(text: string, force = true) {
    if (!this.synth) return;
    if (force) this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.getRandomVoice();

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang; // Android compatibility
    } else {
      // No voice found at all – let browser use its default
      utterance.lang = this.currentLang;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    this.synth.speak(utterance);
  }

  /**
   * Announces progress milestones: 10 %, 25 %, 50 %, 75 %, 90 %.
   */
  public announceProgress(progress: number) {
    const milestones = [10, 25, 50, 75, 90];
    const crossed = milestones.find(m => progress >= m && this.lastMilestone < m);
    if (crossed !== undefined) {
      this.speak(`${crossed}% processing completed.`);
      this.lastMilestone = crossed;
    }
  }

  /**
   * Resets milestone tracker and stops ongoing speech.
   */
  public reset() {
    this.lastMilestone = -1;
    this.synth?.cancel();
  }

  /**
   * Tear down the MutationObserver (call on component unmount).
   */
  public destroy() {
    this.langObserver?.disconnect();
    this.langObserver = null;
    this.synth?.cancel();
  }

  // ─── Internal ────────────────────────────────────────────────────────────

  /**
   * Loads and prioritises voices for the current language.
   *
   * Priority order (STRICT):
   *   1. Microsoft voices  ← Edge TTS, always preferred
   *   2. Google voices
   *   3. Any other voices matching the language
   *
   * Fallback (ENGLISH ONLY):
   *   If no voices match the current language, fall back to English Microsoft
   *   voices → English Google voices → any English voice.
   *   this.currentLang is NEVER changed by a fallback so that when voices
   *   become available later the correct language is used.
   */
  private loadVoices() {
    if (!this.synth) return;

    const all = this.synth.getVoices();
    if (all.length === 0) return; // Voices not ready yet

    // ── Step 1: Find voices for the requested language ──────────────────
    let langVoices = this.matchVoices(all, this.currentLang);

    // ── Step 2: English-only fallback ───────────────────────────────────
    const usingFallback = langVoices.length === 0 && !this.currentLang.startsWith('en');
    if (usingFallback) {
      console.warn(
        `VoiceManager: No voices found for "${this.currentLang}". ` +
        `Falling back to English (this.currentLang unchanged).`
      );
      langVoices = this.matchVoices(all, 'en');
    }

    // ── Step 3: Apply Microsoft → Google → Others priority ───────────────
    this.availableVoices = this.prioritise(langVoices);

    // ── Step 4: Last-resort safety net ──────────────────────────────────
    if (this.availableVoices.length === 0) {
      console.warn('VoiceManager: No voices at all – using full English list as last resort.');
      this.availableVoices = this.prioritise(all.filter(v => v.lang.startsWith('en')));
    }

    if (!this.initialized) {
      console.log(
        `VoiceManager: Initialised with ${this.availableVoices.length} voices ` +
        `for "${this.currentLang}"${usingFallback ? ' (English fallback)' : ''}.`
      );
      this.initialized = true;
    }
  }

  /**
   * Returns voices from `pool` that match the given language code.
   * Handles both exact (e.g. "zh-CN") and base-code (e.g. "zh") matching.
   */
  private matchVoices(pool: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice[] {
    // Try exact prefix first (e.g. "zh-CN" matches "zh-CN-XiaoxiaoNeural")
    let matched = pool.filter(v => v.lang.toLowerCase().startsWith(lang.toLowerCase()));

    // If the lang has a region suffix and nothing matched, try the base code
    if (matched.length === 0 && lang.includes('-')) {
      const base = lang.split('-')[0];
      matched = pool.filter(v => v.lang.toLowerCase().startsWith(base.toLowerCase()));
    }

    return matched;
  }

  /**
   * Applies the Microsoft → Google → Others priority to a list of voices.
   * Returns ALL voices from the highest-priority group found.
   */
  private prioritise(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
    const microsoft = voices.filter(v => v.name.includes('Microsoft'));
    if (microsoft.length > 0) return microsoft;

    const google = voices.filter(v => v.name.includes('Google'));
    if (google.length > 0) return google;

    return voices; // All others
  }

  /**
   * Returns a random voice from the available pool.
   * Retries a voice reload if the pool is empty.
   */
  private getRandomVoice(): SpeechSynthesisVoice | null {
    if (this.availableVoices.length === 0) this.loadVoices();
    if (this.availableVoices.length === 0) {
      console.warn('VoiceManager: No suitable voices found – browser default will be used.');
      return null;
    }
    return this.availableVoices[Math.floor(Math.random() * this.availableVoices.length)];
  }
}

export const voiceManager = new VoiceManager();