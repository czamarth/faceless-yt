"""Ověří přesnost zarovnání na hotových odstavcích p01..pNN (skutečné časy známe). Nevolá API.

  python check_alignment.py --name leadership-paradox --script ../scripts/leadership-paradox.txt --count 11
"""
import argparse
import subprocess
import tempfile
import wave
from pathlib import Path

import align

ROOT = Path(__file__).parent.parent


def dur(p: Path) -> float:
    with wave.open(str(p), "rb") as w:
        return w.getnframes() / w.getframerate()


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", required=True)
    ap.add_argument("--script", type=Path, required=True)
    ap.add_argument("--count", type=int, default=11)
    ap.add_argument("--gap", type=float, default=0.5)
    a = ap.parse_args()

    paras = [p.strip() for p in a.script.read_text(encoding="utf-8").split("\n\n") if p.strip()][: a.count]
    adir = ROOT / "assets" / a.name
    files = [adir / f"p{i:02d}.wav" for i in range(1, a.count + 1)]
    with tempfile.TemporaryDirectory() as td:
        td = Path(td)
        gap = td / "gap.wav"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono",
                        "-t", str(a.gap), "-c:a", "pcm_s16le", str(gap)], check=True)
        lst = td / "l.txt"
        lst.write_text("\n".join(
            x for i, f in enumerate(files)
            for x in ([f"file '{f.as_posix()}'"] + ([f"file '{gap.as_posix()}'"] if i < len(files) - 1 else []))
        ), encoding="utf-8")
        combined = td / "c.wav"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lst),
                        "-c", "copy", str(combined)], check=True)
        _, total, pspans = align.align_part(combined, paras)

    truth, t = [], 0.0
    for f in files:
        d = dur(f)
        truth.append((t, t + d))
        t += d + a.gap
    errs = []
    print(" #   odhad_start  pravda_start  chyba(s)")
    for i, ((es, _), (ts, _)) in enumerate(zip(pspans, truth), 1):
        errs.append(es - ts)
        print(f"{i:2d}   {es:9.2f}   {ts:10.2f}   {es - ts:+.2f}")
    print(f"max |chyba| = {max(abs(e) for e in errs):.2f} s, průměr |chyba| = {sum(abs(e) for e in errs) / len(errs):.2f} s")


if __name__ == "__main__":
    main()
