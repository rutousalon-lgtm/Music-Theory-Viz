import React from 'react';
import { getNoteFromMidi } from '../utils/musicTheory';

interface StaffProps {
  notes?: number[]; // MIDI numbers
  keySignature?: string; // e.g., "G Major" (affects accidentals shown at start)
  clef?: 'treble' | 'bass';
}

// Map standard notes to staff positions (0 = Middle C line)
// C4 = 0, D4 = 1, E4 = 2, F4 = 3, G4 = 4, A4 = 5, B4 = 6, C5 = 7
const getStaffPosition = (noteName: string, octave: number) => {
    const basePositions: {[key: string]: number} = {
        'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G': 4, 'A': 5, 'B': 6
    };
    // Clean sharp/flat from name for position
    const naturalName = noteName.replace(/[#b]/, '');
    const basePos = basePositions[naturalName];
    // Calculate relative to C4 (octave 4)
    return basePos + (octave - 4) * 7;
};

const Staff: React.FC<StaffProps> = ({ notes = [], clef = 'treble' }) => {
  // Staff visual config
  const lineSpacing = 10;
  const startY = 60; // Top line Y
  const middleC_Y = startY + 4 * lineSpacing + lineSpacing; // C4 is one ledger line below treble staff bottom line
  
  // Note rendering logic
  const renderNote = (midi: number, index: number) => {
      const note = getNoteFromMidi(midi);
      const isBlack = note.name.includes('#');
      const pos = getStaffPosition(note.name, note.octave);
      
      const relPos = getStaffPosition(note.name, note.octave);
      const F5_pos = 11; // If C4 is 0.
      const y = startY + (F5_pos - relPos) * (lineSpacing / 2);
      
      const x = 60 + index * 40;

      // Ledger lines
      const ledgers = [];
      if (relPos < 2) { // Below E4
          for (let i = 2; i > relPos; i -= 2) { // E4 is 2. C4 is 0.
             const lY = startY + (F5_pos - (i-2)) * (lineSpacing / 2);
             ledgers.push(<line key={`l-${i}`} x1={x-10} y1={lY} x2={x+10} y2={lY} stroke="white" strokeWidth="2" />);
          }
      }
      // Note C4 (0) -> Ledger at 0.
      if (relPos === 0) {
         const lY = startY + (F5_pos - 0) * (lineSpacing / 2);
         ledgers.push(<line key={`l-0`} x1={x-10} y1={lY} x2={x+10} y2={lY} stroke="white" strokeWidth="2" />);
      }

      return (
          <g key={midi}>
              {ledgers}
              <ellipse cx={x} cy={y} rx={6} ry={5} fill="white" />
              {/* Stem */}
              <line x1={x + 5} y1={y} x2={x + 5} y2={y - 35} stroke="white" strokeWidth="2" />
              {isBlack && (
                  <text x={x - 15} y={y + 5} fill="#fb7185" fontSize="16" fontFamily="serif">♯</text>
              )}
          </g>
      );
  };

  return (
    <div className="w-full overflow-x-auto flex justify-center py-4 bg-gray-800 rounded-lg border border-gray-700">
      <svg width="400" height="150" viewBox="0 0 400 150">
        {/* Staff Lines */}
        {[0, 1, 2, 3, 4].map(i => (
            <line 
                key={i} 
                x1="10" 
                y1={startY + i * lineSpacing} 
                x2="390" 
                y2={startY + i * lineSpacing} 
                stroke="#9ca3af" 
                strokeWidth="2" 
            />
        ))}
        {/* Clef */}
        <text x="20" y={startY + 35} fontSize="40" fill="white" fontFamily="serif">𝄞</text>
        
        {/* Notes */}
        {notes.map((midi, i) => renderNote(midi, i))}
      </svg>
    </div>
  );
};

export default Staff;