class ImageModule {
    constructor(apiService) {
        this.apiService = apiService;
        this.form = document.getElementById('img-form');
        this.fileInput = document.getElementById('img-file');
        this.statusDiv = document.getElementById('img-status');
        this.resultDiv = document.getElementById('img-result');
        this.imgPreview = document.getElementById('img-preview');
        this.translatedText = document.getElementById('img-translated-text');

        this.initEvents();
    }

    initEvents() {
        if (!this.form) return;
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleImageUpload();
        });
    }

    async handleImageUpload() {
        const file = this.fileInput.files[0];
        if (!file) {
            this.showStatus('Por favor, selecciona una imagen.', 'danger');
            return;
        }

        // Mostrar vista previa local
        const reader = new FileReader();
        reader.onload = (e) => {
            this.imgPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('file', file);

        this.showStatus('Analizando imagen con visión por computadora... Por favor espera.', 'info');
        this.resultDiv.classList.add('d-none');

        try {
            const result = await this.apiService.postRequest('/api/translate-image', formData, true);
            
            this.translatedText.innerText = result.translated_text;
            this.resultDiv.classList.remove('d-none');
            this.showStatus('Imagen procesada con éxito.', 'success');
        } catch (error) {
            this.showStatus(error.message || 'Error al procesar la imagen.', 'danger');
        }
    }

    showStatus(message, type) {
        this.statusDiv.className = `alert alert-${type} mt-3`;
        this.statusDiv.textContent = message;
    }
}