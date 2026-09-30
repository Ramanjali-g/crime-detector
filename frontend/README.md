# Crime Detector: frontend

React 18 + Vite.

```powershell
Copy-Item .env.example .env
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```
The backend URL comes from `VITE_API_URL`. The map uses the free OpenStreetMap embed; swap it in `src/services/mapProvider.js`.
