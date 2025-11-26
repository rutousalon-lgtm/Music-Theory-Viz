import React, { useState } from 'react';
import { KEY_SIGNATURES, NOTES } from '../utils/musicTheory';
import Staff from './Staff';
import Piano from './Piano';
import { explainConcept } from '../services/geminiService';
import { Info } from 'lucide-react';

const KeysView: React.FC = () => {
  const [selectedKeyIndex, setSelectedKeyIndex] = useState(0);
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const currentKey = KEY_SIGNATURES[selectedKeyIndex];

  // Map scale notes to C-based chromatic index for piano visualization
  const scaleIndices = currentKey.notes.map(n => {
      // Handle simple enharmonics manually for visualization indices
      if (n === 'Cb') return 11; // B
      if (n === 'Fb') return 4; // E
      if (n === 'E#') return 5; // F
      if (n === 'B#') return 0; // C
      
      const normalized = n.replace('b', '').replace('#', '');
      let idx = NOTES.indexOf(normalized as any);
      if (idx === -1) idx = 0;
      
      if (n.includes('#')) idx = (idx + 1) % 12;
      if (n.includes('b')) idx = (idx - 1 + 12) % 12;
      
      return idx;
  });

  const activeNotes: number[] = [];
  // Populate active MIDI notes for the piano (2 octaves)
  for(let m=48; m<72; m++) {
      if(scaleIndices.includes(m % 12)) activeNotes.push(m);
  }

  const getAIExplanation = async () => {
    setLoading(true);
    const text = await explainConcept(currentKey.name, `The key signature with ${currentKey.sharps} sharps and ${currentKey.flats} flats.`);
    setExplanation(text);
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
       <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h2 className="text-2xl font-bold mb-4 text-emerald-400">Key Signatures</h2>
                <div className="grid grid-cols-3 gap-2 mb-6">
                    {KEY_SIGNATURES.map((k, i) => (
                        <button
                            key={k.name}
                            onClick={() => { setSelectedKeyIndex(i); setExplanation(""); }}
                            className={`p-2 rounded text-sm font-medium transition ${
                                selectedKeyIndex === i 
                                ? 'bg-emerald-600 text-white shadow-lg' 
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {k.name}
                        </button>
                    ))}
                </div>
                
                <div className="flex justify-between items-center bg-gray-900/50 p-4 rounded-lg mb-4">
                    <div>
                        <div className="text-gray-400 text-sm">Accidentals</div>
                        <div className="text-xl font-bold text-white">
                            {currentKey.sharps > 0 ? `${currentKey.sharps} Sharps` : currentKey.flats > 0 ? `${currentKey.flats} Flats` : 'Natural'}
                        </div>
                    </div>
                     <button 
                        onClick={getAIExplanation}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 rounded text-sm transition"
                    >
                        <Info size={16} /> Explain Key
                    </button>
                </div>
                 {explanation && (
                    <div className="bg-gray-700/50 p-4 rounded-lg border-l-2 border-emerald-500 text-sm text-gray-200">
                        {explanation}
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center bg-gray-800 rounded-xl border border-gray-700 p-4">
                 <h3 className="text-gray-400 mb-4">Scale Notes on Treble Clef</h3>
                 <Staff notes={activeNotes.filter(n => n >= 60 && n <= 72)} /> 
            </div>
       </div>

       <Piano 
        activeNotes={activeNotes} 
        color="bg-emerald-500"
       />
    </div>
  );
};

export default KeysView;