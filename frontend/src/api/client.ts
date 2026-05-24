export type InferImageResult = {
  filename: string;
  detections: number;
  image_base64: string;
};

export type InferResponse = {
  request_id: string;
  total_images: number;
  processed_images: number;
  recommended_batch_size: number;
  results: InferImageResult[];
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function runInference(modelFile: File, imageFiles: File[]): Promise<InferResponse> {
  const formData = new FormData();
  formData.append("model", modelFile);
  imageFiles.forEach((imageFile) => formData.append("images", imageFile));

  const response = await fetch(`${API_BASE_URL}/api/infer`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.detail ?? "Inference request failed");
  }

  return data as InferResponse;
}
