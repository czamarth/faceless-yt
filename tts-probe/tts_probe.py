#!/usr/bin/env python
"""Malý nástroj na ověření Google TTS (Gemini API a Cloud Chirp 3 HD).

Příklady:
  python tts_probe.py --provider gemini --voice Kore --text-file sample.txt
  python tts_probe.py --provider chirp --voice en-US-Chirp3-HD-Aoede --text-file sample.txt

Klíče se čtou z prostředí nebo z .env; nikdy se nevypisují.
"""
import argparse
import base64
import os
import struct
import sys
import wave
from pathlib import Path

from dotenv import load_dotenv

HERE = Path(__file__).parent
DEFAULT_STYLE = (
    "natural documentary narration, clear pronunciation, "
    "slightly brisk pace, calm and understated, no advertising enthusiasm"
)


def classify(exc: Exception) -> str:
    """Rozliší typ chyby, aby bylo jasné, co opravit."""
    text = f"{type(exc).__name__}: {exc}".lower()
    rules = [
        (("could not automatically determine credentials", "default credentials", "defaultcredentialserror"), "CHYBÍ ADC (gcloud auth application-default login)"),
        (("api key not valid", "api_key_invalid", "invalid api key", "unauthenticated", "401"), "CHYBNÝ KLÍČ / autentizace"),
        (("permission_denied", "permission denied", "403", "forbidden"), "NEDOSTATEČNÁ OPRÁVNĚNÍ (nebo klíč omezený na jiné API)"),
        (("has not been used", "service_disabled", "api is not enabled", "accessnotconfigured"), "API JE VYPNUTÉ v projektu"),
        (("billing", "billing_disabled"), "CHYBÍ FAKTURACE"),
        (("not found", "404", "is not supported", "model not found"), "MODEL/ENDPOINT NEDOSTUPNÝ"),
        (("resource_exhausted", "quota", "429", "rate limit", "too_many"), "VYČERPANÁ KVÓTA / rate limit"),
        (("invalid_argument", "400", "bad request", "invalid"), "CHYBNÝ POŽADAVEK"),
        (("connect", "timeout", "timed out", "name resolution", "ssl", "proxy"), "SÍŤ prostředí (ne problém účtu)"),
    ]
    for needles, label in rules:
        if any(n in text for n in needles):
            return label
    return "NEZNÁMÁ CHYBA"


def pick_gemini_key() -> str:
    """Explicitně zvolí jeden klíč: GEMINI_API_KEY má přednost před GOOGLE_API_KEY."""
    key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not key:
        raise RuntimeError("Chybí GEMINI_API_KEY (viz .env.example)")
    return key


def error_message(resp) -> str:
    """Text chyby z odpovědi API. Chybová odpověď nemusí být JSON (HTML od proxy, prázdné tělo)."""
    try:
        return resp.json().get("error", {}).get("message") or resp.text[:300]
    except (ValueError, AttributeError):
        return resp.text[:300]


def pcm_to_wav(pcm: bytes, path: Path, rate: int = 24000) -> None:
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(pcm)


def synth_gemini(text: str, model: str, voice: str, style: str, out: Path) -> None:
    # Přímé REST volání místo SDK: SDK při HTTP 429 tiše opakuje s backoffem a vypadá zaseknuté.
    import httpx

    annotations = [{"type": "speech_metadata", "style": style}] if style else []
    body = {
        "model": model,
        "input": [{"type": "user_input", "content": [{"type": "text", "text": text, "annotations": annotations}]}],
        "response_format": {"type": "audio"},
        "generation_config": {"speech_config": [{"voice": voice}]},
    }
    headers = {"x-goog-api-key": pick_gemini_key(), "Content-Type": "application/json"}
    resp = httpx.post(
        "https://generativelanguage.googleapis.com/v1beta/interactions", headers=headers, json=body, timeout=90
    )
    if resp.status_code != 200:
        raise RuntimeError(f"HTTP {resp.status_code}: {error_message(resp)}")
    audio = next(
        (c for s in resp.json().get("steps", []) for c in s.get("content", []) if c.get("type") == "audio"), None
    )
    if audio is None:
        # bez výchozí hodnoty by next() skončilo holým StopIteration, ze kterého není poznat, co se stalo
        raise RuntimeError("Odpověď API neobsahuje zvuk (invalid response: no audio content)")
    data = base64.b64decode(audio["data"])
    mime = audio.get("mime_type", "")
    if data[:4] == b"RIFF":
        out.write_bytes(data)  # unární odpověď je WAV s hlavičkou
    else:
        pcm_to_wav(data, out)  # raw PCM 24 kHz mono 16 bit -> obalíme do WAV
    print(f"  mime od API: {mime or 'neuvedeno'}; hlavička RIFF: {data[:4] == b'RIFF'}")


