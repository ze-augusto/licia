import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "@/components/icons";
import { EXPECTED_PIECES, SUMARIO_PIECES } from "@/data/sumario";
import { DocumentMap } from "./DocumentMap";
import { PieceRow } from "./PieceRow";
import { SumarioViewer } from "./SumarioViewer";
import styles from "./SumarioStep.module.css";

/** Converte o texto do campo em página válida dentro do documento. */
function parsePage(value, totalPages) {
  const n = Number(value.replace(/\D/g, ""));
  return n >= 1 && n <= totalPages ? n : null;
}

/** Rótulo do cabeçalho do visualizador: `2 - Termo de Referência`. */
function viewerLabel(piece, page) {
  if (!piece) return `Página ${page}`;
  if (piece.state === "orfa") return "páginas órfãs";
  return `${piece.order} - ${piece.name}`;
}

/**
 * Etapa intermediária entre a criação da análise e a análise em si: o usuário
 * confere o sumário que a Licia extraiu do documento compilado.
 */
export function SumarioStep({ nup, subject, document, onConfirm }) {
  const [pieces, setPieces] = useState(SUMARIO_PIECES);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);

  const selected = pieces.find((p) => p.id === selectedId) ?? null;

  // Sem peça escolhida, o visualizador nomeia a peça que cobre a página aberta.
  const inView =
    selected ??
    pieces.find((p) => p.startPage !== null && page >= p.startPage && page <= p.endPage) ??
    null;

  const { located, missing, orphanPages } = useMemo(
    () => ({
      located: pieces.filter((p) => p.state !== "orfa" && p.startPage !== null).length,
      missing: pieces.filter((p) => p.state === "ausente").length,
      orphanPages: pieces
        .filter((p) => p.state === "orfa" && p.startPage && p.endPage)
        .reduce((sum, p) => sum + (p.endPage - p.startPage + 1), 0),
    }),
    [pieces],
  );

  function update(id, patch) {
    setPieces((current) => current.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function select(piece) {
    setSelectedId(piece.id);
    if (piece.startPage) setPage(piece.startPage);
  }

  function savePiece(piece, draft) {
    const startPage = parsePage(draft.startPage, document.totalPages);
    const endPage = parsePage(draft.endPage, document.totalPages) ?? startPage;
    update(piece.id, {
      name: draft.name.trim() || piece.name,
      startPage,
      endPage,
      // Sem páginas válidas a peça continua ausente. Uma faixa órfã segue órfã
      // mesmo depois de editada — só a peça ausente que ganha páginas vira idle.
      state: startPage === null ? "ausente" : piece.state === "orfa" ? "orfa" : "idle",
    });
    setEditingId(null);
  }

  return (
    <div className={styles.step}>
      <header className={styles.header}>
        <div className={styles.titleLine}>
          <Link className={styles.back} to="/" title="Voltar para a lista" aria-label="Voltar">
            <ArrowLeft />
          </Link>
          <h1 className={styles.title}>Definir sumário do documento</h1>
        </div>
        <p className={styles.meta}>
          NUP {nup}: {subject}
        </p>
      </header>

      <DocumentMap
        pieces={pieces}
        totalPages={document.totalPages}
        selectedId={selectedId}
        currentPage={page}
        onSelect={(id) => {
          const piece = pieces.find((p) => p.id === id);
          if (piece) select(piece);
        }}
      />

      <div className={styles.body}>
        <SumarioViewer
          nup={nup}
          document={document}
          page={page}
          context={viewerLabel(inView, page)}
          onPageChange={setPage}
        />

        <div className={styles.tablePane}>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Lista de documentos</h2>

            <div className={styles.alerts}>
              {missing > 0 && (
                <span className={styles.tag}>
                  {missing} peça{missing > 1 ? "s" : ""} não localizada{missing > 1 ? "s" : ""}
                </span>
              )}
              {orphanPages > 0 && <span className={styles.tag}>{orphanPages} páginas órfãs</span>}
            </div>

            <div className={styles.tableHead}>
              <div className={styles.colNumber}>Nº</div>
              <div className={styles.colName}>PEÇA</div>
              <div className={styles.colPage}>PÁG. INICIAL</div>
              <div className={styles.colPage}>PÁG. FINAL</div>
              <div className={styles.colActions}>AÇÕES</div>
            </div>

            {pieces.map((piece) => (
              <PieceRow
                key={`${piece.id}-${piece.id === editingId}`}
                piece={piece}
                editing={piece.id === editingId}
                onSelect={() => select(piece)}
                onEdit={() => {
                  select(piece);
                  setEditingId(piece.id);
                }}
                onSave={(draft) => savePiece(piece, draft)}
                onCancel={() => setEditingId(null)}
                onRemove={() => setPieces((c) => c.filter((p) => p.id !== piece.id))}
                onGoToPage={(target) => {
                  setSelectedId(piece.id);
                  setPage(target);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <span className={styles.progress}>
          {located} de {EXPECTED_PIECES} peças localizadas
        </span>
        <div className={styles.actions}>
          <Link className={`${styles.btn} ${styles.btnOutline}`} to="/">
            Cancelar
          </Link>
          <button className={`${styles.btn} ${styles.btnPrimary}`} type="button" onClick={onConfirm}>
            Salvar e iniciar análise
          </button>
        </div>
      </footer>
    </div>
  );
}
