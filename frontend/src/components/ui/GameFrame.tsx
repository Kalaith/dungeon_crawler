import React from 'react';

interface GameFrameProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const GameFrame: React.FC<GameFrameProps> = ({ children, className = '', title }) => {
  return (
    <div className={`relative bg-etrian-800/95 border border-cyan-500 p-1 ${className}`}>
      {/* Inner Border Container */}
      <div className="relative h-full w-full border border-cyan-900/50 p-2 md:p-4">
        {/* Optional Title */}
        {title && (
          <div className="absolute -top-3 left-4 bg-etrian-800 px-2 text-gold-500 font-header text-sm tracking-wider border-x border-cyan-900/50">
            {title}
          </div>
        )}

        {/* Corner Accents (Decorative) */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400" />

        {/* Content */}
        {children}
      </div>
    </div>
  );
};
