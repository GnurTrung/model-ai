import shutil
import tempfile
from contextlib import contextmanager
from pathlib import Path


@contextmanager
def request_workspace(prefix: str = "yolo-test-"):
    temp_dir = tempfile.mkdtemp(prefix=prefix)
    base = Path(temp_dir)
    model_dir = base / "model"
    images_dir = base / "images"

    model_dir.mkdir(parents=True, exist_ok=True)
    images_dir.mkdir(parents=True, exist_ok=True)

    try:
        yield {
            "base": base,
            "model_dir": model_dir,
            "images_dir": images_dir,
        }
    finally:
        shutil.rmtree(base, ignore_errors=True)
