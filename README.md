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

Before deploying, set these GitHub repository variables if needed:
- `VITE_API_BASE_URL`: your deployed backend URL, for example `https://your-backend.onrender.com`

If you do not set a backend URL, the frontend still opens on GitHub Pages and falls back to local in-browser responses.

After pushing to `main`, enable GitHub Pages in your repository settings and choose GitHub Actions as the source.
