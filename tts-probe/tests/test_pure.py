"""Testy čistých funkcí (bez sítě, bez ffmpeg, bez modelů).

Spuštění z tts-probe/:  python -m unittest discover -s tests
"""
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import align  # noqa: E402
import tts_probe as tp  # noqa: E402
import tts_script as ts  # noqa: E402


class SplitParts(unittest.TestCase):
    def test_keeps_order_and_covers_every_paragraph(self):
        paras = ["a" * 100, "b" * 100, "c" * 100, "d" * 100]
        self.assertEqual(ts.split_parts(paras, 2), [[0, 1], [2, 3]])
        self.assertEqual(ts.split_parts(paras, 1), [[0, 1, 2, 3]])

    def test_never_returns_empty_part(self):
        self.assertEqual(ts.split_parts(["x" * 10], 3), [[0]])


class Cache(unittest.TestCase):
    def test_states(self):
        with tempfile.TemporaryDirectory() as td:
            wav = Path(td) / "part1.wav"
            fp = ts.part_fingerprint("Hello.", engine="gemini", voice="Charon")
            self.assertEqual(ts.cache_state(wav, fp), "missing")
            wav.write_bytes(b"\0" * 2000)
            self.assertEqual(ts.cache_state(wav, fp), "unknown")  # zvuk ze starší verze bez otisku
            ts.write_fingerprint(wav, fp)
            self.assertEqual(ts.cache_state(wav, fp), "ok")
            edited = ts.part_fingerprint("Hello there.", engine="gemini", voice="Charon")
            self.assertEqual(ts.cache_state(wav, edited), "stale")
            other_voice = ts.part_fingerprint("Hello.", engine="gemini", voice="Kore")
            self.assertEqual(ts.cache_state(wav, other_voice), "stale")
            wav.with_suffix(".json").write_text("{", encoding="utf-8")
            self.assertEqual(ts.cache_state(wav, fp), "stale")


class Concat(unittest.TestCase):
    def test_apostrophe_in_path_is_escaped(self):
        self.assertEqual(ts.concat_entry(Path("/u/O'Brien/a.wav")), "file '/u/O'\\''Brien/a.wav'")
        self.assertEqual(ts.concat_entry(Path("/u/x/a.wav")), "file '/u/x/a.wav'")


class Align(unittest.TestCase):
    def test_boundary_snaps_to_nearby_silence(self):
        # dva stejně dlouhé úseky v 0–10 s; odhad hranice 5,0 s, skutečné ticho 5,4–5,8 s
        spans = align.align([50, 50], (0.0, 10.0), [(5.4, 5.8)], tol=2.0, weight=1.5)
        self.assertEqual(spans, [(0.0, 5.4), (5.8, 10.0)])

    def test_falls_back_to_estimate_without_silence(self):
        self.assertEqual(align.align([50, 50], (0.0, 10.0), [], tol=2.0, weight=1.5), [(0.0, 5.0), (5.0, 10.0)])

    def test_speech_bounds_trim_leading_and_trailing_silence(self):
        self.assertEqual(align.speech_bounds([(0.0, 0.3), (4.0, 4.5), (9.6, 10.0)], 10.0), (0.3, 9.6))


class ErrorMessage(unittest.TestCase):
    def test_non_json_error_body_does_not_raise(self):
        class Resp:
            text = "<html>502 Bad Gateway</html>"

            def json(self):
                raise ValueError("not json")

        self.assertIn("502", tp.error_message(Resp()))

    def test_json_error_message_is_used(self):
        class Resp:
            text = "{}"

            def json(self):
                return {"error": {"message": "API key not valid"}}

        self.assertEqual(tp.error_message(Resp()), "API key not valid")


if __name__ == "__main__":
    unittest.main()
