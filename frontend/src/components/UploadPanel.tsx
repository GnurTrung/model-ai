type UploadPanelProps = {
  modelFile: File | null;
  imageFiles: File[];
  isRunning: boolean;
  onModelChange: (file: File | null) => void;
  onImagesChange: (files: File[]) => void;
  onRun: () => void;
  onReset: () => void;
};

export default function UploadPanel({
  modelFile,
  imageFiles,
  isRunning,
  onModelChange,
  onImagesChange,
  onRun,
  onReset,
}: UploadPanelProps) {
  return (
    <section className="panel panel-upload">
      <h2 className="panel-title">Upload</h2>

      <label className="input-block">
        <span>Model file (.pt)</span>
        <input
          type="file"
          accept=".pt"
          onChange={(event) => onModelChange(event.target.files?.[0] ?? null)}
          disabled={isRunning}
        />
      </label>

      <label className="input-block">
        <span>Test images (max 40)</span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => onImagesChange(Array.from(event.target.files ?? []))}
          disabled={isRunning}
        />
      </label>

      <div className="file-summary">
        <p><strong>Model:</strong> {modelFile ? modelFile.name : "Chua chon"}</p>
        <p><strong>So anh:</strong> {imageFiles.length}</p>
      </div>

      <div className="preview-strip">
        {imageFiles.slice(0, 8).map((file) => (
          <span key={file.name} className="preview-chip" title={file.name}>
            {file.name}
          </span>
        ))}
        {imageFiles.length > 8 && <span className="preview-chip">+{imageFiles.length - 8} anh</span>}
      </div>

      <div className="actions">
        <button type="button" className="btn btn-primary" disabled={isRunning} onClick={onRun}>
          {isRunning ? "Dang test..." : "Chay test"}
        </button>
        <button type="button" className="btn btn-secondary" disabled={isRunning} onClick={onReset}>
          Reset
        </button>
      </div>
    </section>
  );
}
