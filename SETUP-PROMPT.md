# Prompt pro Claude Code na novém stroji

Zkopíruj celý blok níže do Claude Code spuštěného ve složce, kde má projekt `faceless-yt` ležet.

```text
Jsem na Windows. Chci na tomto stroji zprovoznit projekt `faceless-yt` (faceless YouTube videa:
Remotion + FFmpeg + mcp-video + Google Gemini TTS). Komunikuj česky. Postupuj po fázích, po každé
stručně napiš výsledek. Nic neinstaluj, dokud mi neřekneš co a proč a nepočkáš na souhlas.
Nikdy nevypisuj klíče, nedávej je do kódu ani do Gitu.

FÁZE 1 – Audit (nic neinstaluj)
- Zjisti verze: ffmpeg, ffprobe, node (18+), npm, python (3.10+), uv/uvx, git, winget, claude.
- Ověř filtr drawtext: `ffmpeg -hide_banner -filters | findstr drawtext`.
- Zjisti, zda složka `faceless-yt` už existuje (třeba synchronizací přes OneDrive) a co obsahuje.
- Vypiš, co chybí, a navrhni instalaci přes winget:
  Gyan.FFmpeg, OpenJS.NodeJS.LTS, Python.Python.3.13, astral-sh.uv, Git.Git.

FÁZE 2 – Instalace chybějících nástrojů (po mém souhlasu)
- Jen to, co chybí. Po instalaci ověř verze (může být nutný nový terminál kvůli PATH).

FÁZE 3 – Projekt
- Pokud složka `faceless-yt` neexistuje, zeptej se mě, odkud ji zkopírovat (OneDrive, git, USB).
  Struktura: `scripts/`, `assets/`, `remotion/`, `out/`, `workflows/`, `tts-probe/`, `CLAUDE.md`.
- Přečti `CLAUDE.md` a `workflows/render-pipeline.md`; řiď se jimi.
- Pokud se složky `remotion/node_modules` nebo `tts-probe/.venv` dostaly na tento stroj synchronizací,
  smaž je a vytvoř znovu (virtuální prostředí a node_modules jsou vázané na konkrétní stroj).
- Remotion: `cd remotion && npm install`
- TTS nástroj: `cd tts-probe && uv venv .venv && uv pip install --python .venv\Scripts\python.exe -r requirements.txt`
- Lokální TTS (Kokoro): v `tts-probe` vytvoř složku `models` a stáhni do ní `kokoro-v1.0.onnx` (325 MB) a
  `voices-v1.0.bin` (28 MB) z https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
  (nejdřív mi řekni velikost a počkej na souhlas). Test: `tts_script.py --engine kokoro --script ..\scripts\leadership-paradox.txt --name kokoro-test`.
- `tts-probe/.env`: vytvoř z `.env.example`; hodnotu `GEMINI_API_KEY` mi nech vyplnit ručně
  (klíč z https://aistudio.google.com/apikey). Nikdy ho nečti z cizího zdroje ani ho nevypisuj.
  Ověř jen, že proměnná existuje a že `.gitignore` obsahuje `.env`.

FÁZE 4 – MCP server
- V `faceless-yt` spusť: `claude mcp add mcp-video -- uvx mcp-video` (při selhání zkus variantu s `cmd /c`).
- `claude mcp list` musí ukázat `mcp-video` jako Connected.
- Poznámka: balíček `mcp-video` je obal kolem `kinocut`; varování od uvx je v pořádku.
  `mcp-video doctor` může falešně hlásit chybějící python/npm/npx, pokud jsou v PATH.
- Nástroje, které server skutečně vystavuje (zavolatelné): video_add_audio, video_add_texts,
  video_trim, video_merge, video_info, video_resize, video_convert, video_speed, video_extract_frame,
  video_quality_check ad. Nástroje z `search_tools` (video_generate_subtitles, video_subtitles,
  video_normalize_audio) zavolatelné NEJSOU – nespoléhej na ně.

FÁZE 5 – Ověření
- Smoke test Remotion: `cd remotion && npm run render:test` -> `out/test_raw.mp4`
  (první render stáhne headless Chrome, stovky MB).
- Dokonči postup z `workflows/render-pipeline.md` (zvuk, titulky přes video_add_texts s klíčem
  `start_time`, normalizace ffmpeg loudnorm -16 LUFS) a ověř ffprobe: 1920x1080, 30 fps, H.264/AAC.
- TTS test BEZ spotřeby kvóty: `cd tts-probe && .venv\Scripts\python.exe tts_script.py --script ..\scripts\leadership-paradox.txt --name leadership-paradox --dry-run`
- Skutečný TTS test spusť jen s mým souhlasem (jeden krátký požadavek).

Známé pasti (z původního stroje)
- Gemini free tier: 10 požadavků DENNĚ na model gemini-3.8-flash-tts. Proto text posílej v 1–2
  požadavcích (`--parts 2`), ne po odstavcích. Při HTTP 429 NEOPAKUJ a řekni mi to.
- Python SDK google-genai při 429 tiše opakuje s čekáním a vypadá zaseknuté; nástroj proto volá REST přímo (httpx).
- mcp-video `video_add_texts`: klíč pro čas začátku je `start_time` (ne `start`); u více titulků použij `auto_layout: false`.
- Short je vertikální 1080x1920 (kompozice `CorporateShort`), běžná videa 1920x1080. CLAUDE.md uvádí 1920x1080 pro standardní videa.
- npm hlásí neschválený postinstall u esbuild; render přesto funguje.
- Zdroje v `assets/` nikdy nepřepisuj, výstupy patří do `out/`.

Na konci vypiš: co je nainstalováno (verze), co funguje, co jsem ještě musel udělat já.
```

## Ručně na novém stroji

- Klíč do `tts-probe/.env` zadej sám. Klíč, který jsi poslal do chatu, doporučuji zrotovat (vytvořit nový a starý zakázat v AI Studiu).
- Pokud projekt leží v OneDrive, `.env` se synchronizuje do cloudu; zvaž umístění `.env` mimo synchronizovanou složku.
