import React, { useState, useEffect } from 'react';
import Piano from './Piano';
import Staff from './Staff';
import { getIntervalName } from '../utils/musicTheory';
import { explainConcept } from '../services/geminiService';
import { Play, RotateCcw, Info } from 'lucide-react';
import { playNote } from '../utils/audio';

const IntervalsView: React.FC = () => {
  const [notes, setNotes] = useState<number[]>([]); // Max 2 notes
  const [explanation, setExplanation] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleNoteClick = (midi: number) => {
    if (notes.length === 2) {
      setNotes([midi]);
      setExplanation("");
    } else {
      setNotes([...notes, midi].sort((a, b) => a - b));
    }
  };

  const intervalValue = notes.length === 2 ? notes[1] - notes[0] : null;
  const intervalName = intervalValue !== null ? getIntervalName(intervalValue) : "Select 2 notes";

  const getAIExplanation = async () => {
    if (intervalValue === null) return;
    setLoading(true);
    const text = await explainConcept(intervalName, `An interval of ${intervalValue} semitones between MIDI notes ${notes[0]} and ${notes[1]}`);
    setExplanation(text);
    setLoading(false);
  };

  const playInterval = () => {
      if (notes.length > 0) {
          playNote(440 * Math.pow(2, (notes[0] - 69) / 12), 0.5);
          if(notes[1]) {
             setTimeout(() => playNote(440 * Math.pow(2, (notes[1] - 69) / 12), 0.5), 500);
          }
      }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-4">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h2 className="text-2xl font-bold mb-2 text-indigo-400">Intervals</h2>
                <p className="text-gray-300 mb-4">Select two notes on the piano to see the interval name and staff notation.</p>
                
                <div className="flex items-center gap-4 mb-4 bg-gray-900/50 p-4 rounded-lg">
                    <div className="text-3xl font-mono text-white">{intervalName}</div>
                    {intervalValue !== null && <span className="text-sm text-gray-400">({intervalValue} semitones)</span>}
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={() => setNotes([])}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition"
                    >
                        <RotateCcw size={16} /> Reset
                    </button>
                     <button 
                        onClick={playInterval}
                        disabled={notes.length === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded text-sm transition"
                    >
                        <Play size={16} /> Play
                    </button>
                    {intervalValue !== null && (
                        <button 
                            onClick={getAIExplanation}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded text-sm transition ml-auto"
                        >
                            <Info size={16} /> {loading ? "Asking Gemini..." : "Ask AI Tutor"}
                        </button>
                    )}
                </div>
            </div>
             {explanation && (
                <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-xl border-l-4 border-rose-500 shadow-lg animate-slide-up">
                    <h3 className="font-bold text-rose-400 mb-2 flex items-center gap-2">
                         Gemini Explanation
                    </h3>
                    <p className="text-gray-200 leading-relaxed">{explanation}</p>
                </div>
            )}
        </div>
        
        <div className="flex-1 flex flex-col gap-4 justify-center">
             <Staff notes={notes} />
        </div>
      </div>

      <Piano 
        activeNotes={notes} 
        onKeyClick={handleNoteClick}
        color="bg-indigo-500"
      />
    </div>
  );
};

export default IntervalsView;
