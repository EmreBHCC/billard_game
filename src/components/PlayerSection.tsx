import { Plus, Minus, Edit2, Check } from 'lucide-react';
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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

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
      <div className="absolute top-4 w-full flex justify-center items-center z-10">
        {isEditing ? (
          <div className="flex items-center gap-2 bg-zinc-900 border border-red-900/50 rounded-lg px-2 py-1 shadow-lg">
            <input
              ref={inputRef}
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={handleKeyDown}
              className="bg-transparent text-center font-bold text-lg outline-none w-32 text-white"
              maxLength={12}
            />
            <button onClick={handleNameSubmit} className="text-red-500 hover:text-red-400">
              <Check size={18} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3 py-1 rounded-full hover:bg-zinc-900 transition-colors group border border-transparent hover:border-zinc-800"
          >
            <span className="font-bold text-xl tracking-wide uppercase text-zinc-400 group-hover:text-white transition-colors">{name}</span>
            <Edit2 size={14} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
          </button>
        )}
      </div>

      {/* Score Display */}
      <div className="flex-1 flex items-center justify-center w-full my-2">
        <motion.div
          key={score}
          initial={{ scale: 0.9, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`font-mono font-black text-[clamp(5rem,18vw,12rem)] leading-none tabular-nums select-none ${
            score < 0 ? 'text-red-600' : 'text-white'
          }`}
          style={{ textShadow: '0 0 40px rgba(220, 38, 38, 0.2)' }}
        >
          {score}
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex gap-6 w-full justify-center z-10 pb-4">
        <button
          onClick={() => onUpdateScore(id, -1)}
          className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-red-900/50 active:scale-95 flex items-center justify-center transition-all group"
          aria-label="Decrease Score"
        >
          <Minus size={28} className="text-zinc-500 group-hover:text-red-500 transition-colors" />
        </button>
        <button
          onClick={() => onUpdateScore(id, 1)}
          className="w-16 h-16 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-95 flex items-center justify-center transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]"
          aria-label="Increase Score"
        >
          <Plus size={32} className="text-white" />
        </button>
      </div>
    </div>
  );
}
