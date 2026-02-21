
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













// export class VoiceManager {
//   private synth: SpeechSynthesis | null = null;
//   private availableVoices: SpeechSynthesisVoice[] = [];
//   private lastMilestone = -1;
//   private initialized = false;
//   private currentLang = 'en';
//   private langObserver: MutationObserver | null = null;

//   // Google Translate uses some legacy ISO codes — map them to BCP-47
//   private static readonly LEGACY_LANG_MAP: Record<string, string> = {
//     iw: 'he',   // Hebrew
//     ji: 'yi',   // Yiddish
//     jw: 'jv',   // Javanese
//     in: 'id',   // Indonesian
//     zh: 'zh-CN' // Default Chinese to Simplified
//   };

//   constructor() {
//     if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
//       this.synth = window.speechSynthesis;

//       this.loadVoices();
//       this.synth.onvoiceschanged = () => this.loadVoices();

//       // Mobile: voices may load late
//       setTimeout(() => this.loadVoices(), 500);
//       setTimeout(() => this.loadVoices(), 1500);

//       // Auto-sync with Google Translate
//       this.observeGoogleTranslate();
//     }
//   }

//   // ─── Google Translate Sync ───────────────────────────────────────────────

//   /**
//    * Watches <html lang="..."> attribute — Google Translate updates this
//    * whenever the user switches language. We mirror that change to TTS.
//    */
//   private observeGoogleTranslate() {
//     if (typeof window === 'undefined') return;

//     const htmlEl = document.documentElement;

//     // Pick up language already set on page load
//     const initialLang = htmlEl.getAttribute('lang');
//     if (initialLang) this.applyLangCode(initialLang);

//     this.langObserver = new MutationObserver(() => {
//       const newLang = htmlEl.getAttribute('lang') || 'en';
//       console.log(`VoiceManager: Google Translate changed language → "${newLang}"`);
//       this.applyLangCode(newLang);
//     });

//     this.langObserver.observe(htmlEl, {
//       attributes: true,
//       attributeFilter: ['lang']
//     });
//   }

//   /**
//    * Normalises the lang code from Google Translate and applies it to TTS.
//    * Google Translate sets codes like "zh-CN", "ko", "hi", "fr", "iw" etc.
//    */
//   private applyLangCode(rawLang: string) {
//     const base = rawLang.split('-')[0].toLowerCase();
//     // Fix legacy codes first
//     const fixed = VoiceManager.LEGACY_LANG_MAP[base] ?? rawLang;

//     if (fixed !== this.currentLang) {
//       console.log(`VoiceManager: Applying language "${fixed}"`);
//       this.setLanguage(fixed);
//     }
//   }

//   // ─── Public API ─────────────────────────────────────────────────────────

//   /**
//    * Manually set TTS language. Called by applyLangCode or externally.
//    */
//   public setLanguage(lang: string) {
//     this.currentLang = lang;
//     this.loadVoices(); // Reload voices for the new language immediately
//   }

//   /** Mobile: call this on first user gesture to unlock audio context. */
//   public unlock() {
//     if (this.synth) {
//       this.synth.resume();
//       this.loadVoices();
//     }
//   }

//   /**
//    * Speaks text in the CURRENT language (whatever Google Translate selected).
//    * If no voice exists for that language, falls back to English.
//    */
//   public speak(text: string, force = true) {
//     if (!this.synth) return;
//     if (force) this.synth.cancel();

//     const utterance = new SpeechSynthesisUtterance(text);
//     const voice = this.getBestVoice();

//     if (voice) {
//       utterance.voice = voice;
//       utterance.lang = voice.lang; // Critical for Android
//     } else {
//       utterance.lang = this.currentLang;
//     }

//     utterance.rate = 1.0;
//     utterance.pitch = 1.0;
//     utterance.volume = 1.0;

//     this.synth.speak(utterance);
//   }

//   /** Announces progress at 10%, 25%, 50%, 75%, 90% milestones. */
//   public announceProgress(progress: number) {
//     const milestones = [10, 25, 50, 75, 90];
//     const crossed = milestones.find(m => progress >= m && this.lastMilestone < m);
//     if (crossed !== undefined) {
//       this.speak(`${crossed}% processing completed.`);
//       this.lastMilestone = crossed;
//     }
//   }

