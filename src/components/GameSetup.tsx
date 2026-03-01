import { Users, User, Play, RefreshCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import klasLogo from '../assets/klas-logo.svg';

interface GameSetupProps {
  onStartGame: (players: { name: string; score: number }[]) => void;
}

export function GameSetup({ onStartGame }: GameSetupProps) {
  const [playerCount, setPlayerCount] = useState<3 | 4>(3);
  const [playerScores, setPlayerScores] = useState<number[]>([10, 10, 10, 10]);
  const [globalScore, setGlobalScore] = useState(10);

  // Update scores array when player count changes (ensure length)
  useEffect(() => {
    setPlayerScores(prev => {
      const newScores = [...prev];
      while (newScores.length < 4) newScores.push(globalScore);
      return newScores.slice(0, 4); // Keep 4 max for state simplicity
    });
  }, [playerCount, globalScore]);

  const handleGlobalScoreChange = (newScore: number) => {
    const validScore = Math.max(0, newScore);
    setGlobalScore(validScore);
    setPlayerScores(new Array(4).fill(validScore));
  };

  const handlePlayerScoreChange = (index: number, delta: number) => {
    setPlayerScores(prev => {
      const newScores = [...prev];
      newScores[index] = Math.max(0, newScores[index] + delta);
      return newScores;
    });
  };

  const handleStart = () => {
    const activePlayers = playerScores.slice(0, playerCount).map((score, i) => ({
      name: `OYUNCU ${i + 1}`,
      score
    }));
    onStartGame(activePlayers);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-3 md:p-4 text-center text-white overflow-y-auto">
      <div className="w-full max-w-lg space-y-4 md:space-y-6 py-6 md:py-8">
        {/* Logo */}
        <div className="flex justify-center transform scale-100 md:scale-125 mb-2 md:mb-4">
          <img 
            src={klasLogo} 
            alt="Klas Bilardo" 
            className="h-16 md:h-20 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.innerHTML = '<span class="text-2xl md:text-3xl font-black italic tracking-tighter text-white">KLAS<span class="text-red-600">BİLARDO</span></span>';
            }}
          />
        </div>

        {/* Player Count Selection */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 backdrop-blur-sm">
          <h3 className="text-red-500 font-bold uppercase tracking-widest text-xs mb-3">Oyuncu Sayısı</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPlayerCount(3)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                playerCount === 3
                  ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/20'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
              }`}
            >
              <User size={24} className="mb-1" />
              <span className="text-lg font-bold">3 Kişi</span>
            </button>

            <button
              onClick={() => setPlayerCount(4)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                playerCount === 4
                  ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/20'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
              }`}
            >
              <Users size={24} className="mb-1" />
              <span className="text-lg font-bold">4 Kişi</span>
            </button>
          </div>
        </div>

        {/* Scores Configuration */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-red-500 font-bold uppercase tracking-widest text-xs">Başlangıç Puanları</h3>
            <button 
              onClick={() => handleGlobalScoreChange(10)}
              className="text-xs text-zinc-500 hover:text-white flex items-center gap-1"
            >
              <RefreshCcw size={12} /> Sıfırla (10)
            </button>
          </div>

          <div className="space-y-3">
            {Array.from({ length: playerCount }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 bg-black/40 p-2 rounded-lg border border-zinc-800/50">
                <span className="text-zinc-400 font-bold text-sm w-20 text-left">OYUNCU {i + 1}</span>
                <div className="flex-1 flex items-center justify-end gap-2">
                  <button 
                    onClick={() => handlePlayerScoreChange(i, -1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-mono text-xl font-bold">{playerScores[i]}</span>
                  <button 
                    onClick={() => handlePlayerScoreChange(i, 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full py-4 md:py-5 bg-white text-black text-lg md:text-xl font-black uppercase tracking-widest rounded-2xl hover:bg-zinc-200 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl flex items-center justify-center gap-2 md:gap-3"
        >
          <Play fill="currentColor" className="w-5 h-5 md:w-6 md:h-6" />
          Oyunu Başlat
        </button>
      </div>
    </div>
  );
}
