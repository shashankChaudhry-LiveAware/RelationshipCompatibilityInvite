# Door A — Fit-only Personality Compatibility web form (email / WhatsApp link).

> **Hosting cutover (2026-09-03):** Canonical production host is moving to  
> `https://www.liveaware.in/compatibility?id={inviteId}`  
> Keep this Vercel project live until redirects + Backend env flip are done.

## Production URL (current / legacy)

`https://relationship-compatibility-invite.vercel.app`

Backend (until flip):

```
COMPATIBILITY_CLIENT_BASE_URL=https://relationship-compatibility-invite.vercel.app
```

After LiveAware.in `/compatibility` is verified in production:

```
COMPATIBILITY_CLIENT_BASE_URL=https://www.liveaware.in/compatibility
```

Then enable `vercel.json` redirects in this repo (see below), keep CORS for this origin during the window, then archive.

## Contract (must stay in sync with Mobile)

| Piece | Value |
|-------|--------|
| Inventory | 11 traits × 4 items (44 questions) — same as `PersonalityMappingData.js` |
| Load | `POST /api/v1/compatibility/get-invite` `{ id }` |
| Submit | `POST /api/v1/compatibility/submit-partner` `{ id, itemAnswers }` |
| API | `https://be.liveaware.in` |

Legacy 8-trait `answers`-only submit is **retired**.

## Regenerate after Personality Type inventory change

1. Refresh `_inventory.cjs` from Mobile `PersonalityMappingData.js` (strip `export` → CommonJS).
2. `node build-index.js`
3. Also refresh `Liveaware.in/src/lib/compatibility-inventory.json` from this inventory.
4. Commit + push (Vercel static deploy while this host is still live).

## Safe cutover order (do not skip)

1. Deploy LiveAware.in with `/compatibility`.
2. Smoke: open `https://www.liveaware.in/compatibility?id=<pendingInviteId>` → submit.
3. Flip Backend `COMPATIBILITY_CLIENT_BASE_URL` to liveaware.in path.
4. Enable redirects in `vercel.json` (uncomment / deploy this file’s redirects).
5. Wait 30–90 days → remove CORS origin → archive this repo.

## Local preview

Open `index.html` via a static server with `?id=<pendingInviteId>` against prod or local API (update `API_URL` in generated HTML for local).
