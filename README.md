# Traductor Multimodal IA

## Descripción del Proyecto

Plataforma web de traducción multimodal en tiempo real (Español/Inglés) diseñada con un estilo de interfaz oscuro, moderno y completamente adaptativo (*responsive*). El sistema integra procesamiento de texto, audio, documentos e imágenes mediante servicios Serverless y modelos avanzados de Inteligencia Artificial.

## Problema que Resuelve

Supera las barreras del idioma al centralizar en una sola aplicación la conversión de múltiples formatos de contenido. Permite a los usuarios traducir desde conversaciones breves de texto hasta archivos de voz, documentos de trabajo e imágenes con texto incrustado, sin necesidad de recurrir a herramientas fragmentadas.

## Funcionalidades Implementadas

* **Chat en Tiempo Real:** Traducción bidireccional inmediata (Español ➔ Inglés e Inglés ➔ Español).
* **Traducción de Audio:** Transcripción automática de archivos de voz y generación de su correspondiente traducción.
* **Procesamiento de Documentos:** Extracción y traducción del contenido manteniendo el flujo del texto.
* **Análisis de Imágenes:** Lectura OCR y traducción visual mediante modelos de visión por computadora.
* **Interfaz Adaptativa (Dark Mode):** Diseño tipo Dashboard optimizado para teléfonos móviles, tabletas y computadoras portátiles.

## Tecnologías Utilizadas

* **Frontend:** HTML5, CSS3 Custom Variables, Bootstrap 5.3, JavaScript ES6+ (POO).
* **Backend:** Python, Flask, Serverless Functions.
* **Despliegue e Infraestructura:** Vercel (Backend Serverless) y GitHub Pages (Hosting Frontend).
* **Integración de IA:** OpenAI API (`gpt-4o` / `gpt-4-turbo`, Whisper, Embeddings/Vision).

## Arquitectura General de la Solución

El proyecto utiliza una arquitectura desacoplada y orientada a servicios (*Serverless Architecture*):

1. **Capa del Cliente (Frontend):** Alojadado en GitHub Pages. Administra las interacciones del usuario, la validación de archivos y la representación visual mediante componentes orientados a objetos.
2. **Capa de Negocio (Backend):** Funciones Serverless desplegadas en Vercel utilizando Flask. Gestiona el enrutamiento, la resolución de módulos, las políticas CORS y las solicitudes seguras hacia la API externa.
3. **Capa de Servicios de IA:** API de OpenAI responsable del procesamiento pesado de datos multimodales.

## Descripción del Uso de la API de OpenAI

La API de OpenAI se consume a través del backend para proteger la clave de acceso (`OPENAI_API_KEY`) almacenada en variables de entorno:

* **Modelos de Lenguaje (`gpt-4o`):** Procesan las peticiones del chat y la traducción contextualizada de documentos.
* **Modelos de Visión:** Analizan imágenes en base64 o binarias para extraer texto visualizado (OCR) y traducirlo.
* **Audio/Whisper:** Transcribe los archivos de audio entrantes para su posterior traducción.

## Aplicación de Programación Orientada a Objetos (POO)

El frontend fue construido siguiendo el paradigma de Programación Orientada a Objetos en JavaScript para garantizar un código modular y mantenible:

* **`ApiService`:** Clase encargada de centralizar la comunicación HTTP (peticiones `fetch`) hacia los endpoints del backend.
* **Módulos Específicos (`ChatModule`, `AudioModule`, `DocumentModule`, `ImageModule`):** Clases independientes que encapsulan la lógica de negocio, manejo de eventos DOM y actualización de estado para cada pestaña de la aplicación.
* **`App`:** Clase orquestadora principal que inicializa e integra todos los componentes al cargar la interfaz.

## Consideraciones de Seguridad y Privacidad

* **Seguridad de API Key:** La API Key de OpenAI se gestiona de forma estrictamente privada dentro de las variables de entorno de Vercel y jamás se expone al cliente frontend.
* **Configuración CORS:** Políticas de intercambio de recursos restringidas para permitir únicamente el origen oficial de GitHub Pages (`https://axelllanderal.github.io`).
* **Privacidad de Datos:** La plataforma no almacena archivos, textos ni audios en bases de datos persistentes. La información procesada se transmite de manera efímera hacia OpenAI únicamente para la generación de la respuesta.

## Formatos de Archivos Soportados

* **Audio:** `.mp3`, `.wav`, `.m4a` (Tamaño máximo: 10 MB).
* **Documentos:** `.pdf`, `.docx`, `.txt` (Tamaño máximo: 10 MB).
* **Imágenes:** `.jpg`, `.jpeg`, `.png` (Tamaño máximo: 10 MB).

## Limitaciones Conocidas

* El procesamiento de archivos pesados de audio o PDF extensos puede experimentar tiempos de espera vinculados a la latencia de respuesta de la API o los límites de tiempo (*timeouts*) de las funciones Serverless en Vercel.
* La precisión del módulo de imágenes depende directamente de la nitidez, iluminación y claridad de la tipografía presente en la fotografía.

## Autor

**Axel Llanderal Arteaga**
*Proyecto de Inteligencia Artificial 2026*

## URL Pública de la Aplicación

* **Frontend (Aplicación Web):** `https://axelllanderal.github.io/1.4-Examen-Tema-1.-Tendencias-actuales-de-la-IA/`
