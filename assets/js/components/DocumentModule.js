class DocumentModule {
    constructor(apiService) {
        this.apiService = apiService;
        this.form = document.getElementById('doc-form');
        this.fileInput = document.getElementById('doc-file');
        this.statusDiv = document.getElementById('doc-status');
        this.resultDiv = document.getElementById('doc-result');
        this.translatedContent = document.getElementById('doc-translated-content');

        this.initEvents();
    }

    initEvents() {
        if (!this.form) return;
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleDocumentUpload();
        });
    }

    async handleDocumentUpload() {
        const file = this.fileInput.files[0];
        if (!file) {
            this.showStatus('Por favor, selecciona un documento.', 'danger');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        this.showStatus('Leyendo y traduciendo el documento... Esto puede tomar unos segundos.', 'dark');
        this.resultDiv.classList.add('d-none');

        try {
            const result = await this.apiService.postRequest('/api/translate-document', formData, true);
            
            this.translatedContent.innerText = result.translated_text;
            this.resultDiv.classList.remove('d-none');
            this.showStatus('Documento traducido con éxito.', 'success');
        } catch (error) {
            this.showStatus(error.message || 'Error al procesar el documento.', 'danger');
        }
    }

    showStatus(message, type) {
        this.statusDiv.className = `alert alert-${type} mt-3`;
        this.statusDiv.textContent = message;
    }
}