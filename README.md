# YOLO Model Tester

Website cho phep upload model YOLO `best.pt`, upload nhieu anh, chay test va hien thi ket qua dang grid.

## Kien truc

- Frontend: React + Vite (deploy Vercel)
- Backend: FastAPI + Ultralytics YOLO (deploy Render free tier)

## Local setup

### 1) Backend

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Tao file `.env` cho frontend:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

## API

- `POST /api/infer`
  - form-data:
    - `model`: file `.pt`
    - `images`: danh sach anh
  - response: JSON gom `results[]` voi anh da ve bbox (base64) va so luong detections.

## Deploy ghi chu (free tier)

- FE len Vercel.
- BE len Render free tier (Web Service Python).
- Free tier co cold start, request dau co the cham.
- Khuyen nghi van hanh 10-20 anh/lan de giam timeout.
