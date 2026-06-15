import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  User,
  Mail,
  Phone,
  Briefcase,
  Check,
  Award,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Send,
  CheckCircle2,
  FileText,
  Search,
  Sparkle
} from "lucide-react";
import { Municipality, SurveyResponse } from "../types";
import { MUNICIPALITIES, IMPACT_OPTIONS } from "../utils";
import { CidadeCSCLogo } from "./BrandHeader";

interface NPSWizardFormProps {
  municipality: Municipality;
  onSubmit: (response: Omit<SurveyResponse, "id" | "timestamp">) => void;
}

export default function NPSWizardForm({ municipality, onSubmit }: NPSWizardFormProps) {
  // Wizard Step Control (Starts at 0 for the premium Welcome screen matching the screenshot)
  const [step, setStep] = useState<number>(0);
  const TOTAL_STEPS = 6;

  // Search filter for municipalities list
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Step 1 State: Active Municipality inside the list
  const [selectedMuni, setSelectedMuni] = useState<Municipality | null>(null);

  // Step 2 State: Contact Person
  const [contactName, setContactName] = useState<string>("");
  const [contactRole, setContactRole] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");

  // Step 3 State: NPS (0 to 10) & Justification
  const [ratingNps, setRatingNps] = useState<number | null>(null);
  const [npsJustification, setNpsJustification] = useState<string>("");

  // Step 4 State: Morning activities (0 to 5)
  const [ratingMorningActivities, setRatingMorningActivities] = useState<number | null>(null);

  // Step 5 State: Impact Options (Max 2 choices) & Suggestions for improvement
  const [selectedImpacts, setSelectedImpacts] = useState<string[]>([]);
  const [impactOther, setImpactOther] = useState<string>("");
  const [suggestionsImprovement, setSuggestionsImprovement] = useState<string>("");

  // Step 6 State: Future engagement rating & format
  const [ratingFutureEngagement, setRatingFutureEngagement] = useState<number | null>(null);
  const [engagementFormat, setEngagementFormat] = useState<"total" | "depende" | "indisponivel" | "">("");

  const [isDone, setIsDone] = useState<boolean>(false);

  // Filter municipalities
  const filteredMunicipalities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return MUNICIPALITIES;
    return MUNICIPALITIES.filter(
      (m) => m.name.toLowerCase().includes(query) || m.state.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Handle up-to-2 checkbox selection
  const handleToggleImpact = (id: string) => {
    if (selectedImpacts.includes(id)) {
      setSelectedImpacts(selectedImpacts.filter((item) => item !== id));
    } else {
      if (selectedImpacts.length >= 2) {
        setSelectedImpacts([selectedImpacts[1], id]);
      } else {
        setSelectedImpacts([...selectedImpacts, id]);
      }
    }
  };

  const handleMuniSelect = (muni: Municipality) => {
    setSelectedMuni(muni);
    setTimeout(() => {
      setStep(2);
    }, 280);
  };

  const handleNext = () => {
    if (step === 1 && !selectedMuni) {
      alert("Por favor, selecione a Prefeitura de sua cidade no painel integrado.");
      return;
    }
    if (step === 2) {
      if (!contactName.trim() || !contactRole.trim() || !contactEmail.trim()) {
        alert("Por favor, preencha os dados de contato obrigatórios (Nome, Cargo e E-mail de Trabalho).");
        return;
      }
    }
    if (step === 3 && ratingNps === null) {
      alert("Por favor, selecione uma pontuação técnica na régua de recomendação.");
      return;
    }
    if (step === 4 && ratingMorningActivities === null) {
      alert("Por favor, defina um valor de aproveitamento para as atividades no Passo 4.");
      return;
    }
    if (step === 5) {
      if (selectedImpacts.length === 0) {
        alert("Por favor, indique ao menos um impacto real gerado pela Reunião.");
        return;
      }
      if (selectedImpacts.includes("outro") && !impactOther.trim()) {
        alert("Por favor, preencha o campo de texto detalhando o outro impacto.");
        return;
      }
    }

    if (step < TOTAL_STEPS) {
      setStep((p) => p + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep((p) => p - 1);
    }
  };

  const handleResetForm = () => {
    setStep(0);
    setContactName("");
    setContactRole("");
    setContactEmail("");
    setContactPhone("");
    setRatingNps(null);
    setNpsJustification("");
    setRatingMorningActivities(null);
    setSelectedImpacts([]);
    setImpactOther("");
    setSuggestionsImprovement("");
    setRatingFutureEngagement(null);
    setEngagementFormat("");
    setIsDone(false);
    setSearchQuery("");
  };

  const handleFinalSubmit = () => {
    if (!selectedMuni) {
      alert("Por favor, especifique a Prefeitura no Passo 1.");
      setStep(1);
      return;
    }
    if (ratingFutureEngagement === null || !engagementFormat) {
      alert("Por favor, preencha as questões estratégicas finais do Passo 6.");
      return;
    }

    const payload: Omit<SurveyResponse, "id" | "timestamp"> = {
      municipalityId: selectedMuni.id,
      municipalityName: selectedMuni.name,
      contactName: contactName.trim(),
      contactRole: contactRole.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      ratingNps: ratingNps!,
      npsJustification: npsJustification.trim(),
      ratingMorningActivities: ratingMorningActivities!,
      impactOptions: selectedImpacts,
      impactOther: selectedImpacts.includes("outro") ? impactOther.trim() : undefined,
      suggestionsImprovement: suggestionsImprovement.trim(),
      ratingFutureEngagement: ratingFutureEngagement!,
      engagementFormat
    };

    onSubmit(payload);
    setIsDone(true);
  };

  // NPS Label text mappings - fully dark-mode responsive with NO EMOJIS (as requested)
  const getNpsFeedback = (num: number | null) => {
    if (num === null) return { text: "Toque em uma nota na régua", color: "text-slate-400", bg: "bg-slate-800/20" };
    if (num <= 4) return { text: "Recomenda com reservas (Detrator)", color: "text-rose-400", bg: "bg-rose-950/35" };
    if (num <= 6) return { text: "Pouco provável de recomendar (Detrator)", color: "text-orange-400", bg: "bg-orange-950/35" };
    if (num <= 8) return { text: "Recomenda com neutralidade (Passivo)", color: "text-sky-400", bg: "bg-sky-950/35" };
    return { text: "Altamente provável de recomendar (Promotor)", color: "text-emerald-400 font-bold", bg: "bg-emerald-950/35" };
  };

  // SUCCESS STATE SCREEN - Premium Dark Look with no emojis
  if (isDone) {
    return (
      <div id="survey-success-container" className="max-w-2xl mx-auto bg-[#070E1F]/90 border border-[#1E345E]/50 rounded-[24px] p-8 sm:p-12 shadow-2xl text-center backdrop-blur-md">
        <div className="inline-flex items-center justify-center bg-emerald-500/10 text-emerald-400 w-20 h-20 rounded-full mb-6 relative border border-emerald-500/20">
          <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-duration-1000"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400"></span>
          </span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display mb-3">
          Pesquisa Concluída com Sucesso!
        </h2>
        
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-8 font-sans">
          Queremos manifestar nosso profundo agradecimento à Prefeitura de <span className="font-bold text-[#14A3A1]">{selectedMuni?.name}</span> pelo depoimento estratégico. Suas considerações técnicas servirão diretamente à equipe da <strong>Plataforma CSC</strong> para aprimorar os encontros regionais de fomento tecnológico nacional.
        </p>

        {/* Actionable rewards and links */}
        <div className="bg-[#0B1528] rounded-2xl p-6 mb-2 text-left border border-[#1E3E8C]/30">
          <h3 className="text-xs font-black text-white uppercase tracking-wider font-display mb-4 flex items-center space-x-2">
            <Sparkle className="w-4 h-4 text-[#14A3A1]" />
            <span>Links Estratégicos & Próximos Passos</span>
          </h3>
          <div className="flex flex-col gap-3">
            <a
              href="https://plataformacsc.com.br/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-4 p-4 bg-[#070E1F]/80 rounded-xl border border-[#1E3E8C]/20 hover:border-[#8ac926] hover:bg-[#0E1A35] transition shadow-md w-full"
            >
              <div className="bg-emerald-500/10 text-emerald-400 p-2.5 rounded-lg flex-none border border-emerald-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-white">Agenda de Próximos Eventos da Plataforma</div>
                <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5">Acesse plataformacsc.com.br para acompanhar o cronograma 2026 completo</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Progress bar styling
  const progressPercent = step > 0 ? ((step - 1) / (TOTAL_STEPS - 1)) * 100 : 0;

  return (
    <div id="survey-wizard-container" className="max-w-2xl mx-auto">
      
      <AnimatePresence mode="wait">
        {/* STEP 0: THE PREMIUM WELLCOMING HERO PAGE IN THE SCREENSHOT */}
        {step === 0 && (
          <motion.div
            key="welcome-hero-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-[#070E1F]/90 border border-[#1E345E]/50 rounded-[24px] p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden backdrop-blur-md"
          >
            {/* Soft background light */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#14A3A1]/10 rounded-full blur-[80px]" />
            
            {/* Center spark circular icon */}
            <div className="relative z-10 flex justify-center mb-8">
              <div className="w-16 h-16 rounded-full border border-[#14A3A1]/40 bg-[#14A3A1]/5 flex items-center justify-center shadow-[0_0_20px_rgba(20,163,161,0.15)]">
                <Sparkles className="w-6 h-6 text-[#14A3A1]" />
              </div>
            </div>

            {/* Title with elegant colored gradient matching precisely the screenshot */}
            <h2 className="relative z-10 text-3xl sm:text-[34px] font-black tracking-tight leading-tight text-white mb-4 font-display">
              Queremos ouvir a <br />
              <span className="bg-gradient-to-r from-[#14A3A1] to-[#8ac926] bg-clip-text text-transparent">
                Prefeitura Anfitriã!
              </span>
            </h2>

            {/* Description Text */}
            <p className="relative z-10 text-slate-300 text-sm sm:text-base leading-relaxed max-w-sm mx-auto mb-8 font-sans">
              Como coorganizadora e instituição parceira das <span className="font-bold text-white">Reuniões Estratégicas 2026</span>, sua avaliação técnica é fundamental para aprimorar futuros encontros de inovação regional.
            </p>

            {/* Time badge pill - strictly emoji-free */}
            <div className="relative z-10 inline-flex items-center px-4 py-1.5 rounded-full bg-[#10223E] border border-[#1E3E8C]/40 text-[#14A3A1] text-xs font-bold leading-none mb-10">
              Leva menos de 1 minuto
            </div>

            {/* Action Start Button - fully styled matching green/teal gradient with dark text contrast */}
            <div className="relative z-10 flex justify-center">
              <button
                id="btn-start-wizard"
                onClick={() => setStep(1)}
                className="w-full sm:w-auto sm:px-14 py-4 rounded-xl bg-gradient-to-r from-[#14A3A1] to-[#8ac926] hover:opacity-95 transition shadow-lg shadow-[#14A3A1]/10 text-[#070e1f] font-black text-sm tracking-wide flex items-center justify-center space-x-2.5 cursor-pointer leading-none"
              >
                <span>Iniciar Pesquisa</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEPS MAIN CONTAINER (WHEN STEP > 0) */}
        {step > 0 && (
          <motion.div
            key="wizard-steps-container"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-[#070E1F]/90 border border-[#1E345E]/50 rounded-[24px] overflow-hidden shadow-2xl backdrop-blur-md"
          >
            {/* Top Header Step indicator and luminous progress status */}
            <div className="p-5 sm:p-6 pb-0 border-b border-[#1E345E]/20 bg-[#0B1528]/40">
              <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider font-display mb-2.5">
                <span className="text-slate-400">
                  {selectedMuni ? `Prefeitura de ${selectedMuni.name}` : "Identificação do Município"}
                </span>
                <span className="font-mono text-[#F58F22] font-bold">Passo {step} de {TOTAL_STEPS}</span>
              </div>
              <div className="w-full bg-[#10203e] h-2 rounded-full overflow-hidden mb-5">
                <div
                  className="bg-gradient-to-r from-[#F58F22] to-[#14A3A1] h-full transition-all duration-300 ease-out rounded-full shadow-[0_0_8px_rgba(20,163,161,0.3)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="p-6 sm:p-10">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: CHOOSE HOSTING MUNICIPALITY */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mb-6">
                      <span className="bg-[#F58F22]/15 text-[#F58F22] text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full font-display border border-[#F58F22]/20">
                        Passo 1 • Município Participante
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display mt-4 mb-2 flex items-center space-x-2">
                        <MapPin className="text-[#F58F22] w-6 h-6 flex-none" />
                        <span>Selecione a Prefeitura participante</span>
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                        Para qual município brasileiro foi realizada a coorganização ou participação direta na Reunião Estratégica Regional da Plataforma CSC em 2026?
                      </p>
                    </div>

                    {/* Instant Search Bar */}
                    <div className="relative mb-5">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Search className="w-4 h-4" />
                      </div>
                      <input
                        id="search-municipality-wizard"
                        type="text"
                        placeholder="Pesquisar cidade participante (ex: Santos, Niterói, Belém)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-[#0A1224] border border-[#1E345E]/50 focus:border-[#F58F22] focus:bg-[#0A1224] rounded-xl text-sm focus:outline-none transition text-white placeholder-slate-500"
                      />
                    </div>

                    {/* List Grid - Single column list */}
                    <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto pr-1">
                      {filteredMunicipalities.map((m) => {
                        const isSelected = selectedMuni?.id === m.id;
                        return (
                          <button
                            key={m.id}
                            onClick={() => handleMuniSelect(m)}
                            className={`text-left p-3.5 rounded-xl border transition flex items-center justify-between cursor-pointer focus:outline-none font-sans w-full ${
                              isSelected
                                ? "bg-[#F58F22]/15 border-[#F58F22] shadow-[0_0_15px_rgba(245,143,34,0.1)] font-bold text-white"
                                : "bg-[#0B1528] border-[#1E3E8C]/20 text-slate-200 hover:border-[#1E3E8C]/50 hover:bg-[#0E1B38]"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg flex-none ${
                                isSelected ? "bg-gradient-to-br from-[#F58F22] to-[#ffaa44] text-white" : "bg-[#070e1f] text-slate-400 border border-[#1E3E8C]/20"
                              }`}>
                                <MapPin className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-xs font-bold text-white block">{m.name}</span>
                                <span className="text-[10px] text-slate-400 block font-mono uppercase">{m.state}</span>
                              </div>
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-[#F58F22] stroke-[3]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: CONTACT DETAILS */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mb-6">
                      <span className="bg-[#14A3A1]/15 text-[#14A3A1] text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full font-display border border-[#14A3A1]/20">
                        Passo 2 • Representante de Contato
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display mt-4 mb-2 flex items-center space-x-2">
                        <User className="text-[#14A3A1] w-6 h-6 flex-none" />
                        <span>Por favor, identifique a Pessoa de Contato</span>
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                        Insira as credenciais básicas do gestor público responsável para que possamos mapear e direcionar os relatórios estratégicos setoriais.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                            Nome Completo *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                              <User className="w-4 h-4" />
                            </div>
                            <input
                              id="contact-name"
                              type="text"
                              placeholder="Ex: João da Silva"
                              required
                              value={contactName}
                              onChange={(e) => setContactName(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-[#0A1224] border border-[#1E345E]/50 focus:border-[#14A3A1] rounded-xl text-sm focus:outline-none transition text-white placeholder-slate-500"
                            />
                          </div>
                        </div>

                        {/* Cargo/Função */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                            Cargo ou Função Pública *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                              <Briefcase className="w-4 h-4" />
                            </div>
                            <input
                              id="contact-role"
                              type="text"
                              placeholder="Ex: Secretário de TI / Assessor"
                              required
                              value={contactRole}
                              onChange={(e) => setContactRole(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-[#0A1224] border border-[#1E345E]/50 focus:border-[#14A3A1] rounded-xl text-sm focus:outline-none transition text-white placeholder-slate-500"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* E-mail */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                            E-mail Institucional *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                              <Mail className="w-4 h-4" />
                            </div>
                            <input
                              id="contact-email"
                              type="email"
                              placeholder="nome@prefeitura.gov.br"
                              required
                              value={contactEmail}
                              onChange={(e) => setContactEmail(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-[#0A1224] border border-[#1E345E]/50 focus:border-[#14A3A1] rounded-xl text-sm focus:outline-none transition text-white placeholder-slate-500"
                            />
                          </div>
                        </div>

                        {/* Telefone / Whatsapp */}
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                            Telefone / WhatsApp (Opcional)
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                              <Phone className="w-4 h-4" />
                            </div>
                            <input
                              id="contact-phone"
                              type="text"
                              placeholder="Ex: (11) 99999-8888"
                              value={contactPhone}
                              onChange={(e) => setContactPhone(e.target.value)}
                              className="w-full pl-10 pr-4 py-2.5 bg-[#0A1224] border border-[#1E345E]/50 focus:border-[#14A3A1] rounded-xl text-sm focus:outline-none transition text-white placeholder-slate-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center mt-10">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="flex items-center space-x-1.5 px-4 py-2 bg-[#1B2A4A] hover:bg-[#253965] text-slate-350 text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Voltar</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={!contactName.trim() || !contactRole.trim() || !contactEmail.trim()}
                        className={`flex items-center space-x-1.5 px-5 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer shadow-sm ${
                          contactName.trim() && contactRole.trim() && contactEmail.trim()
                            ? "bg-gradient-to-r from-[#14A3A1] to-[#8ac926] text-[#070e1f] font-black"
                            : "bg-[#1E3E8C]/20 text-slate-500 cursor-not-allowed border border-[#1E3E8C]/10"
                        }`}
                      >
                        <span>Continuar</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: NPS EVALUATION (0 to 10 scale) */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mb-6">
                      <span className="bg-[#14A3A1]/15 text-[#14A3A1] text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full font-display border border-[#14A3A1]/20">
                        Passo 3 • Avaliação NPS de Parceria
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display mt-4 mb-2">
                        Probabilidade de recomendar a parceria com a Plataforma CSC
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                        "Em uma escala de 0 a 10, considerando toda a experiência da sua prefeitura ao sediar a Reunião Estratégica Regional em 2026, qual é a probabilidade de você recomendar a parceria com a Plataforma CSC para outros municípios brasileiros?"
                      </p>
                    </div>

                    {/* Scale Selector */}
                    <div className="bg-[#0B1528] py-8 px-4 sm:p-6 rounded-2xl border border-[#1E3E8C]/35 text-center mb-6 relative">
                      <div className="mb-5 flex justify-center">
                        {ratingNps !== null ? (
                          <span className="text-xs text-white font-extrabold uppercase tracking-wider">
                            Nota Selecionada: <strong className="text-[#14A3A1] text-sm font-black">{ratingNps} de 10</strong>
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Escolha uma nota na régua</span>
                        )}
                      </div>

                      {/* Score numbers block */}
                      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => {
                          const isSelected = ratingNps === val;
                          let btnColor = "bg-[#070e1f] border-[#1E3E8C]/35 text-slate-200 hover:border-[#14A3A1]/50";
                          if (isSelected) {
                            if (val <= 6) btnColor = "bg-rose-500 text-white border-rose-500 shadow-[0_0_15px_rgba(239,68,68,0.25)]";
                            else if (val <= 8) btnColor = "bg-[#F58F22] text-white border-[#F58F22] shadow-[0_0_15px_rgba(245,143,34,0.25)]";
                            else btnColor = "bg-emerald-500 text-white border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.25)]";
                          }
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setRatingNps(val)}
                              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl text-xs sm:text-sm font-extrabold font-mono transition outline-none cursor-pointer border ${btnColor}`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Justification Comment (Text Area) */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                        Justificativa ou Observações Adicionais (Campo de texto aberto)
                      </label>
                      <textarea
                        id="nps-justification-input"
                        placeholder="Justifique aqui os motivos para a sua escolha, citando pontos fortes da parceria ou melhorias pontuais no sediamento..."
                        value={npsJustification}
                        onChange={(e) => setNpsJustification(e.target.value)}
                        rows={3}
                        className="w-full p-3.5 bg-[#0A1224] border border-[#1E345E]/50 focus:border-[#14A3A1] rounded-xl text-xs focus:outline-none transition leading-relaxed text-white font-sans placeholder-slate-500"
                      />
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center mt-10">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="flex items-center space-x-1.5 px-4 py-2 bg-[#1B2A4A] hover:bg-[#253965] text-slate-350 text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Voltar</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={ratingNps === null}
                        className={`flex items-center space-x-1.5 px-5 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer shadow-sm ${
                          ratingNps !== null
                            ? "bg-gradient-to-r from-[#14A3A1] to-[#8ac926] text-[#070e1f] font-black"
                            : "bg-[#1E3E8C]/20 text-slate-500 cursor-not-allowed border border-[#1E3E8C]/10"
                        }`}
                      >
                        <span>Continuar</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: MORNING ACTIVITIES RATING (0 to 5 scale) */}
                {step === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mb-6">
                      <span className="bg-[#14A3A1]/15 text-[#14A3A1] text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full font-display border border-[#14A3A1]/20">
                        Passo 4 • Período da Manhã
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display mt-4 mb-2">
                        Avaliação das Atividades do Período da Manhã
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                        "Em uma escala de 0 a 5 como você avalia as atividades do período da manhã (compartilhamento de desafios com os secretários municipais e apresentação de fornecedores)?"
                      </p>
                    </div>

                    {/* Star numeric score */}
                    <div className="bg-[#0B1528] p-8 rounded-2xl border border-[#1E3E8C]/35 flex flex-col items-center justify-center">
                      <div className="flex gap-2.5 mb-5 select-none">
                        {[0, 1, 2, 3, 4, 5].map((num) => {
                          const isSelected = ratingMorningActivities === num;
                          return (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setRatingMorningActivities(num)}
                              className={`w-11 h-11 rounded-full font-extrabold font-mono transition text-sm relative flex items-center justify-center cursor-pointer border ${
                                isSelected
                                  ? "bg-[#14A3A1] border-[#14A3A1] text-white scale-110 shadow-lg shadow-[#14A3A1]/25"
                                  : "bg-[#070e1f] border-[#1E3E8C]/30 text-slate-300 hover:border-[#14A3A1]/50"
                              }`}
                            >
                              {num}
                            </button>
                          );
                        })}
                      </div>

                      {/* Display score descriptive layout */}
                      <span className="text-xs font-extrabold text-slate-400 block">
                        {ratingMorningActivities !== null ? (
                          <span className="text-white">
                            Nota Selecionada: <strong className="text-[#14A3A1] text-sm font-black">{ratingMorningActivities} de 5</strong>
                          </span>
                        ) : (
                          <span className="text-slate-400">Escolha uma nota de 0 a 5</span>
                        )}
                      </span>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center mt-10">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="flex items-center space-x-1.5 px-4 py-2 bg-[#1B2A4A] hover:bg-[#253965] text-slate-350 text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Voltar</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={ratingMorningActivities === null}
                        className={`flex items-center space-x-1.5 px-5 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer shadow-sm ${
                          ratingMorningActivities !== null
                            ? "bg-gradient-to-r from-[#14A3A1] to-[#8ac926] text-[#070e1f] font-black"
                            : "bg-[#1E3E8C]/20 text-slate-500 cursor-not-allowed border border-[#1E3E8C]/10"
                        }`}
                      >
                        <span>Continuar</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: REAL IMPACTS EXCEL & MUNICIPAL DIFFERENTIAL (Up to 2 options check) */}
                {step === 5 && (
                  <motion.div
                    key="step-5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mb-6">
                      <span className="bg-[#14A3A1]/15 text-[#14A3A1] text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full font-display border border-[#14A3A1]/20">
                        Passo 5 • Impactos Estruturais
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display mt-4 mb-2">
                        Impactos Reais e Sugestões do Município
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                        "Pensando no papel da Reunião Regional que sua Prefeitura co-organizou ou sediou em parceria com a Plataforma CSC, quais foram os principais impactos práticos reais obtidos pelo município?" (Selecione até 2 opções)
                      </p>
                    </div>

                    {/* Impact list options rendered as clean checkboxes */}
                    <div className="space-y-2.5 mb-6">
                      {IMPACT_OPTIONS.map((opt) => {
                        const isChecked = selectedImpacts.includes(opt.id);
                        return (
                          <div key={opt.id} className="w-full">
                            <button
                              type="button"
                              onClick={() => handleToggleImpact(opt.id)}
                              className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-xs font-sans transition flex items-start space-x-3.5 cursor-pointer leading-normal ${
                                isChecked
                                  ? "bg-[#14A3A1]/10 border-[#14A3A1] shadow-[0_0_12px_rgba(20,163,161,0.08)] font-bold text-white"
                                  : "bg-[#0B1528] border-[#1E3E8C]/20 text-slate-200 hover:border-[#1E3E8C]/40 hover:bg-[#0E1B38]"
                              }`}
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center flex-none mt-0.5 transition ${
                                isChecked ? "bg-[#14A3A1] border-[#14A3A1] text-white" : "border-slate-500 bg-[#070e1f]"
                              }`}>
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="text-slate-250 font-medium">{opt.text}</span>
                            </button>

                            {/* Custom Input for 'Outro' */}
                            {opt.id === "outro" && isChecked && (
                              <div className="pl-8 pr-2 pt-2 animate-fade-in">
                                <input
                                  id="impact-other-input"
                                  type="text"
                                  placeholder="Descreva brevemente qual outro impacto real obteve... *"
                                  value={impactOther}
                                  onChange={(e) => setImpactOther(e.target.value)}
                                  required
                                  className="w-full p-2.5 bg-[#0A1224] border border-[#1E345E]/50 focus:border-[#14A3A1] rounded-lg text-xs focus:outline-none transition text-white placeholder-slate-500"
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold block">
                        <span>Limite de até 2 opções selecionadas</span>
                        <span>{selectedImpacts.length} de 2 ativas</span>
                      </div>
                    </div>

                    {/* Question 6 suggestions */}
                    <div className="space-y-1.5 border-t border-[#1E345E]/20 pt-5">
                      <label className="text-[10px] font-bold text-slate-350 uppercase tracking-wider block">
                        Sugestão Técnica de Organização (O que fazer diferente?)
                      </label>
                      <span className="text-[10.5px] text-slate-400 font-sans block mb-1">
                        "Pensando no futuro do movimento, o que você acredita que a Plataforma CSC poderia ter feito de diferente ou melhor na organização da reunião estratégica da sua região?" (Campo de texto aberto)
                      </span>
                      <textarea
                        id="suggestions-improvement-input"
                        placeholder="Ex: 'Mais tempo de painel', 'Envio de pautas prévias', 'Maior rodada de negócios locais'..."
                        value={suggestionsImprovement}
                        onChange={(e) => setSuggestionsImprovement(e.target.value)}
                        rows={3}
                        className="w-full p-3.5 bg-[#0A1224] border border-[#1E345E]/50 focus:border-[#14A3A1] rounded-xl text-xs focus:outline-none transition leading-relaxed text-white font-sans placeholder-slate-500"
                      />
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center mt-10">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="flex items-center space-x-1.5 px-4 py-2 bg-[#1B2A4A] hover:bg-[#253965] text-slate-350 text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Voltar</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={selectedImpacts.length === 0 || (selectedImpacts.includes("outro") && !impactOther.trim())}
                        className={`flex items-center space-x-1.5 px-5 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer shadow-sm ${
                          selectedImpacts.length > 0 && !(selectedImpacts.includes("outro") && !impactOther.trim())
                            ? "bg-gradient-to-r from-[#14A3A1] to-[#8ac926] text-[#070e1f] font-black"
                            : "bg-[#1E3E8C]/20 text-slate-500 cursor-not-allowed border border-[#1E3E8C]/10"
                        }`}
                      >
                        <span>Continuar</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 6: FUTURE CONTINUITY & SUBMIT */}
                {step === 6 && (
                  <motion.div
                    key="step-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mb-6">
                      <span className="bg-[#8ac926]/15 text-emerald-400 text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full font-display border border-emerald-500/20">
                        Passo 6 • Continuidade & Envio Final
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-display mt-4 mb-2">
                        Interesse em continuar engajado
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                        "Em uma escala de 0 a 5, quanto sua prefeitura tem interesse em continuar engajada nas ações da Plataforma CSC e, eventualmente, coorganizar novos desdobramentos práticos desse encontro?"
                      </p>
                    </div>

                    {/* Numeric picker */}
                    <div className="bg-[#0B1528] p-5 rounded-2xl border border-[#1E3E8C]/35 flex flex-col items-center justify-center mb-6">
                      <div className="flex gap-2 mb-3.5">
                        {[0, 1, 2, 3, 4, 5].map((num) => {
                          const isSelected = ratingFutureEngagement === num;
                          return (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setRatingFutureEngagement(num)}
                              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full font-extrabold font-mono transition text-xs relative flex items-center justify-center cursor-pointer border ${
                                isSelected
                                  ? "bg-[#8ac926] border-[#8ac926] text-[#070e1f] scale-115 shadow-lg shadow-emerald-500/20"
                                  : "bg-[#070e1f] border-[#1E3E8C]/30 text-slate-300 hover:border-emerald-500/40"
                              }`}
                            >
                              {num}
                            </button>
                          );
                        })}
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        {ratingFutureEngagement !== null ? (
                          <span className="text-white">Interesse: <strong className="text-[#8ac926] font-extrabold">{ratingFutureEngagement} de 5</strong></span>
                        ) : "Selecione uma nota de 0 a 5 acima"}
                      </span>
                    </div>

                    {/* Engagement Format options */}
                    <div className="space-y-2 mb-6">
                      <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                        Qual é a disponibilidade da Prefeitura para novas ações?
                      </label>
                      
                      {[
                        { id: "total", text: "Sim, temos total interesse em dar continuidade." },
                        { id: "depende", text: "Sim, mas depende do formato e do cronograma." },
                        { id: "indisponivel", text: "No momento, não temos disponibilidade para novas ações." }
                      ].map((option) => {
                        const isChecked = engagementFormat === option.id;
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setEngagementFormat(option.id as any)}
                            className={`w-full text-left p-3.5 rounded-xl border text-xs font-sans transition flex items-center space-x-3 cursor-pointer ${
                              isChecked
                                ? "bg-[#8ac926]/10 border-[#8ac926] shadow-sm font-bold text-white"
                                : "bg-[#0B1528] border-[#1E3E8C]/20 text-slate-300 hover:border-[#1E3E8C]/40 hover:bg-[#0E1B38]"
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-none ${
                              isChecked ? "border-[#8ac926] text-[#8ac926]" : "border-slate-500 bg-[#070e1f]"
                            }`}>
                              {isChecked && (
                                <div className="w-2.5 h-2.5 rounded-full bg-[#8ac926]" />
                              )}
                            </div>
                            <span className="text-slate-205">{option.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Navigation & Submit */}
                    <div className="flex justify-between items-center mt-10">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="flex items-center space-x-1.5 px-4 py-2 bg-[#1B2A4A] hover:bg-[#253965] text-slate-350 text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Voltar</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleFinalSubmit}
                        disabled={ratingFutureEngagement === null || !engagementFormat}
                        className={`flex items-center space-x-2 px-6 py-3 text-xs font-bold rounded-xl transition cursor-pointer shadow-lg ${
                          ratingFutureEngagement !== null && engagementFormat
                            ? "bg-gradient-to-r from-[#14A3A1] to-[#8ac926] text-[#070e1f] font-black"
                            : "bg-[#1E3E8C]/20 text-slate-500 cursor-not-allowed border border-[#1E3E8C]/10"
                        }`}
                      >
                        <Send className="w-4 h-4" />
                        <span>Enviar Feedback de Parceria</span>
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
