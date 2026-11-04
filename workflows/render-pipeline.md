# Workflow: od Remotion renderu po hotové video

Ověřeno smoke testem (`out/test.mp4`): 1920x1080, 30 fps, H.264/AAC, -16 LUFS.
Všechny cesty níže jsou absolutní nebo s lomítky `/`; zpětná lomítka v JSON způsobují chyby.

## 1. Render z Remotion

```bash
cd remotion
npx remotion render src/index.ts <CompositionId> ../out/<nazev>_raw.mp4 --codec=h264
```

- Kompozice se registrují v `remotion/src/Root.tsx` (1920x1080, 30 fps).
- Vzor: `TestPipeline` v `remotion/src/TestPipeline.tsx`, skript `npm run render:test`.
- Náhled animací: `npm run studio`.
- Výstup Remotion nemá audio stopu.

## 2. Přidání zvuku (mcp-video: `video_add_audio`)

Parametry: `video_path`, `audio_path`, `output_path`, volitelně `volume`, `fade_in`, `fade_out`, `mix`.
Výstup: `out/<nazev>_audio.mp4`. Zdrojový audio soubor zůstává v `assets/` beze změny.

Testovací tón (jen pro zkoušky):

```bash
ffmpeg -y -f lavfi -i "sine=frequency=220:duration=10:sample_rate=48000" -ac 2 assets/test_tone.wav
```

## 3. Titulky vypálené do videa (mcp-video: `video_add_texts`)

Parametry: `input_path`, `output_path`, `texts` (pole), `overwrite`, `auto_layout`.
Položka v `texts`:

```json
{"text": "Test pipeline", "position": "bottom-center", "start_time": 0.2, "duration": 2.6, "size": 56, "color": "white"}
```

Pozor:
- Klíč pro čas začátku je **`start_time`**, ne `start`. Při špatném klíči se všechny titulky ukážou naráz a mimo střed.
- Při více titulcích na stejné pozici hlásí validátor `text_overlap`, i když se v čase nepřekrývají. Zadej `auto_layout: false`.
- Diakritika (`ý`, `č`, …) funguje.
- Výstup: `out/<nazev>_sub.mp4`.

## 4. Normalizace hlasitosti (ffmpeg, ne mcp-video)

Nástroj `video_normalize_audio` server nevystavuje ("Unknown tool"), proto přímo ffmpeg:

```bash
ffmpeg -y -i out/<nazev>_sub.mp4 -c:v copy -af loudnorm=I=-16:TP=-1.5:LRA=11 -c:a aac -b:a 192k -ar 48000 out/<nazev>.mp4
```

Výsledek je finální soubor `out/<nazev>.mp4`.

## 5. Kontrola

```bash
ffprobe -v error -show_entries stream=codec_type,codec_name,width,height,r_frame_rate,sample_rate:format=duration -of csv=p=0 out/<nazev>.mp4
ffmpeg -hide_banner -nostats -i out/<nazev>.mp4 -af ebur128 -f null - 2>&1 | grep -A1 Integrated
```

Očekáváno: h264 1920x1080 30/1, aac 48000, hlasitost kolem -16 LUFS.
Vizuální kontrola: vyexportuj snímek (`ffmpeg -ss <s> -i out/<nazev>.mp4 -frames:v 1 snimek.png`) a zkontroluj titulky.

## Známá omezení mcp-video

- Server vystavuje jen ~20 nástrojů (`video_add_audio`, `video_add_texts`, `video_trim`, `video_merge`, `video_info`, ...).
- `search_tools` vrací i nástroje, které nejsou k dispozici (`video_generate_subtitles`, `video_subtitles`, `video_normalize_audio`, `video_analyze`). Před použitím ověř, že se dají zavolat.
- Remotion server nemá; renderuje se samostatně (krok 1).
- Hyperframes zatím není nainstalovaný (`mcp-video doctor` ho hlásí jako Missing).

## Mezivýstupy

`*_raw.mp4`, `*_audio.mp4`, `*_sub.mp4` jsou mezikroky v `out/`. Finální je `<nazev>.mp4`; mezikroky lze po kontrole smazat.
