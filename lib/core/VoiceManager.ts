// export class VoiceManager {
//   private synth: SpeechSynthesis | null = null;
//   private voice: SpeechSynthesisVoice | null = null;
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

//   private loadVoices() {
//     if (!this.synth) return;
//     const voices = this.synth.getVoices();
    
//     // Priority Selection Algorithm:
//     // 1. "Brian" + "Neural" (Specific request for high-quality male voice)
//     // 2. Any "Microsoft" + "Online" + "Natural" (Edge Cloud Voices)
//     // 3. Any "Microsoft" voice (Standard Windows voices)
//     // 4. Default English voice
    
//     this.voice = voices.find(v => v.name.includes('Brian') && v.name.includes('Neural'))
//               || voices.find(v => v.name.includes('Microsoft') && v.name.includes('Online') && v.lang.includes('en'))
//               || voices.find(v => v.name.includes('Microsoft') && v.lang.includes('en'))
//               || voices.find(v => v.lang.startsWith('en'))
//               || null;
              
//     if (this.voice && !this.initialized) {
//         console.log(`Voice Engine Initialized: ${this.voice.name}`);
//         this.initialized = true;
//     }
//   }

//   public speak(text: string, force: boolean = true) {
//     if (!this.synth) return;

//     // Retry loading voice if missing (sometimes needed on first interaction)
//     if (!this.voice) this.loadVoices();

//     if (force) {
//         this.synth.cancel();
//     }

//     const utterance = new SpeechSynthesisUtterance(text);
//     if (this.voice) {
//         utterance.voice = this.voice;
//     }
    
//     // Adjust rate for natural feel
//     utterance.rate = 1.0;
//     utterance.pitch = 1.0;
//     utterance.volume = 1.0;

//     this.synth.speak(utterance);
//   }

//   public announceProgress(progress: number) {
//     // Milestones for voice feedback
//     const milestones = [10, 25, 50, 75, 90];
    
//     // Find if we just crossed a milestone
//     const crossedMilestone = milestones.find(m => progress >= m && this.lastMilestone < m);
    
//     if (crossedMilestone) {
//       this.speak(`${crossedMilestone}% processing completed.`);
//       this.lastMilestone = crossedMilestone;
//     }
//   }

//   public reset() {
//     this.lastMilestone = -1;
//     if (this.synth) {
//         this.synth.cancel();
//     }
//   }
// }

// export const voiceManager = new VoiceManager();

export class VoiceManager {
  private synth: SpeechSynthesis | null = null;
  private availableVoices: SpeechSynthesisVoice[] = []; // Eligible voices (Microsoft English, then any English)
  private lastMilestone = -1;
  private initialized = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      // Some browsers load voices asynchronously
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
      this.loadVoices();
    }
  }

  /**
   * Loads and filters voices:
   * 1. All Microsoft English voices (lang starts with 'en' and name includes 'Microsoft')
   * 2. If none found, fallback to any English voice
   */
  private loadVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();

    // Microsoft English voices (preferred)
    const microsoftEnglish = voices.filter(
      v => v.lang.startsWith('en') && v.name.includes('Microsoft')
    );

    // If Microsoft voices exist, use them; otherwise use any English voice
    this.availableVoices = microsoftEnglish.length > 0
      ? microsoftEnglish
      : voices.filter(v => v.lang.startsWith('en'));

    if (!this.initialized) {
      console.log(`Voice engine initialized with ${this.availableVoices.length} eligible voices.`);
      if (this.availableVoices.length > 0) {
        console.log(`Sample voice: ${this.availableVoices[0].name}`);
      }
      this.initialized = true;
    }
  }

  /**
   * Returns a random voice from the available list.
   * If the list is empty, attempts to reload voices and returns the first English voice (or null).
   */
  private getRandomVoice(): SpeechSynthesisVoice | null {
    // Reload voices if none are available (sometimes needed after browser updates)
    if (this.availableVoices.length === 0) {
      this.loadVoices();
    }

    if (this.availableVoices.length === 0) {
      console.warn('No English voices found. Speech will use default system voice.');
      return null;
    }

    const randomIndex = Math.floor(Math.random() * this.availableVoices.length);
    return this.availableVoices[randomIndex];
  }

  /**
   * Speaks the given text using a randomly selected voice.
   * @param text - The text to speak
   * @param force - If true, cancels any ongoing speech before speaking
   */
  public speak(text: string, force: boolean = true) {
    if (!this.synth) return;

    if (force) {
      this.synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = this.getRandomVoice();

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log(`Speaking with voice: ${selectedVoice.name}`);
    }

    // Natural speech settings
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    this.synth.speak(utterance);
  }

  /**
   * Announces progress milestones (e.g., 10%, 25%, 50%, 75%, 90%).
   * Uses the same random voice selection.
   */
  public announceProgress(progress: number) {
    const milestones = [10, 25, 50, 75, 90];
    const crossedMilestone = milestones.find(m => progress >= m && this.lastMilestone < m);

    if (crossedMilestone) {
      this.speak(`${crossedMilestone}% processing completed.`);
      this.lastMilestone = crossedMilestone;
    }
  }

  /**
   * Resets the milestone tracker and cancels any ongoing speech.
   */
  public reset() {
    this.lastMilestone = -1;
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const voiceManager = new VoiceManager();


























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