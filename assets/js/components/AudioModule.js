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
    }

    initEvents() {
        // Alternar entre Subir y Grabar
        this.btnModeUpload.addEventListener('click', () => this.switchMode('upload'));
        this.btnModeRecord.addEventListener('click', () => this.switchMode('record'));

        // Control de Grabación
        this.btnRecordToggle.addEventListener('click', () => this.toggleRecording());
        this.btnSendRecorded.addEventListener('click', () => this.sendRecordedAudio());
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
                this.recordStatusText.innerText = "Grabando... Habla ahora";
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

        // Llama a tu ApiService actual pasando el formData
        ApiService.translateAudio(formData);
    }
}