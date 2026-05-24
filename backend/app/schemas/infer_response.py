from pydantic import BaseModel


class ImageResult(BaseModel):
    filename: str
    detections: int
    image_base64: str


class InferResponse(BaseModel):
    request_id: str
    total_images: int
    processed_images: int
    recommended_batch_size: int
    results: list[ImageResult]
