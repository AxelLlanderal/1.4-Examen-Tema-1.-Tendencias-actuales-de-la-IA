import io
from pypdf import PdfReader
from docx import Document

class DocumentParser:
    @staticmethod
    def parse_file(file_bytes: bytes, filename: str) -> str:
        ext = filename.split('.')[-1].lower()
        extracted_text = ""

        if ext == 'txt':
            extracted_text = file_bytes.decode('utf-8', errors='ignore')

        elif ext == 'pdf':
            pdf_file = io.BytesIO(file_bytes)
            reader = PdfReader(pdf_file)
            for page in reader.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"

        elif ext == 'docx':
            docx_file = io.BytesIO(file_bytes)
            doc = Document(docx_file)
            for paragraph in doc.paragraphs:
                if paragraph.text:
                    extracted_text += paragraph.text + "\n"
        else:
            raise ValueError(f"Extensión .{ext} no soportada.")

        if not extracted_text.strip():
            raise ValueError("El documento está vacío o contiene solo imágenes sin texto procesable.")

        return extracted_text