import base64
from pathlib import Path

import cv2
from ultralytics import YOLO


class YoloInferService:
    def __init__(self, model_path: Path):
        self.model = YOLO(str(model_path))

    def infer_images(self, image_paths: list[Path]) -> list[dict]:
        predictions = self.model.predict(
            source=[str(path) for path in image_paths],
            verbose=False,
        )

        results: list[dict] = []
        for image_path, prediction in zip(image_paths, predictions):
            rendered = prediction.plot()
            ok, encoded = cv2.imencode(".jpg", rendered)
            if not ok:
                raise RuntimeError(f"Failed to encode output for {image_path.name}")

            image_b64 = base64.b64encode(encoded.tobytes()).decode("ascii")
            detections = 0
            if prediction.boxes is not None:
                detections = len(prediction.boxes)

            results.append(
                {
                    "filename": image_path.name,
                    "detections": detections,
                    "image_base64": image_b64,
                }
            )

        return results
