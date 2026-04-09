# ArkGPT
A MERN based ChatGPT replica implemented from scratch using OpenAI.

## Quick Start (One Command)

From the project root, run:

```powershell
npm run dev:up
```

This command will:
- stop stale process on port 8080 (if any)
- start Backend server
- start Frontend dev server
- show MongoDB service status (if installed)

To stop both backend/frontend node processes:

```powershell
npm run dev:down
```

## GitHub Pages Deployment

GitHub Pages can host the frontend only. The backend must be hosted separately if you want live chat persistence and API-backed responses.

This repo now includes a Pages workflow at [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml).
It also includes a Render backend manifest at [render.yaml](render.yaml).

To make the Pages site behave like the local app, do this:
1. Deploy the `Backend` folder to a Node host such as Render, Railway, or Fly.io.
	If you use Render, the included [render.yaml](render.yaml) is ready to import.
2. Set `OPENAI_API_KEY` and `MONGODB_URI` in that backend host's environment variables.
3. Set the GitHub repository variable `VITE_API_BASE_URL` to the deployed backend URL, for example `https://your-backend.onrender.com`.
4. Enable GitHub Pages in the repository settings and choose GitHub Actions as the source.
5. Push to `main` to trigger the workflow.

Before deploying, set these GitHub repository variables if needed:
- `VITE_API_BASE_URL`: your deployed backend URL, for example `https://your-backend.onrender.com`

If you do not set a backend URL, the frontend still opens on GitHub Pages and falls back to local in-browser responses.

Feedback submitted from the Pages site is sent to the backend `/api/feedback` endpoint. When MongoDB is available, it is stored there; otherwise, it is kept in memory until the backend restarts.

After pushing to `main`, enable GitHub Pages in your repository settings and choose GitHub Actions as the source.
