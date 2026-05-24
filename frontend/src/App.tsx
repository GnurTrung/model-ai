import { useMemo, useState } from "react";
import ResultGrid from "./components/ResultGrid";
import UploadPanel from "./components/UploadPanel";
import { runInference, type InferImageResult } from "./api/client";

const MAX_MODEL_SIZE_MB = 100;
const MAX_IMAGES = 40;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function App() {
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [results, setResults] = useState<InferImageResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState<string>("San sang test model YOLO.");

  const imageTotalBytes = useMemo(
    () => imageFiles.reduce((acc, file) => acc + file.size, 0),
    [imageFiles]
  );

  const handleRun = async () => {
    if (!modelFile) {
      setMessage("Ban can upload file best.pt truoc.");
      return;
    }

    if (modelFile.size > MAX_MODEL_SIZE_MB * 1024 * 1024) {
      setMessage(`Model vuot qua ${MAX_MODEL_SIZE_MB}MB.`);
      return;
    }

    if (!imageFiles.length) {
      setMessage("Ban can chon it nhat 1 anh.");
      return;
    }

    if (imageFiles.length > MAX_IMAGES) {
      setMessage(`Chi duoc toi da ${MAX_IMAGES} anh moi lan.`);
      return;
    }

    setIsRunning(true);
    setMessage("Dang chay inference, vui long doi...");

    try {
      const response = await runInference(modelFile, imageFiles);
      setResults(response.results);
      setMessage(
        `Done: ${response.processed_images}/${response.total_images} anh. Khuyen nghi free-tier: ${response.recommended_batch_size} anh/lan.`
      );
    } catch (error) {
      const text = error instanceof Error ? error.message : "Co loi khong xac dinh.";
      setMessage(`Loi: ${text}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setModelFile(null);
    setImageFiles([]);
    setResults([]);
    setMessage("Da reset. San sang test tiep.");
  };

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">YOLO DEPLOY SANDBOX</p>
        <h1>Test model best.pt bang giao dien web</h1>
        <p className="hero-subtext">
          Upload model, chon nhieu anh, bam test va xem ket qua detect theo dang grid.
        </p>
      </header>

      <section className="stat-band">
        <div>
          <span className="stat-label">So anh da chon</span>
          <strong>{imageFiles.length}</strong>
        </div>
        <div>
          <span className="stat-label">Tong dung luong anh</span>
          <strong>{formatBytes(imageTotalBytes)}</strong>
        </div>
        <div>
          <span className="stat-label">Trang thai</span>
          <strong>{isRunning ? "Dang chay" : "San sang"}</strong>
        </div>
      </section>

      <UploadPanel
        modelFile={modelFile}
        imageFiles={imageFiles}
        isRunning={isRunning}
        onModelChange={setModelFile}
        onImagesChange={setImageFiles}
        onRun={handleRun}
        onReset={handleReset}
      />

      <p className="status-message">{message}</p>

      <ResultGrid results={results} />
    </main>
  );
}
