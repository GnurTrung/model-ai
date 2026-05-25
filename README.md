# YOLO Model Tester

Website cho phep upload model YOLO best.pt, upload nhieu anh, chay test va hien thi ket qua dang grid.

## Kien truc

- Frontend: React + Vite
- Backend: FastAPI + Ultralytics YOLO

## Chay Local Tu Dau

### 1) Clone source code

```powershell
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2) Cai dat backend (lam 1 lan)

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
cd ..
```

Neu may khong co lenh py, thay bang python:

```powershell
python -m venv .venv
```

### 3) Cai dat frontend (lam 1 lan)

```powershell
cd frontend
npm.cmd install
cd ..
```

### 4) Cau hinh bien moi truong frontend

Tao file frontend/.env voi noi dung:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 5) Chay backend va frontend (2 terminal)

Terminal 1 - Backend:

```powershell
cd backend
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Terminal 2 - Frontend:

```powershell
cd frontend
npm.cmd run dev -- --host 0.0.0.0 --port 5173
```

Mo trinh duyet tai:

- Frontend: http://localhost:5173
- Backend health: http://localhost:8000/api/health

### 6) Chay ca FE va BE bang mot lenh PowerShell (tuy chon)

Chay tai thu muc goc du an:

```powershell
Start-Process powershell -ArgumentList '-NoExit','-Command','cd "backend"; .\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000'
Start-Process powershell -ArgumentList '-NoExit','-Command','cd "frontend"; npm.cmd run dev -- --host 0.0.0.0 --port 5173'
```

## API

- POST /api/infer
  - form-data:
    - model: file .pt
    - images: danh sach anh
  - response: JSON gom results[] voi anh da ve bbox (base64) va so luong detections.

## Deploy Ghi Chu

- Khuyen nghi: FE tren Vercel, BE tren nen tang rieng co du RAM cho YOLO inference.
- Free tier co the co cold start.
- Khuyen nghi van hanh 10-20 anh/lan hoac it hon, tuy theo RAM backend.
