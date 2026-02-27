/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { GameSetup } from './components/GameSetup';
import { PlayerSection } from './components/PlayerSection';
import { RotateCcw, Settings, X, Home, Check } from 'lucide-react';

interface Player {
  id: number;
  name: string;
  score: number;
  initialScore: number;
}

export default function App() {
  const [gameMode, setGameMode] = useState<3 | 4 | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: 'reset' | 'exit', message: string } | null>(null);

  const handleStartGame = (configuredPlayers: { name: string; score: number }[]) => {
    setGameMode(configuredPlayers.length as 3 | 4);
    
    const newPlayers = configuredPlayers.map((p, i) => ({
      id: i + 1,
      name: p.name,
      score: p.score,
      initialScore: p.score
    }));
    
    setPlayers(newPlayers);
    setShowSettings(false);
  };

  const updateScore = (scorerId: number, delta: number) => {
    if (!gameMode) return;
    
    const playerCount = gameMode;
    const scoreChangeForScorer = (playerCount - 1) * delta;
    const scoreChangeForOthers = -1 * delta;

    setPlayers(prev => prev.map(p => {
      if (p.id === scorerId) {
        return { ...p, score: p.score + scoreChangeForScorer };
      } else {
        return { ...p, score: p.score + scoreChangeForOthers };
      }
    }));
  };

  const updateName = (id: number, newName: string) => {
    setPlayers(prev => prev.map(p => (p.id === id ? { ...p, name: newName } : p)));
  };

  const handleResetScores = () => {
    setPlayers(prev => prev.map(p => ({ ...p, score: p.initialScore })));
    setConfirmAction(null);
    setShowSettings(false);
  };

  const handleExitGame = () => {
    setGameMode(null);
    setPlayers([]);
    setConfirmAction(null);
    setShowSettings(false);
  };

  if (!gameMode) {
    return <GameSetup onStartGame={handleStartGame} />;
  }

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col">
      {/* Header with Logo */}
      <div className="h-24 md:h-32 flex items-center justify-between px-6 bg-zinc-950 border-b border-zinc-800 z-20 shrink-0 relative shadow-2xl">
        {/* Home Button */}
        <button
          onClick={() => setConfirmAction({ type: 'exit', message: 'Ana sayfaya dönmek istiyor musunuz?' })}
          className="p-3 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-zinc-900"
        >
          <Home size={28} />
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center h-full py-1 w-full max-w-[60%] md:max-w-[50%]">
          <img 
            src="/klas-logo.jpg" 
            alt="Klas Bilardo" 
            className="h-full w-auto max-h-full object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<span class="text-3xl font-black italic tracking-tighter text-white">KLAS<span class="text-red-600">BİLARDO</span></span>';
            }}
          />
        </div>
        
        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-3 transition-colors rounded-full hover:bg-zinc-900 ${showSettings ? 'text-white bg-zinc-900' : 'text-zinc-400 hover:text-white'}`}
        >
          <Settings size={28} />
        </button>
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl transform scale-100 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-white mb-2 text-center">Emin misiniz?</h3>
            <p className="text-zinc-400 text-center mb-6">{confirmAction.message}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 py-3 rounded-xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={confirmAction.type === 'reset' ? handleResetScores : handleExitGame}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition-colors"
              >
                Evet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Menu Overlay */}
      {showSettings && (
        <>
          <div 
            className="absolute inset-0 z-40 bg-black/20" 
            onClick={() => setShowSettings(false)}
          />
          <div className="absolute top-16 right-4 z-50 flex flex-col gap-2 min-w-[220px] animate-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => setConfirmAction({ type: 'reset', message: 'Tüm skorlar başlangıç puanına dönecek.' })}
              className="flex items-center gap-3 px-4 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white hover:bg-zinc-800 hover:border-red-900 transition-all shadow-xl font-bold uppercase text-sm tracking-wider group"
            >
              <div className="p-2 bg-zinc-800 rounded-lg group-hover:bg-red-600/20 group-hover:text-red-500 transition-colors">
                <RotateCcw size={20} />
              </div>
              Skorları Sıfırla
            </button>
            <button
              onClick={() => setConfirmAction({ type: 'exit', message: 'Mevcut oyun sonlandırılacak.' })}
              className="flex items-center gap-3 px-4 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-white transition-all shadow-xl font-bold uppercase text-sm tracking-wider group"
            >
              <div className="p-2 bg-zinc-800 rounded-lg group-hover:bg-zinc-700 transition-colors">
                <Home size={20} />
              </div>
              Ana Sayfa
            </button>
          </div>
        </>
      )}

      {/* Game Grid */}
      <div className={`flex-1 grid gap-1 p-1 min-h-0 w-full z-10 ${
        gameMode === 3 
          ? 'grid-rows-3 md:grid-rows-1 md:grid-cols-3' 
          : 'grid-rows-4 md:grid-rows-2 md:grid-cols-2'
      }`}>
        {players.map(player => (
          <div key={player.id} className="relative w-full h-full min-h-0 p-1">
            <PlayerSection
              {...player}
              onUpdateScore={updateScore}
              onUpdateName={updateName}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