//   /** Reset milestone tracker and stop any ongoing speech. */
//   public reset() {
//     this.lastMilestone = -1;
//     this.synth?.cancel();
//   }

//   /** Call on component unmount to prevent memory leaks. */
//   public destroy() {
//     this.langObserver?.disconnect();
//     this.langObserver = null;
//     this.synth?.cancel();
//   }

//   // ─── Voice Selection Logic ──────────────────────────────────────────────

//   /**
//    * Core voice loading logic:
//    *
//    *  1. Find all voices matching this.currentLang
//    *     → Exact prefix match first (e.g. "zh-CN")
//    *     → Then base-code match (e.g. "zh" matches "zh-CN", "zh-TW")
//    *
//    *  2. Within matched voices, apply STRICT priority:
//    *     Microsoft Edge TTS  ← ALWAYS FIRST
//    *     Google TTS          ← Second
//    *     Any other voice     ← Last resort for that language
//    *
//    *  3. If ZERO voices found for the language → ENGLISH ONLY fallback
//    *     (this.currentLang is NOT changed — so when voices load later, correct lang is used)
//    *
//    *  4. Last-resort: if even English fails, take any available voice.
//    */
//   private loadVoices() {
//     if (!this.synth) return;
//     const all = this.synth.getVoices();
//     if (all.length === 0) return;

//     // Step 1: Find voices for the current language
//     let matched = this.matchByLang(all, this.currentLang);

//     // Step 2: If no match → ENGLISH ONLY fallback (do NOT change this.currentLang)
//     if (matched.length === 0) {
//       if (!this.currentLang.startsWith('en')) {
//         console.warn(
//           `VoiceManager: No voices for "${this.currentLang}" on this device. ` +
//           `Falling back to English only. this.currentLang remains "${this.currentLang}".`
//         );
//       }
//       matched = this.matchByLang(all, 'en');
//     }

//     // Step 3: Apply Microsoft → Google → Others priority
//     this.availableVoices = this.applyPriority(matched);

//     // Step 4: Absolute last resort
//     if (this.availableVoices.length === 0) {
//       this.availableVoices = this.applyPriority(all);
//     }

//     if (!this.initialized && this.availableVoices.length > 0) {
//       console.log(
//         `VoiceManager: Ready. ${this.availableVoices.length} voice(s) for ` +
//         `"${this.currentLang}". Top voice: "${this.availableVoices[0]?.name}"`
//       );
//       this.initialized = true;
//     }
//   }

//   /**
//    * Match voices for a given lang code.
//    * Tries full code first (e.g. "zh-CN"), then base code (e.g. "zh").
//    */
//   private matchByLang(pool: SpeechSynthesisVoice[], lang: string): SpeechSynthesisVoice[] {
//     const lowerLang = lang.toLowerCase();

//     // Exact prefix: "zh-CN" matches "zh-CN-XiaoxiaoNeural", "zh-CNjj" etc.
//     let result = pool.filter(v => v.lang.toLowerCase().startsWith(lowerLang));

//     // Base-code fallback: "zh" matches "zh-CN", "zh-TW", etc.
//     if (result.length === 0 && lowerLang.includes('-')) {
//       const base = lowerLang.split('-')[0];
//       result = pool.filter(v => v.lang.toLowerCase().startsWith(base));
//     }

//     return result;
//   }

//   /**
//    * STRICT priority: Microsoft Edge TTS > Google TTS > Everything else.
//    * Returns ALL voices from the winning group (covers male + female variants).
//    */
//   private applyPriority(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
//     const microsoft = voices.filter(v => v.name.includes('Microsoft'));
//     if (microsoft.length > 0) {
//       console.log(`VoiceManager: Using ${microsoft.length} Microsoft voice(s).`);
//       return microsoft;
//     }

//     const google = voices.filter(v => v.name.includes('Google'));
//     if (google.length > 0) {
//       console.log(`VoiceManager: Using ${google.length} Google voice(s).`);
//       return google;
//     }

//     console.log(`VoiceManager: Using ${voices.length} system voice(s).`);
//     return voices;
//   }

