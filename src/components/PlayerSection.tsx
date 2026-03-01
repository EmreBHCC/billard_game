import { Plus, Minus, Edit2, Check, X } from 'lucide-react';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion } from 'motion/react';

interface PlayerSectionProps {
  id: number;
  name: string;
  score: number;
  onUpdateScore: (id: number, delta: number) => void;
  onUpdateName: (id: number, newName: string) => void;
}

export function PlayerSection({ id, name, score, onUpdateScore, onUpdateName }: PlayerSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [pendingDelta, setPendingDelta] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      if (isEditing) return; // Enter is used to submit name here
      
      if (pendingDelta !== 0 && e.key === 'Enter') {
        onUpdateScore(id, pendingDelta);
        setPendingDelta(0);
      } else if (pendingDelta !== 0 && e.key === 'Escape') {
        setPendingDelta(0);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [pendingDelta, id, onUpdateScore, isEditing]);

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      onUpdateName(id, tempName);
    } else {
      setTempName(name); // Revert if empty
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full p-2 bg-black border-2 border-zinc-800 rounded-xl overflow-hidden">
      {/* Decorative Red Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-red-600 blur-[20px] opacity-50" />

      {/* Name Section */}
      <div className="w-full flex justify-center items-center z-10 pt-1 md:pt-2">
        {isEditing ? (
          <div className="flex items-center gap-2 bg-zinc-900 border border-red-900/50 rounded-lg px-2 py-1 shadow-lg max-w-[90%]">
            <input
              ref={inputRef}
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={handleKeyDown}
              className="bg-transparent text-center font-bold text-sm md:text-lg outline-none w-24 md:w-32 text-white"
              maxLength={12}
            />
            <button onClick={handleNameSubmit} className="text-red-500 hover:text-red-400">
              <Check className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 rounded-full hover:bg-zinc-900 transition-colors group border border-transparent hover:border-zinc-800"
          >
            <span className="font-bold text-sm md:text-xl tracking-wide uppercase text-zinc-400 group-hover:text-white transition-colors truncate max-w-[120px] md:max-w-none">{name}</span>
            <Edit2 className="w-3 h-3 md:w-4 md:h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
          </button>
        )}
      </div>

      {/* Score Display */}
      <div className="flex-1 flex items-center justify-center w-full my-1 md:my-2">
        <motion.div
          key={score}
          initial={{ scale: 0.9, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`font-mono font-black text-[clamp(3rem,min(18vw,30vh),10rem)] leading-none tabular-nums select-none ${
            score < 0 ? 'text-red-600' : 'text-white'
          }`}
          style={{ textShadow: '0 0 40px rgba(220, 38, 38, 0.2)' }}
        >
          {score}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center w-full justify-center z-10 pb-2 md:pb-4 relative">
        <div className="flex gap-3 md:gap-6 w-full justify-center">
          <button
            onClick={() => setPendingDelta(prev => prev - 1)}
            className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-red-900/50 active:scale-95 flex items-center justify-center transition-all group shadow-lg"
            aria-label="Decrease Score"
          >
            <Minus className="w-6 h-6 md:w-7 md:h-7 text-zinc-500 group-hover:text-red-500 transition-colors" />
          </button>
          <button
            onClick={() => setPendingDelta(prev => prev + 1)}
            className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-red-600 hover:bg-red-500 active:scale-95 flex items-center justify-center transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]"
            aria-label="Increase Score"
          >
            <Plus className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </button>
        </div>

        {/* Pending Score Actions */}
        {pendingDelta !== 0 && (
          <div className="absolute -top-16 md:-top-24 flex items-center gap-1 md:gap-2 bg-zinc-950/95 backdrop-blur-md border border-zinc-700/50 rounded-full p-1.5 md:p-2 shadow-[0_0_40px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in slide-in-from-bottom-4 duration-200 z-50">
            <button
              onClick={() => setPendingDelta(0)}
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full text-zinc-400 hover:text-red-400 transition-all shrink-0"
              aria-label="Cancel"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <div className={`font-mono font-black text-2xl md:text-3xl min-w-[3.5rem] md:min-w-[4.5rem] text-center tracking-tighter shrink-0 ${pendingDelta > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {pendingDelta > 0 ? `+${pendingDelta}` : pendingDelta}
            </div>
            <button
              onClick={() => { onUpdateScore(id, pendingDelta); setPendingDelta(0); }}
              className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-green-600 hover:bg-green-500 rounded-full text-white transition-all shadow-[0_0_20px_rgba(22,163,74,0.3)] hover:shadow-[0_0_30px_rgba(22,163,74,0.5)] shrink-0"
              aria-label="Confirm"
            >
              <Check className="w-6 h-6 md:w-7 md:h-7 stroke-[3]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
