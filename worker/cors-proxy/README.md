# LNUP CORS Proxy (Cloudflare Worker)

Ein einfacher CORS-Proxy, damit die LNUP-App im Browser Webseiten laden kann.

## Deploy (Dashboard — empfohlen)

1. Gehe zu [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create**
2. Wähle **"Create Worker"**
3. Gib einen Namen ein, z.B. `lnup-cors-proxy`
4. Ersetze den Code durch den Inhalt von `worker.js`
5. Klicke **Deploy**
6. Deine Worker-URL ist: `https://lnup-cors-proxy.<dein-account>.workers.dev`

## Deploy (CLI)

```bash
cd worker/cors-proxy
npm install -g wrangler
wrangler login
wrangler deploy
```

## In der App konfigurieren

Trage die Worker-URL in `.env` ein:

```
EXPO_PUBLIC_PROXY_URL=https://lnup-cors-proxy.<dein-account>.workers.dev
```

## Testen

```
curl "https://lnup-cors-proxy.<dein-account>.workers.dev/?url=https://www.deggendorf-pulsiert.de/"
```

Sollte den HTML-Inhalt von deggendorf-pulsiert.de zurückgeben.

## Limits (Free Plan)

- 100.000 Requests pro Tag
- 10ms CPU-Zeit pro Request
- Keine Kosten
