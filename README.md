# AI Video Generator

A minimal web app that turns a text prompt into a short AI-generated video.

This is the initial, minimal version: a single page with a text input and a
submit button. Submitting calls a placeholder backend API that currently
always returns a hardcoded sample video. The real video-generation logic is
not implemented yet — see [Next steps](#next-steps).

## Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vercel Serverless Functions](https://vercel.com/docs/functions) for the backend (`api/`)
- Deployed via Vercel's native GitHub integration (auto-deploy on push, no CI config needed)

## Project structure

```
ai_app/
├── api/
│   └── generate.ts      # POST /api/generate — placeholder backend endpoint
├── src/
│   ├── App.tsx           # single-page UI: prompt input, submit button, video player
│   ├── main.tsx           # React entry point
│   └── index.css          # Tailwind directives
├── index.html
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

## How it works

1. The user types a prompt and clicks **Generate video**.
2. The frontend sends `POST /api/generate` with `{ prompt }`.
3. The API validates that `prompt` is a non-empty string (400 if not).
4. The API responds with `{ prompt, videoUrl }`, where `videoUrl` is
   currently a hardcoded public sample video
   (`BigBuckBunny.mp4`). No AI generation happens yet.
5. The frontend plays whatever `videoUrl` it receives.

## Local development

Requires Node.js and npm.

```bash
npm install
npm run dev
```

This starts the Vite dev server for the frontend. Note that `npm run dev`
alone does **not** run the `/api` serverless function — it will 404 in this
mode. To run the frontend and API together locally, use the Vercel CLI:

```bash
npx vercel dev
```

(First run will prompt you to log in and link the project to Vercel.)

## Build

```bash
npm run build
```

Type-checks the app and the API function, then builds the production
frontend bundle into `dist/`.

## Lint

```bash
npm run lint
```

## Deployment

This project deploys via **Vercel's native GitHub integration**:

1. Push this repository to GitHub.
2. In the [Vercel dashboard](https://vercel.com/new), import the GitHub
   repository as a new project.
3. Framework preset: **Vite**. No environment variables are required for the
   current placeholder setup.
4. Every push to the default branch triggers an automatic production
   deployment; pull requests get preview deployments. No GitHub Actions
   workflow is needed.

The `api/generate.ts` file is automatically deployed by Vercel as a
serverless function at `/api/generate` — no extra configuration required.

## Next steps

- Replace the placeholder logic in `api/generate.ts` with a real
  AI video generation integration.
- Add a loading/progress experience suited to real generation latency
  (the placeholder responds instantly).
- Consider persistence (e.g. a database) if generated videos need to be
  saved or listed, and auth if generation should be gated per user.
