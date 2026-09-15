from flask import Flask, request, jsonify
from flask_cors import CORS
from services.openai_service import OpenAITranslatorService
from services.document_parser import DocumentParser

app = Flask(__name__)
CORS(app)  # Habilita peticiones cruzadas (CORS)

translator = OpenAITranslatorService()

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

@app.route('/api/translate', methods=['POST'])
def translate_text():
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

@app.route('/api/translate-document', methods=['POST'])
def translate_document():
    if 'file' not in request.files:
        return jsonify({'message': 'No se seleccionó ningún archivo.'}), 400

    file = request.files['file']
    file_bytes = file.read()

    if len(file_bytes) > MAX_FILE_SIZE:
        return jsonify({'message': 'El archivo excede el tamaño máximo permitido (10MB).'}), 400

    try:
        text = DocumentParser.parse_file(file_bytes, file.filename)
        translated = translator.translate_text(text, "Auto", "Inglés")
        return jsonify({'translated_text': translated})
    except ValueError as ve:
        return jsonify({'message': str(ve)}), 400
    except Exception as e:
        return jsonify({'message': 'Error procesando el documento.'}), 500

if __name__ == '__main__':
    app.run(debug=True)