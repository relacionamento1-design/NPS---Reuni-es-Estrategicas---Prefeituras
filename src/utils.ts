import { SurveyResponse, Municipality } from "./types";

export const MUNICIPALITIES: Municipality[] = [
  { id: "ponta-pora", name: "Ponta Porã", state: "MS" },
  { id: "santana-de-parnaiba", name: "Santana de Parnaíba", state: "SP" },
  { id: "santos", name: "Santos", state: "SP" },
  { id: "sao-jose-dos-pinhais", name: "São José dos Pinhais", state: "PR" },
  { id: "niteroi", name: "Niterói", state: "RJ" },
  { id: "porto-alegre", name: "Porto Alegre", state: "RS" },
  { id: "senador-canedo", name: "Senador Canedo", state: "GO" },
  { id: "sao-luis", name: "São Luís", state: "MA" },
  { id: "criciuma", name: "Criciúma", state: "SC" },
  { id: "caxias-do-sul", name: "Caxias do Sul", state: "RS" },
  { id: "lucas-do-rio-verde", name: "Lucas do Rio Verde", state: "MT" },
  { id: "santa-rita-do-sapucai", name: "Santa Rita do Sapucaí", state: "MG" },
  { id: "aracaju", name: "Aracaju", state: "SE" },
  { id: "pato-branco", name: "Pato Branco", state: "PR" },
  { id: "sao-jose-dos-campos", name: "São José dos Campos", state: "SP" },
  { id: "belem", name: "Belém", state: "PA" }
];

export const IMPACT_OPTIONS = [
  { id: "lideranca", text: "Posicionar o município como liderança regional no debate de transformação urbana." },
  { id: "conexao", text: "Conectar nossa equipe técnica a especialistas e soluções práticas de cidades inteligentes." },
  { id: "dialogo", text: "Fortalecer o diálogo qualificado e a troca de experiências com cidades vizinhas." },
  { id: "atracao", text: "Atrair a atenção de atores estratégicos do ecossistema para as demandas do nosso município." },
  { id: "outro", text: "Outro" }
];

export interface NpsMetrics {
  total: number;
  promoters: number; // 5
  neutrals: number;  // 4
  detractors: number; // 0-3
  score: number;
  avgMorningActivities: number; // 0-5
  avgFutureEngagement: number; // 0-5
  impactBreakdown: Record<string, number>;
  engagementFormatBreakdown: Record<string, number>;
}

export function calculateNps(responses: SurveyResponse[]): NpsMetrics {
  const total = responses.length;
  if (total === 0) {
    return {
      total: 0,
      promoters: 0,
      neutrals: 0,
      detractors: 0,
      score: 0,
      avgMorningActivities: 0,
      avgFutureEngagement: 0,
      impactBreakdown: {},
      engagementFormatBreakdown: {}
    };
  }

  let promoters = 0;
  let neutrals = 0;
  let detractors = 0;
  let sumMorning = 0;
  let sumEngagement = 0;

  const impactBreakdown: Record<string, number> = {};
  const engagementFormatBreakdown: Record<string, number> = {
    total: 0,
    depende: 0,
    indisponivel: 0
  };

  responses.forEach((r) => {
    // NPS Rating (0 to 5 scale)
    if (r.ratingNps === 5) {
      promoters++;
    } else if (r.ratingNps === 4) {
      neutrals++;
    } else {
      detractors++;
    }

    sumMorning += r.ratingMorningActivities;
    sumFutureEngagementCount(r);

    // Impact options keys counting
    if (r.impactOptions && Array.isArray(r.impactOptions)) {
      r.impactOptions.forEach((opt) => {
        impactBreakdown[opt] = (impactBreakdown[opt] || 0) + 1;
      });
    }

    // Format counting
    if (r.engagementFormat) {
      engagementFormatBreakdown[r.engagementFormat] = (engagementFormatBreakdown[r.engagementFormat] || 0) + 1;
    }
  });

  function sumFutureEngagementCount(r: SurveyResponse) {
    sumEngagement += r.ratingFutureEngagement;
  }

  const score = Math.round(((promoters - detractors) / total) * 100);
  const avgMorningActivities = parseFloat((sumMorning / total).toFixed(2));
  const avgFutureEngagement = parseFloat((sumEngagement / total).toFixed(2));

  return {
    total,
    promoters,
    neutrals,
    detractors,
    score,
    avgMorningActivities,
    avgFutureEngagement,
    impactBreakdown,
    engagementFormatBreakdown
  };
}

