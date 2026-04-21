# GAMEFEED 🎮

Noticiero gaming en español con diseño oscuro estilo cyberpunk/gaming.

## Stack

- **Frontend**: React + Vite + Tailwind CSS + React Router
- **Backend**: Node.js + Express
- **Base de datos**: SQLite (better-sqlite3, sin instalación externa)
- **Auth**: JWT + bcrypt

## Estructura

```
gamefeed/
├── client/    ← React app (Vite + Tailwind)
└── server/    ← API REST (Express + SQLite)
```

## Instalación y arranque

### 1. Backend

```bash
cd server
npm install
npm run dev
```

### 2. Frontend (nueva terminal)

```bash
cd client
npm install
npm run dev
```

La app corre en:

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## Variables de entorno

`server/.env` (ya incluido con valores por defecto):

```
JWT_SECRET=gamefeed_super_secret_key_2024
PORT=5000
```

## API Endpoints

| Método | Ruta                | Auth | Descripción               |
| ------ | ------------------- | ---- | ------------------------- |
| POST   | /api/auth/register  | ❌   | Registrar usuario         |
| POST   | /api/auth/login     | ❌   | Iniciar sesión            |
| GET    | /api/news/latest    | ✅   | Newsletter más reciente   |
| POST   | /api/news/publish   | ✅   | Publicar nuevo newsletter |
| POST   | /api/news/poll-vote | ✅   | Votar en encuesta         |
