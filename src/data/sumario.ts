import type { DocumentPiece } from "./types";

/** Total de peças esperadas para o tipo de processo (exclui a faixa de órfãs). */
export const EXPECTED_PIECES = 15;

/**
 * Sumário pré-preenchido pela Licia para o documento de demonstração
 * (24001.028501/2025-75, 214 páginas). Todas as peças localizadas entram como
 * `idle` — cabe ao usuário conferir uma a uma. As três peças não localizadas e
 * a faixa de páginas órfãs já chegam nos seus respectivos estados.
 */
export const SUMARIO_PIECES: DocumentPiece[] = [
  { id: "p01", order: 1, name: "Estudo Técnico Preliminar", startPage: 1, endPage: 14, state: "idle" },
  { id: "p02", order: 2, name: "Termo de Referência", startPage: 15, endPage: 48, state: "idle" },
  { id: "p03", order: 3, name: "Mapa de Preço", startPage: 49, endPage: 56, state: "idle" },
  { id: "p04", order: 4, name: "Pesquisa de Preços", startPage: 57, endPage: 79, state: "idle" },
  { id: "p05", order: 5, name: "Justificativa de Natureza Continuada", startPage: 80, endPage: 82, state: "idle" },
  { id: "p06", order: 6, name: "Justificativa de Qualificação Técnica", startPage: 83, endPage: 84, state: "idle" },
  { id: "p07", order: 7, name: "Justificativa de Consórcio", startPage: 85, endPage: 86, state: "idle" },
  { id: "p08", order: 8, name: "Justificativa de Qualificação Econômico-Financeira", startPage: 87, endPage: 88, state: "idle" },
  { id: "p09", order: 9, name: "Edital", startPage: 89, endPage: 168, state: "idle" },
  { id: "p10", order: 10, name: "Parecer Jurídico", startPage: 169, endPage: 190, state: "idle" },
  { id: "p11", order: 11, name: "Justificativa de Amostras", startPage: 191, endPage: 192, state: "idle" },
  { id: "p12", order: 12, name: "Justificativa de Agrupamento", startPage: 193, endPage: 196, state: "idle" },

  { id: "orfas", order: null, name: "páginas órfãs — nenhuma peça atribuída", startPage: 197, endPage: 214, state: "orfa" },

  { id: "p13", order: null, name: "Justificativa de Cota Reservada", startPage: null, endPage: null, state: "ausente" },
  { id: "p14", order: null, name: "Justificativa para Subcontratação", startPage: null, endPage: null, state: "ausente" },
  { id: "p15", order: null, name: "Justificativa para Indicação de Marca", startPage: null, endPage: null, state: "ausente" },
];
