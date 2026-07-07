import React, { useState, useMemo } from "react";
import {
  Lock,
  ShieldAlert,
  ArrowRight,
  Download,
  RefreshCw,
  Search,
  Smile,
  Meh,
  Frown,
  Filter,
  User,
  Database,
  Building2,
  ChevronDown,
  Sparkle,
  Phone,
  Mail,
  Sliders,
  HelpCircle,
  MessageSquare,
  TrendingUp,
  Heart
} from "lucide-react";
import { SurveyResponse, Municipality } from "../types";
import { calculateNps, exportToCSV, MUNICIPALITIES, IMPACT_OPTIONS } from "../utils";

interface NPSSummaryDashboardProps {
  responses: SurveyResponse[];
  municipalities: Municipality[];
  onClearData: () => void;
}

export default function NPSSummaryDashboard({
  responses,
  municipalities,
  onClearData
}: NPSSummaryDashboardProps) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  // Confirmation Modal States
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Filters State
  const [selectedMuniFilter, setSelectedMuniFilter] = useState<string>("all");
  const [selectedNpsFilter, setSelectedNpsFilter] = useState<string>("all"); // "all", "promoter", "neutral", "detractor"
  const [selectedEngagementFilter, setSelectedEngagementFilter] = useState<string>("all"); // "all", "total", "depende", "indisponivel"
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showAdvanceFilters, setShowAdvanceFilters] = useState<boolean>(false);

  // Authentication Handle
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "csc2026") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Senha incorreta. Por favor, insira a credencial administrativa correta.");
    }
  };

  // Filtered responses logic
  const filteredResponses = useMemo(() => {
    return responses.filter((res) => {
      // 1. Prefeitura Filter
      if (selectedMuniFilter !== "all" && res.municipalityId !== selectedMuniFilter) {
        return false;
      }
      
      // 2. Satisfaction (NPS) Filter (9-10 Promoter, 7-8 Passive, 0-6 Detractor)
      if (selectedNpsFilter !== "all") {
        if (selectedNpsFilter === "promoter" && res.ratingNps < 9) return false;
        if (selectedNpsFilter === "neutral" && (res.ratingNps < 7 || res.ratingNps > 8)) return false;
        if (selectedNpsFilter === "detractor" && res.ratingNps >= 7) return false;
      }

      // 3. Engagement format Filter
      if (selectedEngagementFilter !== "all" && res.engagementFormat !== selectedEngagementFilter) {
        return false;
      }

      // 4. Term Search
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        const matchesQuery =
          (res.npsJustification || "").toLowerCase().includes(query) ||
          (res.contactName || "").toLowerCase().includes(query) ||
          (res.contactRole || "").toLowerCase().includes(query) ||
          (res.suggestionsImprovement || "").toLowerCase().includes(query) ||
          res.municipalityName.toLowerCase().includes(query);
          
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [responses, selectedMuniFilter, selectedNpsFilter, selectedEngagementFilter, searchTerm]);

  // Calculate Metrics based on filtered set
  const metrics = useMemo(() => {
    return calculateNps(filteredResponses);
  }, [filteredResponses]);

  // Get NPS classification tier
  const getNpsTier = (score: number) => {
    if (score < 0) return { text: "Zona Crítica", color: "text-rose-400 bg-rose-950/25 border-rose-900/40" };
    if (score <= 50) return { text: "Zona de Aperfeiçoamento", color: "text-amber-400 bg-amber-950/25 border-amber-900/40" };
    if (score <= 75) return { text: "Zona de Qualidade", color: "text-sky-400 bg-sky-950/25 border-sky-900/40" };
    return { text: "Zona de Excelência", color: "text-emerald-400 bg-emerald-950/25 border-emerald-900/40" };
  };



  // Auth block - Styled in premium dark theme with zero emoticons
  if (!isAuthenticated) {
    return (
      <div id="admin-auth-container" className="max-w-md mx-auto bg-[#070E1F]/90 border border-[#1E345E]/50 rounded-[24px] p-8 sm:p-10 shadow-2xl text-center backdrop-blur-md">
        <div className="bg-[#1E3E8C]/15 text-[#14A3A1] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-[#1E3E8C]/30 shadow-[0_0_15px_rgba(20,163,161,0.1)]">
          <Lock className="w-7 h-7" />
        </div>
        
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display mb-2">
          Área de Gestão Estratégica
        </h2>
        <p className="text-xs text-slate-400 font-sans leading-relaxed mb-6 max-w-sm mx-auto">
          Esta sessão consolida as métricas do NPS institucional para uso da diretoria da Plataforma CSC. Insira a senha administrativa para continuar.
        </p>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Senha Administrativa CSC
            </label>
            <input
              id="admin-password-input"
              type="password"
              placeholder="Digite a credencial..."
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full px-4 py-3 bg-[#0A1224] border border-[#1E345E]/50 focus:border-[#14A3A1] focus:bg-[#0A1224] rounded-xl text-sm focus:outline-none transition font-mono tracking-widest text-[#1E3E8C] text-white"
              autoFocus
            />
            {authError && (
              <span className="text-xs text-rose-400 font-medium mt-2 flex items-center space-x-1.5 leading-relaxed">
                <ShieldAlert className="w-4 h-4 flex-none" />
                <span>{authError}</span>
              </span>
            )}
          </div>

          <button
            id="admin-login-submit"
            type="submit"
            className="w-full bg-gradient-to-r from-[#14A3A1] to-[#8ac926] hover:opacity-95 text-[#070e1f] font-black py-3 px-4 rounded-xl transition shadow-md flex items-center justify-center space-x-2 cursor-pointer text-sm"
          >
            <span>Acessar Painel Integrado</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div id="admin-dashboard-root" className="space-y-6 animate-fade-in text-white">
      
      {/* Action panel & header metrics */}
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-[#1E3E8C]/20 pb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight font-display">
            Painel Executivo de Indicadores
          </h2>
          <p className="text-xs text-slate-400">
            Monitoramento de satisfação das prefeituras brasileiras coorganizadoras das regionais.
          </p>
        </div>

        {/* Executive Action Controls */}
        <div className="flex flex-wrap items-center gap-2">


          {/* Reset/Clear database button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center space-x-1.5 py-2 px-3.5 bg-rose-500/10 hover:bg-rose-500/15 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold transition cursor-pointer"
            title="Apagar todas as respostas e zerar os indicadores"
          >
            <Database className="w-3.5 h-3.5 text-rose-400" />
            <span>Zerar Banco (Limpar Lote)</span>
          </button>



          {/* Export CSV */}
          <button
            onClick={() => exportToCSV(responses)}
            className="flex items-center space-x-1.5 py-2 px-3.5 bg-[#1E3E8C]/20 hover:bg-[#1E3E8C]/30 text-[#F58F22] border border-[#1E3E8C]/30 rounded-xl text-xs font-black transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Base (CSV)</span>
          </button>
        </div>
      </div>

      {/* THREE STRATEGIC KPIS IN DARK GLASS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Metric 1: NPS score calculated with official metrics */}
        <div className="bg-[#0B1528] p-6 rounded-2xl border border-[#1E3E8C]/30 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-450 uppercase tracking-wider block">Score NPS da Parceria</span>
              <span className="text-[10px] bg-[#F58F22]/10 text-[#F58F22] px-2 py-0.5 rounded font-black font-mono border border-[#F58F22]/15">0-10 Scale</span>
            </div>
            <div className="flex items-baseline space-x-1.5 mt-3">
              <span className={`text-5xl font-black font-display text-[#F58F22]`}>
                {metrics.score > 0 ? `+${metrics.score}` : metrics.score}
              </span>
              <span className="text-slate-400 text-xs font-semibold">/100</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#1E3E8C]/20">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider font-display mb-1.5">Classificação do Relacionamento</span>
            <div className={`text-xs font-bold py-1.5 px-2.5 rounded-lg border text-center ${getNpsTier(metrics.score).color}`}>
              {getNpsTier(metrics.score).text}
            </div>
          </div>
        </div>

        {/* Metric 2: Morning activities evaluation (0-5 average) */}
        <div className="bg-[#0B1528] p-6 rounded-2xl border border-[#1E3E8C]/30 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-450 uppercase tracking-wider block">Média Período da Manhã</span>
              <span className="text-[10px] bg-[#14A3A1]/10 text-[#14A3A1] px-2 py-0.5 rounded font-black font-mono border border-[#14A3A1]/15">0-5 Scale</span>
            </div>
            
            <div className="flex items-baseline space-x-1.5 mt-3">
              <span className="text-5xl font-black text-white font-display">{metrics.avgMorningActivities}</span>
              <span className="text-slate-400 text-xs font-semibold">/5.0</span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-1">Compatilhamento de desafios e pitchs de soluções.</p>
          </div>

          <div className="mt-4 pt-4 border-t border-[#1E3E8C]/20">
            <div className="flex justify-between text-[10px] font-extrabold text-slate-400 block mb-1">
              <span>Aproveitamento Técnico</span>
              <span className="text-[#14A3A1]">{Math.round((metrics.avgMorningActivities / 5) * 100)}%</span>
            </div>
            <div className="w-full bg-[#070e1f] h-2 rounded-full overflow-hidden border border-[#1E3E8C]/15">
              <div
                className="bg-[#14A3A1] h-full rounded-full"
                style={{ width: `${(metrics.avgMorningActivities / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 3: Future engagement index (0-5 average) */}
        <div className="bg-[#0B1528] p-6 rounded-2xl border border-[#1E3E8C]/30 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-450 uppercase tracking-wider block">Média Interesse Continuidade</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-black font-mono border border-emerald-500/15">0-5 Scale</span>
            </div>
            
            <div className="flex items-baseline space-x-1.5 mt-3">
              <span className="text-5xl font-black text-[#8ac926] font-display">{metrics.avgFutureEngagement}</span>
              <span className="text-slate-400 text-xs font-semibold">/5.0</span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans mt-1">Interesse em coorganizar novos encontros práticos.</p>
          </div>

          <div className="mt-4 pt-4 border-t border-[#1E3E8C]/20">
            <div className="flex justify-between text-[10px] font-extrabold text-slate-400 block mb-1">
              <span>Engajamento de Longo Prazo</span>
              <span className="text-[#8ac926]">{Math.round((metrics.avgFutureEngagement / 5) * 100)}%</span>
            </div>
            <div className="w-full bg-[#070e1f] h-2 rounded-full overflow-hidden border border-[#1E3E8C]/15">
              <div
                className="bg-[#8ac926] h-full rounded-full"
                style={{ width: `${(metrics.avgFutureEngagement / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Breakdown graphs: Satisfaction blocks + Impact bars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* NPS Category breakdown without emojis */}
        <div className="bg-[#0B1528] p-6 rounded-2xl border border-[#1E3E8C]/30 shadow-md lg:col-span-1 space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider font-display border-b border-[#1E3E8C]/25 pb-2.5">
            Distribuição de Respostas (NPS)
          </h3>
          
          <div className="space-y-3">
            {/* Promoters (9-10) */}
            <div className="p-3.5 bg-emerald-950/20 rounded-xl border border-emerald-500/25">
              <div className="flex items-center justify-between text-xs font-sans text-slate-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Smile className="w-4 h-4 text-emerald-400 flex-none" />
                  <span className="font-extrabold text-white">Promotores (9-10)</span>
                </div>
                <span className="font-bold text-emerald-400">
                  {metrics.promoters} ({metrics.total > 0 ? Math.round((metrics.promoters / metrics.total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-[#070e1f] h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.3)]" style={{ width: `${metrics.total > 0 ? (metrics.promoters / metrics.total) * 100 : 0}%` }} />
              </div>
            </div>

            {/* Neutrals (7-8) */}
            <div className="p-3.5 bg-sky-950/20 rounded-xl border border-sky-500/25">
              <div className="flex items-center justify-between text-xs font-sans text-slate-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Meh className="w-4 h-4 text-[#14A3A1] flex-none" />
                  <span className="font-extrabold text-white">Neutros (7-8)</span>
                </div>
                <span className="font-bold text-sky-400">
                  {metrics.neutrals} ({metrics.total > 0 ? Math.round((metrics.neutrals / metrics.total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-[#070e1f] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#14A3A1] h-full rounded-full shadow-[0_0_8px_rgba(20,163,161,0.3)]" style={{ width: `${metrics.total > 0 ? (metrics.neutrals / metrics.total) * 100 : 0}%` }} />
              </div>
            </div>

            {/* Detractors (0-6) */}
            <div className="p-3.5 bg-rose-950/20 rounded-xl border border-rose-500/25">
              <div className="flex items-center justify-between text-xs font-sans text-slate-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Frown className="w-4 h-4 text-rose-450 flex-none" />
                  <span className="font-extrabold text-white">Detratores (0-6)</span>
                </div>
                <span className="font-bold text-rose-450">
                  {metrics.detractors} ({metrics.total > 0 ? Math.round((metrics.detractors / metrics.total) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-[#070e1f] h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full shadow-[0_0_8px_rgba(239,68,68,0.3)]" style={{ width: `${metrics.total > 0 ? (metrics.detractors / metrics.total) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Real Impacts graph block */}
        <div className="bg-[#0B1528] p-6 rounded-2xl border border-[#1E3E8C]/30 shadow-md lg:col-span-2 space-y-4">
          <h3 className="text-xs font-black text-white uppercase tracking-wider font-display border-b border-[#1E3E8C]/25 pb-2.5">
            Principais Impactos Reais Identificados pelos Municípios
          </h3>

          <div className="space-y-3.5">
            {IMPACT_OPTIONS.map((opt) => {
              const count = metrics.impactBreakdown[opt.id] || 0;
              const percent = metrics.total > 0 ? Math.round((count / metrics.total) * 100) : 0;
              
              return (
                <div key={opt.id} className="text-xs font-sans">
                  <div className="flex justify-between items-start text-xs text-slate-300 mb-1 leading-relaxed">
                    <span className="font-semibold text-slate-250 max-w-sm sm:max-w-md">{opt.text}</span>
                    <span className="font-bold text-[#8ac926] flex-none">{count} ({percent}%)</span>
                  </div>
                  <div className="w-full bg-[#070e1f] border border-[#1E3E8C]/25 h-3 rounded-lg overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#14A3A1] to-[#8ac926] h-full rounded-lg"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* SEARCH AND FILTERS */}
      <div className="bg-[#0B1528] p-5 rounded-2xl border border-[#1E3E8C]/30 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Main search text input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="dashboard-comment-search"
              type="text"
              placeholder="Pesquisar por termos nos feedbacks de prefeituras (ex: networking, IoT, café)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#070e1f] border border-[#1E345E]/40 focus:border-[#14A3A1] rounded-xl text-xs focus:outline-none transition text-white placeholder-slate-500"
            />
          </div>

          <button
            onClick={() => setShowAdvanceFilters(!showAdvanceFilters)}
            className="flex items-center justify-center space-x-1.5 py-2.5 px-4 bg-[#10203e]/40 hover:bg-[#10203e]/80 text-slate-300 rounded-xl text-xs font-bold border border-[#1E3E8C]/35 transition cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-450" />
            <span>Filtros Estruturados</span>
            <ChevronDown className={`w-3.5 h-3.5 transition ${showAdvanceFilters ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Structured Dropdown options */}
        {showAdvanceFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-[#070e1f] rounded-xl border border-[#1E3E8C]/25">
            {/* Municipality Filter */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Filtrar Cidade Participante
              </label>
              <select
                id="filter-municipality"
                value={selectedMuniFilter}
                onChange={(e) => setSelectedMuniFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B1528] text-white border border-[#1E3E8C]/35 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#14A3A1]"
              >
                <option value="all">Todas as Prefeituras</option>
                {MUNICIPALITIES.map((mun) => (
                  <option key={mun.id} value={mun.id}>
                    {mun.name} ({mun.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Satisfaction NPS Filter */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Classificação (NPS)
              </label>
              <select
                id="filter-nps"
                value={selectedNpsFilter}
                onChange={(e) => setSelectedNpsFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B1528] text-white border border-[#1E3E8C]/35 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#14A3A1]"
              >
                <option value="all">Todos os Status NPS</option>
                <option value="promoter">Promotores (Nota 9-10)</option>
                <option value="neutral">Passivos (Nota 7-8)</option>
                <option value="detractor">Detratores (Nota 0-6)</option>
              </select>
            </div>

            {/* Engagement Filter */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Formato de Disponibilidade
              </label>
              <select
                id="filter-engagement"
                value={selectedEngagementFilter}
                onChange={(e) => setSelectedEngagementFilter(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B1528] text-white border border-[#1E3E8C]/35 rounded-lg text-xs font-semibold focus:outline-none focus:border-[#14A3A1]"
              >
                <option value="all">Todas as Disponibilidades</option>
                <option value="total">Sim, temos total interesse</option>
                <option value="depende">Sim, mas depende do cronograma</option>
                <option value="indisponivel">No momento indisponível</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* MAIN LOG DATABASE TABLE */}
      <div className="bg-[#0B1528] rounded-2xl border border-[#1E3E8C]/30 shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#1E3E8C]/25 flex items-center justify-between bg-[#10203e]/20">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-extrabold text-white tracking-tight font-display">
              Registros Consolidados de Prefeituras Anfitriãs (Lote Estratégico)
            </h3>
          </div>
          <span className="bg-[#14A3A1]/15 text-[#14A3A1] border border-[#14A3A1]/20 font-mono text-xs px-2.5 py-1 rounded-full font-bold">
            Mostrando {filteredResponses.length} de {responses.length}
          </span>
        </div>

        {filteredResponses.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <HelpCircle className="w-12 h-12 mx-auto text-slate-500 mb-3" />
            <h4 className="text-sm font-bold text-slate-300">Nenhum feedback corresponde aos filtros</h4>
            <p className="text-xs text-slate-400 mt-1">Limpe sua busca para analisar as respostas novamente.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#10203e]/40 text-slate-300 uppercase tracking-wider font-extrabold font-display border-b border-[#1E3E8C]/25">
                  <th className="py-4 px-5">Cidade / Data</th>
                  <th className="py-4 px-5">Gestor Público (Contato)</th>
                  <th className="py-4 px-5 text-center">Recomenda (NPS)</th>
                  <th className="py-4 px-5 text-center">Atividade Manhã</th>
                  <th className="py-4 px-5">Impactos & Melhoria Sugerida</th>
                  <th className="py-4 px-5 text-center">Disponibilidade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3E8C]/15">
                {filteredResponses.map((res) => {
                  let npsTag = { text: "Detrator", style: "bg-rose-950/30 text-rose-400 border-rose-900/40" };
                  if (res.ratingNps >= 9) {
                    npsTag = { text: "Promotor", style: "bg-emerald-950/30 text-emerald-400 border-emerald-900/40" };
                  } else if (res.ratingNps >= 7) {
                    npsTag = { text: "Passivo", style: "bg-sky-950/30 text-sky-400 border-sky-900/40" };
                  }

                  let engagementLabel = "Indisponível";
                  let engagementStyle = "bg-rose-950/30 text-rose-400 border border-rose-900/40";
                  if (res.engagementFormat === "total") {
                    engagementLabel = "Total";
                    engagementStyle = "bg-emerald-950/30 text-emerald-400 border border-emerald-900/40";
                  } else if (res.engagementFormat === "depende") {
                    engagementLabel = "Depende";
                    engagementStyle = "bg-amber-950/30 text-amber-400 border border-amber-900/40";
                  }

                  return (
                    <tr key={res.id} className="hover:bg-[#10203e]/20 transition">
                      
                      {/* Municipal detail */}
                      <td className="py-4.5 px-5 space-y-1">
                        <div className="font-extrabold text-white text-sm">{res.municipalityName}</div>
                        <span className="text-[10px] text-slate-400 font-bold block">
                          {new Date(res.timestamp).toLocaleDateString("pt-BR")} às {new Date(res.timestamp).toLocaleTimeString("pt-BR", {hour: "2-digit", minute:"2-digit"})}
                        </span>
                        {res.isPreseeded && (
                          <span className="inline-block text-[9px] bg-[#10203e]/70 border border-[#1E3E8C]/20 text-slate-400 font-bold px-1.5 py-0.2 rounded mt-1">Pre-seeded</span>
                        )}
                      </td>

                      {/* Contact metadata */}
                      <td className="py-4.5 px-5 space-y-1">
                        <div className="font-bold text-white block flex items-center space-x-1">
                          <User className="w-3.5 h-3.5 text-slate-450 inline flex-none" />
                          <span>{res.contactName}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          <span className="block font-semibold text-[#14A3A1]">{res.contactRole}</span>
                          <span className="block italic text-slate-400 flex items-center space-x-1 mt-0.5">
                            <Mail className="w-3 h-3 inline mb-0.5 text-slate-500" />
                            <span>{res.contactEmail}</span>
                          </span>
                          {res.contactPhone && (
                            <span className="block text-slate-400 flex items-center space-x-1">
                              <Phone className="w-3 h-3 inline mb-0.5 text-slate-500" />
                              <span>{res.contactPhone}</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Recommend Score NPS */}
                      <td className="py-4.5 px-5 text-center">
                        <div className="inline-block text-center">
                          <span className={`inline-block border text-[11px] font-black px-2.5 py-0.5 rounded-full ${npsTag.style}`}>
                            {res.ratingNps} — {npsTag.text}
                          </span>
                        </div>
                      </td>

                      {/* Morning Evaluation score */}
                      <td className="py-4.5 px-5 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-xl bg-sky-950/30 text-[#14A3A1] border border-[#14A3A1]/20 font-black text-xs">
                          {res.ratingMorningActivities} de 5
                        </span>
                      </td>

                      {/* Text Comments & impacts of governances */}
                      <td className="py-4.5 px-5 max-w-sm space-y-2.5 leading-relaxed text-slate-300 font-normal">
                        <div>
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Impactos obtidos:</span>
                          <div className="flex flex-wrap gap-1">
                            {res.impactOptions.map((optId) => {
                              const matchObj = IMPACT_OPTIONS.find((i) => i.id === optId);
                              return (
                                <span key={optId} className="bg-[#070e1f] text-slate-300 text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#1E3E8C]/30">
                                  {matchObj ? matchObj.text.slice(0, 32) + "..." : optId}
                                </span>
                              );
                            })}
                            {res.impactOther && (
                              <span className="bg-amber-950/20 text-amber-400 text-[9px] font-bold px-1.5 py-0.5 rounded border border-[#F58F22]/20 animate-pulse">
                                Outro: {res.impactOther}
                              </span>
                            )}
                          </div>
                        </div>

                        {res.npsJustification && (
                          <div className="bg-[#070e1f] p-2.5 rounded-xl border border-[#1E3E8C]/20 text-[11.5px]">
                            <strong className="text-slate-450 font-bold block mb-0.5">Depoimento:</strong>
                            <p className="italic text-slate-200">"{res.npsJustification}"</p>
                          </div>
                        )}

                        {res.suggestionsImprovement && (
                          <div className="text-[11px]">
                            <strong className="text-slate-500 block">Como CSC poderia melhorar:</strong>
                            <p className="text-slate-350">"{res.suggestionsImprovement}"</p>
                          </div>
                        )}
                      </td>

                      {/* Continuity format availability */}
                      <td className="py-4.5 px-5 text-center">
                        <div className="space-y-1">
                          <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${engagementStyle}`}>
                            {engagementLabel}
                          </span>
                          <span className="block text-[10px] text-slate-400 font-semibold">Nota: {res.ratingFutureEngagement}/5</span>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal - Zerar Banco */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#070E1F] border border-rose-500/40 rounded-[24px] max-w-md w-full p-6 sm:p-8 shadow-2xl text-center space-y-5">
            <div className="bg-rose-500/10 text-rose-400 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-black text-white tracking-tight">
                Confirmar Limpeza Total
              </h3>
              <p className="text-xs text-slate-450 leading-relaxed">
                Você tem certeza que deseja limpar todo o lote de dados? Isso apagará definitivamente todas as respostas e zerará os indicadores no painel.
              </p>
              <p className="text-[10px] text-rose-400/80 font-semibold bg-rose-500/5 py-2 px-3 rounded-lg border border-rose-500/10 inline-block w-full">
                Esta ação é irreversível e removerá todas as submissões atuais.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="w-full sm:flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onClearData();
                  setShowResetConfirm(false);
                }}
                className="w-full sm:flex-1 py-2.5 px-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs font-black rounded-xl border border-rose-500/30 shadow-md transition cursor-pointer"
              >
                Limpar Banco (Zerar)
              </button>
            </div>
          </div>
        </div>
      )}



    </div>
  );
}
