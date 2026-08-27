/** Total de peças esperadas para o tipo de processo (exclui a faixa de órfãs). */
export const EXPECTED_PIECES = 15;

/**
 * Sumário pré-preenchido pela Licia para o documento de demonstração
 * (24001.028501/2025-75, 214 páginas). Todas as peças localizadas entram como
 * `idle` — cabe ao usuário conferir uma a uma. As três peças não localizadas e
 * a faixa de páginas órfãs já chegam nos seus respectivos estados.
 *
 * `shortName` é o rótulo do mapa: lá o segmento tem 48px e o nome inteiro não
 * cabe. A tabela sempre usa `name`.
 */
export const SUMARIO_PIECES = [
  { id: "p01", order: 1, name: "Estudo Técnico Preliminar", shortName: "Estudo Técnico Preliminar", startPage: 1, endPage: 14, state: "idle" },
  { id: "p02", order: 2, name: "Termo de Referência", shortName: "Termo de Referência", startPage: 15, endPage: 48, state: "idle" },
  { id: "p03", order: 3, name: "Mapa de Preço", shortName: "Mapa de Preço", startPage: 49, endPage: 56, state: "idle" },
  { id: "p04", order: 4, name: "Pesquisa de Preços", shortName: "Pesquisa de Preços", startPage: 57, endPage: 79, state: "idle" },
  { id: "p05", order: 5, name: "Justificativa de Natureza Continuada", shortName: "J. Natureza Continuada", startPage: 80, endPage: 82, state: "idle" },
  { id: "p06", order: 6, name: "Justificativa de Qualificação Técnica", shortName: "J. Qualificação Técnica", startPage: 83, endPage: 84, state: "idle" },
  { id: "p07", order: 7, name: "Justificativa de Consórcio", shortName: "J. Consórcio", startPage: 85, endPage: 86, state: "idle" },
  { id: "p08", order: 8, name: "Justificativa de Qualificação Econômico-Financeira", shortName: "J. Qualif. Econ.-Financeira", startPage: 87, endPage: 99, state: "idle" },
  { id: "p09", order: 9, name: "Edital", shortName: "Edital", startPage: 100, endPage: 168, state: "idle" },
  { id: "p10", order: 10, name: "Parecer Jurídico", shortName: "Parecer Jurídico", startPage: 169, endPage: 190, state: "idle" },
  { id: "p11", order: 11, name: "Justificativa de Amostras", shortName: "J. Amostras", startPage: 191, endPage: 192, state: "idle" },
  { id: "p12", order: 12, name: "Justificativa de Agrupamento", shortName: "J. Agrupamento", startPage: 193, endPage: 196, state: "idle" },

  { id: "orfas", order: null, name: "páginas órfãs — nenhuma peça atribuída", shortName: "órfãs", startPage: 197, endPage: 214, state: "orfa" },

  { id: "p13", order: null, name: "Justificativa de Cota Reservada", shortName: "J. Cota Reservada", startPage: null, endPage: null, state: "ausente" },
  { id: "p14", order: null, name: "Justificativa para Subcontratação", shortName: "J. Subcontratação", startPage: null, endPage: null, state: "ausente" },
  { id: "p15", order: null, name: "Justificativa para Indicação de Marca", shortName: "J. Indicação de Marca", startPage: null, endPage: null, state: "ausente" },
];
