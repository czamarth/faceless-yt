"""Lokální TTS přes Kokoro-82M (kokoro-onnx). Bez klíče, bez kvóty.

Modely (tts-probe/models/, v .gitignore):
  kokoro-v1.0.onnx, voices-v1.0.bin  z https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
"""
import wave
from pathlib import Path

import numpy as np

MODELS = Path(__file__).parent / "models"
_kokoro = None


def _load():
    global _kokoro
    if _kokoro is None:
        from kokoro_onnx import Kokoro
        model, voices = MODELS / "kokoro-v1.0.onnx", MODELS / "voices-v1.0.bin"
        if not (model.exists() and voices.exists()):
            raise FileNotFoundError(f"Chybí model Kokoro v {MODELS} (viz docstring).")
        _kokoro = Kokoro(str(model), str(voices))
    return _kokoro


def synth_kokoro(text: str, voice: str, out: Path, speed: float = 1.0, lang: str | None = None) -> None:
    """Syntetizuje text do mono 16bit WAV (24 kHz). Jazyk se bere z hlasu (bf_/bm_ = en-gb)."""
    lang = lang or ("en-gb" if voice.startswith("b") else "en-us")
    samples, rate = _load().create(text, voice=voice, speed=speed, lang=lang)
    peak = float(np.max(np.abs(samples))) or 1.0
    if peak > 0.98:
        samples = samples * (0.98 / peak)
    out.parent.mkdir(parents=True, exist_ok=True)
    pcm = (np.clip(samples, -1, 1) * 32767).astype("<i2")
    with wave.open(str(out), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(pcm.tobytes())
