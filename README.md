# Eric's Live Channels — standalone PWA

A thin, installable web app that shows **only the Channels tab** (world radio /
TV / movies) from the town apps, for people who aren't in any of the towns.

## How it stays identical + in sync (zero maintenance)

This app ships almost no logic of its own. At runtime it loads the **same shared
bundle every town app uses**:

- `https://colonialbeachapp.com/channels-widget.js` — the entire Channels UI +
  persistent world-radio player (built from `pwa-colonial-beach/components/channels/widget-entry.jsx`).
- The widget self-fetches the live feed from `https://colonialbeachapp.com/channels.json`.

So whenever the widget or the channel feed is rebuilt and pushed (e.g. the
`cb-channels-refresh` / channels Action), this app picks it up on the next load.
No build step, no data file here, nothing to keep in sync by hand.

It mounts with **no town context**, so it renders the global feed (no per-town
nest cam) — exactly the channels common to every town.

Not part of the iOS App Store build (separate web app; the App Store CB app
gates Channels off anyway).

## Files
- `index.html` — shell: splash, header, mount point, widget loader + offline fallback.
- `manifest.json` — PWA manifest (name "Eric's Live Channels", standalone, teal theme).
- `sw.js` — service worker. Network-first for the shell AND for the
  colonialbeachapp.com widget/feed (freshness wins; cache only as offline fallback).
- `vercel.json` — static hosting config + SW/manifest headers.
- `icons/` — full icon set + maskable variants.

## Deploy (target: https://channels.colonialbeachapp.com)
1. Place this folder at `C:\Users\perib\Code\eric-live-channels`.
2. `git init` + commit, create a GitHub repo, push.
3. Import the repo in Vercel as a **new project** (framework: "Other",
   no build command, output dir = repo root).
4. Add the domain `channels.colonialbeachapp.com` to the project. Since
   colonialbeachapp.com already lives in this Vercel account, the DNS record is
   created automatically.
