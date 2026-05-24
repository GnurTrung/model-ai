from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.config import settings
from app.schemas.infer_response import InferResponse
from app.services.file_store import request_workspace
from app.services.yolo_infer import YoloInferService

ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}

router = APIRouter(prefix="/api", tags=["inference"])


def _validate_model_upload(model: UploadFile) -> None:
    if not model.filename:
        raise HTTPException(status_code=400, detail="Model file is required.")

    if not model.filename.lower().endswith(".pt"):
        raise HTTPException(status_code=400, detail="Model must be a .pt file.")


def _validate_image_uploads(images: list[UploadFile]) -> None:
    if not images:
        raise HTTPException(status_code=400, detail="At least one image is required.")

    if len(images) > settings.max_images_per_request:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum {settings.max_images_per_request} images per request.",
        )

    for image in images:
        if not image.filename:
            raise HTTPException(status_code=400, detail="Invalid image filename.")

        suffix = Path(image.filename).suffix.lower()
        if suffix not in ALLOWED_IMAGE_EXTENSIONS:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported image format: {image.filename}",
            )


async def _save_model(model: UploadFile, model_target: Path) -> None:
    model_bytes = await model.read()
    max_size = settings.max_model_size_mb * 1024 * 1024
    if len(model_bytes) > max_size:
        raise HTTPException(
            status_code=400,
            detail=f"Model must be <= {settings.max_model_size_mb}MB.",
        )

    model_target.write_bytes(model_bytes)


async def _save_images(images: list[UploadFile], images_dir: Path) -> list[Path]:
    saved: list[Path] = []
    for image in images:
        target = images_dir / image.filename
        image_bytes = await image.read()
        target.write_bytes(image_bytes)
        saved.append(target)
    return saved


@router.post("/infer", response_model=InferResponse)
async def infer(model: UploadFile = File(...), images: list[UploadFile] = File(...)):
    _validate_model_upload(model)
    _validate_image_uploads(images)

    with request_workspace() as workspace:
        request_id = str(uuid4())
        model_path = workspace["model_dir"] / "best.pt"

        await _save_model(model, model_path)
        image_paths = await _save_images(images, workspace["images_dir"])

        try:
            infer_service = YoloInferService(model_path)
            result_items = infer_service.infer_images(image_paths)
        except Exception as exc:
            raise HTTPException(status_code=500, detail=f"Inference failed: {exc}") from exc

    return InferResponse(
        request_id=request_id,
        total_images=len(images),
        processed_images=len(result_items),
        recommended_batch_size=settings.recommended_batch_size,
        results=result_items,
    )
