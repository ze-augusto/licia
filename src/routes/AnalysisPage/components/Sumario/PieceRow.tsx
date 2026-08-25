import { useState } from "react";
import { CheckIcon, XmarkIcon, PenToSquareIcon } from "@/components/icons";
import type { DocumentPiece } from "@/data/types";
import styles from "./PieceRow.module.css";

export interface PieceDraft {
  name: string;
  startPage: string;
  endPage: string;
}

interface PieceRowProps {
  piece: DocumentPiece;
  selected: boolean;
  onSelect: () => void;
  /** Entra em edição (`atual`) a partir de `idle`, `ausente` ou `orfa`. */
  onEdit: () => void;
  /** Confirma a peça (de `idle`) ou salva a edição (de `atual`). */
  onConfirm: (draft?: PieceDraft) => void;
  /** Sai da edição sem salvar. */
  onCancel: () => void;
  /** Volta de `confirmada` para `idle`. */
  onUndo: () => void;
  /** "Não se aplica" (ausente) / "Ignorar" (órfã) — remove a linha. */
  onDismiss: () => void;
  /** Leva o visualizador direto para a página clicada. */
  onGoToPage: (page: number) => void;
}

/** Círculo com o número da peça (`Sumário/Peça-número`). */
function PieceNumber({ piece }: { piece: DocumentPiece }) {
  const label =
    piece.state === "orfa" ? "!" : piece.state === "ausente" ? "—" : String(piece.order ?? "—");
  return (
    <span className={`${styles.number} ${styles[`number_${piece.state}`] ?? ""}`} aria-hidden="true">
      {label}
    </span>
  );
}

/**
 * Linha da tabela de peças (`Sumário/Linha-peça`).
 * Estados: idle, confirmada, atual (em edição), ausente, órfã.
 */
export function PieceRow({
  piece,
  selected,
  onSelect,
  onEdit,
  onConfirm,
  onCancel,
  onUndo,
  onDismiss,
  onGoToPage,
}: PieceRowProps) {
  const [draft, setDraft] = useState<PieceDraft>({
    name: piece.name,
    startPage: piece.startPage?.toString() ?? "",
    endPage: piece.endPage?.toString() ?? "",
  });

  const editing = piece.state === "atual";
  const missing = piece.state === "ausente";

  const rowClass = [
    styles.row,
    styles[`row_${piece.state}`],
    selected && !editing ? styles.rowSelected : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rowClass} onClick={onSelect} data-state={piece.state}>
      <div className={styles.colNumber}>
        <PieceNumber piece={piece} />
      </div>

      <div className={styles.colName}>
        {editing ? (
          <input
            className={styles.input}
            value={draft.name}
            autoFocus
            aria-label="Nome da peça"
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
        ) : (
          <span className={styles.name}>{piece.name}</span>
        )}
      </div>

      {missing ? (
        <div className={styles.colMessage}>não localizada no documento</div>
      ) : (
        <>
          <div className={styles.colPage}>
            {editing ? (
              <input
                className={styles.input}
                value={draft.startPage}
                inputMode="numeric"
                aria-label="Página inicial"
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setDraft({ ...draft, startPage: e.target.value })}
              />
            ) : (
              <button
                className={styles.page}
                type="button"
                title={`Ir para a página ${piece.startPage}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (piece.startPage) onGoToPage(piece.startPage);
                }}
              >
                {piece.startPage}
              </button>
            )}
          </div>
          <div className={styles.colPage}>
            {editing ? (
              <input
                className={styles.input}
                value={draft.endPage}
                inputMode="numeric"
                aria-label="Página final"
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setDraft({ ...draft, endPage: e.target.value })}
              />
            ) : (
              <button
                className={styles.page}
                type="button"
                title={`Ir para a página ${piece.endPage}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (piece.endPage) onGoToPage(piece.endPage);
                }}
              >
                {piece.endPage}
              </button>
            )}
          </div>
        </>
      )}

      <div className={styles.colActions} onClick={(e) => e.stopPropagation()}>
        {piece.state === "idle" && (
          <>
            <button
              className={styles.iconBtn}
              type="button"
              aria-label={`Editar ${piece.name}`}
              onClick={onEdit}
            >
              <PenToSquareIcon />
            </button>
            <button
              className={`${styles.iconBtn} ${styles.iconBtnBrand}`}
              type="button"
              aria-label={`Confirmar ${piece.name}`}
              onClick={() => onConfirm()}
            >
              <CheckIcon />
            </button>
          </>
        )}

        {piece.state === "confirmada" && (
          <button className={styles.linkBtn} type="button" onClick={onUndo}>
            Desfazer confirmação
          </button>
        )}

        {editing && (
          <>
            <button
              className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
              type="button"
              aria-label="Cancelar edição"
              onClick={onCancel}
            >
              <XmarkIcon />
            </button>
            <button
              className={`${styles.iconBtn} ${styles.iconBtnBrand}`}
              type="button"
              aria-label="Salvar peça"
              onClick={() => onConfirm(draft)}
            >
              <CheckIcon />
            </button>
          </>
        )}

        {missing && (
          <>
            <button className={styles.outlineBtn} type="button" onClick={onEdit}>
              Apontar páginas
            </button>
            <button className={styles.ghostBtn} type="button" onClick={onDismiss}>
              Não se aplica
            </button>
          </>
        )}

        {piece.state === "orfa" && (
          <>
            <button className={styles.outlineBtn} type="button" onClick={onEdit}>
              Atribuir à peça
            </button>
            <button className={styles.ghostBtn} type="button" onClick={onDismiss}>
              Ignorar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
