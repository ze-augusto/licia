/** Modelos de domínio da Analisadora. */

/** Situação de um item de checklist conforme avaliação da Licia. */
export type ChecklistStatus = "success" | "warning" | "error" | "na";

/** Rótulo exibido para cada situação. */
export const STATUS_LABEL: Record<ChecklistStatus, string> = {
  success: "Conforme",
  warning: "Com ressalva",
  error: "Não-conforme",
  na: "Não se aplica",
};

/** Filtros disponíveis na aba Checklist. */
export type ChecklistFilter = "nao-conforme" | "conforme" | "nao-aplica" | "todos";

/** Item individual do checklist (uma verificação). */
export interface ChecklistItem {
  id: string;
  question: string;
  status: ChecklistStatus;
  /** Análise textual da Licia. */
  detail: string;
  /** Referência de páginas no PDF, ex.: "p. 18–22". */
  pages?: string;
  /** Rótulo do botão "Ver p. …" quando há referência navegável. */
  viewLabel?: string;
}

/** Agrupamento de itens do checklist (ex.: DADOS GERAIS). */
export interface ChecklistGroup {
  id: string;
  label: string;
  items: ChecklistItem[];
}

/** Observação da aba Técnica (item neutro, sem situação). */
export interface Observation {
  id: string;
  question: string;
  detail: string;
}

/** Grupo de observações técnicas. */
export interface ObservationGroup {
  id: string;
  label: string;
  items: Observation[];
}

/** Linha da lista de análises (página inicial). */
export interface AnalysisSummary {
  id: string;
  nup: string;
  /** Objeto da contratação. */
  subject: string;
  /** Data e hora de adição, ex.: "20/03/2024 - 14:30". */
  addedAt: string;
  /** Responsável pela adição. */
  addedBy: string;
}

/** Documento exibido no visor de PDF. */
export interface AnalysisDocument {
  fileName: string;
  totalPages: number;
}

/**
 * Estados da linha da tabela de peças (componente `Sumário/Linha-peça`).
 * - `idle`       — peça localizada pela Licia, aguardando conferência
 * - `confirmada` — conferida pelo usuário
 * - `atual`      — em edição (nome e páginas viram campos)
 * - `ausente`    — peça esperada que não foi localizada no documento
 * - `orfa`       — faixa de páginas sem peça atribuída
 */
export type PieceState = "idle" | "confirmada" | "atual" | "ausente" | "orfa";

/** Peça do sumário do documento compilado. */
export interface DocumentPiece {
  id: string;
  /** Número exibido no círculo. `null` em peças ausentes ("—") e órfãs ("!"). */
  order: number | null;
  name: string;
  /** Página inicial no PDF; `null` quando a peça não foi localizada. */
  startPage: number | null;
  /** Página final no PDF; `null` quando a peça não foi localizada. */
  endPage: number | null;
  state: PieceState;
}
