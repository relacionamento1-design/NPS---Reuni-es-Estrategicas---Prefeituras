import React, { useState, useEffect } from "react";
import BrandHeader, { CidadeCSCLogo } from "./components/BrandHeader";
import NPSWizardForm from "./components/NPSWizardForm";
import NPSSummaryDashboard from "./components/NPSSummaryDashboard";
import { Municipality, SurveyResponse } from "./types";
import { MUNICIPALITIES, loadResponses, saveResponse, clearAllResponses } from "./utils";
import { Sparkle, ShieldCheck, HelpCircle, Lock, FileText } from "lucide-react";

export default function App() {
  // State for all responses
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  
  // State for currently selected municipality
  const [currentMunicipality, setCurrentMunicipality] = useState<Municipality>(
    MUNICIPALITIES.find((m) => m.id === "santana-de-parnaiba") || MUNICIPALITIES[0]
  );

  // Toggle mode: false = survey wizard, true = admin dashboard
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);

  // Load from Supabase on mount
  useEffect(() => {
    async function fetchInitialData() {
      const loaded = await loadResponses();
      setResponses(loaded);
    }
    fetchInitialData();
  }, []);

  // Handle new submission
  const handleSurveySubmit = async (newResponseData: Omit<SurveyResponse, "id" | "timestamp">) => {
    const completeResponse: SurveyResponse = {
      ...newResponseData,
      id: `rep-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    
    const updated = await saveResponse(completeResponse);
    setResponses(updated);
  };



  // Handle completely clearing responses database (zeroing out)
  const handleClearData = async () => {
    const cleared = await clearAllResponses();
    setResponses(cleared);
  };



  // Secret Click counter on Logo to toggle admin mode elegantly
  const [logoClicks, setLogoClicks] = useState<number>(0);
  const handleLogoClick = () => {
    setLogoClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setIsAdminMode(!isAdminMode);
        return 0;
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#040815] bg-[radial-gradient(#14223c_1.2px,transparent_1.2px)] [background-size:24px_24px] text-slate-100 flex flex-col font-sans selection:bg-[#F58F22]/30 antialiased selection:text-white relative">
      
      {/* Sticky Top Navigation Bar to make Admin Panel perfectly visible and accessible */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#040815]/80 border-b border-[#1E3E8C]/20 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-[#070e1f] border border-[#14A3A1]/30">
              <CidadeCSCLogo className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-black text-white uppercase tracking-wider block font-sans">
                Plataforma Connected Smart Cities
              </span>
              <span className="text-[9px] text-[#14A3A1] font-mono uppercase tracking-widest block -mt-0.5">
                NPS Executive Dashboard
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border shadow-md cursor-pointer ${
              isAdminMode 
                ? "bg-[#1E3E8C]/20 hover:bg-[#1E3E8C]/35 text-[#F58F22] border-[#1E3E8C]/30"
                : "bg-gradient-to-r from-[#14A3A1] to-[#8ac926] hover:scale-[1.02] active:scale-[0.98] text-[#070e1f] border-transparent font-black"
            }`}
          >
            {isAdminMode ? (
              <>
                <FileText className="w-3.5 h-3.5" />
                <span>Voltar à Pesquisa</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-[#070e1f]" />
                <span>Acessar Painel ADM</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Centered Top Brand Area */}
      <div className="text-center max-w-2xl mx-auto pt-10 pb-6 sm:pb-8 animate-fade-in relative select-none">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#14A3A1]/5 rounded-full blur-[60px] pointer-events-none" />
        
        {/* Centered Logo with 5-click secret admin toggle */}
        <div 
          onClick={handleLogoClick}
          className="inline-block cursor-pointer transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
          title="Clique 5 vezes para alternar o painel"
        >
          <CidadeCSCLogo className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 drop-shadow-[0_4px_20px_rgba(245,143,34,0.15)] relative z-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-1 relative z-10 font-sans">
          REUNIÕES ESTRATÉGICAS 2026
        </h1>
        
        <div className="flex items-center justify-center mb-3 relative z-10">
          <span className="bg-[#F58F22]/10 text-[#F58F22] text-[10.5px] font-black px-3 py-1 rounded-md uppercase tracking-widest font-sans border border-[#F58F22]/20">
            Plataforma CSC
          </span>
        </div>
        
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto relative z-10 font-sans font-medium px-4">
          {isAdminMode 
            ? "Painel de Consolidação Técnica e Indicadores de Parceria das Prefeituras Anfitriãs"
            : "Avaliação de parceria e coprodução técnica das prefeituras brasileiras anfitriãs e coorganizadoras dos encontros regionais."}
        </p>

        {isAdminMode && (
          <div className="mt-4 inline-flex items-center space-x-2 bg-[#F58F22]/10 border border-[#F58F22]/20 px-3 py-1 rounded-full relative z-10 animate-pulse">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F58F22]" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F58F22]">
              Área Executiva do Conselho
            </span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main id="main-content-area" className="flex-grow pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Dynamic Context Header matching the requested screenshot setup */}
        {isAdminMode && (
          <div className="mb-6 max-w-2xl mx-auto bg-[#0B1528] py-4 px-6 rounded-2xl border border-[#1E3E8C]/30 flex flex-wrap items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center space-x-3">
              <div className="bg-[#1E3E8C]/25 p-2 rounded-xl text-[#14A3A1] border border-[#1E3E8C]/45 shadow-[0_0_10px_rgba(20,163,161,0.1)]">
                <ShieldCheck className="w-4 h-4 text-[#F58F22]" />
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Painel Autenticado de Consolidação</span>
                <span className="text-xs font-bold text-white">Conselho Estratégico Corporativo</span>
              </div>
            </div>
            <div className="text-[10.5px] text-slate-400 font-bold font-sans flex items-center space-x-3">
              <button
                onClick={() => setIsAdminMode(false)}
                className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-700/60 px-3 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer"
              >
                Voltar à Pesquisa
              </button>
            </div>
          </div>
        )}

        {/* Core Component Views with Motion Transitions */}
        <div className="transition-all duration-300">
          {!isAdminMode ? (
            <NPSWizardForm
              municipality={currentMunicipality}
              onSubmit={handleSurveySubmit}
            />
          ) : (
            <NPSSummaryDashboard
              responses={responses}
              municipalities={MUNICIPALITIES}
              onClearData={handleClearData}
            />
          )}
        </div>

      </main>

      {/* Tiny almost fully transparent trigger for admin console at the absolute bottom - zero clutter */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-5 hover:opacity-100 transition-opacity duration-300 text-[9px] font-mono select-none">
        <button 
          onClick={() => setIsAdminMode(!isAdminMode)} 
          className="text-slate-500 hover:text-[#14A3A1] cursor-pointer"
        >
          {isAdminMode ? ":: view form ::" : ":: view admin ::"}
        </button>
      </div>
    </div>
  );
}
