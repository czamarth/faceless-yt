"""Časování titulků z hotového zvuku: detekce ticha + sekvenční zarovnání po znacích.

Textové jednotky (odstavce, pak věty) se rozloží podle počtu znaků a každá hranice se
"přichytí" na nejbližší skutečné ticho. Po každé přichycené hranici se odhad přepočítá
na zbývající úsek, takže se chyba nehromadí.
"""
import re
import subprocess
from pathlib import Path


def detect_silences(wav: Path, noise_db: int = -38, min_dur: float = 0.22):
    """Vrátí [(start, end), ...] ticha v souboru (ffmpeg silencedetect)."""
    p = subprocess.run(
        ["ffmpeg", "-hide_banner", "-nostats", "-i", str(wav), "-af",
         f"silencedetect=noise={noise_db}dB:d={min_dur}", "-f", "null", "-"],
        capture_output=True, text=True, check=True,
    )
    starts = [float(x) for x in re.findall(r"silence_start: (-?[\d.]+)", p.stderr)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", p.stderr)]
    dur_m = re.search(r"Duration: (\d+):(\d+):([\d.]+)", p.stderr)
    total = int(dur_m[1]) * 3600 + int(dur_m[2]) * 60 + float(dur_m[3])
    if len(starts) > len(ends):  # ticho na konci souboru
        ends.append(total)
    return [(max(0.0, s), e) for s, e in zip(starts, ends)], total


def speech_bounds(silences, total, eps=0.05):
    """Začátek a konec samotné řeči (bez úvodního a závěrného ticha)."""
    t0, t1 = 0.0, total
    if silences and silences[0][0] <= eps:
        t0 = silences[0][1]
    if silences and abs(silences[-1][1] - total) <= eps:
        t1 = silences[-1][0]
    return t0, t1


def align(lengths, region, silences, tol, weight):
    """Rozdělí region [a, b] na len(lengths) úseků podle znaků a přichytí hranice na ticho.

    Vrací [(start, end), ...]; mezi end jednoho a start dalšího je přichycené ticho.
    """
    a, b = region
    inner = [(s, e) for s, e in silences if a < s and e < b]
    out, cur = [], a
    for i, n in enumerate(lengths):
        if i == len(lengths) - 1:
            out.append((cur, b))
            break
        rest = sum(lengths[i:])
        est = cur + (b - cur) * n / rest
        best, best_score = None, None
        for s, e in inner:
            mid = (s + e) / 2
            if mid <= cur + 0.15:
                continue
            d = abs(mid - est)
            if d > tol:
                continue
            score = d - weight * (e - s)
            if best_score is None or score < best_score:
                best, best_score = (s, e), score
        if best:
            out.append((cur, best[0]))
            cur = best[1]
        else:
            out.append((cur, est))
            cur = est
    return out


def sentences(par: str):
    return [s for s in re.split(r"(?<=[.?!:])\s+", par) if s]


def align_part(wav: Path, paras):
    """Časy odstavců a vět pro jeden zvukový soubor. Vrací (segmenty, délka souboru, rozsahy odstavců)."""
    sil, total = detect_silences(wav)
    t0, t1 = speech_bounds(sil, total)
    pspans = align([len(p) for p in paras], (t0, t1), sil, tol=2.0, weight=1.5)
    result = []
    for par, (ps, pe) in zip(paras, pspans):
        sents = sentences(par)
        sspans = align([len(s) for s in sents], (ps, pe), sil, tol=0.8, weight=0.5)
        # nový titulek naskočí těsně před začátkem věty (konec ticha), ne uprostřed pauzy
        result.append([(s, a, b) for s, (a, b) in zip(sents, sspans)])
    return result, total, pspans
