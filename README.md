# ArkGPT
A MERN based AI assistant project inspired by chat interfaces and powered by OpenAI.

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
2. Set `OPENAI_API_KEY`, `MONGODB_URI`, and `CORS_ORIGIN` in that backend host's environment variables.
	Optional: set `OPENAI_MODEL_SIMPLE` and `OPENAI_MODEL_COMPLEX` to control model routing.
3. Set the GitHub repository variable `VITE_API_BASE_URL` to the deployed backend URL, for example `https://your-backend.onrender.com`.
   Use `https://` only. Do not use `http://` for production.
4. Enable GitHub Pages in the repository settings and choose GitHub Actions as the source.
5. Push to `main` to trigger the workflow.

Before deploying, set these GitHub repository variables if needed:
- `VITE_API_BASE_URL`: your deployed backend URL, for example `https://your-backend.onrender.com`

## If Browser Shows "Dangerous Site"

If the Pages URL was previously reported, browser reputation warnings can continue even after code fixes.

1. Remove or avoid third-party injected scripts/styles. This project now bundles icon styles locally.
2. Ensure your backend and all external calls use HTTPS only.
3. Submit a review request to Safe Browsing:
	- Google: https://safebrowsing.google.com/safebrowsing/report_error/
	- Microsoft Defender SmartScreen: https://www.microsoft.com/wdsi/support/report-unsafe-site-guest
4. If possible, use a custom domain for production instead of the default `github.io` URL to build separate reputation.
5. Wait for reputation cache updates (usually 24-72 hours after review and clean redeploy).

### Deployment Verification Checklist (Scripted)

After deploying frontend + backend, run:

```powershell
npm run verify:deploy -- -FrontendUrl https://<your-frontend-url> -BackendUrl https://<your-backend-url>
```

This verifies:
- frontend is reachable
- backend `/health` responds with `status: "ok"`
- required backend security headers are present
- CORS preflight for `/api/chat` behaves correctly for your frontend origin

For local-only checks, allow HTTP explicitly:

```powershell
npm run verify:deploy -- -FrontendUrl http://localhost:5173 -BackendUrl http://localhost:8080 -AllowHttp
```

If you do not set a backend URL, the frontend still opens on GitHub Pages and falls back to local in-browser responses.

Feedback submitted from the Pages site is sent to the backend `/api/feedback` endpoint. When MongoDB is available, it is stored there; otherwise, it is kept in memory until the backend restarts.

Backend health checks are available at `/health`, which is what Render uses for its service health path.

After pushing to `main`, enable GitHub Pages in your repository settings and choose GitHub Actions as the source.

## AI Features

- **Response modes**: `default`, `tutor`, `concise`, `deep`
- **Context-aware model routing** between simple and complex prompts
- **Retry with exponential backoff** on transient OpenAI errors
- **Capabilities endpoint**: `GET /api/ai/capabilities`

### Response Modes Explained

1. **Default** - General helpful assistant that answers any query directly, clearly, and concisely. Best for general questions.
2. **Tutor** - Solves problems step-by-step with detailed explanations. Perfect for learning code, math, and complex concepts. Does not default to generic encouragement.
3. **Concise** - Gives the shortest correct answer first, then 3 key bullet points. Ideal when you want quick information.
4. **Deep** - Rigorous technical answers with assumptions, edge cases, and practical next steps. Great for senior-level technical discussions.

### Built-in Services

Beyond the AI modes, the assistant can handle:
- **Weather queries**: Ask "What's the weather in London?" or "How will be the weather today?" (requires OPENWEATHER_API_KEY)
- **Calculator**: Ask "What is 15 + 27?" or "Calculate 100 * 0.5" for instant math results
- **Knowledge chat**: Default OpenAI integration for coding, explanations, creative writing, and more
