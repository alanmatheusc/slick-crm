export type LeadStatus = 
  | "Novo" 
  | "Abordagem Enviada" 
  | "Follow Up" 
  | "Desqualificado" 
  | "Agendado";

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  status: LeadStatus;
  ultimo_contato?: string;
  data_agendamento?: string;
}

export const STATUS_COLORS: Record<LeadStatus, { bg: string; text: string }> = {
  "Novo": { bg: "bg-status-novo", text: "text-status-novo-foreground" },
  "Abordagem Enviada": { bg: "bg-status-abordagem", text: "text-status-abordagem-foreground" },
  "Follow Up": { bg: "bg-status-followup", text: "text-status-followup-foreground" },
  "Desqualificado": { bg: "bg-status-desqualificado", text: "text-status-desqualificado-foreground" },
  "Agendado": { bg: "bg-status-agendado", text: "text-status-agendado-foreground" },
};
