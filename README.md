# mindplay

A minimal, eye-friendly browser game platform. No frameworks, no build tools — just HTML, CSS, and JavaScript. Works offline as an installable PWA.

**Live:** https://werninger.github.io/mindplay/

## Games

### Cross Sum
Calculate the [digital root](https://en.wikipedia.org/wiki/Digital_root) of six random numbers as fast as you can. The timer starts immediately and your top 5 times are saved locally.

### Mastermind
Crack a secret 4-color code in up to 10 attempts. After each guess you get feedback: filled dot = right color & position, ring = right color wrong position.

## Features

- Light / dark mode toggle, preference saved to localStorage
- Fully offline via service worker (cache-first)
- Installable on iOS and Android as a PWA
- No dependencies, no build step

## Run locally

```bash
cd mindplay
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy to GitHub Pages

1. Push this repo to GitHub
2. Settings → Pages → Source: `main` branch, `/ (root)`
3. Live at `https://<username>.github.io/mindplay/`

## Structure

```
index.html        home screen
crosssum.html     crosssum game
mastermind.html   mastermind game
style.css         shared styles + CSS variables (light/dark)
app.js            theme toggle, hint panel
crosssum.js       crosssum game logic
mastermind.js     mastermind game logic
manifest.json     PWA manifest
sw.js             service worker (offline support)
icons/            PWA icons (192px, 512px)
```