//   /**
//    * Picks a random voice from the available pool.
//    * Randomising across multiple voices gives variety (male/female/accent).
//    */
//   private getBestVoice(): SpeechSynthesisVoice | null {
//     if (this.availableVoices.length === 0) this.loadVoices();
//     if (this.availableVoices.length === 0) {
//       console.warn('VoiceManager: No voices available at all.');
//       return null;
//     }
//     return this.availableVoices[Math.floor(Math.random() * this.availableVoices.length)];
//   }
// }

// export const voiceManager = new VoiceManager();


export class VoiceManager {
  private synth: SpeechSynthesis | null = null;
  private allVoices: SpeechSynthesisVoice[] = [];
  private availableVoices: SpeechSynthesisVoice[] = [];
  private lastMilestone = -1;
  private currentLang = 'en';
  private langObserver: MutationObserver | null = null;
  private voicesReady = false;

  /**
   * Maps Google Translate lang codes → BCP-47 base codes used in SpeechSynthesis voice.lang
   *
   * Google Translate emits short codes (e.g. "zh-CN", "ko", "hi", "iw").
   * SpeechSynthesis voice.lang is typically full BCP-47 (e.g. "zh-CN", "ko-KR", "hi-IN").
   * This map normalises Google's output so matchByLang() can find the right voices.
   *
   * Format: googleTranslateCode → BCP-47 prefix to match against voice.lang
   */
  private static readonly LANG_MAP: Record<string, string> = {
    // ── Legacy / Deprecated ISO codes Google still emits ──────────────────
    iw: 'he',         // Hebrew       (legacy → modern)
    ji: 'yi',         // Yiddish
    jw: 'jv',         // Javanese
    'in': 'id',       // Indonesian   (legacy → modern)
    mo: 'ro',         // Moldovan     (merged into Romanian)

    // ── Chinese variants ──────────────────────────────────────────────────
    zh: 'zh-CN',      // Chinese generic     → Simplified (Mainland)
    'zh-CN': 'zh-CN', // Chinese Simplified
    'zh-TW': 'zh-TW', // Chinese Traditional (Taiwan)
    'zh-HK': 'zh-HK', // Chinese Traditional (Hong Kong)

    // ── South Asian / Indian languages ────────────────────────────────────
    hi: 'hi-IN',      // Hindi
    bn: 'bn-IN',      // Bengali
    ta: 'ta-IN',      // Tamil
    te: 'te-IN',      // Telugu
    mr: 'mr-IN',      // Marathi
    gu: 'gu-IN',      // Gujarati
    kn: 'kn-IN',      // Kannada
    ml: 'ml-IN',      // Malayalam
    pa: 'pa-IN',      // Punjabi (Gurmukhi)
    or: 'or-IN',      // Odia
    as: 'as-IN',      // Assamese
    ur: 'ur-PK',      // Urdu         (primary: Pakistan)
    si: 'si-LK',      // Sinhala
    ne: 'ne-NP',      // Nepali

    // ── East / Southeast Asian ────────────────────────────────────────────
    ko: 'ko-KR',      // Korean
    ja: 'ja-JP',      // Japanese
    vi: 'vi-VN',      // Vietnamese
    th: 'th-TH',      // Thai
    km: 'km-KH',      // Khmer
    lo: 'lo-LA',      // Lao
    my: 'my-MM',      // Burmese
    mn: 'mn-MN',      // Mongolian
    ms: 'ms-MY',      // Malay
    id: 'id-ID',      // Indonesian
    tl: 'fil-PH',     // Filipino / Tagalog
    fil: 'fil-PH',    // Filipino (explicit)
    jv: 'jv-ID',      // Javanese
    su: 'su-ID',      // Sundanese
    ceb: 'ceb',       // Cebuano

    // ── Middle Eastern / Central Asian ────────────────────────────────────
    ar: 'ar-SA',      // Arabic       (primary: Saudi Arabia)
    he: 'he-IL',      // Hebrew
    fa: 'fa-IR',      // Persian / Farsi
    ps: 'ps-AF',      // Pashto
    ku: 'ku',         // Kurdish
    hy: 'hy-AM',      // Armenian
    ka: 'ka-GE',      // Georgian
    az: 'az-AZ',      // Azerbaijani
    kk: 'kk-KZ',      // Kazakh
    ky: 'ky-KG',      // Kyrgyz
    uz: 'uz-UZ',      // Uzbek
    tk: 'tk-TM',      // Turkmen
    tg: 'tg-TJ',      // Tajik

    // ── European — Romance ────────────────────────────────────────────────
    es: 'es-ES',      // Spanish      (primary: Spain)
    'es-419': 'es-MX',// Spanish Latin America → Mexico
    pt: 'pt-PT',      // Portuguese   (primary: Portugal)
    'pt-BR': 'pt-BR', // Portuguese Brazil
    fr: 'fr-FR',      // French
    it: 'it-IT',      // Italian
    ro: 'ro-RO',      // Romanian
    ca: 'ca-ES',      // Catalan
    gl: 'gl-ES',      // Galician
    oc: 'oc',         // Occitan

    // ── European — Germanic ───────────────────────────────────────────────
    de: 'de-DE',      // German
    nl: 'nl-NL',      // Dutch
    af: 'af-ZA',      // Afrikaans
    sv: 'sv-SE',      // Swedish
    no: 'nb-NO',      // Norwegian    (Bokmål)
    nb: 'nb-NO',      // Norwegian Bokmål
    nn: 'nn-NO',      // Norwegian Nynorsk
    da: 'da-DK',      // Danish
    is: 'is-IS',      // Icelandic
    lb: 'lb',         // Luxembourgish
    yi: 'yi',         // Yiddish

    // ── European — Slavic ─────────────────────────────────────────────────
    ru: 'ru-RU',      // Russian
    uk: 'uk-UA',      // Ukrainian
    pl: 'pl-PL',      // Polish
    cs: 'cs-CZ',      // Czech
    sk: 'sk-SK',      // Slovak
    bg: 'bg-BG',      // Bulgarian
    hr: 'hr-HR',      // Croatian
    sr: 'sr-RS',      // Serbian
    bs: 'bs-BA',      // Bosnian
    sl: 'sl-SI',      // Slovenian
    mk: 'mk-MK',      // Macedonian
    be: 'be-BY',      // Belarusian

    // ── European — Baltic ─────────────────────────────────────────────────
    lt: 'lt-LT',      // Lithuanian
    lv: 'lv-LV',      // Latvian
    et: 'et-EE',      // Estonian

    // ── European — Finno-Ugric ────────────────────────────────────────────
    fi: 'fi-FI',      // Finnish
    hu: 'hu-HU',      // Hungarian

    // ── European — Celtic / Other ─────────────────────────────────────────
    cy: 'cy-GB',      // Welsh
    ga: 'ga-IE',      // Irish
    eu: 'eu-ES',      // Basque
    mt: 'mt-MT',      // Maltese
    sq: 'sq-AL',      // Albanian
    el: 'el-GR',      // Greek

    // ── African ───────────────────────────────────────────────────────────
    sw: 'sw-KE',      // Swahili
    am: 'am-ET',      // Amharic
    yo: 'yo-NG',      // Yoruba
    ig: 'ig-NG',      // Igbo
    ha: 'ha-NG',      // Hausa
    zu: 'zu-ZA',      // Zulu
    xh: 'xh-ZA',      // Xhosa
    st: 'st-ZA',      // Sesotho
    sn: 'sn-ZW',      // Shona
    so: 'so-SO',      // Somali
    rw: 'rw-RW',      // Kinyarwanda
    ny: 'ny-MW',      // Chichewa / Nyanja
    mg: 'mg-MG',      // Malagasy
    lg: 'lg-UG',      // Luganda
    ak: 'ak-GH',      // Akan / Twi
    ee: 'ee-GH',      // Ewe
    ti: 'ti-ET',      // Tigrinya
    om: 'om-ET',      // Oromo

    // ── English variants (pass-through) ──────────────────────────────────
    en: 'en-US',      // English generic → US
    'en-US': 'en-US',
    'en-GB': 'en-GB',
    'en-AU': 'en-AU',
    'en-IN': 'en-IN',

    // ── Turkish / Turkic ─────────────────────────────────────────────────
    tr: 'tr-TR',      // Turkish

    // ── Other ─────────────────────────────────────────────────────────────
    eo: 'eo',         // Esperanto
    la: 'la',         // Latin
    fy: 'fy-NL',      // Frisian
    gd: 'gd-GB',      // Scottish Gaelic
    mi: 'mi-NZ',      // Maori
    sm: 'sm-WS',      // Samoan
    to: 'to-TO',      // Tongan
    haw: 'haw-US',    // Hawaiian
    ht: 'ht-HT',      // Haitian Creole
    hmn: 'hmn',       // Hmong
    xh: 'xh-ZA',      // Xhosa
  };

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;

