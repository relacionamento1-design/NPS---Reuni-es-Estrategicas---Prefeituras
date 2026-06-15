export interface SurveyResponse {
  id: string;
  timestamp: string; // ISO string
  municipalityId: string; // e.g., "santos"
  municipalityName: string; // e.g., "Santos"
  
  // 2. Pessoa de contato
  contactName: string;
  contactRole: string; // Cargo / Função
  contactEmail: string;
  contactPhone: string;

  // 3. Recomendar parceria com Plataforma CSC (NPS) - Escala de 0 a 10
  ratingNps: number; // 0 to 10
  npsJustification: string; // Justificativa aberta

  // 4. Atividades do período da manhã - Escala de 0 a 5
  ratingMorningActivities: number; // 0 to 5

  // 5. Principal Impacto Real (Até duas opções)
  impactOptions: string[]; // Chaves das opções selecionadas
  impactOther?: string; // Texto customizado para "Outro"

  // 6. O que a Plataforma CSC poderia ter feito de diferente/melhor
  suggestionsImprovement: string;

  // 7. Interesse em continuar engajado - Escala de 0 a 5 E Formato
  ratingFutureEngagement: number; // 0 to 5
  engagementFormat: "total" | "depende" | "indisponivel" | "";

  isPreseeded?: boolean;
}

export interface Municipality {
  id: string;
  name: string;
  state: string;
  isHost?: boolean;
}
