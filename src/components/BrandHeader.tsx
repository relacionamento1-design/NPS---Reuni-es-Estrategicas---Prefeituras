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
        {/* Glow and Drop Shadow effects for high-end professional appearance */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.25" />
        </filter>
        
        {/* Gradients for node connection aesthetics */}
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14A3A1" />
          <stop offset="100%" stopColor="#F58F22" />
        </linearGradient>
      </defs>

      {/* Symmetrical High-Tech "Smart Cities" Network Connections (Constellation Grid) */}
      {/* 1. Outer rings to give a "radar/sphere" feel */}
      <circle cx="100" cy="100" r="64" stroke="#1E3E8C" strokeWidth="1" strokeDasharray="3 3" opacity="0.35" />
      <circle cx="100" cy="100" r="44" stroke="#14A3A1" strokeWidth="1" strokeDasharray="4 4" opacity="0.25" />

      {/* 2. Core connectivity circuit lines representing modern networked systems */}
      {/* Center spoke radial lines */}
      <line x1="100" y1="100" x2="100" y2="36" stroke="#475569" strokeWidth="1.5" opacity="0.7" />
      <line x1="100" y1="100" x2="155.4" y2="68" stroke="#475569" strokeWidth="1.5" opacity="0.7" />
      <line x1="100" y1="100" x2="155.4" y2="132" stroke="#475569" strokeWidth="1.5" opacity="0.7" />
      <line x1="100" y1="100" x2="100" y2="164" stroke="#475569" strokeWidth="1.5" opacity="0.7" />
      <line x1="100" y1="100" x2="44.6" y2="132" stroke="#475569" strokeWidth="1.5" opacity="0.7" />
      <line x1="100" y1="100" x2="44.6" y2="68" stroke="#475569" strokeWidth="1.5" opacity="0.7" />

      {/* Outer boundary octagon/hexagon line loops */}
      <polygon 
        points="100,36 155.4,68 155.4,132 100,164 44.6,132 44.6,68" 
        stroke="url(#lineGrad)" 
        strokeWidth="2" 
        strokeLinejoin="round" 
        opacity="0.6"
      />

      {/* 3. Smart Cities Constellation Nodes (Interactive colored vertices) */}
      <circle cx="100" cy="36" r="8" fill="#F58F22" filter="url(#glow)" />   {/* Orange */}
      <circle cx="155.4" cy="68" r="8" fill="#8CC63F" filter="url(#glow)" /> {/* Lime Green */}
      <circle cx="155.4" cy="132" r="8" fill="#14A3A1" filter="url(#glow)" />{/* Teal */}
      <circle cx="100" cy="164" r="8" fill="#1E3E8C" filter="url(#glow)" />  {/* Navy Blue */}
      <circle cx="44.6" cy="132" r="8" fill="#7F4FA0" filter="url(#glow)" /> {/* Purple */}
      <circle cx="44.6" cy="68" r="8" fill="#F58F22" filter="url(#glow)" />   {/* Accent Orange */}

      {/* 4. Elegant circular high-contrast container in the center */}
      <circle cx="100" cy="100" r="42" fill="#FFFFFF" filter="url(#shadow)" stroke="#E2E8F0" strokeWidth="1" />

      {/* 5. Minimalist & high-legibility typographic mark */}
      <text 
        x="100" 
        y="91" 
        fill="#1E3E8C" 
        fontSize="12.5" 
        fontWeight="800" 
        fontFamily='"Montserrat", "Inter", sans-serif' 
        textAnchor="middle" 
        letterSpacing="0.2"
      >
        Cidade
      </text>
      <text 
        x="100" 
        y="120" 
        fill="#F58F22" 
        fontSize="24" 
        fontWeight="900" 
        fontFamily='"Montserrat", "Inter", sans-serif' 
        textAnchor="middle" 
        letterSpacing="-0.8"
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