export const PRE_SEEDED_RESPONSES: SurveyResponse[] = [
  {
    id: "seed-1",
    timestamp: "2026-06-12T09:15:00.000Z",
    municipalityId: "santana-de-parnaiba",
    municipalityName: "Santana de Parnaíba",
    contactName: "Mateus Ribeiro da Silva",
    contactRole: "Secretário de Tecnologia e Inovação",
    contactEmail: "mateus.ribeiro@santanadeparnaiba.sp.gov.br",
    contactPhone: "(11) 98877-6655",
    ratingNps: 5,
    npsJustification: "A reunião estratégica acelerou nosso alinhamento com fornecedores de ponta e nos inseriu no mapa nacional de Smart Cities pela Plataforma CSC. Essencial!",
    ratingMorningActivities: 5,
    impactOptions: ["lideranca", "conexao"],
    suggestionsImprovement: "O tempo para debater com fornecedores poderia ser expandido em mais 30 minutos na grade técnica.",
    ratingFutureEngagement: 5,
    engagementFormat: "total",
    isPreseeded: true
  },
  {
    id: "seed-2",
    timestamp: "2026-06-12T14:30:00.000Z",
    municipalityId: "santos",
    municipalityName: "Santos",
    contactName: "Camila Maria Toledo",
    contactRole: "Assessora de Assessoramento Estratégico",
    contactEmail: "camila.toledo@santos.sp.gov.br",
    contactPhone: "(13) 99122-3344",
    ratingNps: 5,
    npsJustification: "Excelente oportunidade de benchmarking local. Santos pôde expor seus avanços de infovias municipais.",
    ratingMorningActivities: 4,
    impactOptions: ["lideranca", "dialogo"],
    suggestionsImprovement: "Fazer painéis menores divididos por temas específicos no período vespertino.",
    ratingFutureEngagement: 4,
    engagementFormat: "total",
    isPreseeded: true
  },
  {
    id: "seed-3",
    timestamp: "2026-06-13T10:15:00.000Z",
    municipalityId: "niteroi",
    municipalityName: "Niterói",
    contactName: "Luís Fernando Gomes",
    contactRole: "Subsecretário de Planejamento Urbano",
    contactEmail: "luis.fernando@niteroi.rj.gov.br",
    contactPhone: "(21) 97111-2233",
    ratingNps: 4,
    npsJustification: "O debate de sustentabilidade nas cidades inteligentes foi muito bem guiado. O formato foi dinâmico.",
    ratingMorningActivities: 4,
    impactOptions: ["conexao", "atracao"],
    suggestionsImprovement: "Poderiam enviar os relatórios e portfólios das empresas de tecnologia com antecedência.",
    ratingFutureEngagement: 4,
    engagementFormat: "depende",
    isPreseeded: true
  },
  {
    id: "seed-4",
    timestamp: "2026-06-13T16:45:00.000Z",
    municipalityId: "sao-jose-dos-campos",
    municipalityName: "São José dos Campos",
    contactName: "Marcos Paulo de Alencar",
    contactRole: "Diretor de Smart Cities e Economia Criativa",
    contactEmail: "marcos.alencar@sjc.sp.gov.br",
    contactPhone: "(12) 98122-8899",
    ratingNps: 5,
    npsJustification: "Como primeiro município de categoria tecnológica certificada, hospedar a reunião regional gerou enorme impacto político de visibilidade e interesse de startups.",
    ratingMorningActivities: 5,
    impactOptions: ["lideranca", "atracao"],
    suggestionsImprovement: "Sem pontos negativos. O suporte conceitual da equipe da Plataforma CSC foi exemplar.",
    ratingFutureEngagement: 5,
    engagementFormat: "total",
    isPreseeded: true
  },
  {
    id: "seed-5",
    timestamp: "2026-06-14T11:20:00.000Z",
    municipalityId: "porto-alegre",
    municipalityName: "Porto Alegre",
    contactName: "Débora Maria Martins",
    contactRole: "Secretária Municipal de Planejamento e Assuntos Digitais",
    contactEmail: "debora.martins@portoalegre.rs.gov.br",
    contactPhone: "(51) 99344-5566",
    ratingNps: 4,
    npsJustification: "A estrutura de facilitação e debate foi boa, mas queríamos mais soluções práticas operacionais com orçamentos condizentes a médias capitais.",
    ratingMorningActivities: 3,
    impactOptions: ["dialogo", "conexao"],
    suggestionsImprovement: "Apresentações mais curtas por parte de patrocinadores corporativos.",
    ratingFutureEngagement: 3,
    engagementFormat: "depende",
    isPreseeded: true
  },
  {
    id: "seed-6",
    timestamp: "2026-06-14T15:05:00.000Z",
    municipalityId: "santa-rita-do-sapucai",
    municipalityName: "Santa Rita do Sapucaí",
    contactName: "Augusto César Bueno",
    contactRole: "Coordenador do Vale da Eletrônica",
    contactEmail: "augusto.bueno@santasabrina.mg.gov.br",
    contactPhone: "(35) 98845-1122",
    ratingNps: 5,
    npsJustification: "Nossa tradição em IoT corporativa foi posta em alto debate. Excelente público sênior das prefeituras adjacentes.",
    ratingMorningActivities: 5,
    impactOptions: ["lideranca", "dialogo"],
    suggestionsImprovement: "Promover uma rodada de negócios direta de maior duração.",
    ratingFutureEngagement: 5,
    engagementFormat: "total",
    isPreseeded: true
  },
  {
    id: "seed-7",
    timestamp: "2026-06-14T17:30:00.000Z",
    municipalityId: "pato-branco",
    municipalityName: "Pato Branco",
    contactName: "Eduardo Henrique Scherer",
    contactRole: "Secretário de Ciência, Tecnologia e Inovação",
    contactEmail: "eduardo.scherer@patobranco.pr.gov.br",
    contactPhone: "(46) 99201-1551",
    ratingNps: 5,
    npsJustification: "Nos aproximou de outras prefeituras com desafios correlatos aos nossos (Caxias, Pinhais). Sinergia instantânea.",
    ratingMorningActivities: 4,
    impactOptions: ["dialogo", "conexao"],
    suggestionsImprovement: "Mais dinamismo na agenda de apresentações de patrocinadores secundários.",
    ratingFutureEngagement: 5,
    engagementFormat: "total",
    isPreseeded: true
  },
  {
    id: "seed-8",
    timestamp: "2026-06-15T09:00:00.000Z",
    municipalityId: "senador-canedo",
    municipalityName: "Senador Canedo",
    contactName: "Patrícia Peixoto Nogueira",
    contactRole: "Assessora de Transformação Social e Governo Digital",
    contactEmail: "patricia.nogueira@senadorcanedo.go.gov.br",
    contactPhone: "(62) 98144-2233",
    ratingNps: 3,
    npsJustification: "O debate foca muito nas capitais e grandes metrópoles, sentimos falta de soluções sob medida para municípios de faixa populacional média.",
    ratingMorningActivities: 3,
    impactOptions: ["conexao"],
    impactOther: "Capacitação de lideranças intermediárias",
    suggestionsImprovement: "Focar em painéis adequados ao porte dos municípios convidados em cada regional.",
    ratingFutureEngagement: 3,
    engagementFormat: "depende",
    isPreseeded: true
  },
  {
    id: "seed-9",
    timestamp: "2026-06-15T09:45:00.000Z",
    municipalityId: "belem",
    municipalityName: "Belém",
    contactName: "Felipe Siqueira",
    contactRole: "Diretor Executivo da COP 30 Municipal",
    contactEmail: "felipe.cop@belem.pa.gov.br",
    contactPhone: "(91) 98111-9922",
    ratingNps: 5,
    npsJustification: "Fabuloso para preparar Belém em governança verde rumo à COP. Plataforma séria e muito respeitada nacionalmente.",
    ratingMorningActivities: 5,
    impactOptions: ["lideranca", "atracao"],
    suggestionsImprovement: "Nada a apontar, os desdobramentos práticos trarão excelentes frutos ambientais urbanos.",
    ratingFutureEngagement: 5,
    engagementFormat: "total",
    isPreseeded: true
  }
];

