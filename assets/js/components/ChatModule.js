class ChatModule {
    constructor(apiService) {
        this.apiService = apiService;
        this.chatHistory = [];
        this.container = document.getElementById('chat-history');
    }

    // assets/js/components/ChatModule.js

    async sendMessage(text, sourceLang, targetLang) {
        if (!text || !text.trim()) return;

        try {
            // Agrega el mensaje original del usuario
            const userMsg = {
                id: Date.now(),
                sender: 'User',
                text,
                lang: sourceLang || 'Auto',
                translated: null
            };
            this.chatHistory.push(userMsg);
            this.render();

            // Petición a la API
            const result = await this.apiService.postRequest('/api/translate', {
                text: text,
                source_lang: sourceLang,
                target_lang: targetLang
            });

            if (result && result.translated_text) {
                userMsg.translated = result.translated_text;
                if (result.source_lang) {
                    userMsg.lang = result.source_lang;
                }
            }
        } catch (error) {
            console.error("Error al procesar la traducción:", error);
        } finally {
            this.render();
        }
    }

    render() {
        this.container.innerHTML = '';
        this.chatHistory.forEach(msg => {
            const card = document.createElement('div');
            card.className = `card mb-2 ${msg.lang === 'Español' ? 'border-primary' : 'border-success'}`;
            card.innerHTML = `
                <div class="card-body">
                    <span class="badge ${msg.lang === 'Español' ? 'bg-primary' : 'bg-success'} mb-1">${msg.lang}</span>
                    <p class="card-text mb-1"><strong>Original:</strong> ${msg.text}</p>
                    ${msg.translated ? `<p class="card-text text-muted"><strong>Traducción:</strong> ${msg.translated}</p>` : '<div class="spinner-border spinner-border-sm" role="status"></div> Traduciendo...'}
                </div>
            `;
            this.container.appendChild(card);
        });
        this.container.scrollTop = this.container.scrollHeight;
    }
}