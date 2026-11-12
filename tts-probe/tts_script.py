#!/usr/bin/env python
"""Scénář -> hlas (1–2 požadavky) -> timeline titulků pro Remotion.

  python tts_script.py --script ../scripts/x.txt --name x --voice Charon [--parts 2] [--dry-run]
  python tts_script.py --engine kokoro --script ../scripts/x.txt --name x [--voice bm_george]

Celý text jde do API najednou (nebo ve --parts půlkách, dělených na hranici odstavce), mezi
odstavce se vkládá značka <short pause>. Časování titulků se zjistí ze zvuku (align.py).
Free tier má limit 10 požadavků/den na model, proto se vše děje v pár požadavcích.

Engine kokoro je lokální (models/kokoro-v1.0.onnx + voices-v1.0.bin), bez kvóty a bez klíče;
odstavce syntetizuje zvlášť a odděluje je tichem (Kokoro nezná značky <short pause>).

Výstup:
  ../assets/<name>/part1.wav ...        syntetizovaný hlas (cache; část se přegeneruje, jen když se změní
                                        její text nebo nastavení – otisk je v part1.json)
  ../remotion/public/<name>.wav         spojený a znormalizovaný hlas (-16 LUFS)
  ../remotion/public/<name>.timeline.json
"""
import argparse
import hashlib
import json
import subprocess
import sys
import time
from pathlib import Path

from dotenv import load_dotenv

import align
import tts_probe as tp

HERE = Path(__file__).parent
ROOT = HERE.parent
GAP = 0.45  # pauza mezi částmi (s)
DAILY_LIMIT = 10
KOKORO_MODEL = HERE / "models" / "kokoro-v1.0.onnx"
KOKORO_VOICES = HERE / "models" / "voices-v1.0.bin"
KOKORO_PARA_PAUSE = 0.5  # pauza mezi odstavci uvnitř části (s)


def synth_kokoro(paras, voice: str, lang: str, speed: float, out: Path) -> None:
    """Lokální syntéza po odstavcích; mezi odstavce se vloží ticho. Výstup: WAV 24 kHz mono 16 bit."""
    import numpy as np
    from kokoro_onnx import Kokoro

    for f in (KOKORO_MODEL, KOKORO_VOICES):
        if not f.exists():
            raise FileNotFoundError(f"Chybí {f} (viz README / Fáze 3)")
    kokoro = Kokoro(str(KOKORO_MODEL), str(KOKORO_VOICES))
    chunks, rate = [], 24000
    for i, para in enumerate(paras):
        samples, rate = kokoro.create(para, voice=voice, speed=speed, lang=lang)
        chunks.append(samples)
        if i < len(paras) - 1:
            chunks.append(np.zeros(int(rate * KOKORO_PARA_PAUSE), dtype=np.float32))
    pcm = (np.clip(np.concatenate(chunks), -1.0, 1.0) * 32767).astype(np.int16).tobytes()
    tp.pcm_to_wav(pcm, out, rate)