      // Load voices — Chrome has them sync, Firefox/Safari async
      this.loadVoices();
      this.synth.onvoiceschanged = () => this.loadVoices();

      // Mobile: voices often arrive late
      setTimeout(() => this.loadVoices(), 300);
      setTimeout(() => this.loadVoices(), 1000);
      setTimeout(() => this.loadVoices(), 2500);

      // Sync with Google Translate <html lang="...">
      this.observeGoogleTranslate();
    }
  }

  // ─── Google Translate Sync ───────────────────────────────────────────────

  private observeGoogleTranslate() {
    if (typeof window === 'undefined') return;
    const htmlEl = document.documentElement;

    // Read language already present at startup (e.g. user had translate active)
    const initial = htmlEl.getAttribute('lang');
    if (initial) this.applyLangCode(initial);

    this.langObserver = new MutationObserver(() => {
      const lang = htmlEl.getAttribute('lang');
      if (lang) {
        console.log(`VoiceManager: Google Translate → "${lang}"`);
        this.applyLangCode(lang);
      }
    });

    this.langObserver.observe(htmlEl, {
      attributes: true,
      attributeFilter: ['lang'],
    });
  }

  /**
   * Convert Google Translate's emitted code to BCP-47, then apply.
   *
   * Google emits codes like: "zh-CN", "ko", "hi", "iw", "in", "es-419"
   * We look up the FULL code first, then the base code, then use as-is.
   */
  private applyLangCode(rawLang: string) {
    const raw = rawLang.trim();
    const base = raw.split('-')[0].toLowerCase();

    // 1. Try full code lookup (e.g. "zh-CN", "es-419", "pt-BR")
    const mapped =
      VoiceManager.LANG_MAP[raw] ??
      VoiceManager.LANG_MAP[base] ??
      raw; // Use as-is if not in map

    if (mapped !== this.currentLang) {
      console.log(`VoiceManager: Language "${raw}" → "${mapped}"`);
      this.currentLang = mapped;
      this.selectVoicesForCurrentLang();
    }
  }

  // ─── Voice Loading ────────────────────────────────────────────────────────

  private loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    if (voices.length === 0) return;

    this.allVoices = voices;
    this.voicesReady = true;
    console.log(`VoiceManager: ${voices.length} total voices loaded from browser.`);

    this.selectVoicesForCurrentLang();
  }

  /**
   * THE CORE MATCHING ENGINE
   *
   * Given this.currentLang (a BCP-47 prefix like "zh-CN", "ko-KR", "hi-IN"):
   *
   * 1. Find all voices where voice.lang STARTS WITH the target prefix
   *    e.g. "ko-KR" matches "ko-KR" voice
   *    e.g. "zh-CN" matches "zh-CN" voice
   *    e.g. "hi"    matches "hi-IN" voice  (base-code match)
   *
   * 2. Apply STRICT priority: Microsoft → Google → Others
   *
   * 3. ENGLISH-ONLY fallback if zero voices found for the language
   *
   * 4. Absolute last resort: any voice on the system
   */
  private selectVoicesForCurrentLang() {
    if (!this.voicesReady || this.allVoices.length === 0) return;

    // Step 1: Match voices for current language
    let matched = this.matchVoices(this.currentLang);

    const isEnglish = this.currentLang.startsWith('en');

    // Step 2: English-only fallback
    if (matched.length === 0 && !isEnglish) {
      console.warn(
        `VoiceManager: No voices found for "${this.currentLang}" on this device. ` +
        `Falling back to English ONLY.`
      );
      matched = this.matchVoices('en');
    }

    // Step 3: Apply Microsoft > Google > Others priority
    this.availableVoices = this.applyPriority(matched);

    // Step 4: Absolute last resort
    if (this.availableVoices.length === 0) {
      console.warn('VoiceManager: No English voices either! Using any available voice.');
      this.availableVoices = this.applyPriority(this.allVoices);
    }

    console.log(
      `VoiceManager: "${this.currentLang}" → ` +
      `${this.availableVoices.length} voice(s) selected. ` +
      `Top: "${this.availableVoices[0]?.name}" [${this.availableVoices[0]?.lang}]`
    );
  }

  /**
   * Match voices from allVoices for a given lang target.
   *
   * Strategy:
   *   A) Full prefix match: target="ko-KR"  → voice.lang starts with "ko-KR"
   *   B) Base match:        target="ko-KR"  → voice.lang starts with "ko"
   *   C) Target is base:    target="ko"     → voice.lang starts with "ko"
   *
   * Always tries the most specific match first to avoid wrong-region voices.
   */
  private matchVoices(target: string): SpeechSynthesisVoice[] {
    const t = target.toLowerCase();
    const base = t.split('-')[0];

    // A: Exact prefix — "ko-KR" matches voice.lang "ko-KR"
    let result = this.allVoices.filter(v =>
      v.lang.toLowerCase().startsWith(t)
    );

    // B: If target had region suffix and nothing matched, try base code
    //    "ko-KR" → try "ko" to catch any Korean voice (ko-KR, ko-KP etc.)
    if (result.length === 0 && t.includes('-')) {
      result = this.allVoices.filter(v =>
        v.lang.toLowerCase().startsWith(base)
      );
    }

    // C: If target IS a base code (e.g. "ko", "hi", "zh")
    //    already covered by case A since "ko".startsWith("ko") is true
    //    but voice.lang is "ko-KR" and "ko-KR".startsWith("ko") is ALSO true ✓

    return result;
  }

  /**
   * STRICT priority: Microsoft Edge TTS > Google TTS > System/Other
   * Returns ALL voices in the winning tier (includes male + female variants).
   */
  private applyPriority(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
    const microsoft = voices.filter(v => v.name.toLowerCase().includes('microsoft'));
    if (microsoft.length > 0) return microsoft;

    const google = voices.filter(v => v.name.toLowerCase().includes('google'));
    if (google.length > 0) return google;

    return voices;
  }

  // ─── Public API ──────────────────────────────────────────────────────────

  /** Manually override the TTS language (e.g. from a UI picker). */
  public setLanguage(lang: string) {
    this.applyLangCode(lang);
  }

  /** Call on first user gesture — required to unlock audio on iOS/Android. */
  public unlock() {
    if (this.synth) {
      this.synth.resume();
      this.loadVoices();
    }
  }

  /**
   * Speak text using the best voice for the current language.
   * If no voice found for that language → speaks in English.
   */
  public speak(text: string, force = true) {
    if (!this.synth) return;

    // If voices weren't ready at construction, try again now
    if (!this.voicesReady) this.loadVoices();

    if (force) this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.pickVoice();

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang; // Explicit lang required on Android
    } else {
      utterance.lang = this.currentLang;
    }

    utterance.rate   = 1.0;
    utterance.pitch  = 1.0;
    utterance.volume = 1.0;

    this.synth.speak(utterance);
  }

  /** Announce progress milestones: 10%, 25%, 50%, 75%, 90%. */
  public announceProgress(progress: number) {
    const milestones = [10, 25, 50, 75, 90];
    const crossed = milestones.find(m => progress >= m && this.lastMilestone < m);
    if (crossed !== undefined) {
      this.speak(`${crossed}% processing completed.`);
      this.lastMilestone = crossed;
    }
  }

  /** Reset milestones and stop any ongoing speech. */
  public reset() {
    this.lastMilestone = -1;
    this.synth?.cancel();
  }

  /** Call on component unmount to clean up observer. */
  public destroy() {
    this.langObserver?.disconnect();
    this.langObserver = null;
    this.synth?.cancel();
  }

  // ─── Internal ────────────────────────────────────────────────────────────

  private pickVoice(): SpeechSynthesisVoice | null {
    // Retry if pool is empty (sometimes voices load after speak() is called)
    if (this.availableVoices.length === 0) {
      this.loadVoices();
    }

    if (this.availableVoices.length === 0) {
      console.warn('VoiceManager: No voice available. Browser default will be used.');
      return null;
    }

    // Random selection across available voices → natural variety (male/female)
    const idx = Math.floor(Math.random() * this.availableVoices.length);
    return this.availableVoices[idx];
  }
}

export const voiceManager = new VoiceManager();