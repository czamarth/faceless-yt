# faceless-yt

Projekt pro tvorbu faceless YouTube videí pomocí Claude Code, MCP serveru mcp-video (FFmpeg) a Remotion.

## Struktura

- `scripts/` – scénáře (zdroj pravdy je repo `faceless-yt-brain`; zde jen lokální kopie mimo git)
- `assets/` – hlas, hudba, obrázky (zdrojové soubory)
- `remotion/` – video z kódu
- `out/` – všechny výstupy
- `workflows/` – opakovatelné postupy

## Pravidla

- Výstup: 1920x1080, 30 fps, H.264 (video) / AAC (audio).
- Titulky jsou vypálené přímo do videa.
- Všechny výstupy ukládej do `out/`.
- Zdrojové soubory (zejména v `assets/`) nikdy nepřepisuj; úpravy vždy ukládej jako nový soubor v `out/`.

## Workflows

- `workflows/render-pipeline.md` – render v Remotion, přidání zvuku, vypálené titulky, normalizace na -16 LUFS a kontrola. Přečti před každým renderem.
