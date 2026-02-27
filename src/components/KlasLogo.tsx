import { motion } from 'motion/react';

export function KlasLogo({ className = "h-16" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg 
        viewBox="0 0 500 150" 
        className="h-full w-full overflow-visible" 
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Red Crescent Shape */}
        <path
          d="M 120,10 Q 10,75 120,140 Q 70,75 120,10 Z"
          fill="#DC2626"
        />
        
        {/* KLAS Text */}
        <text 
          x="130" 
          y="110" 
          fontFamily="Arial, Helvetica, sans-serif" 
          fontWeight="900" 
          fontStyle="italic" 
          fontSize="110" 
          fill="white" 
          letterSpacing="-4"
        >
          KLAS
        </text>
        
        {/* BİLARDO Text */}
        <text 
          x="400" 
          y="140" 
          fontFamily="Arial, Helvetica, sans-serif" 
          fontWeight="bold" 
          fontStyle="italic" 
          fontSize="32" 
          fill="white" 
          letterSpacing="4"
          textAnchor="end"
        >
          BİLARDO
        </text>
      </svg>
    </div>
  );
}
