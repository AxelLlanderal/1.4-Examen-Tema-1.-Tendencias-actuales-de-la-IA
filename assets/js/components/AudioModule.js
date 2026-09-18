class AudioModule {
    constructor(apiService) {
        this.apiService = apiService;
        
        // Elementos de la interfaz
        this.form = document.getElementById('audio-form');
        this.fileInput = document.getElementById('audio-file');
        this.statusDiv = document.getElementById('audio-status');
        this.resultDiv = document.getElementById('audio-result');
        this.originalP = document.getElementById('audio-original');
        this.translatedP = document.getElementById('audio-translated');
        this.audioPlayer = document.getElementById('audio-player');

        // Elementos de cambio de modo y grabación por micrófono
        this.btnModeUpload = document.getElementById('btn-mode-upload');
        this.btnModeRecord = document.getElementById('btn-mode-record');
        this.recordContainer = document.getElementById('record-container');
        this.btnRecordToggle = document.getElementById('btn-record-toggle');
        this.btnSendRecorded = document.getElementById('btn-send-recorded');
        this.recordStatusText = document.getElementById('record-status-text');
        this.recordPreview = document.getElementById('record-preview');

        this.mediaRecorder = null;
        this.audioChunks = [];
        this.recordedBlob = null;

        this.initEvents();
    }

    initEvents() {
        // Evento formulario de subida
        if (this.form) {
            this.form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleAudioUpload();
            });
        }

        // Eventos para cambiar entre Subir / Grabar
        if (this.btnModeUpload && this.btnModeRecord) {
            this.btnModeUpload.addEventListener('click', () => this.switchMode('upload'));
            this.btnModeRecord.addEventListener('click', () => this.switchMode('record'));
        }

        // Eventos de Grabación
        if (this.btnRecordToggle) {
            this.btnRecordToggle.addEventListener('click', () => this.toggleRecording());
        }
        if (this.btnSendRecorded) {
            this.btnSendRecorded.addEventListener('click', () => this.handleRecordedUpload());
        }
    }

    switchMode(mode) {
        if (mode === 'upload') {
            this.btnModeUpload.classList.add('active');
            this.btnModeRecord.classList.remove('active');
            this.form.classList.remove('d-none');
            this.recordContainer.classList.add('d-none');
        } else {
            this.btnModeRecord.classList.add('active');
            this.btnModeUpload.classList.remove('active');
            this.form.classList.add('d-none');
            this.recordContainer.classList.remove('d-none');
        }
        this.statusDiv.className = 'mt-3';
        this.statusDiv.textContent = '';
    }

    // 1. Procesar subida de archivo
    async handleAudioUpload() {
        const file = this.fileInput.files[0];
        if (!file) {
            this.showStatus('Por favor, selecciona un archivo de audio.', 'danger');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('target_lang', 'Inglés'); // Obliga la traducción directa

        await this.sendToBackend(formData);
    }

    // 2. Control del Micrófono (Grabar / Detener)
    async toggleRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
            this.mediaRecorder.stop();
            this.btnRecordToggle.classList.remove('pulse-animation');
            this.recordStatusText.innerText = "Grabación completada";
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.mediaRecorder = new MediaRecorder(stream);
                this.audioChunks = [];

                this.mediaRecorder.ondataavailable = event => {
                    this.audioChunks.push(event.data);
                };

                this.mediaRecorder.onstop = () => {
                    this.recordedBlob = new Blob(this.audioChunks, { type: 'audio/mp3' });
                    const audioUrl = URL.createObjectURL(this.recordedBlob);
                    this.recordPreview.src = audioUrl;
                    this.recordPreview.classList.remove('d-none');
                    this.btnSendRecorded.classList.remove('d-none');
                };

                this.mediaRecorder.start();
                this.btnRecordToggle.classList.add('pulse-animation');
                this.recordStatusText.innerText = "Grabando... Haz clic de nuevo para detener";
            } catch (err) {
                this.showStatus('No se pudo acceder al micrófono. Verifica los permisos de tu navegador.', 'danger');
            }
        }
    }

    // 3. Procesar audio grabado desde el micrófono
    async handleRecordedUpload() {
        if (!this.recordedBlob) return;

        const formData = new FormData();
        formData.append('file', this.recordedBlob, 'grabacion.mp3');
        formData.append('target_lang', 'Inglés'); // Obliga la traducción directa

        await this.sendToBackend(formData);
    }

    // Petición al backend que proyecta textos y reproduce audio base64
    async sendToBackend(formData) {
        this.showStatus('Procesando y traduciendo audio... Por favor espera.', 'info');
        this.resultDiv.classList.add('d-none');

        try {
            const result = await this.apiService.postRequest('/api/translate-audio', formData, true);
            
            this.originalP.textContent = result.original_text || result.text || '';
            this.translatedP.textContent = result.translated_text || result.translation || '';
            
            if (result.audio_base64) {
                const base64Audio = result.audio_base64.startsWith('data:') 
                    ? result.audio_base64 
                    : `data:audio/mp3;base64,${result.audio_base64}`;
                
                this.audioPlayer.src = base64Audio;
            }

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