# Brand Perception Card Sort — Vercel deployment

Same survey as the artifact version, but standalone: a static `index.html` plus one serverless API route (`api/responses.js`) backed by Vercel KV, so it works outside Claude.ai.

## Deploy

1. Push this folder to a GitHub repo (or run `vercel` from inside it with the Vercel CLI).
2. Import the repo in the Vercel dashboard. Framework preset: "Other". No build command needed.
3. In the project, go to **Storage → Create Database → KV**. Connect it to this project. Vercel will inject the required env vars (`KV_REST_API_URL`, `KV_REST_API_TOKEN`, etc.) automatically, no manual copy-pasting.
4. Redeploy (Vercel usually triggers this automatically after connecting storage; if not, hit Deployments → Redeploy).
5. Open the deployed URL. Take the survey, then check `/` → "View results" to confirm a response was saved.

## Local development

```
npm install
vercel env pull .env.local   # pulls the KV credentials from your Vercel project
vercel dev
```

## Notes

- `api/responses.js` handles both saving (`POST`) and reading (`GET`) responses. `GET` returns everything under the shared key set, there's no per-user scoping, this matches the "anyone with the link can see aggregate results" behavior from the artifact version.
- Brand list is 8 (EU brands dropped per the latest scope). Edit the `BRANDS` array in `index.html` if that changes again, no other file needs to change.
- If you ever want to reset the study (start over with 0 responses), the simplest way is to delete and recreate the KV database in the Vercel dashboard, or open the KV data browser and clear keys prefixed `card-sort:`.
