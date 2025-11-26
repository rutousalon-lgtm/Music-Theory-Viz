import React, { useState } from 'react';
import { CHORD_TYPES, NOTES, getScaleNotes } from '../utils/musicTheory';
import Piano from './Piano';
import Staff from './Staff';
import { playChord } from '../utils/audio';
import { explainConcept } from '../services/geminiService';
import { Volume2, Info } from 'lucide-react';

const ChordsView: React.FC = () => {
  const [root, setRoot] = useState(0); // C
  const [chordTypeIndex, setChordTypeIndex] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const currentChordType = CHORD_TYPES[chordTypeIndex];
  
  // Base C3 = 48
  // Selected Root in C4 octave = 60 + root
  const rootMidi = 60 + root;
  const chordIntervals = currentChordType.intervals;
  const chordNotesMidi = getScaleNotes(rootMidi, chordIntervals);

  const chordName = `${NOTES[root]} ${currentChordType.name}`;

  const handlePlay = () => {
      const frequencies = chordNotesMidi.map(m => 440 * Math.pow(2, (m - 69) / 12));
      playChord(frequencies);
  };

  const getAIExplanation = async () => {
    setLoading(true);
    const text = await explainConcept(chordName, `A ${currentChordType.name} chord built on ${NOTES[root]}. Intervals: ${currentChordType.intervals.join(', ')}`);
    setExplanation(text);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-amber-400 mb-4">Chords Builder</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {NOTES.map((n, i) => (
                            <button
                                key={n}
                                onClick={() => setRoot(i)}
                                className={`w-10 h-10 rounded-full font-bold transition ${
                                    root === i ? 'bg-amber-500 text-white' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                }`}
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                         {CHORD_TYPES.map((c, i) => (
                             <button
                                key={c.name}
                                onClick={() => { setChordTypeIndex(i); setExplanation(""); }}
                                className={`px-3 py-2 rounded text-sm transition ${
                                    chordTypeIndex === i 
                                    ? 'bg-amber-600/80 text-white border border-amber-500' 
                                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                                }`}
                             >
                                 {c.name}
                             </button>
                         ))}
                    </div>
                </div>

                <div className="flex items-center justify-between bg-gray-900/50 p-4 rounded-lg">
                    <span className="text-2xl font-bold text-white">{chordName}</span>
                    <div className="flex gap-2">
                        <button 
                            onClick={handlePlay}
                            className="p-3 bg-amber-600 rounded-full hover:bg-amber-500 text-white transition shadow-lg hover:shadow-amber-500/20"
                        >
                            <Volume2 size={20} />
                        </button>
                         <button 
                            onClick={getAIExplanation}
                            disabled={loading}
                            className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 text-white transition"
                            title="Ask AI"
                        >
                            <Info size={20} />
                        </button>
                    </div>
                </div>
                {explanation && (
                    <div className="text-sm text-gray-300 bg-gray-700/30 p-4 rounded border-l-2 border-amber-500">
                        {explanation}
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col justify-center items-center bg-gray-800 rounded-xl border border-gray-700 p-6">
                <Staff notes={chordNotesMidi} />
            </div>
        </div>

        <Piano 
            activeNotes={chordNotesMidi} 
            color="bg-amber-500"
            startMidi={48}
            keysCount={36}
        />
    </div>
  );
};

export default ChordsView;
