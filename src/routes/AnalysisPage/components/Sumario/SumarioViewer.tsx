import { ArrowLeft, ArrowRight } from "@/components/icons";
import type { AnalysisDocument } from "@/data/types";
import { DocumentCard } from "../DocumentCard";
import styles from "./SumarioViewer.module.css";

interface SumarioViewerProps {
  nup: string;
  document: AnalysisDocument;
  page: number;
  /** Peça correspondente à página em foco, exibida na faixa de contexto. */
  context: string | null;
  onPageChange: (page: number) => void;
}

/** Visualizador do PDF na etapa de sumário — versão estreita do visor da análise. */
export function SumarioViewer({ nup, document, page, context, onPageChange }: SumarioViewerProps) {
  const go = (delta: number) =>
    onPageChange(Math.min(document.totalPages, Math.max(1, page + delta)));

  return (
    <aside className={styles.viewer}>
      <h2 className={styles.title}>Visualizador</h2>

      <div className={styles.context}>
        Página {page}
        {context ? ` · ${context}` : ""}
      </div>

      <div className={styles.pdf}>
        <div className={styles.toolbar}>
          <span className={styles.fileName}>{document.fileName}</span>
          <button
            className={styles.miniBtn}
            type="button"
            aria-label="Página anterior"
            onClick={() => go(-1)}
          >
            <ArrowLeft />
          </button>
          <div className={styles.pageBox}>
            <input
              className={styles.pageInput}
              value={page}
              inputMode="numeric"
              aria-label="Número da página"
              onChange={(e) => {
                const n = Number(e.target.value.replace(/\D/g, ""));
                if (n >= 1 && n <= document.totalPages) onPageChange(n);
              }}
            />
            <span className={styles.pageTotal}>/ {document.totalPages}</span>
          </div>
          <button
            className={styles.miniBtn}
            type="button"
            aria-label="Próxima página"
            onClick={() => go(1)}
          >
            <ArrowRight />
          </button>
        </div>

        <div className={styles.documentArea}>
          <DocumentCard compact nup={nup} totalPages={document.totalPages} page={page} />
        </div>
      </div>
    </aside>
  );
}
