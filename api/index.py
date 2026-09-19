from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Agrega la carpeta 'api' y la raíz del proyecto al PATH de Python
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)

if current_dir not in sys.path:
    sys.path.insert(0, current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

# Importaciones locales
from services.openai_service import OpenAITranslatorService
from services.document_parser import DocumentParser
from utils.validators import FileValidator

app = Flask(__name__)

# Dominio exacto desde el que haces las peticiones (sin / al final)
ALLOWED_ORIGIN = "https://llanderalarteaga.github.io"

# Configuración de CORS
CORS(app, resources={r"/api/*": {"origins": ALLOWED_ORIGIN}})

translator = OpenAITranslatorService()

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = app.make_default_options_response()
        headers = response.headers
        headers['Access-Control-Allow-Origin'] = ALLOWED_ORIGIN
        headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
        headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        return response, 200

@app.route('/api/translate', methods=['POST', 'OPTIONS'])
def translate_text():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    data = request.get_json() or {}
    text = data.get('text', '')
    source_lang = data.get('source_lang', 'Español')
    target_lang = data.get('target_lang', 'Inglés')

    if not text:
        return jsonify({'message': 'Entrada vacía o sin contenido.'}), 400

    try:
        result = translator.translate_text(text, source_lang, target_lang)
        return jsonify({'translated_text': result})
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/translate-document', methods=['POST', 'OPTIONS'])
def translate_document():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    if 'file' not in request.files:
        return jsonify({'message': 'No se seleccionó ningún archivo.'}), 400

    file = request.files['file']
    file_bytes = file.read()

    try:
        FileValidator.validate_size(file_bytes)
        FileValidator.validate_extension(file.filename, FileValidator.ALLOWED_DOC_EXTENSIONS)
        
        text = DocumentParser.parse_file(file_bytes, file.filename)
        translated = translator.translate_text(text, "Auto", "Inglés")
        return jsonify({'translated_text': translated})
    except ValueError as ve:
        return jsonify({'message': str(ve)}), 400
    except Exception as e:
        return jsonify({'message': 'Error procesando el documento.'}), 500

@app.route('/api/translate-audio', methods=['POST', 'OPTIONS'])
def translate_audio():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    if 'file' not in request.files:
        return jsonify({'message': 'No se subió archivo de audio.'}), 400

    file = request.files['file']
    target_lang = request.form.get('target_lang', 'Inglés')
    file_bytes = file.read()

    try:
        FileValidator.validate_size(file_bytes)
        FileValidator.validate_extension(file.filename, FileValidator.ALLOWED_AUDIO_EXTENSIONS)
        
        result = translator.process_audio(file_bytes, file.filename, target_lang)
        if "error" in result:
            return jsonify({'message': result['error']}), 400
            
        return jsonify(result)
    except ValueError as ve:
        return jsonify({'message': str(ve)}), 400
    except Exception as e:
        return jsonify({'message': 'Error procesando el audio.'}), 500

@app.route('/api/translate-image', methods=['POST', 'OPTIONS'])
def translate_image():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    if 'file' not in request.files:
        return jsonify({'message': 'No se subió ninguna imagen.'}), 400

    file = request.files['file']
    target_lang = request.form.get('target_lang', 'Inglés')
    file_bytes = file.read()

    try:
        FileValidator.validate_size(file_bytes)
        ext = FileValidator.validate_extension(file.filename, FileValidator.ALLOWED_IMAGE_EXTENSIONS)
        
        mime_type = f"image/{'jpeg' if ext in ['jpg', 'jpeg'] else 'png'}"
        translated_text = translator.process_image(file_bytes, mime_type, target_lang)
        
        return jsonify({'translated_text': translated_text})
    except ValueError as ve:
        return jsonify({'message': str(ve)}), 400
    except Exception as e:
        return jsonify({'message': 'Error al procesar la imagen.'}), 500

if __name__ == '__main__':
    app.run(debug=True)