const STORAGE_KEY = "csc_prefe_nps_survey_responses_v2";

export function loadResponses(): SurveyResponse[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(PRE_SEEDED_RESPONSES));
      return PRE_SEEDED_RESPONSES;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Erro ao carregar respostas do localStorage", error);
    return PRE_SEEDED_RESPONSES;
  }
}

export function saveResponse(response: SurveyResponse): SurveyResponse[] {
  try {
    const current = loadResponses();
    const updated = [response, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error("Erro ao salvar resposta no localStorage", error);
    return [];
  }
}

export function resetToDefault(): SurveyResponse[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(PRE_SEEDED_RESPONSES));
    return PRE_SEEDED_RESPONSES;
  } catch (error) {
    console.error("Erro ao reiniciar dados", error);
    return PRE_SEEDED_RESPONSES;
  }
}

export function clearAllResponses(): SurveyResponse[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    return [];
  } catch (error) {
    console.error("Erro ao zerar dados", error);
    return [];
  }
}

export function exportToCSV(responses: SurveyResponse[]): void {
  const headers = [
    "ID",
    "Data/Hora",
    "Prefeitura Participante",
    "Nome Contato",
    "Cargo/Função",
    "E-mail",
    "Telefone/WhatsApp",
    "Nota Recomendar Parceria (0-10)",
    "Status NPS",
    "Justificativa Parceria",
    "Avaliação Manhã (0-5)",
    "Impactos Selecionados",
    "Impacto Outro",
    "O que poderia melhorar",
    "Interesse Engajado (0-5)",
    "Formato Engajamento"
  ];

  const rows = responses.map((r) => {
    let statusNps = "Defensor / Promotor";
    if (r.ratingNps >= 9) statusNps = "Promotor";
    else if (r.ratingNps >= 7) statusNps = "Neutro / Passivo";
    else statusNps = "Detrator";

    const selectedImpactsStr = r.impactOptions
      .map((optId) => {
        const option = IMPACT_OPTIONS.find((o) => o.id === optId);
        return option ? option.text : optId;
      })
      .join(" | ");

    return [
      r.id,
      new Date(r.timestamp).toLocaleString("pt-BR"),
      r.municipalityName,
      `"${(r.contactName || "").replace(/"/g, '""')}"`,
      `"${(r.contactRole || "").replace(/"/g, '""')}"`,
      r.contactEmail || "",
      r.contactPhone || "",
      r.ratingNps.toString(),
      statusNps,
      `"${(r.npsJustification || "").replace(/"/g, '""')}"`,
      r.ratingMorningActivities.toString(),
      `"${selectedImpactsStr.replace(/"/g, '""')}"`,
      r.impactOther ? `"${r.impactOther.replace(/"/g, '""')}"` : "",
      `"${(r.suggestionsImprovement || "").replace(/"/g, '""')}"`,
      r.ratingFutureEngagement.toString(),
      r.engagementFormat || ""
    ];
  });

  const csvContent =
    "\uFEFF" + 
    [headers.join(";"), ...rows.map((row) => row.join(";"))].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `NPS_Parceria_CSC_Prefeituras_${new Date().toISOString().slice(0, 10)}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
