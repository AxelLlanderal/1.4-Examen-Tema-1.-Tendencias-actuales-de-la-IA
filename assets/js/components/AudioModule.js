class AudioModule {
    constructor(apiService) {
        this.apiService = apiService;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.recordedBlob = null;

        this.initElements();
        this.initEvents();
    }

    initElements() {
        this.btnModeUpload = document.getElementById('btn-mode-upload');
        this.btnModeRecord = document.getElementById('btn-mode-record');
        this.uploadForm = document.getElementById('audio-form');
        this.recordContainer = document.getElementById('record-container');

        this.btnRecordToggle = document.getElementById('btn-record-toggle');
        this.btnSendRecorded = document.getElementById('btn-send-recorded');
        this.recordStatusText = document.getElementById('record-status-text');
        this.recordPreview = document.getElementById('record-preview');
        this.audioStatus = document.getElementById('audio-status');
        this.audioResult = document.getElementById('audio-result');
    }

    initEvents() {
        // Selector de modo Subir / Grabar
        if (this.btnModeUpload && this.btnModeRecord) {
            this.btnModeUpload.addEventListener('click', () => this.switchMode('upload'));
            this.btnModeRecord.addEventListener('click', () => this.switchMode('record'));
        }

        // Formulario original de subida
        if (this.uploadForm) {
            this.uploadForm.addEventListener('submit', (e) => this.handleUploadSubmit(e));
        }

        // Eventos de Grabación
        if (this.btnRecordToggle) {
            this.btnRecordToggle.addEventListener('click', () => this.toggleRecording());
        }
        if (this.btnSendRecorded) {
            this.btnSendRecorded.addEventListener('click', () => this.sendRecordedAudio());
        }
    }

    switchMode(mode) {
        if (mode === 'upload') {
            this.btnModeUpload.classList.add('active');
            this.btnModeRecord.classList.remove('active');
            this.uploadForm.classList.remove('d-none');
            this.recordContainer.classList.add('d-none');
        } else {
            this.btnModeRecord.classList.add('active');
            this.btnModeUpload.classList.remove('active');
            this.uploadForm.classList.add('d-none');
            this.recordContainer.classList.remove('d-none');
        }
        this.audioStatus.className = 'mt-3';
        this.audioStatus.innerText = '';
    }

    // Manejo del formulario de subida de archivo original
    async handleUploadSubmit(e) {
        e.preventDefault();
        const fileInput = document.getElementById('audio-file');
        if (!fileInput || !fileInput.files[0]) {
            this.audioStatus.className = "alert alert-danger mt-3";
            this.audioStatus.innerText = "Por favor selecciona un archivo de audio.";
            return;
        }

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        await this.processAudioRequest(formData);
    }

    // Manejo de grabación
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
                this.audioStatus.className = "alert alert-danger mt-3";
                this.audioStatus.innerText = "No se pudo acceder al micrófono. Verifica los permisos de tu navegador.";
            }
        }
    }

    async sendRecordedAudio() {
        if (!this.recordedBlob) return;
        const formData = new FormData();
        formData.append('file', this.recordedBlob, 'grabacion.mp3');
        await this.processAudioRequest(formData);
    }

    async processAudioRequest(formData) {
        this.audioStatus.className = "mt-3";
        this.audioStatus.innerText = "Procesando audio...";

        try {
            const response = await this.apiService.translateAudio(formData);

            const originalText = response.original_text || response.text || '';
            const translatedText = response.translated_text || response.translation || '';

            document.getElementById('audio-original').innerText = originalText;
            document.getElementById('audio-translated').innerText = translatedText;

            const audioPlayer = document.getElementById('audio-player');

            if (translatedText) {
                // API pública de TTS con CORS habilitado (Voice Brian / English)
                const encodedText = encodeURIComponent(translatedText);
                const ttsUrl = `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${encodedText}`;

                // Asigna la fuente al reproductor de HTML
                audioPlayer.src = ttsUrl;
                audioPlayer.classList.remove('d-none');

                // Carga y reproduce el audio
                audioPlayer.load();
                audioPlayer.play().catch(e => console.log('Autoplay prevenido por el navegador:', e));
            }

            this.audioResult.classList.remove('d-none');
            this.audioStatus.innerText = "";
        } catch (error) {
            this.audioStatus.className = "alert alert-danger mt-3";
            this.audioStatus.innerText = error.message;
        }
    }
}