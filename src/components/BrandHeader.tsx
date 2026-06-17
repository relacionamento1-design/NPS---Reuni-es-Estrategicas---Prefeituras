import React from "react";
import { BarChart3, Edit3 } from "lucide-react";
import { Municipality } from "../types";

interface BrandHeaderProps {
  currentMunicipality: Municipality;
  municipalities: Municipality[];
  onMunicipalityChange: (m: Municipality) => void;
  isAdminMode: boolean;
  onToggleAdmin: () => void;
}

// Symmetrical vector representation of the official Connected Smart Cities Logo
export function CidadeCSCLogo({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Precise linear gradients matched to the official Plataforma CSC colors */}
        <linearGradient id="grad0" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F58F22" /> {/* Top: Orange */}
          <stop offset="100%" stopColor="#1E3E8C" /> {/* Bottom: Navy Blue */}
        </linearGradient>
        <linearGradient id="grad45" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8CC63F" /> {/* Top-Right: Lime Green */}
          <stop offset="100%" stopColor="#7F4FA0" /> {/* Bottom-Left: Violet */}
        </linearGradient>
        <linearGradient id="grad90" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7F4FA0" /> {/* Left: Violet */}
          <stop offset="100%" stopColor="#14A3A1" /> {/* Right: Teal/Cyan */}
        </linearGradient>
        <linearGradient id="grad135" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F58F22" /> {/* Top-Left: Red-Orange */}
          <stop offset="100%" stopColor="#14A3A1" /> {/* Bottom-Right: Teal */}
        </linearGradient>
        
        {/* Soft elegant glow behind the white hexagon */}
        <filter id="hexaGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#F58F22" floodOpacity="0.22" />
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* 4 overlapping capsules at 0, 45, 90, and 135 degrees with 0.88 opacity for beautiful, translucent layer blending */}
      {/* 1. Vertical Capsule (0 deg) */}
      <rect x="77" y="29" width="46" height="142" rx="23" fill="url(#grad0)" opacity="0.88" />

      {/* 2. Diagonal 1 (45 deg) */}
      <rect x="77" y="29" width="46" height="142" rx="23" transform="rotate(45 100 100)" fill="url(#grad45)" opacity="0.88" />

      {/* 3. Horizontal (90 deg) */}
      <rect x="77" y="29" width="46" height="142" rx="23" transform="rotate(90 100 100)" fill="url(#grad90)" opacity="0.88" />

      {/* 4. Diagonal 2 (135 deg) */}
      <rect x="77" y="29" width="46" height="142" rx="23" transform="rotate(135 100 100)" fill="url(#grad135)" opacity="0.88" />

      {/* Perfectly rounded white hexagon container matching the official Cidade CSC Logo */}
      <polygon 
        points="78,62 122,62 144,100 122,138 78,138 56,100" 
        fill="#FFFFFF" 
        stroke="#FFFFFF" 
        strokeWidth="18" 
        strokeLinejoin="round" 
        filter="url(#hexaGlow)"
      />

      {/* Inside Text matching the official Cidade CSC Logo styling with the premium Montserrat font */}
      <text 
        x="100" 
        y="93" 
        fill="#F58F22" 
        fontSize="17.5" 
        fontWeight="800" 
        fontFamily='"Montserrat", "Inter", sans-serif' 
        textAnchor="middle" 
        letterSpacing="-0.3"
      >
        Cidade
      </text>
      <text 
        x="100" 
        y="129" 
        fill="#F58F22" 
        fontSize="34" 
        fontWeight="900" 
        fontFamily='"Montserrat", "Inter", sans-serif' 
        textAnchor="middle" 
        letterSpacing="-1.2"
      >
        CSC
      </text>
    </svg>
  );
}

export default function BrandHeader({
  currentMunicipality,
  municipalities,
  onMunicipalityChange,
  isAdminMode,
  onToggleAdmin
}: BrandHeaderProps) {
  return (
    <header id="brand-header" className="bg-[#070E1F]/60 backdrop-blur-md border-b border-[#1E3E8C]/20 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Logo and Brand Title with white and neon text matching the screenshot */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <CidadeCSCLogo className="w-11 h-11 sm:w-13 sm:h-13 flex-none animate-pulse-slow" />
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-[9.5px] font-black tracking-widest text-[#14A3A1] uppercase font-mono">
                  Plataforma
                </span>
                <span className="bg-[#F58F22]/10 text-[#F58F22] text-[9px] font-black px-1.5 py-0.2 rounded font-mono border border-[#F58F22]/15">
                  Connected Smart Cities
                </span>
              </div>
              <h1 className="text-xs sm:text-sm font-black tracking-tight text-white font-display uppercase">
                Avaliação de Parceria Estratégica
              </h1>
              <p className="text-[10px] text-slate-400 font-medium font-sans">
                Feedback Estratégico • Coorganização Regional 2026
              </p>
            </div>
          </div>

          {/* Premium control indicators instead of loud toggle buttons */}
          <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">
            {isAdminMode ? (
              <span className="text-[#F58F22] bg-[#F58F22]/10 px-2 py-1 rounded border border-[#F58F22]/15">
                Área Executiva
              </span>
            ) : (
              <span className="text-[#14A3A1] bg-[#14A3A1]/10 px-2 py-1 rounded border border-[#14A3A1]/15">
                Canal de Prefeitura Anfitriã
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
