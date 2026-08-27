import { useState } from "react";
import { CheckIcon, XmarkIcon, PenToSquareIcon, TrashIcon } from "@/components/icons";
import styles from "./PieceRow.module.css";

/** Círculo com o número da peça (`Sumário/Peça-número`). */
function PieceNumber({ piece, variant }) {
  const label =
    piece.state === "orfa" ? "!" : piece.state === "ausente" ? "—" : String(piece.order ?? "—");
  return (
    <span className={`${styles.number} ${styles[`number_${variant}`] ?? ""}`} aria-hidden="true">
      {label}
    </span>
  );
}

/**
 * Linha da tabela de peças (`Sumário/Linha-peça`).
 * Estados: idle, atual (em edição), ausente, órfã.
 *
 * `editing` é a variante `atual`. Ele vem de fora, e não do `piece.state`, para
 * a peça não perder o próprio estado enquanto está sendo editada.
 *
 * As ações são as mesmas em toda linha parada — remover e editar. Só a linha
 * em edição troca o par por cancelar e salvar.
 */
export function PieceRow({
  piece,
  editing,
  onSelect,
  onEdit,
  onSave,
  onCancel,
  onRemove,
  onGoToPage,
}) {
  const [draft, setDraft] = useState({
    name: piece.name,
    startPage: piece.startPage?.toString() ?? "",
    endPage: piece.endPage?.toString() ?? "",
  });

  const missing = piece.state === "ausente";
  const variant = editing ? "atual" : piece.state;

  return (
    <div
      className={`${styles.row} ${styles[`row_${variant}`]}`}
      onClick={onSelect}
      data-state={variant}
    >
      <div className={styles.colNumber}>
        <PieceNumber piece={piece} variant={variant} />
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

      {missing && !editing ? (
        <div className={styles.colMessage}>não localizado</div>
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
        {editing ? (
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
              className={`${styles.iconBtn} ${styles.iconBtnSuccess}`}
              type="button"
              aria-label="Salvar peça"
              onClick={() => onSave(draft)}
            >
              <CheckIcon />
            </button>
          </>
        ) : (
          <>
            <button
              className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
              type="button"
              aria-label={`Remover ${piece.name}`}
              onClick={onRemove}
            >
              <TrashIcon />
            </button>
            <button
              className={styles.iconBtn}
              type="button"
              aria-label={`Editar ${piece.name}`}
              onClick={onEdit}
            >
              <PenToSquareIcon />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
