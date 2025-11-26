import React, { useState } from 'react';
import { ViewMode } from './types';
import IntervalsView from './components/IntervalsView';
import KeysView from './components/KeysView';
import ChordsView from './components/ChordsView';
import { Music, Key, Layers, Mic2 } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.INTERVALS);

  const NavButton = ({ mode, icon: Icon, label }: { mode: ViewMode, icon: any, label: string }) => (
    <button
      onClick={() => setView(mode)}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
        view === mode 
        ? 'bg-gray-100 text-gray-900 shadow-lg scale-105' 
        : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Music className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Music Theory Viz</h1>
          </div>
          
          <nav className="hidden md:flex gap-2">
            <NavButton mode={ViewMode.INTERVALS} icon={Layers} label="Intervals" />
            <NavButton mode={ViewMode.KEYS} icon={Key} label="Key Signatures" />
            <NavButton mode={ViewMode.CHORDS} icon={Mic2} label="Chords" />
          </nav>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className="md:hidden flex justify-around border-b border-gray-800 p-2 sticky top-20 bg-gray-900 z-40">
         <button onClick={() => setView(ViewMode.INTERVALS)} className={`p-2 rounded ${view === ViewMode.INTERVALS ? 'bg-gray-800 text-white' : 'text-gray-500'}`}><Layers size={20}/></button>
         <button onClick={() => setView(ViewMode.KEYS)} className={`p-2 rounded ${view === ViewMode.KEYS ? 'bg-gray-800 text-white' : 'text-gray-500'}`}><Key size={20}/></button>
         <button onClick={() => setView(ViewMode.CHORDS)} className={`p-2 rounded ${view === ViewMode.CHORDS ? 'bg-gray-800 text-white' : 'text-gray-500'}`}><Mic2 size={20}/></button>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="min-h-[600px]">
          {view === ViewMode.INTERVALS && <IntervalsView />}
          {view === ViewMode.KEYS && <KeysView />}
          {view === ViewMode.CHORDS && <ChordsView />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 mt-12 text-center text-gray-500 text-sm">
        <p>Built with React, Tailwind, and Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
