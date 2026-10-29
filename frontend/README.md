# NidhiSetu frontend for Vercel

Standalone Next.js, React and TypeScript version of the portal UI. The original Cloudflare application remains in ../prototype/.

## Run locally

Use Node.js 22.13 or later and npm:

```powershell
cd frontend
npm ci
npm run dev
```

Open the URL printed by Next.js. No environment variables or sign-in are needed.

```powershell
npm run typecheck
npm test
npm run lint
npm run test:browser
npm run build
npm start
```

## Browser demo mode

The visible Browser demo banner identifies this version. Seven synthetic records are created on first use. Submissions, revisions, simulated evidence, release steps and deduplicated reminders use the existing domain rules. Demo personas change the workflow being explored.

The client adapter in lib/demo-client.ts stores state and uploaded files in IndexedDB. Changes survive refresh in the same browser and origin. State changes and document uploads use atomic transactions with revision checks across tabs. PDF, PNG and JPEG uploads are limited to 5 MB and checked against file signatures. Seed receipts download as explicitly synthetic TXT files.

Each browser profile and origin has its own data. Clearing site data deletes it. Uploads never leave the browser. Browser storage limits still apply. Use only sample information and files. Anyone using that browser can inspect its local data: this demo provides no real authentication or authorization boundary.

There is no backend connection, real bank verification, AICTE integration, notification delivery or money movement. The reminder clock remains fixed at 28 October 2026. The existing private hosted site and its data are not accessed.

## Deploy on Vercel

1. Push this folder as part of your Git repository.
2. Import the repository into Vercel and set Root Directory to frontend.
3. Choose Next.js, keep the default install command and use npm run build.
4. Leave the output-directory override unset. Browser demo mode needs no secrets or environment variables.
5. Deploy and test the banner, persona switch, a submission, upload/download, reminders and refresh.

This package uses ordinary Next.js build/start scripts and contains no Cloudflare bindings, API handlers, Sites sign-in routes or remote fonts.

## Connecting a real backend later

Replace workspaceRequest and downloadDemoDocument with an authenticated API adapter. A backend must validate roles and institution scope independently of the persona selector, validate uploads, and persist state and audit events. The original Cloudflare backend depends on platform-owned sign-in and same-origin checks: pointing the browser at its URL alone does not integrate it. Keep backend credentials on the server and implement an agreed authentication and origin policy.

Browser tests use installed Microsoft Edge on Windows. On other platforms, run `npx playwright install chromium` first. The browser suite starts the dev server if needed; set PLAYWRIGHT_BASE_URL to test an already-running production preview instead.
