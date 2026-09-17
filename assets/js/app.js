document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://1-4-examen-tema-1-tendencias-actual.vercel.app';
    const apiService = new ApiService(API_URL);

    // Inicialización de componentes POO
    const chatModule = new ChatModule(apiService);
    new AudioModule(apiService);
    new DocumentModule(apiService);
    new ImageModule(apiService);

    // Evento del Chat con Detección Automática Inteligente
    const chatForm = document.getElementById('chat-form');
    if (chatForm) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('chat-input');
            const direction = document.getElementById('chat-direction').value;
            const text = input.value.trim();

            if (!text) return;

            // Detecta si el texto ingresado tiene caracteres / palabras en inglés o español
            const containsSpanish = /[áéíóúñ¿¡]/i.test(text) || /\b(hola|que|como|estas|bien|gracias|soy)\b/i.test(text);
            
            // Determina los idiomas automáticamente basados en lo que escribió el usuario
            let sourceLang = 'Español';
            let targetLang = 'Inglés';

            if (direction === 'auto' || direction === 'es-en') {
                if (containsSpanish) {
                    sourceLang = 'Español';
                    targetLang = 'Inglés';
                } else {
                    sourceLang = 'Inglés';
                    targetLang = 'Español';
                }
            }

            try {
                // Envía 'Auto' como source_lang al backend para que OpenAI detecte de forma exacta
                await chatModule.sendMessage(text, 'Auto', targetLang);
                
                // Sobrescribimos la etiqueta en la tarjeta para que pinte el idioma real detectado
                if (chatModule.chatHistory.length > 0) {
                    chatModule.chatHistory[chatModule.chatHistory.length - 1].lang = sourceLang;
                    chatModule.render();
                }

                input.value = '';
            } catch (err) {
                alert(err.message);
            }
        });
    }
});