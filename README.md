# Door A — Compatibility Check web form (Fit only · email / WhatsApp link)

> **Flip (2026-09-04):** Canonical host is `https://www.liveaware.in/compatibility?id={inviteId}`.  
> This Vercel project **stays** — it redirects to liveaware.in. Do **not** delete the repo or Vercel project yet.

## Production URL

| Role | URL |
|------|-----|
| **Canonical (new invites)** | `https://www.liveaware.in/compatibility` |
| **Legacy host (kept; redirects)** | `https://relationship-compatibility-invite.vercel.app` |

Backend / AWS (flip):

```
COMPATIBILITY_CLIENT_BASE_URL=https://www.liveaware.in/compatibility
```

Keep `https://relationship-compatibility-invite.vercel.app` in Backend CORS.

## Contract (must stay in sync with Mobile)

| Piece | Value |
|-------|--------|
| Inventory | 11 traits × 4 items (44 questions) — same as `PersonalityMappingData.js` |
| Load | `POST /api/v1/compatibility/get-invite` `{ id }` |
| Submit | `POST /api/v1/compatibility/submit-partner` `{ id, itemAnswers }` |
| API | `https://be.liveaware.in` |

## Regenerate inventory (Liveaware.in is SoT for the live form)

```bash
node sync-inventory.js   # Mobile → _inventory.cjs + Liveaware.in JSON
node build-index.js      # rebuild index.html (local preview / rollback)
```

## Do not delete yet

Leave this GitHub repo + Vercel project up with redirects. Archive only later if you explicitly choose to retire the legacy host.
