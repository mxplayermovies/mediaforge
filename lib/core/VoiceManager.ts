
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

  // Google Translate uses some legacy ISO codes — map them to BCP-47
  private static readonly LEGACY_LANG_MAP: Record<string, string> = {
    iw: 'he',   // Hebrew
    ji: 'yi',   // Yiddish
    jw: 'jv',   // Javanese
    in: 'id',   // Indonesian
    zh: 'zh-CN' // Default Chinese to Simplified
  };

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;

      this.loadVoices();
      this.synth.onvoiceschanged = () => this.loadVoices();

      // Mobile: voices may load late
      setTimeout(() => this.loadVoices(), 500);
      setTimeout(() => this.loadVoices(), 1500);

      // Auto-sync with Google Translate
      this.observeGoogleTranslate();
    }
  }

  // ─── Google Translate Sync ───────────────────────────────────────────────

  /**
   * Watches <html lang="..."> attribute — Google Translate updates this
   * whenever the user switches language. We mirror that change to TTS.
   */
  private observeGoogleTranslate() {
    if (typeof window === 'undefined') return;

    const htmlEl = document.documentElement;

    // Pick up language already set on page load
    const initialLang = htmlEl.getAttribute('lang');
    if (initialLang) this.applyLangCode(initialLang);

    this.langObserver = new MutationObserver(() => {
      const newLang = htmlEl.getAttribute('lang') || 'en';
      console.log(`VoiceManager: Google Translate changed language → "${newLang}"`);
      this.applyLangCode(newLang);
    });

    this.langObserver.observe(htmlEl, {
      attributes: true,
      attributeFilter: ['lang']
    });
  }

  /**
   * Normalises the lang code from Google Translate and applies it to TTS.
   * Google Translate sets codes like "zh-CN", "ko", "hi", "fr", "iw" etc.
   */
  private applyLangCode(rawLang: string) {
    const base = rawLang.split('-')[0].toLowerCase();
    // Fix legacy codes first
    const fixed = VoiceManager.LEGACY_LANG_MAP[base] ?? rawLang;

    if (fixed !== this.currentLang) {
      console.log(`VoiceManager: Applying language "${fixed}"`);
      this.setLanguage(fixed);
    }
  }

  // ─── Public API ─────────────────────────────────────────────────────────

  /**
   * Manually set TTS language. Called by applyLangCode or externally.
   */
  public setLanguage(lang: string) {
    this.currentLang = lang;
    this.loadVoices(); // Reload voices for the new language immediately
  }

  /** Mobile: call this on first user gesture to unlock audio context. */
  public unlock() {
    if (this.synth) {
      this.synth.resume();
      this.loadVoices();
    }
  }

  /**
   * Speaks text in the CURRENT language (whatever Google Translate selected).
   * If no voice exists for that language, falls back to English.
   */
  public speak(text: string, force = true) {
    if (!this.synth) return;
    if (force) this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.getBestVoice();

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang; // Critical for Android
    } else {
      utterance.lang = this.currentLang;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    this.synth.speak(utterance);
  }

  /** Announces progress at 10%, 25%, 50%, 75%, 90% milestones. */
  public announceProgress(progress: number) {
    const milestones = [10, 25, 50, 75, 90];
    const crossed = milestones.find(m => progress >= m && this.lastMilestone < m);
    if (crossed !== undefined) {
      this.speak(`${crossed}% processing completed.`);
      this.lastMilestone = crossed;
    }
  }

  /** Reset milestone tracker and stop any ongoing speech. */
  public reset() {
    this.lastMilestone = -1;
    this.synth?.cancel();
  }

  /** Call on component unmount to prevent memory leaks. */
  public destroy() {
    this.langObserver?.disconnect();
    this.langObserver = null;
    this.synth?.cancel();
  }

  // ─── Voice Selection Logic ──────────────────────────────────────────────

  /**
   * Core voice loading logic:
   *
   *  1. Find all voices matching this.currentLang
   *     → Exact prefix match first (e.g. "zh-CN")
   *     → Then base-code match (e.g. "zh" matches "zh-CN", "zh-TW")
   *
   *  2. Within matched voices, apply STRICT priority:
   *     Microsoft Edge TTS  ← ALWAYS FIRST
   *     Google TTS          ← Second
   *     Any other voice     ← Last resort for that language
   *
   *  3. If ZERO voices found for the language → ENGLISH ONLY fallback
   *     (this.currentLang is NOT changed — so when voices load later, correct lang is used)
   *
   *  4. Last-resort: if even English fails, take any available voice.
   */
  private loadVoices() {
    if (!this.synth) return;
    const all = this.synth.getVoices();
    if (all.length === 0) return;

    // Step 1: Find voices for the current language
    let matched = this.matchByLang(all, this.currentLang);

    // Step 2: If no match → ENGLISH ONLY fallback (do NOT change this.currentLang)
    if (matched.length === 0) {
      if (!this.currentLang.startsWith('en')) {
        console.warn(
          `VoiceManager: No voices for "${this.currentLang}" on this device. ` +
          `Falling back to English only. this.currentLang remains "${this.currentLang}".`
        );
      }
      matched = this.matchByLang(all, 'en');
    }

    // Step 3: Apply Microsoft → Google → Others priority
    this.availableVoices = this.applyPriority(matched);

    // Step 4: Absolute last resort
    if (this.availableVoices.length === 0) {
      this.availableVoices = this.applyPriority(all);
    }

    if (!this.initialized && this.availableVoices.length > 0) {
      console.log(
        `VoiceManager: Ready. ${this.availableVoices.length} voice(s) for ` +
        `"${this.currentLang}". Top voice: "${this.availableVoices[0]?.name}"`
      );
      this.initialized = true;
    }
  }

  /**
   * Match voices for a given lang code.
   * Tries full code first (e.g. "zh-CN"), then base code (e.g. "zh").
   */
  private matchByLang(pool: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice[] {
    const lowerLang = lang.toLowerCase();

    // Exact prefix: "zh-CN" matches "zh-CN-XiaoxiaoNeural", "zh-CNjj" etc.
    let result = pool.filter(v => v.lang.toLowerCase().startsWith(lowerLang));

    // Base-code fallback: "zh" matches "zh-CN", "zh-TW", etc.
    if (result.length === 0 && lowerLang.includes('-')) {
      const base = lowerLang.split('-')[0];
      result = pool.filter(v => v.lang.toLowerCase().startsWith(base));
    }

    return result;
  }

  /**
   * STRICT priority: Microsoft Edge TTS > Google TTS > Everything else.
   * Returns ALL voices from the winning group (covers male + female variants).
   */
  private applyPriority(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
    const microsoft = voices.filter(v => v.name.includes('Microsoft'));
    if (microsoft.length > 0) {
      console.log(`VoiceManager: Using ${microsoft.length} Microsoft voice(s).`);
      return microsoft;
    }

    const google = voices.filter(v => v.name.includes('Google'));
    if (google.length > 0) {
      console.log(`VoiceManager: Using ${google.length} Google voice(s).`);
      return google;
    }

    console.log(`VoiceManager: Using ${voices.length} system voice(s).`);
    return voices;
  }

  /**
   * Picks a random voice from the available pool.
   * Randomising across multiple voices gives variety (male/female/accent).
   */
  private getBestVoice(): SpeechSynthesisVoice | null {
    if (this.availableVoices.length === 0) this.loadVoices();
    if (this.availableVoices.length === 0) {
      console.warn('VoiceManager: No voices available at all.');
      return null;
    }
    return this.availableVoices[Math.floor(Math.random() * this.availableVoices.length)];
  }
}

export const voiceManager = new VoiceManager();