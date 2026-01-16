# BeautyShop MERN with Power BI

Stack: MongoDB · Express/Node.js · React (Vite) · Power BI embed · ETL exports.

## Setup

1) Clone & install
- Backend: `cd backend && npm install`
- Frontend: `cd ../frontend && npm install`

2) Configure env
- Backend `backend/.env` (example in `.env.example`):
  - `MONGO_URI=` (or `MONGODB_URI=`)
  - `PORT=5000`
  - `JWT_SECRET=`
- Frontend `frontend/.env`:
  - `VITE_API_URL=http://localhost:5000/api`
  - `VITE_POWER_BI_URL=<lien_dashboard_powerbi>`

3) Run
- Backend API: `cd backend && npm run dev`
- Frontend: `cd frontend && npm run dev`

## Power BI & Analytics
- Export des données MongoDB en CSV: `cd backend && node scripts/exportDataForPowerBI.js` (fichiers dans `backend/powerbi-exports/`).
- Bouton "Analytics" (navbar) ouvre directement le dashboard Power BI via `VITE_POWER_BI_URL`.
- Page Analytics React: KPIs + lien dashboard.
- Rapport LaTeX avec captures: `rapport_analyse_powerbi_v2.tex` (images dans `captures/`).

## ETL
- Scripts ETL et schéma entrepôt dans `etl/` (`etl_pipeline.py`, `schema_star.sql`).
- Export complet CSV également dans `powerbi-exports/`.

## API (exemples)
- Auth, produits, commandes, analytics (voir routes/controllers dans `backend/`).


## License
Non spécifié.
