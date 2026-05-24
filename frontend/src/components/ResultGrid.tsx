import type { InferImageResult } from "../api/client";

type ResultGridProps = {
  results: InferImageResult[];
};

export default function ResultGrid({ results }: ResultGridProps) {
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
      <h2 className="panel-title">Grid ket qua</h2>
      <div className="result-grid">
        {results.map((item) => (
          <article key={`${item.filename}-${item.image_base64.slice(0, 12)}`} className="result-card">
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
    </section>
  );
}
