class AudioModule {
    constructor(apiService) {
        this.apiService = apiService;
        this.form = document.getElementById('audio-form');
        this.fileInput = document.getElementById('audio-file');
        this.statusDiv = document.getElementById('audio-status');
        this.resultDiv = document.getElementById('audio-result');
        this.originalP = document.getElementById('audio-original');
        this.translatedP = document.getElementById('audio-translated');
        this.audioPlayer = document.getElementById('audio-player');

        this.initEvents();
    }

    initEvents() {
        if (!this.form) return;
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleAudioUpload();
        });
    }

    async handleAudioUpload() {
        const file = this.fileInput.files[0];
        if (!file) {
            this.showStatus('Por favor, selecciona un archivo de audio.', 'danger');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('target_lang', 'Inglés'); // Por defecto traduce al otro idioma

        this.showStatus('Procesando y traduciendo audio... Por favor espera.', 'info');
        this.resultDiv.classList.add('d-none');

        try {
            const result = await this.apiService.postRequest('/api/translate-audio', formData, true);
            
            this.originalP.textContent = result.original_text;
            this.translatedP.textContent = result.translated_text;
            this.audioPlayer.src = result.audio_base64;
            
            this.resultDiv.classList.remove('d-none');
            this.showStatus('Audio traducido con éxito.', 'success');
        } catch (error) {
            this.showStatus(error.message || 'Error al procesar el audio.', 'danger');
        }
    }

    showStatus(message, type) {
        this.statusDiv.className = `alert alert-${type} mt-3`;
        this.statusDiv.textContent = message;
    }
}