import { Note, NoteName, KeySignature, ChordType } from '../types';

export const NOTES: NoteName[] = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const NOTES_FLAT: string[] = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

export const getNoteFromMidi = (midi: number): Note => {
  const octave = Math.floor(midi / 12) - 1;
  const noteIndex = midi % 12;
  const frequency = 440 * Math.pow(2, (midi - 69) / 12);
  return {
    name: NOTES[noteIndex],
    octave,
    midi,
    frequency
  };
};

export const getIntervalName = (semitones: number): string => {
  const intervals = [
    "Perfect Unison", "Minor 2nd", "Major 2nd", "Minor 3rd", "Major 3rd",
    "Perfect 4th", "Tritone", "Perfect 5th", "Minor 6th", "Major 6th",
    "Minor 7th", "Major 7th", "Perfect Octave"
  ];
  return intervals[semitones % 13] || `${semitones} semitones`;
};

// Circle of Fifths data
export const KEY_SIGNATURES: KeySignature[] = [
  { name: "C Major", sharps: 0, flats: 0, notes: ["C", "D", "E", "F", "G", "A", "B"] },
  { name: "G Major", sharps: 1, flats: 0, notes: ["G", "A", "B", "C", "D", "E", "F#"] },
  { name: "D Major", sharps: 2, flats: 0, notes: ["D", "E", "F#", "G", "A", "B", "C#"] },
  { name: "A Major", sharps: 3, flats: 0, notes: ["A", "B", "C#", "D", "E", "F#", "G#"] },
  { name: "E Major", sharps: 4, flats: 0, notes: ["E", "F#", "G#", "A", "B", "C#", "D#"] },
  { name: "B Major", sharps: 5, flats: 0, notes: ["B", "C#", "D#", "E", "F#", "G#", "A#"] },
  { name: "F# Major", sharps: 6, flats: 0, notes: ["F#", "G#", "A#", "B", "C#", "D#", "E#"] }, // Simplified E# as F for display logic often, but strictly E#
  { name: "F Major", sharps: 0, flats: 1, notes: ["F", "G", "A", "Bb", "C", "D", "E"] },
  { name: "Bb Major", sharps: 0, flats: 2, notes: ["Bb", "C", "D", "Eb", "F", "G", "A"] },
  { name: "Eb Major", sharps: 0, flats: 3, notes: ["Eb", "F", "G", "Ab", "Bb", "C", "D"] },
  { name: "Ab Major", sharps: 0, flats: 4, notes: ["Ab", "Bb", "C", "Db", "Eb", "F", "G"] },
  { name: "Db Major", sharps: 0, flats: 5, notes: ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"] },
  { name: "Gb Major", sharps: 0, flats: 6, notes: ["Gb", "Ab", "Bb", "Cb", "Db", "Eb", "F"] },
];

export const CHORD_TYPES: ChordType[] = [
  { name: "Major", intervals: [0, 4, 7] },
  { name: "Minor", intervals: [0, 3, 7] },
  { name: "Diminished", intervals: [0, 3, 6] },
  { name: "Augmented", intervals: [0, 4, 8] },
  { name: "Major 7th", intervals: [0, 4, 7, 11] },
  { name: "Minor 7th", intervals: [0, 3, 7, 10] },
  { name: "Dominant 7th", intervals: [0, 4, 7, 10] },
];

// Helper to get scale notes for visualization
export const getScaleNotes = (rootIndex: number, intervals: number[]): number[] => {
  return intervals.map(interval => rootIndex + interval);
};
