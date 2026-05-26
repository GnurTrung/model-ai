import { useState } from "react";
import JSZip from "jszip";
import type { InferImageResult } from "../api/client";

type ResultGridProps = {
  results: InferImageResult[];
};

export default function ResultGrid({ results }: ResultGridProps) {
  const [activeImage, setActiveImage] = useState<InferImageResult | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const base64ToUint8Array = (base64: string) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  };

  const downloadAllAsZip = async () => {
    if (!results.length || isDownloading) {
      return;
    }

    setIsDownloading(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("inference-results");

      results.forEach((item, index) => {
        const safeName = item.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
        const fallbackName = `image_${index + 1}.jpg`;
        const filename = safeName.length ? safeName : fallbackName;
        folder?.file(filename, base64ToUint8Array(item.image_base64));
      });

      const blob = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `inference-results-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!results.length) {
    return (
      <section className="panel panel-results empty-state">
        <h2 className="panel-title">Ket qua</h2>
        <p>Chua co ket qua. Upload model + anh roi bam Chay test.</p>
      </section>
    );
  }

  return (
    <section className="panel panel-results">
      <div className="result-head">
        <h2 className="panel-title">Grid ket qua</h2>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={downloadAllAsZip}
          disabled={isDownloading}
        >
          {isDownloading ? "Dang tao ZIP..." : "Tai tat ca (.zip)"}
        </button>
      </div>
      <div className="result-grid">
        {results.map((item) => (
          <article
            key={`${item.filename}-${item.image_base64.slice(0, 12)}`}
            className="result-card"
            onClick={() => setActiveImage(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setActiveImage(item);
              }
            }}
          >
            <img
              src={`data:image/jpeg;base64,${item.image_base64}`}
              alt={item.filename}
              loading="lazy"
            />
            <div className="result-meta">
              <strong>{item.filename}</strong>
              <span>{item.detections} detections</span>
            </div>
          </article>
        ))}
      </div>

      {activeImage && (
        <div className="image-modal" onClick={() => setActiveImage(null)}>
          <div className="image-modal-content" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="image-modal-close"
              onClick={() => setActiveImage(null)}
              aria-label="Dong"
            >
              x
            </button>
            <img
              src={`data:image/jpeg;base64,${activeImage.image_base64}`}
              alt={activeImage.filename}
            />
            <p>
              <strong>{activeImage.filename}</strong> - {activeImage.detections} detections
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
