import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className} group`}>
      {/* Background Shape */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl shadow-lg shadow-blue-200 transform rotate-3 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:shadow-blue-300"></div>
      
      {/* SVG Icon: Stylized AI Brain */}
      <svg 
        className="relative z-10 w-3/5 h-3/5 text-white drop-shadow-md transition-transform duration-300 group-hover:scale-95" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        {/* Brain Left Hemisphere */}
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-4Z" />
        {/* Brain Right Hemisphere */}
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-4Z" />
        {/* Central Synapse/Node - The "AI" Spark */}
        <path d="M12 11v3" strokeWidth="1.5" opacity="0.8" />
        <circle cx="12" cy="7" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    </div>
  );
};