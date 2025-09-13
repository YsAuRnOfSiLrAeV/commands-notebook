## Commands Notebook

Desktop app built with React + Tailwind + Electron for organizing sections and commands.

### Quick install (Windows)
⚠️ The Windows installer is in the repository root: `windows installer/Commands Notebook Setup 0.0.0.exe`.
Run it and install the app; a desktop shortcut will be created.

### Development (frontend only, Electron not required)
```bash
npm install
npm run dev
```
- This starts the Vite dev server with HMR.

### Build installers

Run these from the project root:
- Windows (run on Windows):
```bash
npm run dist:win
```
Artifact: `release/Commands Notebook-<version>.exe`

- macOS (run on macOS):
```bash
npm run dist:mac
```
Artifacts: `release/Commands Notebook-<version>.dmg` (and `.zip`)

- Linux (run on Linux/WSL):
```bash
sudo apt update
sudo apt install -y fakeroot rpm libarchive-tools dpkg desktop-file-utils

npm ci
npm run dist:linux
```
Artifacts: `release/*.AppImage`, `release/*.deb`, `release/*.rpm`

### Electron integration (technical details)
- The renderer (React) is built by Vite into `dist/` and loaded into a `BrowserWindow`.
- Preload `electron/preload.cjs` safely exposes APIs on `window`:
  - `window.dataApi.loadAll()/saveAll()` — reads/writes `data.json` via IPC handled in `electron/main.cjs`.
  - `window.electronClipboard.writeText()` — copies text to the system clipboard.
- In dev, `loadAll/saveAll` fall back to `fetch('/data.json')`/`/api/save` (only during `npm run dev`).

### Troubleshooting
- Blank screen in production build: ensure `vite.config.ts` has `base: './'` for build.
- Windows icon cache: sometimes recreate the shortcut or clear the icon cache.
- Tailwind oxide on Windows (EBUSY/EPERM):
```bat
taskkill /F /IM node.exe 2>nul
set TAILWIND_DISABLE_OXIDE=1
npm i
```

### License
The repository owner defines distribution terms.
