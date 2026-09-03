# RelationshipCompatibilityInvite

Door A — **Fit-only** Personality Compatibility web form (email / WhatsApp link).

Not the mutual bond invite. Bond partners without the app still use this only when they receive a Door A Fit link; bond email itself points to app stores + claim-by-email.

## Production URL

`https://relationship-compatibility-invite.vercel.app`

Backend:

```
COMPATIBILITY_CLIENT_BASE_URL=https://relationship-compatibility-invite.vercel.app
```

Links: `{COMPATIBILITY_CLIENT_BASE_URL}/?id={inviteId}`

Also allow this origin in backend CORS (`KNOWN_PRODUCTION_ORIGINS` or `CORS_ALLOWED_ORIGINS`).

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
3. Commit + push `main` (Vercel static deploy).

## Local preview

Open `index.html` via a static server with `?id=<pendingInviteId>` against prod or local API (update `API_URL` in generated HTML for local).
