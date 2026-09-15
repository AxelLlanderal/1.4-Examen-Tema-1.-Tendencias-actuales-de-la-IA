class ChatModule {
    constructor(apiService) {
        this.apiService = apiService;
        this.chatHistory = [];
        this.container = document.getElementById('chat-history');
    }

    async sendMessage(text, sourceLang, targetLang) {
        if (!text.trim()) {
            throw new Error("El mensaje no puede estar vacío.");
        }

        const userMsg = { id: Date.now(), sender: 'User', text, lang: sourceLang, translated: null };
        this.chatHistory.push(userMsg);
        this.render();

        const result = await this.apiService.postRequest('/api/translate', {
            text,
            source_lang: sourceLang,
            target_lang: targetLang
        });

        userMsg.translated = result.translated_text;
        this.render();
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