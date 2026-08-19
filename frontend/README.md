# React + Vite

## Run Locally

Start the backend on port `8000`, then run the frontend:

```bash
cd backend
npm install
npm start

cd frontend
npm install
npm run dev
```

Local Vite development uses `http://localhost:8000` from `.env`.
Production builds use the deployed API from `.env.production`. When deploying
to another frontend or backend URL, set `VITE_ENV_BACKEND_URL` in the hosting
provider's environment variables and add the frontend URL to
`WHITELISTED_FRONTEND_URLS` on the backend.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
