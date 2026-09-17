class AudioModule {
    constructor() {
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
        // Alternar entre Subir y Grabar
        if (this.btnModeUpload && this.btnModeRecord) {
            this.btnModeUpload.addEventListener('click', () => this.switchMode('upload'));
            this.btnModeRecord.addEventListener('click', () => this.switchMode('record'));
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
        this.audioStatus.innerHTML = '';
    }

    async toggleRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state === "recording") {
            // Detener grabación
            this.mediaRecorder.stop();
            this.btnRecordToggle.classList.remove('pulse-animation');
            this.recordStatusText.innerText = "Grabación completada";
        } else {
            // Iniciar grabación
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

        // Visualización de carga
        this.btnSendRecorded.disabled = true;
        this.btnSendRecorded.innerText = "Traduciendo...";
        this.audioStatus.className = "mt-3";
        this.audioStatus.innerText = "";

        const formData = new FormData();
        formData.append('file', this.recordedBlob, 'grabacion.mp3');

        try {
            // Llamada directa al método estático
            const response = await ApiService.translateAudio(formData);

            document.getElementById('audio-original').innerText = response.original_text || response.text || '';
            document.getElementById('audio-translated').innerText = response.translated_text || response.translation || '';
            this.audioResult.classList.remove('d-none');
        } catch (error) {
            this.audioStatus.className = "alert alert-danger mt-3";
            this.audioStatus.innerText = error.message;
        } finally {
            this.btnSendRecorded.disabled = false;
            this.btnSendRecorded.innerText = "Traducir Grabación";
        }
    }
}