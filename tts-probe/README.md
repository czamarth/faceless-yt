# tts-probe

Malý nástroj na ověření Google TTS pro anglické komentáře. Vypíše typ chyby (klíč, oprávnění, vypnuté API, fakturace, model, kvóta, síť) a vždy validuje vzniklé WAV (formát, délka, neticho).

## Nastavení (Gemini API)

1. Klíč vytvoř na https://aistudio.google.com/apikey (stav kvóty a fakturace: https://aistudio.google.com/usage).
2. Zkopíruj `.env.example` na `.env` a vyplň `GEMINI_API_KEY`. `.env` je v `.gitignore`.
3. Prostředí:

```bash
uv venv .venv
uv pip install --python .venv/Scripts/python.exe -r requirements.txt
```

## Použití

```bash
.venv/Scripts/python.exe tts_probe.py --provider gemini --voice Kore --text-file sample.txt
.venv/Scripts/python.exe tts_probe.py --provider gemini --voice Charon --model gemini-3.8-flash-lite-tts --text-file sample.txt
.venv/Scripts/python.exe tts_probe.py --provider chirp --voice en-US-Chirp3-HD-Aoede --text-file sample.txt
```

Výstup jde do `output/` jako WAV (Gemini: 24 kHz, mono, 16 bit).

## Hlas pro celé video

```bash
.venv/Scripts/python.exe tts_script.py --script ../scripts/leadership-paradox.txt --name leadership-paradox --voice Charon --dry-run
.venv/Scripts/python.exe tts_script.py --script ../scripts/leadership-paradox.txt --name leadership-paradox --voice Charon
```

Text jde do API v 1–2 požadavcích (`--parts`), protože free tier má 10 požadavků denně na model. Časování titulků se zjistí ze zvuku (`align.py`, detekce ticha); přesnost se dá ověřit na hotových souborech příkazem `check_alignment.py`. Při HTTP 429 skript skončí a nic neopakuje.

## Lokální hlas (Kokoro-82M, bez klíče a kvóty)

Model (~350 MB) patří do `tts-probe/models/` (je v `.gitignore`):

```bash
mkdir models && cd models
curl -L -O https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -L -O https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
```

```bash
.venv/Scripts/python.exe tts_script.py --engine kokoro --voice am_michael --script ../scripts/leadership-paradox.txt --name leadership-paradox-kokoro
```

Hlasy: `am_michael`, `am_adam`, `bm_george` (dokumentární tón), další viz `voices-v1.0.bin`. Syntéza jde po odstavcích, časy titulků jsou přesné z délek souborů. Nemá styl ani pauzové značky. Video dělej celé jedním enginem, hlasy se nemíchají. ~143 s zvuku trvá na CPU kolem 50 s.

## Chirp 3 HD (Google Cloud)

Vyžaduje projekt s fakturací, zapnuté `texttospeech.googleapis.com` a ADC:

```bash
gcloud auth application-default login
gcloud config set project PROJECT_ID
gcloud auth application-default set-quota-project PROJECT_ID
gcloud services enable texttospeech.googleapis.com
```

Chirp nepodporuje styl v promptu; `--style` platí jen pro Gemini.
