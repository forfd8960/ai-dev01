# Project Alpha Frontend

React 18 + Vite + TypeScript implementation of the ticket dashboard described in `specs/w1/0001-spec.md`. The UI consumes the FastAPI backend (`/api`) delivered in Phase 2.

## Prerequisites

- Node.js 20.x (npm 10.x)
- Backend running locally on `http://localhost:8000`

## Getting Started

```bash
cd w1/project-alpha/frontend
npm install
cp .env.example .env.local        # optional – defaults to http://localhost:8000/api
npm run dev
```

The development server runs on `http://localhost:5173` and proxies API requests to the backend via the `VITE_API_BASE_URL` environment variable.

## Available Scripts

- `npm run dev` – start Vite in development mode
- `npm run build` – generate a production build
- `npm run preview` – preview the production build locally
- `npm run lint` – run ESLint across the project

## Architecture Notes

- **State & Data**: React Query manages API calls/caching; Zustand stores UI filter state (search, tags, pagination, sorting).
- **UI Toolkit**: Tailwind CSS for styling with custom design tokens, plus lightweight components (`Button`, `Dialog`, `Toast`, etc.).
- **Structure**:
	- `src/App.tsx` – main composition of layout, filters, list, and modal dialog.
	- `src/components/filters` – search, tag, priority, and status controls.
	- `src/components/tickets` – list, card, dialog, and pagination building blocks.
	- `src/hooks` – React Query hooks wrapping service calls.
	- `src/services` – typed Axios clients targeting the backend (`/tickets`, `/tags`).
	- `src/store` – Zustand filter store shared across components.

## API Contract

The backend responds with `{ code, message, data }`. Services unwrap the `data` field and surface rich errors when available. Configure `VITE_API_BASE_URL` if the backend is not running on the default host/port.
