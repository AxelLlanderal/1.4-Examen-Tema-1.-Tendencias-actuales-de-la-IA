# Documentación de la Arquitectura del Sistema

## 1. Resumen
Esta aplicación es un Traductor Multimodal Inteligente desarrollado en arquitectura desacoplada (Frontend estático + Backend Serverless) e integrado con la API de OpenAI (GPT-4o, Whisper y TTS).

## 2. Componentes del Sistema

### Frontend (GitHub Pages)
- **HTML5 & Bootstrap 5:** Estructura limpia y adaptabilidad a dispositivos móviles.
- **JavaScript Orientado a Objetos (POO):**
  - `ApiService`: Servicio encargado del manejo centralizado de peticiones HTTP.
  - `ChatModule`, `AudioModule`, `DocumentModule`, `ImageModule`: Encapsulan la lógica de la interfaz para cada modalidad.

### Backend (Vercel Serverless - Python)
- **Flask / FastAPI:** API REST que gestiona peticiones CORS seguras desde el frontend.
- **`OpenAITranslatorService`:** Clase contenedora de las llamadas seguras a los modelos de OpenAI:
  - `gpt-4o-mini`: Traducción de texto general y conversaciones tipo Chat.
  - `whisper-1`: Transcripción Speech-to-Text de archivos de audio.
  - `tts-1`: Generación de voz sintetizada (Text-to-Speech).
  - `gpt-4o (Vision)`: Reconocimiento OCR y traducción de texto contenido en imágenes.
- **`FileValidator`:** Módulo de validación previa de tamaño (máx 10MB) y extensiones admitidas.

## 3. Seguridad de Credenciales
La API Key de OpenAI está almacenada únicamente en las variables de entorno de la plataforma Vercel (`OPENAI_API_KEY`). El cliente frontend interactúa exclusivamente con el backend sin tener visibilidad de las credenciales privadas.