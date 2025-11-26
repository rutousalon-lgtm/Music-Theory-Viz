import React from 'react';
import { NOTES, getNoteFromMidi } from '../utils/musicTheory';
import { playNote } from '../utils/audio';

interface PianoProps {
  startMidi?: number; // Starting note (default 48 -> C3)
  keysCount?: number; // Number of keys (default 24 -> 2 octaves)
  activeNotes?: number[]; // MIDI numbers to highlight
  onKeyClick?: (midi: number) => void;
  color?: string;
}

const Piano: React.FC<PianoProps> = ({ 
  startMidi = 48, // C3
  keysCount = 25, // C3 to C5
  activeNotes = [], 
  onKeyClick,
  color = "bg-indigo-500"
}) => {
  const keys = [];

  for (let i = 0; i < keysCount; i++) {
    const midi = startMidi + i;
    const note = getNoteFromMidi(midi);
    const isBlack = note.name.includes("#");
    keys.push({ midi, isBlack, note });
  }

  // Separate white and black keys for easy CSS layering
  // However, rendering them in order is easier with flexbox if we adjust widths
  // A standard approach: White keys are flex items, black keys are absolute positioned overlays.

  const whiteKeys = keys.filter(k => !k.isBlack);
  
  // Map midi to an index in the white keys array for positioning black keys
  const getWhiteKeyIndex = (midi: number) => {
    let count = 0;
    for(let m = startMidi; m < midi; m++) {
        if (!getNoteFromMidi(m).name.includes('#')) count++;
    }
    return count;
  };

  return (
    <div className="relative h-48 w-full max-w-4xl select-none mx-auto bg-gray-800 p-2 rounded-lg shadow-xl overflow-hidden">
      <div className="relative h-full flex">
        {whiteKeys.map((k) => {
            const isActive = activeNotes.includes(k.midi);
            return (
                <div
                    key={k.midi}
                    className={`h-full flex-1 border border-gray-400 rounded-b-md cursor-pointer transition-colors duration-200 active:bg-gray-200 ${
                        isActive ? `${color} text-white` : 'bg-white hover:bg-gray-100'
                    }`}
                    onClick={() => {
                        playNote(k.note.frequency);
                        onKeyClick?.(k.midi);
                    }}
                >
                    {isActive && <div className="mt-auto mb-2 text-center text-xs font-bold w-full">{k.note.name}</div>}
                </div>
            );
        })}
        
        {keys.filter(k => k.isBlack).map(k => {
            const whiteIndex = getWhiteKeyIndex(k.midi);
            // Position exactly between the previous white key and the next one.
            // whiteIndex corresponds to the number of white keys before this black key.
            // Since white keys are flex-1, the boundary is exactly at (count / total) * 100%.
            const leftPos = (whiteIndex / whiteKeys.length) * 100;
            const isActive = activeNotes.includes(k.midi);
            
            return (
                <div
                    key={k.midi}
                    className={`absolute w-[4%] h-[60%] z-10 rounded-b-md cursor-pointer transition-transform duration-100 active:scale-y-95 border border-gray-900 ${
                        isActive ? `${color} ring-2 ring-white` : 'bg-black hover:bg-gray-800'
                    }`}
                    style={{ left: `${leftPos}%`, transform: 'translateX(-50%)' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        playNote(k.note.frequency);
                        onKeyClick?.(k.midi);
                    }}
                >
                     {isActive && <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-white font-bold">{k.note.name}</div>}
                </div>
            );
        })}
      </div>
    </div>
  );
};

export default Piano;