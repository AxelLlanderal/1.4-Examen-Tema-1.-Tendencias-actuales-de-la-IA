class FileValidator:
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

    ALLOWED_DOC_EXTENSIONS = {'pdf', 'docx', 'txt'}
    ALLOWED_AUDIO_EXTENSIONS = {'mp3', 'wav', 'm4a'}
    ALLOWED_IMAGE_EXTENSIONS = {'jpg', 'jpeg', 'png'}

    @classmethod
    def validate_size(cls, file_bytes: bytes):
        if len(file_bytes) > cls.MAX_FILE_SIZE:
            raise ValueError("El archivo excede el tamaño máximo permitido de 10 MB.")

    @classmethod
    def validate_extension(cls, filename: str, allowed_types: set):
        if '.' not in filename:
            raise ValueError("El archivo no tiene una extensión válida.")
        ext = filename.rsplit('.', 1)[1].lower()
        if ext not in allowed_types:
            raise ValueError(f"Formato no permitido. Extensiones válidas: {', '.join(allowed_types)}")
        return ext