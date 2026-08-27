import { useState } from "react";
import { MinusIcon, PlusIcon } from "@/components/icons";
import styles from "./DocumentMap.module.css";

const ZOOM_STEPS = [1, 1.5, 2, 3];
/** Menor largura de segmento no Figma. Abaixo disso o detalhe é cortado. */
const SEGMENT_MIN_WIDTH = 48;

/**
 * Régua proporcional do documento (`Mapa do documento`). Cada segmento é uma
 * peça com páginas atribuídas; a largura acompanha o nº de páginas. O nome e a
 * faixa aparecem sempre — quando não cabem, o segmento corta com reticências.
 */
export function DocumentMap({ pieces, totalPages, selectedId, currentPage, onSelect }) {
  const [zoomIndex, setZoomIndex] = useState(0);

  const segments = pieces.filter((p) => p.startPage !== null && p.endPage !== null);
  const zoom = ZOOM_STEPS[zoomIndex];

  return (
    <section className={styles.map}>
      <div className={styles.head}>
        <h2 className={styles.title}>Mapa do documento</h2>
        <div className={styles.zoom}>
          <span className={styles.zoomLabel}>Zoom do mapa</span>
          <button
            className={styles.miniBtn}
            type="button"
            aria-label="Reduzir zoom do mapa"
            disabled={zoomIndex === 0}
            onClick={() => setZoomIndex((i) => Math.max(0, i - 1))}
          >
            <MinusIcon />
          </button>
          <button
            className={styles.miniBtn}
            type="button"
            aria-label="Ampliar zoom do mapa"
            disabled={zoomIndex === ZOOM_STEPS.length - 1}
            onClick={() => setZoomIndex((i) => Math.min(ZOOM_STEPS.length - 1, i + 1))}
          >
            <PlusIcon />
          </button>
        </div>
      </div>

      <div className={styles.scroll}>
        <div className={styles.track} style={{ width: `${zoom * 100}%` }}>
          <div className={styles.ruler}>
            {segments.map((piece) => {
              const pages = piece.endPage - piece.startPage + 1;
              const selected = piece.id === selectedId;
              const segClass = [
                styles.segment,
                styles[`segment_${piece.state}`],
                selected ? styles.segmentSelected : "",
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <button
                  key={piece.id}
                  type="button"
                  className={segClass}
                  style={{ flex: `${pages} 1 0`, minWidth: SEGMENT_MIN_WIDTH }}
                  title={`${piece.name} · ${piece.startPage}–${piece.endPage}`}
                  onClick={() => onSelect(piece.id)}
                >
                  <span
                    className={`${styles.number} ${styles[`number_${piece.state}`] ?? ""} ${
                      selected ? styles.numberSelected : ""
                    }`}
                  >
                    {piece.state === "orfa" ? "!" : piece.order}
                  </span>
                  <span className={styles.detail}>
                    <span className={styles.detailName}>{piece.shortName}</span>
                    <span className={styles.detailRange}>
                      {piece.startPage}–{piece.endPage}
                    </span>
                  </span>
                </button>
              );
            })}
            <div
              className={styles.cursor}
              style={{ left: `${((currentPage - 1) / totalPages) * 100}%` }}
            />
          </div>

          <div className={styles.scale}>
            <span>1</span>
            <span>50</span>
            <span>100</span>
            <span>150</span>
            <span>{totalPages}</span>
            <span
              className={styles.cursorLabel}
              style={{ left: `${((currentPage - 1) / totalPages) * 100}%` }}
            >
              {currentPage}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
