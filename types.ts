export type NoteName = 
  | "C" | "C#" | "Db"
  | "D" | "D#" | "Eb"
  | "E" | "E#" | "Fb"
  | "F" | "F#" | "Gb"
  | "G" | "G#" | "Ab"
  | "A" | "A#" | "Bb"
  | "B" | "B#" | "Cb";

export interface Note {
  name: NoteName;
  octave: number;
  midi: number;
  frequency: number;
}

export enum ViewMode {
  INTERVALS = 'INTERVALS',
  KEYS = 'KEYS',
  CHORDS = 'CHORDS'
}

export interface KeySignature {
  name: string;
  sharps: number;
  flats: number;
  notes: NoteName[];
}

export interface ChordType {
  name: string;
  intervals: number[]; // semitones from root
}