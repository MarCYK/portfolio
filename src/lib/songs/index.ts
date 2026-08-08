// Song catalog for the jukebox. Each song module is auto-generated from a MIDI
// file by scripts/import_song.py and carries its own bpm + pitch range so the
// engine plays it at the right speed and maps it to the right canvas rows.
import { SONG as letItHappen } from './let-it-happen';
import { SONG as onMelancholyHill } from './on-melancholy-hill';
import { SONG as moonlightSonata } from './moonlight-sonata';

export interface Song {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  midiLo: number;
  midiHi: number;
  notes: [number, number, number, number][];
}

export const SONGS: Song[] = [letItHappen, onMelancholyHill, moonlightSonata];

export const DEFAULT_SONG_ID = 'let-it-happen';

export function getSongById(id: string): Song {
  return SONGS.find((s) => s.id === id) ?? SONGS[0];
}
