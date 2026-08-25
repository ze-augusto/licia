import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "@/components/icons";
import { EXPECTED_PIECES, SUMARIO_PIECES } from "@/data/sumario";
import type { AnalysisDocument, DocumentPiece } from "@/data/types";
import { DocumentMap } from "./DocumentMap";
import { PieceRow, type PieceDraft } from "./PieceRow";
import { SumarioViewer } from "./SumarioViewer";
import styles from "./SumarioStep.module.css";

interface SumarioStepProps {
  nup: string;
  document: AnalysisDocument;
  onConfirm: () => void;
}

/** Estado para o qual a linha volta quando a edição é cancelada. */
function restingState(piece: DocumentPiece): DocumentPiece["state"] {
  if (piece.startPage === null) return "ausente";
  return piece.order === null ? "orfa" : "idle";
}

/** Converte o texto do campo em página válida dentro do documento. */
function parsePage(value: string, totalPages: number): number | null {
  const n = Number(value.replace(/\D/g, ""));
  return n >= 1 && n <= totalPages ? n : null;
}

/**
 * Etapa intermediária entre a criação da análise e a análise em si: o usuário
 * confere o sumário que a Licia extraiu do documento compilado.
 */
export function SumarioStep({ nup, document, onConfirm }: SumarioStepProps) {
  const [pieces, setPieces] = useState<DocumentPiece[]>(SUMARIO_PIECES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const selected = pieces.find((p) => p.id === selectedId) ?? null;

  const { confirmed, missing, orphanPages } = useMemo(
    () => ({
      confirmed: pieces.filter((p) => p.state === "confirmada").length,
      missing: pieces.filter((p) => p.state === "ausente").length,
      orphanPages: pieces
        .filter((p) => p.state === "orfa" && p.startPage && p.endPage)
        .reduce((sum, p) => sum + ((p.endPage as number) - (p.startPage as number) + 1), 0),
    }),
    [pieces],
  );

  function update(id: string, patch: Partial<DocumentPiece>) {
    setPieces((current) => current.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function select(piece: DocumentPiece) {
    setSelectedId(piece.id);
    if (piece.startPage) setPage(piece.startPage);
  }

  function confirmPiece(piece: DocumentPiece, draft?: PieceDraft) {
    if (!draft) {
      update(piece.id, { state: "confirmada" });
      return;
    }
    const startPage = parsePage(draft.startPage, document.totalPages);
    const endPage = parsePage(draft.endPage, document.totalPages) ?? startPage;
    update(piece.id, {
      name: draft.name.trim() || piece.name,
      startPage,
      endPage,
      // Sem páginas válidas a peça continua ausente do documento.
      state: startPage === null ? "ausente" : "confirmada",
    });
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
          NUP {nup} · documento único {document.fileName} · {document.totalPages} páginas ·{" "}
          {EXPECTED_PIECES} peças esperadas
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
        <div className={styles.tablePane}>
          <div className={styles.alerts}>
            {missing > 0 && (
              <span className={styles.chip}>
                {missing} peça{missing > 1 ? "s" : ""} não localizada{missing > 1 ? "s" : ""}
              </span>
            )}
            {orphanPages > 0 && (
              <span className={styles.chip}>{orphanPages} páginas órfãs</span>
            )}
          </div>

          <div className={styles.table}>
            <div className={styles.tableHead}>
              <div className={styles.colNumber}>Nº</div>
              <div className={styles.colName}>PEÇA</div>
              <div className={styles.colPage}>PÁG. INICIAL</div>
              <div className={styles.colPage}>PÁG. FINAL</div>
              <div className={styles.colActions}>AÇÕES</div>
            </div>

            {pieces.map((piece) => (
              <PieceRow
                key={`${piece.id}-${piece.state}`}
                piece={piece}
                selected={piece.id === selectedId}
                onSelect={() => select(piece)}
                onEdit={() => {
                  select(piece);
                  update(piece.id, { state: "atual" });
                }}
                onConfirm={(draft) => confirmPiece(piece, draft)}
                onCancel={() => update(piece.id, { state: restingState(piece) })}
                onUndo={() => update(piece.id, { state: "idle" })}
                onDismiss={() => setPieces((c) => c.filter((p) => p.id !== piece.id))}
                onGoToPage={(target) => {
                  setSelectedId(piece.id);
                  setPage(target);
                }}
              />
            ))}
          </div>
        </div>

        <SumarioViewer
          nup={nup}
          document={document}
          page={page}
          context={selected?.state === "orfa" ? "páginas órfãs" : (selected?.name ?? null)}
          onPageChange={setPage}
        />
      </div>

      <footer className={styles.footer}>
        <span className={styles.progress}>
          {confirmed} de {EXPECTED_PIECES} peças confirmadas
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