def part_fingerprint(text: str, **params) -> str:
    """Otisk všeho, co určuje obsah zvukové části (text, hlas, engine, model, tempo…)."""
    material = json.dumps({"text": text, **params}, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(material.encode("utf-8")).hexdigest()


def cache_state(wav: Path, fingerprint: str) -> str:
    """Stav uložené části: 'missing' | 'ok' | 'stale' | 'unknown'.

    'stale' = vedle zvuku leží otisk, který neodpovídá (změnil se scénář, hlas nebo --parts).
    'unknown' = zvuk bez otisku (vznikl před zavedením otisků) – nelze poznat, zda odpovídá.
    """
    if not (wav.exists() and wav.stat().st_size > 1000):
        return "missing"
    meta = wav.with_suffix(".json")
    if not meta.exists():
        return "unknown"
    try:
        return "ok" if json.loads(meta.read_text(encoding="utf-8")).get("fingerprint") == fingerprint else "stale"
    except (OSError, ValueError, AttributeError):
        return "stale"


def write_fingerprint(wav: Path, fingerprint: str) -> None:
    wav.with_suffix(".json").write_text(json.dumps({"fingerprint": fingerprint}), encoding="utf-8")


def concat_entry(path: Path) -> str:
    """Řádek pro ffmpeg concat; apostrof v cestě (C:/Users/O'Brien/…) se musí escapovat."""
    return "file '" + path.as_posix().replace("'", "'\\''") + "'"


def split_parts(paras, n):
    """Rozdělí odstavce na n souvislých částí s podobným počtem znaků."""
    if n <= 1:
        return [list(range(len(paras)))]
    total = sum(len(p) for p in paras)
    parts, cur, acc = [], [], 0
    for i, p in enumerate(paras):
        cur.append(i)
        acc += len(p)
        if len(parts) < n - 1 and acc >= total * (len(parts) + 1) / n:
            parts.append(cur)
            cur = []
    parts.append(cur)
    return [p for p in parts if p]


def main() -> int:
    load_dotenv(HERE / ".env")
    ap = argparse.ArgumentParser()
    ap.add_argument("--script", type=Path, required=True)
    ap.add_argument("--name", required=True)
    ap.add_argument("--engine", choices=["gemini", "kokoro"], default="gemini")
    ap.add_argument("--voice", default=None, help="Gemini: Charon (výchozí); Kokoro: bm_george (výchozí)")
    ap.add_argument("--lang", default="en-us", help="jen Kokoro (Kokoro nepodporuje češtinu)")
    ap.add_argument("--speed", type=float, default=1.0, help="jen Kokoro")
    ap.add_argument("--model", default="gemini-3.8-flash-tts")
    ap.add_argument("--parts", type=int, default=2, help="na kolik požadavků text rozdělit (výchozí 2)")
    ap.add_argument("--no-pause-tags", action="store_true", help="nevkládat <short pause> mezi odstavce")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--force", action="store_true", help="přegenerovat i části bez otisku (starší běhy)")
    args = ap.parse_args()
    kokoro = args.engine == "kokoro"
    voice = args.voice or ("bm_george" if kokoro else "Charon")

    paras = [p.strip() for p in args.script.read_text(encoding="utf-8").split("\n\n") if p.strip()]
    adir = ROOT / "assets" / args.name
    adir.mkdir(parents=True, exist_ok=True)
    parts = split_parts(paras, args.parts)
    files = [adir / f"part{i + 1}.wav" for i in range(len(parts))]
    sep = "\n\n" if args.no_pause_tags else "\n\n<short pause>\n\n"

    # Otisk části: uložený zvuk se použije znovu jen tehdy, když odpovídá aktuálnímu textu a nastavení.
    # Dřív rozhodovala pouhá existence souboru, takže po úpravě scénáře se tiše použil starý hlas.
    def fingerprint(ix) -> str:
        if kokoro:
            return part_fingerprint("\n\n".join(paras[i] for i in ix), engine="kokoro", voice=voice, lang=args.lang, speed=args.speed)
        return part_fingerprint(sep.join(paras[i] for i in ix), engine="gemini", voice=voice, model=args.model, style=tp.DEFAULT_STYLE)

    prints = {f: fingerprint(ix) for f, ix in zip(files, parts)}
    states = {f: cache_state(f, prints[f]) for f in files}
    todo = [(f, ix) for f, ix in zip(files, parts) if states[f] in ("missing", "stale") or (args.force and states[f] == "unknown")]
    print(f"Částí: {len(parts)}, k vygenerování (požadavků): {len(todo)}")
    for f, ix in todo:
        why = " – scénář nebo nastavení se změnily" if states[f] == "stale" else ""
        print(f"  {f.name}: odstavce {ix[0] + 1}-{ix[-1] + 1} ({sum(len(paras[i]) for i in ix)} znaků){why}")
    for f in files:
        if states[f] == "unknown" and not args.force:
            print(f"  POZOR: {f.name} nemá otisk, nelze ověřit, že odpovídá scénáři. Používám ho; přegenerování: --force")
    if args.dry_run:
        return 0
    if not kokoro and len(todo) > DAILY_LIMIT:
        print(f"Plánováno {len(todo)} požadavků, denní limit je {DAILY_LIMIT}. Sniž --parts.")
        return 2

    for f, ix in todo:
        if kokoro:
            try:
                synth_kokoro([paras[i] for i in ix], voice, args.lang, args.speed, f)
            except Exception as exc:  # noqa: BLE001
                print(f"{f.name} selhal (Kokoro): {type(exc).__name__}: {str(exc)[:200]}")
                return 2
            write_fingerprint(f, prints[f])
            continue
        text = sep.join(paras[i] for i in ix)
        for attempt in (1, 2):
            try:
                tp.synth_gemini(text, args.model, voice, tp.DEFAULT_STYLE, f)
                write_fingerprint(f, prints[f])
                break
            except Exception as exc:  # noqa: BLE001
                label = tp.classify(exc)
                print(f"{f.name} selhal ({label}): {str(exc)[:200]}")
                if attempt == 2 or "síť" not in label.lower():
                    print("Přerušuji – nepokračuji v opakovaných pokusech.")
                    return 2
                time.sleep(10)

    # časování ze zvuku
    segments, t = [], 0.0
    for f, ix in zip(files, parts):
        res, total, _ = align.align_part(f, [paras[i] for i in ix])
        for i, sents in zip(ix, res):
            for text, a, b in sents:
                segments.append({"text": text, "start": round(t + a, 3), "end": round(t + b, 3),
                                 "para": i + 1, "last": i + 1 == len(paras)})
        t += total + GAP
    total_s = t - GAP

    pub = ROOT / "remotion" / "public"
    pub.mkdir(parents=True, exist_ok=True)
    silence = adir / "gap.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono",
                    "-t", str(GAP), "-c:a", "pcm_s16le", str(silence)], check=True)
    lines = []
    for i, f in enumerate(files):
        lines.append(concat_entry(f))
        if i < len(files) - 1:
            lines.append(concat_entry(silence))
    listfile = adir / "concat.txt"
    listfile.write_text("\n".join(lines), encoding="utf-8")
    raw = adir / "combined_raw.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(listfile),
                    "-c", "copy", str(raw)], check=True)
    final = pub / f"{args.name}.wav"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(raw), "-af",
                    "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", "-ac", "2", str(final)], check=True)

    (pub / f"{args.name}.timeline.json").write_text(
        json.dumps({"totalSeconds": round(total_s, 3), "audio": f"{args.name}.wav", "segments": segments},
                   ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"Hotovo: {final.name}, {total_s:.1f} s, {len(segments)} titulků")
    return 0


if __name__ == "__main__":
    sys.exit(main())