def synth_chirp(text: str, voice: str, out: Path) -> None:
    from google.cloud import texttospeech

    client = texttospeech.TextToSpeechClient()
    lang = "-".join(voice.split("-")[:2])
    resp = client.synthesize_speech(
        input=texttospeech.SynthesisInput(text=text),
        voice=texttospeech.VoiceSelectionParams(language_code=lang, name=voice),
        audio_config=texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.LINEAR16),
    )
    out.write_bytes(resp.audio_content)  # LINEAR16 přichází jako WAV s hlavičkou


def validate_wav(path: Path) -> dict:
    with wave.open(str(path), "rb") as w:
        ch, width, rate, frames = w.getnchannels(), w.getsampwidth(), w.getframerate(), w.getnframes()
        raw = w.readframes(frames)
    dur = frames / rate if rate else 0
    samples = struct.unpack("<" + "h" * (len(raw) // 2), raw) if width == 2 else ()
    peak = max((abs(s) for s in samples), default=0)
    ok = frames > 0 and dur > 1 and peak > 100
    return {"channels": ch, "bits": width * 8, "rate": rate, "duration_s": round(dur, 2), "peak": peak, "ok": ok, "bytes": path.stat().st_size}


def main() -> int:
    load_dotenv(HERE / ".env")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--provider", choices=["gemini", "chirp"], required=True)
    ap.add_argument("--model", default="gemini-3.8-flash-tts", help="jen Gemini")
    ap.add_argument("--voice", required=True, help="Gemini: např. Kore; Chirp: např. en-US-Chirp3-HD-Aoede")
    ap.add_argument("--text-file", required=True, type=Path)
    ap.add_argument("--style", default=DEFAULT_STYLE, help="jen Gemini; Chirp styl v promptu nepodporuje")
    ap.add_argument("--out", type=Path, default=None)
    args = ap.parse_args()

    text = args.text_file.read_text(encoding="utf-8").strip()
    outdir = HERE / "output"
    outdir.mkdir(exist_ok=True)
    name = f"{args.provider}_{(args.model if args.provider == 'gemini' else 'chirp3hd')}_{args.voice}.wav".replace("/", "_")
    out = args.out or outdir / name

    print(f"[{args.provider}] hlas={args.voice} znaků={len(text)}")
    try:
        if args.provider == "gemini":
            synth_gemini(text, args.model, args.voice, args.style, out)
        else:
            synth_chirp(text, args.voice, out)
    except Exception as exc:  # noqa: BLE001
        print(f"  SELHÁNÍ: {classify(exc)}")
        print(f"  detail: {type(exc).__name__}: {str(exc)[:300]}")
        return 2

    info = validate_wav(out)
    print(f"  soubor: {out}")
    print(f"  formát: {info['channels']} ch, {info['bits']} bit, {info['rate']} Hz, {info['duration_s']} s, {info['bytes']} B, peak={info['peak']}")
    print("  VÝSLEDEK: OK (validní, neprázdné WAV)" if info["ok"] else "  VÝSLEDEK: PODEZŘELÉ (prázdné/ticho/krátké)")
    return 0 if info["ok"] else 3


if __name__ == "__main__":
    sys.exit(main())
