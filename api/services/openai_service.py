import os
import base64
from openai import OpenAI

class OpenAITranslatorService:
    def __init__(self):
        # La API Key se lee EXCLUSIVAMENTE del entorno seguro
        self.client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

    def translate_text(self, text: str, source_lang: str, target_lang: str) -> str:
        if not text.strip():
            raise ValueError("El texto de entrada no puede estar vacío.")

        # Prompt estricto que prohíbe responder como asistente conversacional
        system_prompt = (
            "Eres un traductor estricto. Tu ÚNICA función es traducir el texto recibido. "
            "Si el texto está en inglés, tradúcelo al español. "
            "Si el texto está en español, tradúcelo al inglés. "
            "REGLA CRÍTICA: NUNCA contestes, respondas la pregunta ni entables conversación. "
            "DEVUELVE ÚNICAMENTE LA TRADUCCIÓN DIRECTA."
        )

        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text}
            ],
            temperature=0.1
        )
        return response.choices[0].message.content.strip()

    def process_audio(self, audio_file_bytes, filename: str, target_lang: str) -> dict:
        # 1. Transcribir audio con Whisper
        transcription = self.client.audio.transcriptions.create(
            model="whisper-1",
            file=(filename, audio_file_bytes, "audio/mpeg")
        )
        original_text = transcription.text

        if not original_text.strip():
            return {"error": "No se detectó voz utilizable en el audio."}

        # 2. Traducir texto detectando el idioma automáticamente
        translated_text = self.translate_text(original_text, "Auto", target_lang)

        # 3. Generar Audio Traducido (TTS)
        speech_response = self.client.audio.speech.create(
            model="tts-1",
            voice="alloy",
            input=translated_text
        )
        audio_b64 = base64.b64encode(speech_response.content).decode('utf-8')

        return {
            "original_text": original_text,
            "translated_text": translated_text,
            "audio_base64": f"data:audio/mp3;base64,{audio_b64}"
        }

    def process_image(self, image_bytes, mime_type: str, target_lang: str) -> str:
        base64_image = base64.b64encode(image_bytes).decode('utf-8')
        data_url = f"data:{mime_type};base64,{base64_image}"

        prompt = (
            f"Analiza la imagen. Si no contiene texto legible, responde únicamente: 'NO_TEXT_FOUND'. "
            f"Si contiene texto, extráelo y tradúcelo al idioma {target_lang}. Proporciona el texto original y la traducción."
        )

        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": data_url}}
                    ]
                }
            ]
        )
        result = response.choices[0].message.content
        if "NO_TEXT_FOUND" in result:
            raise ValueError("No se encontró texto legible en la imagen proporcionada.")
        return result