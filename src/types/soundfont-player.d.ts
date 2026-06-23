declare module 'soundfont-player' {
  export interface Player {
    play(note: string, time: number, options?: { duration?: number; gain?: number }): void;
    stop(): void;
  }

  interface SoundfontStatic {
    instrument(audioContext: AudioContext, name: string, options?: { soundfont?: string }): Promise<Player>;
  }

  const Soundfont: SoundfontStatic;
  export default Soundfont;
}
